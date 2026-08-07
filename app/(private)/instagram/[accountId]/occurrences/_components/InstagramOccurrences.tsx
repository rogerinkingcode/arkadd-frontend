"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, ImageIcon, ShieldCheck, ShieldAlert, Instagram, ImageOff, CalendarClock } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import Paginations from "@/components/pagination";
import { IInstagramOccurrence, IInstagramProtectionProgress } from "@/lib/types";

type InstagramOccurrencesPageProps = {
    pageSkeleton: React.ReactNode;
};

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/**
 * Prévia da cópia encontrada.
 *
 * A URL vem do CDN do Instagram e **expira** — uma cópia encontrada semanas atrás quase sempre
 * não carrega mais. Em vez de deixar um ícone quebrado na tela, o erro é tratado e vira um aviso
 * explícito: o que importa para o takedown são os links, que continuam válidos.
 */
function OccurrencePreview({ url }: { url: string }) {
    const [broken, setBroken] = useState(false);

    if (broken) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted px-4 text-center">
                <ImageOff className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Prévia expirada — o link do Instagram continua válido</p>
            </div>
        );
    }

    return <img src={url} alt="Cópia encontrada no Instagram" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={() => setBroken(true)} />;
}

export default function InstagramOccurrencesPage({ pageSkeleton }: InstagramOccurrencesPageProps) {
    const params = useParams<{ accountId: string }>();
    const accountId = params?.accountId;

    const [occurrences, setOccurrences] = useState<IInstagramOccurrence[]>([]);
    const [progress, setProgress] = useState<IInstagramProtectionProgress | null>(null);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [take] = useState(50);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const { makeRequest } = useFetch();

    useEffect(() => {
        async function load() {
            if (!accountId) return;

            const skip = (page - 1) * take;
            const response = await makeRequest("get", `/instagram/occurrences?accountId=${accountId}&skip=${skip}&take=${take}`);

            if (response?.status === 200) {
                setOccurrences(response.occurrences ?? []);
                setProgress(response.progress ?? null);
                setCount(response.count ?? 0);
            } else {
                setOccurrences([]);
                setProgress(null);
                setCount(0);
            }

            setInitialLoaded(true);
        }

        load();
    }, [accountId, page]);

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
                {/* Destino fixo, e não `router.back()`: esta página é aberta em nova aba, onde
                    não existe histórico para voltar. */}
                <Button variant="outline" size="icon" asChild aria-label="Ir para o Instagram" title="Ir para o Instagram">
                    <Link href="/instagram">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <ShieldAlert className="h-7 w-7 text-primary" />
                        Cópias encontradas
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {count} ocorrência{count === 1 ? "" : "s"} das imagens deste perfil dentro do Instagram
                    </p>
                </div>
            </div>

            {/* Resumo da proteção — dá contexto ao número acima: "zero cópias" com metade do
                acervo ainda por verificar significa outra coisa que "zero" com tudo verificado. */}
            {progress && (
                <Card className="mb-6">
                    <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-4 p-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Imagens verificadas</p>
                                <p className="font-semibold tabular-nums">
                                    {progress.checked} de {progress.total}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                                <ShieldAlert className="h-5 w-5 text-destructive" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cópias no Instagram</p>
                                <p className="font-semibold tabular-nums">{progress.occurrences}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Frequência</p>
                                <p className="font-semibold">Cada imagem é rebuscada a cada 30 dias</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShieldCheck className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">Nenhuma cópia encontrada</h3>
                        <p className="max-w-md text-center text-muted-foreground">{progress && progress.checked < progress.total ? `Ainda faltam ${progress.total - progress.checked} imagem(ns) a verificar. Só aparecem aqui as cópias exatas encontradas dentro do Instagram.` : "Todas as imagens verificadas e nenhuma cópia exata localizada dentro do Instagram."}</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid animate-in grid-cols-1 gap-4 duration-500 fade-in sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {occurrences.map((occurrence) => (
                            <Card key={occurrence.id} className="group flex h-full flex-col overflow-hidden border border-border transition-all hover:shadow-md">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <OccurrencePreview url={occurrence.imageUrl} />

                                    {/* A nossa imagem, sobreposta: é o que prova que a cópia é da marca.
                                        Vem do nosso bucket, então sempre carrega. */}
                                    {occurrence.image.url && (
                                        <span className="absolute bottom-2 left-2 h-14 w-14 overflow-hidden rounded-md border-2 border-background bg-muted shadow-md" title="Sua imagem, publicada no perfil do cliente">
                                            <img
                                                src={occurrence.image.url}
                                                alt="Imagem original do perfil"
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                                                }}
                                            />
                                        </span>
                                    )}

                                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-[11px] font-semibold text-background">
                                        <Instagram className="h-3 w-3" />
                                        {occurrence.domain}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col gap-3 p-3">
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>Encontrada em {new Date(occurrence.createdAt).toLocaleDateString("pt-BR")}</p>
                                        {/* Distinguir "achada uma vez" de "continua no ar" é o que diz se
                                            o takedown funcionou. */}
                                        <p>Vista pela última vez em {new Date(occurrence.lastSeenAt).toLocaleDateString("pt-BR")}</p>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-2">
                                        {/* O link da página é o alvo de takedown; quando o Google não o
                                            informa, resta a URL do arquivo. */}
                                        {occurrence.pageUrl ? (
                                            <Button variant="default" size="sm" asChild>
                                                <a href={occurrence.pageUrl} target="_blank" rel="noreferrer noopener">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Abrir publicação
                                                </a>
                                            </Button>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">O Google não informou a publicação de origem — use o link da imagem.</p>
                                        )}

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <a href={occurrence.imageUrl} target="_blank" rel="noreferrer noopener">
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    Imagem
                                                </a>
                                            </Button>

                                            {occurrence.image.post?.permalink && (
                                                <Button variant="outline" size="sm" asChild className="flex-1" title="Sua publicação original">
                                                    <a href={occurrence.image.post.permalink} target="_blank" rel="noreferrer noopener">
                                                        <Instagram className="mr-2 h-4 w-4" />
                                                        Original
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {count > take && <Paginations handleChangePagination={handleChangePagination} count={count} take={take} />}
                </>
            )}
        </div>
    );
}
