"use client";

import { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, CircleDollarSign, Loader2, Save, Search, TrendingUp } from "lucide-react";
import { MoneyInput } from "@/components/MoneyInput";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { ICostReport, ICostServiceLine, IServicePrice } from "@/lib/types";

type CostsPageProps = {
    pageSkeleton: React.ReactNode;
};

/**
 * Valor em reais. Abaixo de R$ 1 mostra até 4 casas: custo por consulta é fração de centavo
 * (R$ 0,0076), e com 2 casas ele aparecia como R$ 0,01 — ou como R$ 0,00.
 */
const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: value !== 0 && Math.abs(value) < 1 ? 4 : 2 });

/** `Date` → `AAAA-MM-DD` no fuso local (o que o `<input type="date">` usa). */
const isoDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Atalhos do período. O padrão é o mês corrente inteiro — é o que mostra a projeção do mês. */
const PRESETS: { label: string; range: () => { start: string; end: string } }[] = [
    {
        label: "Este mês",
        range: () => {
            const now = new Date();
            return { start: isoDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: isoDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
        },
    },
    {
        label: "Mês passado",
        range: () => {
            const now = new Date();
            return { start: isoDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)), end: isoDay(new Date(now.getFullYear(), now.getMonth(), 0)) };
        },
    },
    {
        label: "Últimos 30 dias",
        range: () => {
            const now = new Date();
            return { start: isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)), end: isoDay(now) };
        },
    },
];

const plural = (count: number, one: string, many: string) => `${count.toLocaleString("pt-BR")} ${count === 1 ? one : many}`;

/** Tokens em escala legível: 950 tokens, 12,3 mil tokens, 1,2 mi tokens. */
const tokens = (count: number) => {
    if (count < 1000) return plural(count, "token", "tokens");
    if (count < 1_000_000) return `${(count / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil tokens`;
    return `${(count / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} mi tokens`;
};

/**
 * Uso de um recorte, na unidade de cada serviço. Consultas (Google), créditos (CNPJá) e tokens
 * (Groq e Gemini) não se somam — aparecem lado a lado quando há mais de um.
 */
const usage = (money: { queries: number; credits: number; tokens: number }) => {
    const parts = [money.queries > 0 ? plural(money.queries, "consulta", "consultas") : null, money.credits > 0 ? plural(money.credits, "crédito", "créditos") : null, money.tokens > 0 ? tokens(money.tokens) : null];
    return parts.filter(Boolean).join(" · ") || "0 consultas";
};

/** O que uma unidade do serviço é, para a tabela de preços. */
const UNIT_HINT: Record<string, string> = {
    query: "por consulta",
    credit: "por crédito — 1 crédito a cada 10 empresas lidas",
    mtoken: "por 1 milhão de tokens",
};

const PROVIDER_LABEL: Record<string, string> = { vertex: "Vertex AI Search", vision: "Google Vision", cnpja: "CNPJá", groq: "Groq", gemini: "Gemini (Vertex AI)" };

/** Uso de um serviço, sempre na unidade dele — inclusive o zero ("0 tokens", não "0 consultas"). */
const serviceUsage = (line: ICostServiceLine) => {
    if (line.unit === "token") return tokens(line.tokens);
    if (line.unit === "credit") return plural(line.credits, "crédito", "créditos");
    return plural(line.queries, "consulta", "consultas");
};

const formatDay = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");

/** Tamanho máximo da descrição de cada preço na tabela; o resto fica no balão. */
const HINT_LIMIT = 40;

/**
 * Descrição de um preço (fornecedor, unidade e onde é usado). Os textos são longos de propósito —
 * explicam a cobrança —, mas na tabela viram uma linha curta: até 40 caracteres e reticências, com
 * o texto inteiro num balão ao passar o mouse (ou focar pelo teclado).
 */
function PriceHint({ text }: { text: string }) {
    if (text.length <= HINT_LIMIT) return <p className="text-xs text-muted-foreground">{text}</p>;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <p tabIndex={0} className="w-fit cursor-help text-xs text-muted-foreground">
                    {text.slice(0, HINT_LIMIT).trimEnd()}…
                </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{text}</TooltipContent>
        </Tooltip>
    );
}

/** Cor do lucro: verde no positivo, vermelho no prejuízo. */
const profitClass = (value: number) => (value > 0 ? "text-success" : value < 0 ? "text-destructive" : "text-muted-foreground");

