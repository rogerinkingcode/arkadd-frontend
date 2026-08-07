"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ExternalLink, ImageIcon, Search, Shield, Globe, CircleDashed, Clock, CheckCircle2, ImagePlus, RefreshCw, Loader2, Sparkles, CalendarClock, Filter, Circle, ClipboardCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import Paginations from "@/components/pagination";
import { ISiteImageOccurrence, ISiteImageSource } from "@/lib/types";

type OccurrencesPageProps = {
    pageSkeleton: React.ReactNode;
};

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/** Mapeia o status de pesquisa da imagem de origem para o badge visual. */
const SEARCHED_LABEL: Record<"pending" | "processing" | "completed", { label: string; classes: string; Icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: "Aguardando pesquisa", classes: "bg-slate-500/90 text-white", Icon: CircleDashed },
    processing: { label: "Em processamento", classes: "bg-amber-500/90 text-white", Icon: Clock },
    completed: { label: "Pesquisa concluída", classes: "bg-emerald-600/90 text-white", Icon: CheckCircle2 },
};

/** Miniatura do ativo: exibe a imagem (logo_url) quando houver, com fallback no ícone Shield — igual à página de ativos. */
function BrandThumb({ logoUrl }: { logoUrl?: string | null }) {
    if (logoUrl) {
        return (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-card">
                <img
                    src={logoUrl}
                    alt="Imagem do ativo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                />
            </span>
        );
    }

    return (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
        </span>
    );
}

/**
 * Folga usada para associar uma ocorrência à última pesquisa da imagem.
 *
 * As linhas são gravadas segundos antes de a imagem ser marcada como pesquisada, então comparar
 * as datas exige uma janela — sem ela, nenhuma ocorrência bateria com a própria pesquisa.
 */
const SEARCH_MATCH_TOLERANCE_MS = 10 * 60 * 1000;

/** A ocorrência entrou na pesquisa mais recente? Só faz sentido a partir da 2ª rodada — na
 *  primeira, tudo é novo e marcar todas não diria nada. */
function isNewInLastSearch(occurrence: ISiteImageOccurrence, image: ISiteImageSource | null): boolean {
    if (!image?.searchedAt || image.searchCount < 2) return false;

    return Math.abs(new Date(occurrence.createdAt).getTime() - new Date(image.searchedAt).getTime()) <= SEARCH_MATCH_TOLERANCE_MS;
}

/** A ocorrência deixou de aparecer na última pesquisa — indício de que o conteúdo saiu do ar. */
function isMissingInLastSearch(occurrence: ISiteImageOccurrence, image: ISiteImageSource | null): boolean {
    if (!image?.searchedAt || image.searchCount < 2) return false;

    return new Date(occurrence.lastSeenAt).getTime() < new Date(image.searchedAt).getTime() - SEARCH_MATCH_TOLERANCE_MS;
}

