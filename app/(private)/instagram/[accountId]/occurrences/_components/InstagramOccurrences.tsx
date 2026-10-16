"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImageIcon, ShieldCheck, ShieldAlert, Instagram, ImageOff, CalendarClock, EyeOff, Undo2 } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import Paginations from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/LanguageProvider";
import { IInstagramOccurrence, IInstagramProtectionProgress } from "@/lib/types";

type InstagramOccurrencesPageProps = {
    pageSkeleton: React.ReactNode;
};

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/**
 * Prévia do card.
 *
 * **Mostra a nossa imagem, não a cópia** (out/2026). A URL da cópia vem do CDN do Instagram e
 * expira em poucos dias, então a prévia quase sempre falhava e o card exibia um aviso no lugar
 * da imagem — justamente no elemento que deveria dar a leitura imediata da ocorrência.
 *
 * Trocar faz sentido porque o sistema só registra correspondência: o que se veria na cópia é
 * visualmente a mesma imagem. A diferença é que esta carrega sempre, por ser nossa.
 *
 * O tratamento de erro fica: o arquivo pode ter saído do bucket, e aí o aviso é preferível a um
 * ícone quebrado. O que importa para o takedown continuam sendo os links, sempre válidos.
 */
function OccurrencePreview({ url }: { url: string }) {
    const { t } = useT();
    const [broken, setBroken] = useState(false);

    if (broken) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted px-4 text-center">
                <ImageOff className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{t("occurrences.previewExpired")}</p>
            </div>
        );
    }

    return <img src={url} alt={t("occurrences.copyAlt")} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={() => setBroken(true)} />;
}

