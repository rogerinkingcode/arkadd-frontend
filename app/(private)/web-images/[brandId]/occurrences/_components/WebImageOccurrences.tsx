"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImageIcon, ShieldCheck, ShieldAlert, ImageOff, CalendarClock, EyeOff, Undo2, Globe } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import Paginations from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { IWebImageOccurrence, IWebProtectionProgress } from "@/lib/types";

type WebImageOccurrencesPageProps = {
    pageSkeleton: React.ReactNode;
};

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/**
 * Prévia do card: **a nossa imagem, não a cópia** — o mesmo critério da tela do Instagram. O
 * arquivo do terceiro pode ter saído do ar, bloquear o carregamento a partir de outro site ou
 * exigir login; o nosso carrega sempre, e o que se veria na cópia é visualmente a mesma imagem.
 * O que importa para o takedown são os links, logo abaixo.
 */
function OccurrencePreview({ url }: { url: string }) {
    const [broken, setBroken] = useState(false);

    if (broken) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted px-4 text-center">
                <ImageOff className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Prévia indisponível — use os links abaixo.</p>
            </div>
        );
    }

    return <img src={url} alt="Imagem copiada" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={() => setBroken(true)} />;
}

const plural = (count: number, one: string, other: string) => `${count} ${count === 1 ? one : other}`;