/** Retorna o hostname amigável de uma URL — fallback para a própria string. */
function getHostname(url?: string | null): string {
    if (!url) return "";
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export default function OccurrencesPage({ pageSkeleton }: OccurrencesPageProps) {
    const params = useParams<{ imageId: string }>();
    const router = useRouter();
    const imageId = params?.imageId;

    const [image, setImage] = useState<ISiteImageSource | null>(null);
    const [occurrences, setOccurrences] = useState<ISiteImageOccurrence[]>([]);
    const [count, setCount] = useState<number>(0);
    // Contadores do acervo inteiro — não acompanham o filtro, senão o cabeçalho mudaria de
    // significado a cada troca e não haveria como saber o tamanho do trabalho restante.
    const [totalCount, setTotalCount] = useState<number>(0);
    const [reviewedCount, setReviewedCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [take] = useState<number>(20);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [researching, setResearching] = useState(false);
    /** Triagem manual: "pending" → ainda não analisadas; "reviewed" → já analisadas. */
    const [reviewedFilter, setReviewedFilter] = useState<"all" | "pending" | "reviewed">("all");
    /** Ids em trânsito no PUT — evita cliques repetidos na mesma ocorrência. */
    const [reviewing, setReviewing] = useState<Set<string>>(new Set());

    const { makeRequest } = useFetch();

    useEffect(() => {
        async function load() {
            if (!imageId) return;

            const skip = page === 1 ? 0 : (page - 1) * take;
            const response = await makeRequest("get", `/site-images/${imageId}/occurrences?skip=${skip}&take=${take}&reviewed=${reviewedFilter}`);

            if (response?.status === 200) {
                setImage(response.image ?? null);
                setOccurrences(response.occurrences || []);
                setCount(response.count || 0);
                setTotalCount(response.totalCount || 0);
                setReviewedCount(response.reviewedCount || 0);
            } else {
                setImage(null);
                setOccurrences([]);
                setCount(0);
                setTotalCount(0);
                setReviewedCount(0);
            }

            setInitialLoaded(true);
        }

        load();
    }, [imageId, page, reviewedFilter]);

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    /** Troca o filtro de triagem. Volta para a primeira página: a paginação atual pode nem
     *  existir no recorte novo. */
    const handleChangeReviewedFilter = (value: "all" | "pending" | "reviewed") => {
        setReviewedFilter(value);
        setPage(1);
    };

    /** Marca/desmarca a ocorrência como analisada. A tela atualiza antes da resposta e desfaz
     *  se o servidor recusar — o alvo é triagem em sequência, e esperar o ida-e-volta a cada
     *  card tornaria isso arrastado. */
    const handleToggleReviewed = async (occurrence: ISiteImageOccurrence) => {
        if (reviewing.has(occurrence.id)) return;

        const reviewed = !occurrence.reviewed;

        setReviewing((prev) => new Set(prev).add(occurrence.id));
        setOccurrences((prev) => prev.map((o) => (o.id === occurrence.id ? { ...o, reviewed, reviewedAt: reviewed ? new Date().toISOString() : null } : o)));
        setReviewedCount((prev) => prev + (reviewed ? 1 : -1));

        const response = await makeRequest("put", `/site-images/occurrences/${occurrence.id}/review`, { reviewed });

        if (response?.status !== 200) {
            setOccurrences((prev) => prev.map((o) => (o.id === occurrence.id ? { ...o, reviewed: occurrence.reviewed, reviewedAt: occurrence.reviewedAt } : o)));
            setReviewedCount((prev) => prev - (reviewed ? 1 : -1));
            toast.error("Não foi possível salvar", { description: response?.message ?? "Tente novamente." });
        } else if (reviewedFilter !== "all") {
            // A ocorrência deixou de pertencer ao recorte exibido — recarrega para ela sair da
            // lista e a paginação continuar batendo com o total.
            setOccurrences((prev) => prev.filter((o) => o.id !== occurrence.id));
            setCount((prev) => Math.max(0, prev - 1));
        }

        setReviewing((prev) => {
            const next = new Set(prev);
            next.delete(occurrence.id);
            return next;
        });
    };

    /** Antecipa a reconferência mensal: devolve a imagem para a fila da extensão. */
    const handleResearch = async () => {
        if (!imageId) return;

        setResearching(true);

        const response = await makeRequest("post", `/site-images/${imageId}/research`);

        if (response?.status === 200) {
            toast.success("Pesquisa reagendada", { description: "A imagem voltou para a fila da extensão." });
            setImage((prev) => (prev ? { ...prev, searched: "pending" } : prev));
        } else if (response?.status === 409) {
            toast.info("Já está na fila", { description: response?.message ?? "A imagem ainda não foi pesquisada." });
        } else if (response?.status === 403) {
            toast.warning("Serviço não habilitado", { description: response?.message ?? "O serviço de Pesquisa Reversa de Imagem não está habilitado para este cliente." });
        } else {
            toast.error("Erro ao reagendar", { description: response?.message ?? "Tente novamente." });
        }

        setResearching(false);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Voltar" title="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Search className="h-7 w-7 text-primary" />
                        Ocorrências encontradas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {totalCount} resultado{totalCount === 1 ? "" : "s"} para esta imagem · {reviewedCount} analisada{reviewedCount === 1 ? "" : "s"}
                    </p>
                </div>
            </div>

            {/* Imagem de origem: a imagem que foi pesquisada e gerou as ocorrências abaixo */}
            {image &&
                (() => {
                    const statusMeta = SEARCHED_LABEL[image.searched] ?? SEARCHED_LABEL.pending;
                    const StatusIcon = statusMeta.Icon;
                    return (
                        <Card className="mb-6 overflow-hidden animate-in fade-in duration-500">
                            <div className="flex flex-col sm:flex-row">
                                <a href={image.url} target="_blank" rel="noreferrer noopener" className="group relative block w-full sm:w-48 shrink-0 h-40 sm:h-auto bg-muted overflow-hidden" title="Abrir imagem original em nova aba">
                                    <img
                                        src={image.url}
                                        alt={image.alt ?? "Imagem pesquisada"}
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/30 group-hover:opacity-100">
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-card/90 px-3 py-1.5 text-sm font-medium text-foreground">
                                            <ExternalLink className="h-4 w-4" />
                                            Abrir
                                        </span>
                                    </div>
                                </a>

                                <CardContent className="flex flex-1 flex-col justify-center gap-2 p-4">
                                    <div>
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Imagem pesquisada</p>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <BrandThumb logoUrl={image.siteScrape.brand?.logo_url} />
                                            <span className="font-semibold text-foreground truncate">{image.siteScrape.brand?.name ?? "Sem ativo"}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                                        <Globe className="h-4 w-4 shrink-0 text-primary" />
                                        <span className="truncate">{image.siteScrape.domain.replace(/^https?:\/\//, "")}</span>
                                    </div>

                                    {image.alt && <p className="text-sm text-muted-foreground line-clamp-2">{image.alt}</p>}

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.classes}`} title={image.searchedAt ? `${statusMeta.label} em ${new Date(image.searchedAt).toLocaleString("pt-BR")}` : statusMeta.label}>
                                            <StatusIcon className={`h-3.5 w-3.5 ${image.searched === "processing" ? "animate-pulse" : ""}`} />
                                            {statusMeta.label}
                                        </span>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                            <Search className="h-3.5 w-3.5" />
                                            {totalCount} ocorrência{totalCount === 1 ? "" : "s"}
                                        </span>

                                        {totalCount > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-xs font-semibold text-white" title="Ocorrências que já passaram pela triagem manual">
                                                <ClipboardCheck className="h-3.5 w-3.5" />
                                                {reviewedCount} de {totalCount} analisada{reviewedCount === 1 ? "" : "s"}
                                            </span>
                                        )}

                                        {/* Novidade da última reconferência — só a partir da 2ª pesquisa */}
                                        {image.searchCount > 1 && image.lastNewCount > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/90 px-2.5 py-1 text-xs font-semibold text-white" title="Ocorrências que ainda não estavam no banco quando a imagem foi pesquisada de novo">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                {image.lastNewCount} nova{image.lastNewCount === 1 ? "" : "s"} na última pesquisa
                                            </span>
                                        )}

                                        {image.manual && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/90 px-2.5 py-1 text-xs font-semibold text-white" title="Imagem adicionada manualmente">
                                                <ImagePlus className="h-3.5 w-3.5" />
                                                Manual
                                            </span>
                                        )}
                                    </div>

                                    {/* A imagem é pesquisada de novo a cada 30 dias: sem esta linha a tela
                                        pareceria estática, e o usuário não saberia que há reconferência. */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                                            {image.searchCount === 0 ? "Ainda não pesquisada" : `${image.searchCount} pesquisa${image.searchCount === 1 ? "" : "s"} realizada${image.searchCount === 1 ? "" : "s"}`}
                                        </span>

                                        {image.nextSearchAt && image.searched === "completed" && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                                                Próxima reconferência a partir de {new Date(image.nextSearchAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        )}

                                        {image.searched === "completed" && (
                                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={handleResearch} disabled={researching} title="Devolve a imagem para a fila da extensão agora, sem esperar o vencimento mensal">
                                                {researching ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
                                                Pesquisar novamente
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    );
                })()}

            {/* Filtro da triagem. Fica fora do bloco vazio de propósito: filtrando por "já
                analisadas" o recorte pode vir vazio, e sem o select na tela não haveria como voltar. */}
            {totalCount > 0 && (
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Exibindo {count} ocorrência{count === 1 ? "" : "s"}
                        {reviewedFilter === "pending" ? " pendente(s) de análise" : reviewedFilter === "reviewed" ? " já analisada(s)" : ""}
                    </p>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Select value={reviewedFilter} onValueChange={handleChangeReviewedFilter}>
                            <SelectTrigger className="w-full sm:w-[230px]">
                                <SelectValue placeholder="Filtrar por análise" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="pending">Pendentes de análise</SelectItem>
                                <SelectItem value="reviewed">Já analisadas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        {totalCount > 0 ? (
                            <>
                                <h3 className="text-lg font-semibold mb-2">Nenhuma ocorrência neste filtro</h3>
                                <p className="text-muted-foreground text-center">{reviewedFilter === "pending" ? "Todas as ocorrências desta imagem já foram analisadas." : "Nenhuma ocorrência desta imagem foi analisada ainda."}</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-2">Nenhuma ocorrência ainda</h3>
                                <p className="text-muted-foreground text-center">A extensão ainda não pesquisou esta imagem ou nenhum resultado foi encontrado.</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
                        {occurrences.map((occ) => {
                            const mainImage = occ.thumbnail || occ.image || FALLBACK_IMAGE;
                            const host = getHostname(occ.href);
                            const title = occ.text?.trim() || host || "Sem título";
                            const isNew = isNewInLastSearch(occ, image);
                            const isMissing = isMissingInLastSearch(occ, image);

                            // Só o conteúdo é link. O botão de triagem precisa ficar fora dele:
                            // um <button> dentro de um <a> é HTML inválido e o clique navegaria.
                            const content = (
                                <>
                                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                        <img
                                            src={mainImage}
                                            alt={title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                                            }}
                                        />
                                        {occ.href && (
                                            <div className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md bg-card/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="h-4 w-4" />
                                            </div>
                                        )}

                                        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                                            {isNew && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-warning/90 px-2 py-1 text-[11px] font-semibold text-white shadow-sm" title="Apareceu na pesquisa mais recente — não estava no banco antes">
                                                    <Sparkles className="h-3 w-3" />
                                                    Nova
                                                </span>
                                            )}

                                            {occ.reviewed && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-1 text-[11px] font-semibold text-white shadow-sm" title={occ.reviewedAt ? `Analisada em ${new Date(occ.reviewedAt).toLocaleString("pt-BR")}` : "Analisada"}>
                                                    <ClipboardCheck className="h-3 w-3" />
                                                    Analisada
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-3 space-y-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {occ.image ? (
                                                <img
                                                    src={occ.image}
                                                    alt=""
                                                    loading="lazy"
                                                    className="h-5 w-5 rounded-sm object-cover shrink-0 bg-muted"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center shrink-0">
                                                    <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span className="text-xs text-muted-foreground truncate">{host || "—"}</span>
                                        </div>

                                        <p className="text-sm font-medium line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">{title}</p>

                                        {/* `lastSeenAt` ao lado de `createdAt` de propósito: distinguir "achada uma
                                            vez" de "continua no ar" é o que diz se o takedown funcionou. */}
                                        <p className="text-[11px] text-muted-foreground" title={`Encontrada em ${new Date(occ.createdAt).toLocaleString("pt-BR")} · vista pela última vez em ${new Date(occ.lastSeenAt).toLocaleString("pt-BR")}`}>
                                            Encontrada em {new Date(occ.createdAt).toLocaleDateString("pt-BR")}
                                            {isMissing ? <span className="text-emerald-600 dark:text-emerald-500"> · fora da última pesquisa</span> : <> · vista em {new Date(occ.lastSeenAt).toLocaleDateString("pt-BR")}</>}
                                        </p>
                                    </div>
                                </>
                            );

                            return (
                                <Card key={occ.id} className="flex flex-col overflow-hidden h-full hover:shadow-md transition-all border border-border group">
                                    {occ.href ? (
                                        <a href={occ.href} target="_blank" rel="noreferrer noopener" className="flex flex-col gap-6 focus:outline-none focus:ring-2 focus:ring-primary rounded-t-lg">
                                            {content}
                                        </a>
                                    ) : (
                                        <div className="flex flex-col gap-6">{content}</div>
                                    )}

                                    <div className="mt-auto flex flex-col gap-2 px-3">
                                        <Button variant={occ.reviewed ? "outline" : "default"} size="sm" className="w-full" onClick={() => handleToggleReviewed(occ)} disabled={reviewing.has(occ.id)} title={occ.reviewed ? "Devolve a ocorrência para a fila de análise" : "Marca que esta ocorrência já foi analisada"}>
                                            {reviewing.has(occ.id) ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : occ.reviewed ? <Circle className="mr-1.5 h-3.5 w-3.5" /> : <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />}
                                            {occ.reviewed ? "Marcar como pendente" : "Marcar como analisada"}
                                        </Button>

                                        {/* Ponte para a tela do ativo: a mesma ocorrência foi replicada em marketplaces,
                                            e é lá que ela pode ser verificada, notificada e arquivada. */}
                                        {occ.marketplace && (
                                            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary" asChild title="Abre esta mesma ocorrência na aba de Marketplaces do ativo, em uma nova aba">
                                                <Link href={`/brands/${occ.marketplace.brandId}?NewThreat=${occ.marketplace.id}&Source=marketplace`} target="_blank" rel="noopener noreferrer">
                                                    <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                                                    Ver em Marketplaces
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {count > take && <Paginations handleChangePagination={handleChangePagination} count={count} take={take} />}
                </>
            )}
        </div>
    );
}
