"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

/** Um dia da linha do tempo: o total acumulado ao fim do dia e quantas ameaças entraram nele. */
type TimelinePoint = { date: string; total: number; added: number };

/** Períodos do seletor — os mesmos que o backend aceita. */
const PERIODS = [
    { days: 30, label: "30 dias" },
    { days: 90, label: "90 dias" },
    { days: 365, label: "12 meses" },
];

const number = (value: number) => value.toLocaleString("pt-BR");

/** `AAAA-MM-DD` → data local (sem o deslocamento de fuso que o `new Date("AAAA-MM-DD")` traria). */
const toDate = (iso: string) => {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
};

/** Rótulo do eixo: dia e mês nos períodos curtos; mês e ano no de 12 meses. */
const tickLabel = (iso: string, days: number) => toDate(iso).toLocaleDateString("pt-BR", days > 90 ? { month: "short", year: "2-digit" } : { day: "2-digit", month: "short" });

const fullDate = (iso: string) => toDate(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

/** Tooltip do crosshair: a data, o total do dia e o que entrou nele. Texto nas cores de texto, nunca na da linha. */
function TimelineTooltip({ active, payload }: { active?: boolean; payload?: { payload: TimelinePoint }[] }) {
    const point = payload?.[0]?.payload;

    if (!active || !point) return null;

    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
            <p className="text-muted-foreground">{fullDate(point.date)}</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-foreground">
                <span className="inline-block h-0.5 w-3 rounded-full bg-primary" aria-hidden="true" />
                {number(point.total)} {point.total === 1 ? "ameaça ativa" : "ameaças ativas"}
            </p>
            <p className="mt-0.5 text-muted-foreground">{point.added > 0 ? `+${number(point.added)} no dia` : "Nenhuma nova no dia"}</p>
        </div>
    );
}

/**
 * Evolução do total de ameaças ativas — o mesmo número do card "Ameaças Ativas", dia a dia.
 *
 * Linha, porque a pergunta é de mudança ao longo do tempo. Uma série só: sem legenda, o título
 * a nomeia. O eixo vertical não começa no zero de propósito — é um acumulado, e a partir do zero a
 * variação do período sumiria numa linha quase reta no topo.
 */
export default function ThreatTimelineChart() {
    const { makeRequest } = useFetch();
    const [days, setDays] = useState(90);
    const [points, setPoints] = useState<TimelinePoint[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setFailed(false);

            const response = await makeRequest("get", `/read-dashboard/threat-timeline?days=${days}`);

            if (cancelled) return;

            if (Array.isArray(response?.data?.points)) {
                setPoints(response.data.points);
            } else {
                setFailed(true);
            }

            setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [days]);

    const current = points?.at(-1)?.total ?? 0;
    const first = points?.[0] ? points[0].total - points[0].added : 0;
    const change = current - first;
    const isEmpty = !points || points.every((point) => point.total === 0);

    return (
        <Card className="mb-8">
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle>Evolução das ameaças ativas</CardTitle>
                    <CardDescription className="mt-2">Total acumulado ao fim de cada dia, somando todos os serviços</CardDescription>

                    {points && !isEmpty && (
                        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground">
                            <span className="text-2xl font-bold text-foreground tabular-nums">{number(current)}</span>
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                                {change > 0 ? `+${number(change)}` : number(change)} em {PERIODS.find((period) => period.days === days)?.label}
                            </span>
                        </p>
                    )}
                </div>

                {/* Filtros numa fila só, acima do gráfico */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {PERIODS.map((period) => (
                        <Button key={period.days} type="button" size="sm" variant={days === period.days ? "default" : "outline"} onClick={() => setDays(period.days)} aria-pressed={days === period.days}>
                            {period.label}
                        </Button>
                    ))}
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowTable((value) => !value)} aria-pressed={showTable}>
                        {showTable ? "Ver gráfico" : "Ver tabela"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {loading && !points ? (
                    <div className="flex h-[300px] items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : failed ? (
                    <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Não foi possível carregar a evolução das ameaças.</div>
                ) : isEmpty ? (
                    <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Nenhuma ameaça registrada no período.</div>
                ) : showTable ? (
                    // Os dias com ameaça nova, do mais recente para o mais antigo
                    <div className="max-h-[300px] overflow-y-auto rounded-lg border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Dia</TableHead>
                                    <TableHead className="text-right">Novas</TableHead>
                                    <TableHead className="text-right">Total ativo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...points!]
                                    .filter((point) => point.added > 0)
                                    .reverse()
                                    .map((point) => (
                                        <TableRow key={point.date}>
                                            <TableCell>{fullDate(point.date)}</TableCell>
                                            <TableCell className="text-right tabular-nums">+{number(point.added)}</TableCell>
                                            <TableCell className="text-right tabular-nums">{number(point.total)}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className={`h-[300px] w-full transition-opacity ${loading ? "opacity-50" : ""}`} role="img" aria-label={`Evolução das ameaças ativas: ${number(current)} hoje, ${change >= 0 ? "+" : ""}${number(change)} no período.`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={points!} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                                {/* Grade recessiva: só as linhas horizontais, na cor da borda */}
                                <CartesianGrid vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="date" tickFormatter={(value) => tickLabel(value, days)} tickLine={false} axisLine={false} minTickGap={28} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                <YAxis allowDecimals={false} domain={["auto", "auto"]} tickFormatter={(value) => number(value)} tickLine={false} axisLine={false} width={48} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                <Tooltip content={<TimelineTooltip />} cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                                {/* Linha de 2px; o ponto do hover tem anel na cor do card para destacar da linha */}
                                <Line type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