export default function WebImageOccurrencesPage({ pageSkeleton }: WebImageOccurrencesPageProps) {
    const params = useParams<{ brandId: string }>();
    const brandId = params?.brandId;

    /** Recorte por imagem, vindo da grade. Opcional: sem ele a tela mostra o ativo inteiro. */
    const searchParams = useSearchParams();
    const imageId = searchParams.get("imageId");

    /**
     * Cliente de onde se veio, trazido pela tela de Imagens na web. Volta no link de retorno
     * para ela reabrir já com ele selecionado (e neste ativo). Sem ele — URL aberta direto — o
     * retorno cai no seletor vazio, como antes.
     */
    const clientQuery = new URLSearchParams();
    const fromClientId = searchParams.get("clientId");

    if (fromClientId) {
        clientQuery.set("clientId", fromClientId);
        clientQuery.set("clientName", searchParams.get("clientName") ?? "");
    }

    const backHref = fromClientId ? `/web-images?${clientQuery.toString()}&brandId=${encodeURIComponent(brandId ?? "")}` : "/web-images";
    const allOccurrencesHref = `/web-images/${brandId}/occurrences${fromClientId ? `?${clientQuery.toString()}` : ""}`;

    const [occurrences, setOccurrences] = useState<IWebImageOccurrence[]>([]);
    const [progress, setProgress] = useState<IWebProtectionProgress | null>(null);
    const [brandName, setBrandName] = useState("");
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [take] = useState(50);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Ocorrência aguardando confirmação do descarte, e a que espera para ser restaurada
    const [occurrenceToIgnore, setOccurrenceToIgnore] = useState<IWebImageOccurrence | null>(null);
    const [occurrenceToRestore, setOccurrenceToRestore] = useState<IWebImageOccurrence | null>(null);

    /** Papel da sessão. `null` até a resposta chegar, para os controles de triagem não piscarem. */
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    /** Lado da listagem que está aberto. Só o dono alcança as descartadas. */
    const [showingIgnored, setShowingIgnored] = useState(false);

    /** Muda a cada descarte para a listagem ser relida — a página atual ficou com uma vaga. */
    const [reloadToken, setReloadToken] = useState(0);

    const { makeRequest } = useFetch();

    useEffect(() => {
        (async () => {
            const response = await makeRequest("get", "/me");
            setIsOwner(response?.user?.role === "owner");
        })();
    }, []);

    useEffect(() => {
        async function load() {
            if (!brandId) return;

            const skip = (page - 1) * take;
            const response = await makeRequest("get", `/web-images/occurrences?brandId=${encodeURIComponent(brandId)}&skip=${skip}&take=${take}${showingIgnored ? "&ignored=true" : ""}${imageId ? `&imageId=${encodeURIComponent(imageId)}` : ""}`);

            if (response?.status === 200) {
                setOccurrences(response.occurrences ?? []);
                setProgress(response.progress ?? null);
                setBrandName(response.brand?.name ?? "");
                setCount(response.count ?? 0);
            } else {
                setOccurrences([]);
                setProgress(null);
                setCount(0);
            }

            setInitialLoaded(true);
        }

        load();
    }, [brandId, page, reloadToken, showingIgnored, imageId]);

    /** Descarta (ou restaura) e relê a página. No banco a linha descartada permanece. */
    const handleToggleIgnored = async (occurrence: IWebImageOccurrence, ignore: boolean) => {
        const response = await makeRequest("put", `/web-images/occurrences/${occurrence.id}/${ignore ? "ignore" : "restore"}`);

        setOccurrenceToIgnore(null);
        setOccurrenceToRestore(null);

        if (response?.status === 200) {
            toast.success(ignore ? "Ocorrência descartada" : "Ocorrência restaurada", { description: ignore ? "Ela sai da listagem e não volta nas próximas buscas." : "Ela voltou para a listagem de ocorrências ativas." });
            setReloadToken((token) => token + 1);
            return;
        }

        toast.error(ignore ? "Não foi possível descartar" : "Não foi possível restaurar", { description: response?.message ?? "Tente novamente." });
    };

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
                <Button variant="outline" size="icon" asChild aria-label="Voltar para Imagens na web" title="Voltar para Imagens na web">
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <ShieldAlert className="h-7 w-7 text-primary" />
                        Cópias encontradas
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {plural(count, "ocorrência", "ocorrências")} na web{brandName ? ` · ${brandName}` : ""}
                    </p>
                </div>
            </div>

            {/* Sem este aviso, a lista recortada pareceria "as ocorrências sumiram". */}
            {imageId && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">Mostrando apenas as ocorrências de uma imagem.</span>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={allOccurrencesHref}>Ver todas do ativo</Link>
                    </Button>
                </div>
            )}

            {/* Alternância entre ativas e descartadas — triagem, portanto só do dono. */}
            {isOwner && (
                <div className="mb-6 flex gap-2">
                    <Button
                        size="sm"
                        variant={showingIgnored ? "outline" : "default"}
                        onClick={() => {
                            setShowingIgnored(false);
                            setPage(1);
                        }}
                    >
                        Ativas
                    </Button>
                    <Button
                        size="sm"
                        variant={showingIgnored ? "default" : "outline"}
                        onClick={() => {
                            setShowingIgnored(true);
                            setPage(1);
                        }}
                    >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Descartadas
                    </Button>
                </div>
            )}

            {/* Resumo da proteção — "zero cópias" com metade do acervo por verificar significa
                outra coisa que "zero" com tudo verificado. */}
            {progress && (
                <Card className="mb-6">
                    <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-4 p-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Imagens verificadas</p>
                                <p className="tabular-nums">
                                    {progress.checked} de {progress.total}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                                <ShieldAlert className="h-5 w-5 text-destructive" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cópias</p>
                                <p className="tabular-nums">{progress.occurrences}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Frequência</p>
                                <p>Cada imagem é buscada uma vez por mês</p>
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
                        <p className="max-w-md text-center text-muted-foreground">
                            {showingIgnored
                                ? "Nenhuma ocorrência foi descartada."
                                : progress && progress.checked < progress.total
                                  ? `Ainda ${progress.total - progress.checked === 1 ? "falta 1 imagem" : `faltam ${progress.total - progress.checked} imagens`} para a primeira verificação.`
                                  : "Todas as imagens foram verificadas e nenhuma cópia apareceu fora do site do cliente e do Instagram."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid animate-in grid-cols-1 gap-4 duration-500 fade-in sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {occurrences.map((occurrence) => (
                            <Card key={occurrence.id} className="group flex h-full flex-col overflow-hidden border border-border transition-all hover:shadow-md">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <OccurrencePreview url={occurrence.image.url || occurrence.imageUrl} />

                                    {occurrence.ignoredAt && (
                                        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-[11px] font-semibold text-background">
                                            <EyeOff className="h-3 w-3" />
                                            Descartada
                                        </span>
                                    )}

                                    {/* Rotula qual das duas é a nossa. */}
                                    {occurrence.image.url && (
                                        <span className="absolute bottom-2 left-2 h-14 w-14 overflow-hidden rounded-md border-2 border-background bg-muted shadow-md" title="Esta é a nossa imagem — a ocorrência é uma cópia dela">
                                            <img
                                                src={occurrence.image.url}
                                                alt="Imagem original"
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                                                }}
                                            />
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col gap-3 p-3">
                                    {/* Onde a cópia está — na web é isso que identifica a ocorrência. */}
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="flex items-center gap-1.5 truncate text-sm font-semibold" title={occurrence.domain}>
                                            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            {occurrence.domain}
                                        </p>
                                        {occurrence.pageTitle && (
                                            <p className="line-clamp-2 text-xs text-muted-foreground" title={occurrence.pageTitle}>
                                                {occurrence.pageTitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>Encontrada em {new Date(occurrence.createdAt).toLocaleDateString("pt-BR")}</p>
                                        {/* Distinguir "achada uma vez" de "continua no ar" é o que diz se
                                            o takedown funcionou. */}
                                        <p>Vista pela última vez em {new Date(occurrence.lastSeenAt).toLocaleDateString("pt-BR")}</p>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-2">
                                        {isOwner &&
                                            (occurrence.ignoredAt ? (
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setOccurrenceToRestore(occurrence)}>
                                                    <Undo2 className="mr-2 h-4 w-4" />
                                                    Restaurar
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setOccurrenceToIgnore(occurrence)}>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Descartar
                                                </Button>
                                            ))}

                                        <div className="flex gap-2">
                                            {/* A página é o link principal: é onde a cópia está publicada e o
                                                que vai para o takedown. Sem ela, o arquivo assume o papel. */}
                                            {occurrence.pageUrl && (
                                                <Button variant="default" size="sm" asChild className="flex-1">
                                                    <a href={occurrence.pageUrl} target="_blank" rel="noreferrer noopener">
                                                        <Globe className="mr-2 h-4 w-4" />
                                                        Página
                                                    </a>
                                                </Button>
                                            )}

                                            <Button variant={occurrence.pageUrl ? "outline" : "default"} size="sm" asChild className="flex-1">
                                                <a href={occurrence.imageUrl} target="_blank" rel="noreferrer noopener">
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    Imagem
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {count > take && <Paginations handleChangePagination={handleChangePagination} count={count} take={take} />}
                </>
            )}

            <ConfirmDialog
                open={!!occurrenceToRestore}
                onOpenChange={(open) => {
                    if (!open) setOccurrenceToRestore(null);
                }}
                title="Restaurar ocorrência"
                description="A ocorrência volta para a listagem de cópias ativas."
                onConfirm={() => occurrenceToRestore && handleToggleIgnored(occurrenceToRestore, false)}
                confirmText="Restaurar"
                cancelText="Cancelar"
            />

            <ConfirmDialog
                open={!!occurrenceToIgnore}
                onOpenChange={(open) => {
                    if (!open) setOccurrenceToIgnore(null);
                }}
                title="Descartar ocorrência"
                description="Use para falso positivo. A ocorrência sai da listagem — inclusive para o cliente — e não volta nas próximas buscas. Dá para desfazer em Descartadas."
                onConfirm={() => occurrenceToIgnore && handleToggleIgnored(occurrenceToIgnore, true)}
                confirmText="Descartar"
                cancelText="Cancelar"
            />
        </div>
    );
}