export default function InstagramOccurrencesPage({ pageSkeleton }: InstagramOccurrencesPageProps) {
    const params = useParams<{ accountId: string }>();
    const accountId = params?.accountId;

    /**
     * Recorte por publicação, vindo da grade de posts. Opcional: sem ele a tela mostra o perfil
     * inteiro, que é o comportamento de sempre.
     */
    const searchParams = useSearchParams();
    const postId = searchParams.get("postId");

    /**
     * Cliente de onde se veio, trazido pela tela do Instagram. Volta no link de retorno para ela
     * reabrir já com ele selecionado (e no perfil desta tela). Sem ele — URL aberta direto — o
     * retorno cai no seletor vazio, como antes.
     */
    const clientQuery = new URLSearchParams();
    const fromClientId = searchParams.get("clientId");

    if (fromClientId) {
        clientQuery.set("clientId", fromClientId);
        clientQuery.set("clientName", searchParams.get("clientName") ?? "");
    }

    const backHref = fromClientId ? `/instagram?${clientQuery.toString()}&accountId=${encodeURIComponent(accountId ?? "")}` : "/instagram";
    const allOccurrencesHref = `/instagram/${accountId}/occurrences${fromClientId ? `?${clientQuery.toString()}` : ""}`;

    const [occurrences, setOccurrences] = useState<IInstagramOccurrence[]>([]);
    const [progress, setProgress] = useState<IInstagramProtectionProgress | null>(null);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [take] = useState(50);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Ocorrência aguardando confirmação do descarte, e a que espera para ser restaurada
    const [occurrenceToIgnore, setOccurrenceToIgnore] = useState<IInstagramOccurrence | null>(null);
    const [occurrenceToRestore, setOccurrenceToRestore] = useState<IInstagramOccurrence | null>(null);

    /**
     * Papel da sessão. Começa `null` (desconhecido) e só então os controles de triagem entram:
     * mostrá-los antes faria o botão piscar e sumir na tela do cliente.
     */
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    /** Lado da listagem que está aberto. Só o dono alcança as ignoradas. */
    const [showingIgnored, setShowingIgnored] = useState(false);

    /** Muda a cada descarte para a listagem ser relida — a página atual ficou com uma vaga. */
    const [reloadToken, setReloadToken] = useState(0);

    useEffect(() => {
        (async () => {
            const response = await makeRequest("get", "/me");
            // Qualquer coisa fora de `owner` — inclusive um corpo de erro — é acesso de cliente.
            setIsOwner(response?.user?.role === "owner");
        })();
    }, []);

    const { makeRequest } = useFetch();
    const { t, tn, locale } = useT();

    useEffect(() => {
        async function load() {
            if (!accountId) return;

            const skip = (page - 1) * take;
            const response = await makeRequest("get", `/instagram/occurrences?accountId=${accountId}&skip=${skip}&take=${take}${showingIgnored ? "&ignored=true" : ""}${postId ? `&postId=${encodeURIComponent(postId)}` : ""}`);

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
    }, [accountId, page, reloadToken, showingIgnored, postId]);

    /**
     * Descarta a ocorrência: ela sai da listagem e não volta nas próximas buscas.
     *
     * No banco a linha permanece — é o que impede a busca mensal de recriá-la. Para a tela,
     * porém, ela deixou de existir, então basta reler a página.
     */
    /** Desfaz o descarte: a ocorrência volta para a listagem ativa. */
    const handleRestore = async () => {
        if (!occurrenceToRestore) return;

        const response = await makeRequest("put", `/instagram/occurrences/${occurrenceToRestore.id}/restore`);

        setOccurrenceToRestore(null);

        if (response?.status === 200) {
            toast.success(t("occurrences.restoredTitle"), { description: t("occurrences.restoredDescription") });
            setReloadToken((token) => token + 1);
            return;
        }

        toast.error(t("occurrences.restoreErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
    };

    const handleIgnore = async () => {
        if (!occurrenceToIgnore) return;

        const response = await makeRequest("put", `/instagram/occurrences/${occurrenceToIgnore.id}/ignore`);

        setOccurrenceToIgnore(null);

        if (response?.status === 200) {
            toast.success(t("occurrences.ignoredTitle"), { description: t("occurrences.ignoredDescription") });
            setReloadToken((token) => token + 1);
            return;
        }

        toast.error(t("occurrences.ignoreErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
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
                <Button variant="outline" size="icon" asChild aria-label={t("occurrences.backToInstagram")} title={t("occurrences.backToInstagram")}>
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <ShieldAlert className="h-7 w-7 text-primary" />
                        {t("occurrences.title")}
                    </h1>
                    <p className="mt-1 text-muted-foreground">{tn("occurrences.subtitle", count)}</p>
                </div>
            </div>

            {/* Sem este aviso, a lista recortada pareceria "as ocorrências sumiram". O link de
                saída é parte dele: entrou-se por uma URL, e é preciso haver como voltar. */}
            {postId && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{t("occurrences.filteredByPost")}</span>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={allOccurrencesHref}>{t("occurrences.seeAllOccurrences")}</Link>
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
                        {t("occurrences.filterActive")}
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
                        {t("occurrences.filterIgnored")}
                    </Button>
                </div>
            )}

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
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("occurrences.checkedLabel")}</p>
                                <p className="tabular-nums">{t("occurrences.counted", { checked: progress.checked, total: progress.total })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                                <ShieldAlert className="h-5 w-5 text-destructive" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("occurrences.copiesLabel")}</p>
                                <p className="tabular-nums">{progress.occurrences}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("occurrences.frequencyLabel")}</p>
                                <p>{t("occurrences.frequencyValue")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShieldCheck className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">{t("occurrences.emptyTitle")}</h3>
                        <p className="max-w-md text-center text-muted-foreground">{showingIgnored ? t("occurrences.emptyIgnored") : progress && progress.checked < progress.total ? tn("occurrences.emptyPending", progress.total - progress.checked) : t("occurrences.emptyDone")}</p>
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
                                            {t("occurrences.ignoredBadge")}
                                        </span>
                                    )}

                                    {/* Mantida mesmo repetindo a imagem grande: é ela que rotula qual
                                        das duas é a nossa, e o `title` explica a ocorrência ao passar
                                        o mouse. Sem ela o card perderia essa leitura. */}
                                    {occurrence.image.url && (
                                        <span className="absolute bottom-2 left-2 h-14 w-14 overflow-hidden rounded-md border-2 border-background bg-muted shadow-md" title={t("occurrences.ourImageTitle")}>
                                            <img
                                                src={occurrence.image.url}
                                                alt={t("occurrences.originalAlt")}
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
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>{t("occurrences.foundAt", { date: new Date(occurrence.createdAt).toLocaleDateString(locale) })}</p>
                                        {/* Distinguir "achada uma vez" de "continua no ar" é o que diz se
                                            o takedown funcionou. */}
                                        <p>{t("occurrences.lastSeenAt", { date: new Date(occurrence.lastSeenAt).toLocaleDateString(locale) })}</p>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-2">
                                        {/* Triagem é do dono. Para o cliente o card não tem ação:
                                            ele vê a ocorrência, não decide sobre ela. */}
                                        {isOwner &&
                                            (occurrence.ignoredAt ? (
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setOccurrenceToRestore(occurrence)}>
                                                    <Undo2 className="mr-2 h-4 w-4" />
                                                    {t("occurrences.restore")}
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setOccurrenceToIgnore(occurrence)}>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    {t("occurrences.ignore")}
                                                </Button>
                                            ))}

                                        <div className="flex gap-2">
                                            {/* Sólido, e o único assim no card: é o link para a
                                                cópia — a ação principal da ocorrência. O "Original"
                                                ao lado fica em contorno, por ser a referência. */}
                                            <Button variant="default" size="sm" asChild className="flex-1">
                                                <a href={occurrence.imageUrl} target="_blank" rel="noreferrer noopener">
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    {t("occurrences.imageButton")}
                                                </a>
                                            </Button>

                                            {occurrence.image.post?.permalink && (
                                                <Button variant="outline" size="sm" asChild className="flex-1" title={t("occurrences.originalTitle")}>
                                                    <a href={occurrence.image.post.permalink} target="_blank" rel="noreferrer noopener">
                                                        <Instagram className="mr-2 h-4 w-4" />
                                                        {t("occurrences.originalButton")}
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

            <ConfirmDialog
                open={!!occurrenceToRestore}
                onOpenChange={(open) => {
                    if (!open) setOccurrenceToRestore(null);
                }}
                title={t("occurrences.restoreTitle")}
                description={t("occurrences.restoreDescription")}
                onConfirm={handleRestore}
                confirmText={t("occurrences.restore")}
                cancelText={t("common.cancel")}
            />

            <ConfirmDialog
                open={!!occurrenceToIgnore}
                onOpenChange={(open) => {
                    if (!open) setOccurrenceToIgnore(null);
                }}
                title={t("occurrences.ignoreTitle")}
                description={t("occurrences.ignoreDescription")}
                onConfirm={handleIgnore}
                confirmText={t("occurrences.ignore")}
                cancelText={t("common.cancel")}
            />
        </div>
    );
}