export default function CostsPage({ pageSkeleton }: CostsPageProps) {
    const { makeRequest } = useFetch();

    const [prices, setPrices] = useState<IServicePrice[]>([]);
    const [savingPrices, setSavingPrices] = useState(false);

    const [startDate, setStartDate] = useState(() => PRESETS[0].range().start);
    const [endDate, setEndDate] = useState(() => PRESETS[0].range().end);
    const [search, setSearch] = useState("");
    /** A busca vai ao servidor só depois de uma pausa na digitação. */
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [report, setReport] = useState<ICostReport | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [openClients, setOpenClients] = useState<Set<string>>(new Set());
    /** Ativos abertos — mostram a lista de serviços, um por linha. */
    const [openBrands, setOpenBrands] = useState<Set<number>>(new Set());

    const [initialLoaded, setInitialLoaded] = useState(false);

    const loadPrices = async () => {
        const response = await makeRequest("get", "/costs/prices");

        if (response?.status === 200) {
            setPrices(response.prices ?? []);
        } else {
            toast.error("Não foi possível carregar os preços", { description: response?.message ?? "Tente novamente." });
        }
    };

    const loadReport = async () => {
        // Período incompleto ou invertido enquanto se edita: espera ficar válido
        if (!startDate || !endDate || endDate < startDate) return;

        setLoadingReport(true);
        const params = new URLSearchParams({ startDate, endDate, ...(debouncedSearch ? { search: debouncedSearch } : {}) });
        const response = await makeRequest("get", `/costs/report?${params.toString()}`);
        setLoadingReport(false);

        if (response?.status === 200) {
            setReport(response);
            return;
        }

        toast.error("Não foi possível carregar o relatório", { description: response?.message ?? "Tente novamente." });
    };

    useEffect(() => {
        (async () => {
            await Promise.all([loadPrices(), loadReport()]);
            setInitialLoaded(true);
        })();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (initialLoaded) loadReport();
    }, [startDate, endDate, debouncedSearch]);

    const updatePrice = (service: string, patch: Partial<IServicePrice>) => {
        setPrices((current) => current.map((item) => (item.service === service ? { ...item, ...patch } : item)));
    };

    const handleSavePrices = async () => {
        setSavingPrices(true);

        const response = await makeRequest("put", "/costs/prices", { prices: prices.map(({ service, costBrl, priceBrl }) => ({ service, costBrl, priceBrl })) });

        setSavingPrices(false);

        if (response?.status === 200) {
            setPrices(response.prices ?? []);
            toast.success("Preços salvos", { description: "Valem a partir da próxima consulta — o que já foi feito mantém o preço da época." });
            await loadReport();
            return;
        }

        toast.error("Não foi possível salvar", { description: response?.message ?? "Confira os valores e tente novamente." });
    };

    const toggleClient = (clientId: string) => {
        setOpenClients((current) => {
            const next = new Set(current);
            next.has(clientId) ? next.delete(clientId) : next.add(clientId);
            return next;
        });
    };

    const toggleBrand = (brandId: number) => {
        setOpenBrands((current) => {
            const next = new Set(current);
            next.has(brandId) ? next.delete(brandId) : next.add(brandId);
            return next;
        });
    };

    if (!initialLoaded) return <>{pageSkeleton}</>;

    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CircleDollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Custos</h1>
                    <p className="mt-1 text-muted-foreground">Quanto cada serviço custa, quanto é cobrado e o lucro por cliente e por ativo</p>
                </div>
            </div>

            {/* ===== Tabela de preços ===== */}
            <Card>
                <CardHeader>
                    <CardTitle>Preços por consulta</CardTitle>
                    <CardDescription>Custo e preço em reais, iguais para todos os clientes, na unidade em que cada serviço cobra: por consulta, por crédito (CNPJá) ou por 1 milhão de tokens (Groq e Gemini, que cobram entrada e saída separadas e mudam de preço por modelo). Digite só os números, com 4 casas decimais (1-5-0-0-0 vira R$ 1,5000). Os custos se atualizam sozinhos todo dia às 03:00 pelo dólar do dia; os da Groq seguem o último valor digitado aqui.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Serviço</TableHead>
                                    <TableHead>Custo unitário</TableHead>
                                    <TableHead>Preço unitário</TableHead>
                                    <TableHead className="text-right">Margem por consulta</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prices.map((item) => {
                                    const margin = item.priceBrl - item.costBrl;

                                    return (
                                        <TableRow key={item.service}>
                                            <TableCell>
                                                <p className="font-medium">{item.label}</p>
                                                <PriceHint text={`${PROVIDER_LABEL[item.provider] ?? item.provider} · ${UNIT_HINT[item.unit] ?? UNIT_HINT.query}${item.usedBy ? ` · usado em: ${item.usedBy}` : ""}`} />
                                            </TableCell>
                                            <TableCell>
                                                <MoneyInput className="w-36" decimals={4} value={item.costBrl} onChange={(value) => updatePrice(item.service, { costBrl: value })} aria-label={`Custo ${UNIT_HINT[item.unit] ?? UNIT_HINT.query} de ${item.label}`} />
                                            </TableCell>
                                            <TableCell>
                                                <MoneyInput className="w-36" decimals={4} value={item.priceBrl} onChange={(value) => updatePrice(item.service, { priceBrl: value })} aria-label={`Preço cobrado ${UNIT_HINT[item.unit] ?? UNIT_HINT.query} de ${item.label}`} />
                                            </TableCell>
                                            <TableCell className={`text-right font-medium ${profitClass(margin)}`}>{brl(margin)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSavePrices} disabled={savingPrices}>
                            {savingPrices ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar preços
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ===== Relatório do período ===== */}
            <Card>
                <CardHeader className="space-y-4">
                    <div>
                        <CardTitle>Consumo no período</CardTitle>
                        <CardDescription className="mt-1.5">Uso de cada serviço (consultas do Google, créditos do CNPJá, tokens das IAs), custo, valor a cobrar e lucro. Se o período ainda não acabou, a projeção soma ao realizado o que a busca de marcas ainda fará até o fim dele (2 consultas por frente por dia, até a cota mensal do ativo).</CardDescription>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div className="relative w-full lg:max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Buscar pelo nome do ativo" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Buscar pelo nome do ativo" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <div className="flex flex-wrap gap-1.5">
                                {PRESETS.map((preset) => {
                                    const range = preset.range();
                                    const active = range.start === startDate && range.end === endDate;

                                    return (
                                        <Button
                                            key={preset.label}
                                            type="button"
                                            size="sm"
                                            variant={active ? "default" : "outline"}
                                            onClick={() => {
                                                setStartDate(range.start);
                                                setEndDate(range.end);
                                            }}
                                        >
                                            {preset.label}
                                        </Button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input type="date" value={startDate} max={endDate || undefined} onChange={(e) => setStartDate(e.target.value)} className="w-auto" aria-label="Início do período" />
                                <span className="text-sm text-muted-foreground">até</span>
                                <Input type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} className="w-auto" aria-label="Fim do período" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingReport || !report ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {[
                                    { label: "Uso", value: usage(report.totals) },
                                    { label: "Custo", value: brl(report.totals.costBrl) },
                                    { label: "A cobrar", value: brl(report.totals.priceBrl) },
                                    { label: "Lucro", value: brl(report.totals.profitBrl), className: profitClass(report.totals.profitBrl) },
                                ].map((tile) => (
                                    <div key={tile.label} className="rounded-lg border border-border bg-muted/40 p-3">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{tile.label}</p>
                                        <p className={`mt-1 text-xl font-bold tabular-nums ${tile.className ?? ""}`}>{tile.value}</p>
                                    </div>
                                ))}
                            </div>

                            {report.clients.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">{report.search ? `Nenhum ativo com "${report.search}" no nome.` : "Nenhum cliente cadastrado."}</p>}

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cliente / ativo</TableHead>
                                            <TableHead className="text-right">Uso</TableHead>
                                            <TableHead className="text-right">Custo</TableHead>
                                            <TableHead className="text-right">A cobrar</TableHead>
                                            <TableHead className="text-right">Lucro</TableHead>
                                            {report.hasProjection && <TableHead className="text-right">Projeção até {formatDay(report.endDate)}</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.clients.map((client) => {
                                            const open = openClients.has(client.clientId);
                                            const projection = client.brands.reduce((sum, brand) => sum + (brand.projection?.priceBrl ?? 0), 0);

                                            return (
                                                <Fragment key={client.clientId}>
                                                    <TableRow className="cursor-pointer" onClick={() => toggleClient(client.clientId)}>
                                                        <TableCell className="font-medium">
                                                            <span className="flex items-center gap-2">
                                                                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                                                                {client.name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">{usage(client)}</TableCell>
                                                        <TableCell className="text-right tabular-nums">{brl(client.costBrl)}</TableCell>
                                                        <TableCell className="text-right tabular-nums">{brl(client.priceBrl)}</TableCell>
                                                        <TableCell className={`text-right tabular-nums font-medium ${profitClass(client.profitBrl)}`}>{brl(client.profitBrl)}</TableCell>
                                                        {report.hasProjection && <TableCell className="text-right tabular-nums text-muted-foreground">{projection > 0 ? `${brl(projection)} a cobrar` : "—"}</TableCell>}
                                                    </TableRow>

                                                    {/* Nível 2: os ativos do cliente, cada um com os totais dele. Clicar abre
                                                        o nível 3, a lista completa de serviços do ativo. */}
                                                    {open &&
                                                        client.brands.map((brand) => {
                                                            const brandOpen = openBrands.has(brand.brandId);

                                                            return (
                                                                <Fragment key={brand.brandId}>
                                                                    <TableRow className="cursor-pointer bg-muted/30" onClick={() => toggleBrand(brand.brandId)} aria-expanded={brandOpen}>
                                                                        <TableCell className="pl-8">
                                                                            <span className="flex items-center gap-2">
                                                                                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
                                                                                {brand.name}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell className="text-right tabular-nums">
                                                                            {usage(brand)}
                                                                            <span className="block text-xs text-muted-foreground">cota {brand.quota}/mês</span>
                                                                        </TableCell>
                                                                        <TableCell className="text-right tabular-nums">{brl(brand.costBrl)}</TableCell>
                                                                        <TableCell className="text-right tabular-nums">{brl(brand.priceBrl)}</TableCell>
                                                                        <TableCell className={`text-right tabular-nums ${profitClass(brand.profitBrl)}`}>{brl(brand.profitBrl)}</TableCell>
                                                                        {report.hasProjection && (
                                                                            <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                                                                                {brand.projection ? (
                                                                                    <>
                                                                                        <span className="block">{plural(brand.projection.queries, "consulta", "consultas")}</span>
                                                                                        <span className="block">
                                                                                            custo {brl(brand.projection.costBrl)} · cobra {brl(brand.projection.priceBrl)}
                                                                                        </span>
                                                                                        <span className={`block font-medium ${profitClass(brand.projection.profitBrl)}`}>lucro {brl(brand.projection.profitBrl)}</span>
                                                                                    </>
                                                                                ) : (
                                                                                    "sem busca contratada"
                                                                                )}
                                                                            </TableCell>
                                                                        )}
                                                                    </TableRow>

                                                                    {/* Nível 3: todos os serviços, um por linha. O que ainda não rodou para
                                                                        o ativo aparece apagado e zerado, até ter uso no período. */}
                                                                    {brandOpen &&
                                                                        brand.services.map((line) => {
                                                                            const unused = line.queries + line.credits + line.tokens === 0;

                                                                            return (
                                                                                <TableRow key={line.service} className={`bg-muted/60 text-sm ${unused ? "text-muted-foreground/70" : ""}`}>
                                                                                    <TableCell className="pl-16">{line.label}</TableCell>
                                                                                    <TableCell className="text-right tabular-nums">{serviceUsage(line)}</TableCell>
                                                                                    <TableCell className="text-right tabular-nums">{brl(line.costBrl)}</TableCell>
                                                                                    <TableCell className="text-right tabular-nums">{brl(line.priceBrl)}</TableCell>
                                                                                    <TableCell className={`text-right tabular-nums ${unused ? "" : profitClass(line.profitBrl)}`}>{brl(line.profitBrl)}</TableCell>
                                                                                    {report.hasProjection && <TableCell />}
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                </Fragment>
                                                            );
                                                        })}

                                                    {open &&
                                                        client.withoutBrand.map((service) => (
                                                            <TableRow key={service.service} className="bg-muted/30">
                                                                <TableCell className="pl-14">
                                                                    <p>{service.label}</p>
                                                                    <p className="text-xs text-muted-foreground">sem ativo — perfil do Instagram do cliente ou ativo já excluído</p>
                                                                </TableCell>
                                                                <TableCell className="text-right tabular-nums">{usage(service)}</TableCell>
                                                                <TableCell className="text-right tabular-nums">{brl(service.costBrl)}</TableCell>
                                                                <TableCell className="text-right tabular-nums">{brl(service.priceBrl)}</TableCell>
                                                                <TableCell className={`text-right tabular-nums ${profitClass(service.profitBrl)}`}>{brl(service.profitBrl)}</TableCell>
                                                                {report.hasProjection && <TableCell />}
                                                            </TableRow>
                                                        ))}
                                                </Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Uso registrado antes de o serviço ter preço aparece com R$ 0 — o histórico guarda sempre o preço da época.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
