"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Instagram, ImageIcon, Loader2, RefreshCw, Link2Off, ExternalLink, Layers, AlertCircle, CheckCircle2, Images, Plus, Users, KeyRound, Hourglass, RotateCcw, ShieldCheck, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { ClientsSelect } from "@/components/ClientsSelect";
import Paginations from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IInstagramAccount, IInstagramPost } from "@/lib/types";
import { useT } from "@/lib/i18n/LanguageProvider";

type InstagramPageProps = {
    pageSkeleton: React.ReactNode;
};

/** Intervalo de consulta enquanto alguma importação está rodando no backend. */
const SYNC_POLL_INTERVAL = 3000;

/**
 * Marca de mão única para o ir-e-voltar da autorização. É gravada apenas ao redirecionar para
 * o Instagram e consumida (lida e apagada) no mount, para que o perfil recém-conectado
 * reapareça no retorno. Fora desse fluxo o seletor sempre começa vazio: entrar na página exige
 * selecionar um cliente para carregar os dados.
 */
const SELECTED_CLIENT_KEY = "apex-instagram-client";

/** Gradiente característico da marca Instagram (amarelo → laranja → magenta → roxo → azul). */
const INSTAGRAM_GRADIENT = "bg-[linear-gradient(135deg,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)]";

/** Estados em que há trabalho rodando no backend — a tela consulta o progresso enquanto durarem. */
const IN_PROGRESS_STATUSES = ["discovering", "downloading"];

const isInProgress = (account: IInstagramAccount) => IN_PROGRESS_STATUSES.includes(account.syncStatus);

/** Placeholder exibido quando a imagem não carrega (objeto removido do bucket, por exemplo). */
const BROKEN_IMAGE_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

export default function InstagramPage({ pageSkeleton }: InstagramPageProps) {
    // Cliente em foco
    const [clientId, setClientId] = useState("");
    const [clientName, setClientName] = useState("");

    // Perfis conectados do cliente e o que está aberto na grade
    const [accounts, setAccounts] = useState<IInstagramAccount[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState("");
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    const [posts, setPosts] = useState<IInstagramPost[]>([]);
    const [countPosts, setCountPosts] = useState(0);

    const [initialLoaded, setInitialLoaded] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<IInstagramAccount | null>(null);

    // Publicação aguardando confirmação de exclusão
    const [postToDelete, setPostToDelete] = useState<IInstagramPost | null>(null);
    const [deletingPost, setDeletingPost] = useState(false);

    // Paginação das publicações
    const [takePosts] = useState(50);
    const [pagePosts, setPagePosts] = useState(1);

    // Publicação aberta no visualizador (mostra todas as imagens do carrossel)
    const [openedPost, setOpenedPost] = useState<IInstagramPost | null>(null);

    /**
     * Desconectar é a única ação desta tela restrita ao dono — apaga o perfil e todo o acervo
     * importado. Começa `null` (ainda não sabemos) e o botão só entra quando a resposta chega:
     * mostrá-lo antes faria ele piscar na tela do cliente e sumir em seguida.
     */
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    const { makeRequest } = useFetch();
    const { t, tn, locale } = useT();

    // `makeRequest` muda a cada render (novo closure); a ref evita recriar os efeitos por isso.
    const requestRef = useRef(makeRequest);
    requestRef.current = makeRequest;

    /** Lê os perfis conectados do cliente. Devolve-os para os fluxos que reagem ao status. */
    const loadAccounts = async (targetClientId: string): Promise<IInstagramAccount[]> => {
        const response = await requestRef.current("get", `/instagram/accounts?clientId=${targetClientId}`);

        if (response?.status === 200) {
            const loaded: IInstagramAccount[] = response.accounts ?? [];
            setAccounts(loaded);
            return loaded;
        }

        toast.error(t("instagram.toast.loadErrorTitle"), { description: response?.message ?? t("instagram.toast.loadErrorDescription") });
        setAccounts([]);
        return [];
    };

    /** Lê uma página de publicações do perfil aberto. */
    const loadPosts = async (accountId: string, page: number = pagePosts) => {
        if (!accountId) {
            setPosts([]);
            setCountPosts(0);
            return;
        }

        const skip = (page - 1) * takePosts;
        const response = await requestRef.current("get", `/instagram/posts?accountId=${accountId}&skip=${skip}&take=${takePosts}`);

        if (response?.status === 200) {
            setPosts(response.posts ?? []);
            setCountPosts(response.count ?? 0);
        } else {
            setPosts([]);
            setCountPosts(0);
        }
    };

    // Só restaura o cliente quando o usuário está voltando do fluxo de autorização; a marca é
    // consumida (lida e apagada) aqui. Numa entrada normal na página não há marca, então o
    // seletor começa vazio e exige uma seleção explícita para carregar os dados.
    useEffect(() => {
        const stored = sessionStorage.getItem(SELECTED_CLIENT_KEY);
        sessionStorage.removeItem(SELECTED_CLIENT_KEY);

        if (stored) {
            try {
                const { id, name } = JSON.parse(stored) as { id: string; name: string };
                setClientId(id);
                setClientName(name);
            } catch {
                // marca corrompida: ignora e segue com o seletor vazio
            }
        }

        setInitialLoaded(true);
    }, []);

    // Papel da sessão: decide se o botão de desconectar entra na tela e se o cliente já vem
    // escolhido.
    useEffect(() => {
        (async () => {
            const response = await requestRef.current("get", "/me");

            // Qualquer coisa fora de `owner` — inclusive um corpo de erro devolvido pelo
            // `useFetch` — é tratada como acesso de cliente.
            const owner = response?.user?.role === "owner";

            setIsOwner(owner);

            if (owner) return;

            /**
             * O dono escolhe entre os clientes dele; o acesso de cliente alcança um só, o
             * próprio. Pedir que ele selecione é teatro — a lista tem uma linha, e enquanto
             * nada estiver escolhido a tela fica no estado "Selecione um cliente" sem carregar
             * perfil algum.
             *
             * `setState` por função, e não por valor: o retorno da autorização do Instagram
             * restaura o cliente da sessão no mount, possivelmente antes desta resposta chegar.
             * O que já estiver escolhido vence.
             */
            const ownClientId = response?.user?.clientId;

            if (!ownClientId) return;

            setClientId((current) => current || String(ownClientId));
            setClientName((current) => current || (response?.user?.companyName ?? ""));
        })();
    }, []);

    // Troca de cliente: recarrega os perfis e abre o primeiro deles
    useEffect(() => {
        if (!initialLoaded) return;

        async function load() {
            setSelectedAccountId("");
            setPosts([]);
            setCountPosts(0);
            setPagePosts(1);

            if (!clientId) {
                setAccounts([]);
                return;
            }

            setLoadingAccounts(true);
            const loaded = await loadAccounts(clientId);
            setLoadingAccounts(false);

            // Com um único perfil não faz sentido exigir um clique para abri-lo
            if (loaded.length > 0) setSelectedAccountId(loaded[0].id);
        }

        load();
    }, [clientId, initialLoaded]);

    // Troca de perfil ou de página da grade
    useEffect(() => {
        if (!initialLoaded) return;
        loadPosts(selectedAccountId, pagePosts);
    }, [selectedAccountId, pagePosts]);

    /**
     * Enquanto alguma importação roda no backend, consulta o status periodicamente. Ao
     * terminar, recarrega a grade do perfil aberto e avisa o resultado.
     */
    const syncingIds = accounts
        .filter(isInProgress)
        .map((account) => account.id)
        .join(",");

    useEffect(() => {
        if (!syncingIds || !clientId) return;

        const watched = syncingIds.split(",");

        const interval = setInterval(async () => {
            const updated = await loadAccounts(clientId);
            const finished = updated.filter((account) => watched.includes(account.id) && !isInProgress(account));

            if (finished.length === 0) return;

            for (const account of finished) {
                if (account.syncStatus === "completed") {
                    const failed = account.progress.failed;
                    toast.success(t("instagram.toast.importedTitle", { username: account.username }), {
                        description: t("instagram.toast.importedDescription", {
                            posts: tn("instagram.posts", account.postsCount),
                            images: tn("instagram.images", account.imagesCount),
                            extra: failed > 0 ? tn("instagram.toast.importedFailed", failed) : "",
                        }),
                    });
                } else if (account.syncStatus === "reauth_required") {
                    toast.error(t("instagram.toast.reauthTitle", { username: account.username }), { description: t("instagram.toast.reauthDescription") });
                } else if (account.syncStatus === "failed") {
                    toast.error(t("instagram.toast.syncFailedTitle", { username: account.username }), { description: account.syncError ?? t("instagram.toast.tryLater") });
                }
            }

            // Só recarrega a grade se o perfil aberto foi um dos que terminaram
            if (finished.some((account) => account.id === selectedAccountId)) {
                setPagePosts(1);
                await loadPosts(selectedAccountId, 1);
            }
        }, SYNC_POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [syncingIds, clientId, selectedAccountId]);

    const handleSelectClient = (value: string, name: string) => {
        setClientId(value);
        setClientName(name);
    };

    /** Etapa 1 — leva o usuário à tela de permissões do Instagram, para este cliente. */
    const handleConnect = async () => {
        if (!clientId) return;

        setConnecting(true);

        const response = await makeRequest("get", `/instagram/auth-url?clientId=${clientId}`);

        if (response?.status === 200 && response.url) {
            // Guarda o cliente só para o ir-e-voltar da autorização: o fluxo sai da app e
            // retorna pela rota de callback, que reabre esta tela. É consumido (e apagado) no
            // mount, então uma entrada normal na página começa sempre sem cliente selecionado.
            sessionStorage.setItem(SELECTED_CLIENT_KEY, JSON.stringify({ id: clientId, name: clientName }));
            // Sai da aplicação: o retorno acontece na rota de callback.
            window.location.href = response.url;
            return;
        }

        toast.error(t("instagram.toast.connectErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
        setConnecting(false);
    };

    /** Etapa 2 — dispara a importação das publicações do perfil em background. */
    const handleSync = async (account: IInstagramAccount) => {
        const response = await makeRequest("post", `/instagram/accounts/${account.id}/sync`);

        if (response?.status === 202) {
            setAccounts((prev) => prev.map((item) => (item.id === account.id ? { ...item, syncStatus: "discovering", syncError: null } : item)));
            toast.info(t("instagram.toast.syncStartedTitle", { username: account.username }), { description: t(account.syncTruncated ? "instagram.toast.syncStartedResume" : "instagram.toast.syncStartedNew") });
            return;
        }

        toast.error(t("instagram.toast.syncStartErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
    };

    /** Reenfileira downloads que ficaram para trás, sem repetir a varredura da API. */
    const handleRetryPending = async (account: IInstagramAccount) => {
        const response = await makeRequest("post", `/instagram/accounts/${account.id}/retry-pending`);

        if (response?.status === 202) {
            setAccounts((prev) => prev.map((item) => (item.id === account.id ? { ...item, syncStatus: "downloading", syncError: null } : item)));
            toast.info(t("instagram.toast.retryTitle", { username: account.username }), { description: tn("instagram.toast.queued", response.requeued) });
            return;
        }

        toast.error(t("instagram.toast.retryErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
    };

    /**
     * Apaga uma publicação do acervo.
     *
     * Recarrega a página atual da grade em vez de só remover o item da lista: a exclusão mexe
     * nos contadores do card e pode deixar a página com uma vaga, que a recarga preenche com o
     * item seguinte.
     */
    const handleDeletePost = async () => {
        if (!postToDelete) return;

        setDeletingPost(true);

        const response = await makeRequest("delete", `/instagram/posts/${postToDelete.id}`);

        setDeletingPost(false);

        if (response?.status === 200) {
            toast.success(t("instagram.toast.deletedPostTitle"), { description: t("instagram.toast.deletedPostDescription") });

            setPostToDelete(null);
            setOpenedPost(null);

            if (clientId) await loadAccounts(clientId);
            await loadPosts(selectedAccountId, pagePosts);
            return;
        }

        toast.error(t("instagram.toast.deletePostErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
        setPostToDelete(null);
    };

    const handleDisconnect = async () => {
        if (!accountToDisconnect) return;

        const response = await makeRequest("delete", `/instagram/accounts/${accountToDisconnect.id}`);

        if (response?.status === 200) {
            const remaining = accounts.filter((account) => account.id !== accountToDisconnect.id);

            setAccounts(remaining);
            toast.success(t("instagram.toast.disconnectedTitle"), { description: t("instagram.toast.disconnectedDescription", { username: accountToDisconnect.username }) });

            if (selectedAccountId === accountToDisconnect.id) {
                setPagePosts(1);
                setSelectedAccountId(remaining[0]?.id ?? "");
            }
        } else {
            toast.error(t("instagram.toast.disconnectErrorTitle"), { description: response?.message ?? t("instagram.toast.tryLater") });
        }

        setAccountToDisconnect(null);
    };

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagePosts(value);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;

    return (
        <div className="p-6 lg:p-8">
            {/* Cabeçalho */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Instagram className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Instagram</h1>
                        <p className="mt-1 text-muted-foreground">{t("instagram.subtitle")}</p>
                    </div>
                </div>

                {/* Só quando já há perfis: no estado vazio o botão central "Conectar Instagram"
                    já cobre a ação, e mostrar os dois seria redundante. */}
                {clientId && accounts.length > 0 && (
                    <Button onClick={handleConnect} disabled={connecting} className="w-full lg:w-auto">
                        {connecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                {t("instagram.connectAnother")}
                            </div>
                        )}
                    </Button>
                )}
            </div>

            {/* Seleção do cliente */}
            <Card className="mb-6 p-4">
                <div className="flex-1">
                    <Label className="mb-2 block">{t("instagram.clientLabel")}</Label>
                    <ClientsSelect companyName={clientName} value={clientId} onChange={(value, client) => handleSelectClient(String(value), client?.companyName ?? "")} makeRequest={makeRequest} />
                </div>
            </Card>

            {!clientId ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">{t("instagram.selectClientTitle")}</h3>
                        <p className="text-center text-muted-foreground">{t("instagram.selectClientDescription")}</p>
                    </CardContent>
                </Card>
            ) : loadingAccounts ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="mb-4 h-10 w-10 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">{t("instagram.loadingProfiles")}</p>
                    </CardContent>
                </Card>
            ) : accounts.length === 0 ? (
                /* ===== Etapa 1 — o cliente ainda não tem perfil conectado ===== */
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        {/* Gradiente oficial do Instagram (amarelo → laranja → magenta → roxo → azul),
                            para amarrar visualmente esta ação à marca. */}
                        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${INSTAGRAM_GRADIENT}`}>
                            <Instagram className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">{t("instagram.noProfilesTitle")}</h3>
                        <p className="mb-6 max-w-md text-center text-muted-foreground">{t("instagram.noProfilesDescription")}</p>
                        <Button size="lg" onClick={handleConnect} disabled={connecting} className={`border-0 text-white hover:opacity-90 ${INSTAGRAM_GRADIENT}`}>
                            {connecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4" />
                                    {t("instagram.connect")}
                                </div>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* ===== Perfis conectados do cliente ===== */}
                    <div className="mb-6 space-y-4">
                        {accounts.map((account) => {
                            const isSyncing = isInProgress(account);
                            const needsReauth = account.syncStatus === "reauth_required";
                            const isOpen = account.id === selectedAccountId;

                            const { stored, pending, failed } = account.progress;
                            const totalImages = stored + pending + failed;
                            const percent = totalImages > 0 ? Math.round(((stored + failed) / totalImages) * 100) : 0;

                            return (
                                <Card key={account.id} className={`p-6 transition-all ${isOpen ? "border-primary bg-primary/5" : ""}`}>
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <button type="button" onClick={() => setSelectedAccountId(account.id)} className="flex items-center gap-4 text-left" aria-pressed={isOpen}>
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                                                {account.profilePictureUrl ? (
                                                    <img
                                                        src={account.profilePictureUrl}
                                                        alt={t("instagram.profilePhotoAlt", { username: account.username })}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE_FALLBACK;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Instagram className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="truncate text-xl font-bold">@{account.username}</h2>
                                                    {account.accountType && <Badge variant="secondary">{account.accountType}</Badge>}
                                                    {isOpen && accounts.length > 1 && <Badge>{t("instagram.showing")}</Badge>}
                                                </div>
                                                {account.name && <p className="truncate text-muted-foreground">{account.name}</p>}
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {tn("instagram.posts", account.postsCount)} · {tn("instagram.imagesImported", account.imagesCount)}
                                                    {account.mediaCount !== null && ` · ${t("instagram.onProfile", { count: account.mediaCount })}`}
                                                </p>
                                                {account.lastSyncAt && <p className="text-xs text-muted-foreground">{t("instagram.lastSync", { date: new Date(account.lastSyncAt).toLocaleString(locale) })}</p>}
                                            </div>
                                        </button>

                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            {needsReauth ? (
                                                /* Retentar não resolve token revogado — a única saída é reautorizar */
                                                <Button onClick={handleConnect} disabled={connecting}>
                                                    {connecting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <KeyRound className="h-4 w-4" />
                                                            {t("instagram.reconnect")}
                                                        </div>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button onClick={() => handleSync(account)} disabled={isSyncing}>
                                                    {isSyncing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            {t(account.syncStatus === "discovering" ? "instagram.scanning" : "instagram.downloading")}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <RefreshCw className="h-4 w-4" />
                                                            {t(account.syncTruncated ? "instagram.continueImport" : "instagram.fetchPosts")}
                                                        </div>
                                                    )}
                                                </Button>
                                            )}

                                            {/* Downloads que ficaram para trás são retomados sem repetir a varredura da API */}
                                            {!isSyncing && !needsReauth && pending > 0 && (
                                                <Button variant="secondary" onClick={() => handleRetryPending(account)}>
                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                    {tn("instagram.resumeDownloads", pending)}
                                                </Button>
                                            )}

                                            {/* Nova aba: a tela de ocorrências é consultada em paralelo ao trabalho
                                                aqui (disparar buscas, acompanhar importação) — navegar para fora
                                                obrigaria a refazer a seleção de cliente e perfil na volta. */}
                                            {account.protection.occurrences > 0 && (
                                                <Button variant="outline" asChild>
                                                    <a href={`/instagram/${account.id}/occurrences`} target="_blank" rel="noreferrer noopener">
                                                        <Search className="mr-2 h-4 w-4" />
                                                        {tn("instagram.occurrences", account.protection.occurrences)}
                                                    </a>
                                                </Button>
                                            )}

                                            {isOwner && (
                                                <Button variant="outline" onClick={() => setAccountToDisconnect(account)} disabled={isSyncing}>
                                                    <Link2Off className="mr-2 h-4 w-4" />
                                                    {t("instagram.disconnect")}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progresso do download — a etapa longa da importação */}
                                    {(isSyncing || pending > 0) && totalImages > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    {isSyncing && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                                                    {account.syncStatus === "discovering" ? t("instagram.progressScanning") : t("instagram.progressDownloading", { stored, total: totalImages })}
                                                </span>
                                                <span className="tabular-nums">{percent}%</span>
                                            </div>
                                            <Progress value={percent} />
                                        </div>
                                    )}

                                    {isSyncing && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                            {t("instagram.keepBrowsing")}
                                        </div>
                                    )}

                                    {/* Token revogado/expirado: nenhuma retentativa resolve */}
                                    {needsReauth && (
                                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
                                            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                                            <span>
                                                {t("instagram.reauthNotice")}
                                                {account.syncError ? <span className="block text-muted-foreground">{account.syncError}</span> : null}
                                            </span>
                                        </div>
                                    )}

                                    {/* Varredura interrompida no teto de páginas: a importação está incompleta */}
                                    {!isSyncing && account.syncTruncated && (
                                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
                                            <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                                            <span>{t("instagram.truncatedNotice")}</span>
                                        </div>
                                    )}

                                    {!isSyncing && account.syncStatus === "failed" && (
                                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{account.syncError ? t("instagram.lastSyncFailedWithError", { error: account.syncError }) : t("instagram.lastSyncFailed")}</span>
                                        </div>
                                    )}

                                    {/* Situação da proteção — as imagens são rebuscadas uma vez por mês, então
                                        o que interessa é quanto do acervo já passou pela primeira verificação. */}
                                    {stored > 0 && (
                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                                                {account.protection.checked === 0 ? (
                                                    <>{t("instagram.protectionNone")}</>
                                                ) : (
                                                    <>
                                                        <span className="tabular-nums">{t("instagram.protectionCounted", { checked: account.protection.checked, total: account.protection.total })}</span> {tn("instagram.protectionChecked", account.protection.total)}
                                                    </>
                                                )}
                                            </span>

                                            {account.protection.occurrences > 0 && (
                                                <a href={`/instagram/${account.id}/occurrences`} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {tn("instagram.copiesFound", account.protection.occurrences)}
                                                </a>
                                            )}

                                            {account.protection.failed > 0 && (
                                                <span className="text-xs">
                                                    {tn("instagram.protectionFailed", account.protection.failed)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {!isSyncing && !needsReauth && account.syncStatus === "completed" && !account.syncTruncated && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                            {t("instagram.syncDone")}
                                            {failed > 0 && tn("instagram.syncDoneFailed", failed)}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* ===== Etapa 2 — publicações do perfil aberto ===== */}
                    {countPosts === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">{t("instagram.noPostsTitle")}</h3>
                                <p className="max-w-md text-center text-muted-foreground">{t("instagram.noPostsDescription")}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {accounts.length > 1 && selectedAccount && (
                                <p className="mb-3 text-sm text-muted-foreground">
                                    {t("instagram.postsOf")} <span className="font-medium text-foreground">@{selectedAccount.username}</span>
                                </p>
                            )}

                            <div className="grid animate-in grid-cols-2 gap-4 duration-500 fade-in sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {posts.map((post) => {
                                    const cover = post.images[0];

                                    return (
                                        <button key={post.id} type="button" onClick={() => setOpenedPost(post)} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted text-left transition-all hover:shadow-md" title={post.caption ?? t("instagram.viewPost")}>
                                            {cover ? (
                                                <img
                                                    src={cover.url}
                                                    alt={post.caption ?? t("instagram.postImageAlt")}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE_FALLBACK;
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                </div>
                                            )}

                                            {/* Marcador de carrossel com a quantidade de imagens */}
                                            {post.images.length > 1 && (
                                                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-[11px] font-semibold text-background shadow-sm">
                                                    <Layers className="h-3 w-3" />
                                                    {post.images.length}
                                                </span>
                                            )}

                                            {post.postedAt && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                                                    <p className="truncate text-[10px] text-white/90">{new Date(post.postedAt).toLocaleDateString(locale)}</p>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {countPosts > takePosts && <Paginations handleChangePagination={handleChangePagination} count={countPosts} take={takePosts} />}
                        </>
                    )}
                </>
            )}

            {/* Visualizador da publicação — mostra todas as imagens, inclusive as do carrossel */}
            <Dialog
                open={!!openedPost}
                onOpenChange={(open) => {
                    if (!open) setOpenedPost(null);
                }}
            >
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Images className="h-5 w-5" />
                            {openedPost && openedPost.images.length > 1 ? t("instagram.carousel", { count: openedPost.images.length }) : t("instagram.postDialogTitle")}
                        </DialogTitle>
                        <DialogDescription>{openedPost?.postedAt ? t("instagram.publishedAt", { date: new Date(openedPost.postedAt).toLocaleString(locale) }) : t("instagram.importedImages")}</DialogDescription>
                    </DialogHeader>

                    {openedPost && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {openedPost.images.map((image) => (
                                    <a key={image.id} href={image.url} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-lg border border-border bg-muted">
                                        <img
                                            src={image.url}
                                            alt={openedPost.caption ?? t("instagram.postImageAlt")}
                                            loading="lazy"
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE_FALLBACK;
                                            }}
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/30 group-hover:opacity-100">
                                            <span className="inline-flex h-9 items-center justify-center rounded-md bg-card/90 px-3 text-sm font-medium text-foreground">
                                                <ExternalLink className="h-4 w-4" />
                                            </span>
                                        </span>
                                    </a>
                                ))}
                            </div>

                            {openedPost.caption && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{openedPost.caption}</p>}

                            <div className="flex flex-col gap-2 sm:flex-row">
                                {openedPost.permalink && (
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <a href={openedPost.permalink} target="_blank" rel="noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            {t("instagram.viewOnInstagram")}
                                        </a>
                                    </Button>
                                )}

                                {/* Aberto aos dois papéis: o acervo é do cliente, e apagar uma
                                    publicação sua não é o mesmo que desconectar o perfil inteiro.
                                    A confirmação abaixo é o que impede a exclusão num clique só. */}
                                <Button variant="outline" className="w-full text-destructive hover:text-destructive sm:w-auto" onClick={() => setPostToDelete(openedPost)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t("instagram.deletePost")}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!postToDelete}
                onOpenChange={(open) => {
                    if (!open && !deletingPost) setPostToDelete(null);
                }}
                title={t("instagram.deletePostTitle")}
                description={t("instagram.deletePostDescription")}
                onConfirm={handleDeletePost}
                confirmText={t("instagram.deletePost")}
                cancelText={t("common.cancel")}
                variant="destructive"
            />

            <ConfirmDialog
                open={!!accountToDisconnect}
                onOpenChange={(open) => {
                    if (!open) setAccountToDisconnect(null);
                }}
                title={t("instagram.disconnectTitle")}
                description={t("instagram.disconnectDescription", { username: accountToDisconnect?.username ?? "" })}
                onConfirm={handleDisconnect}
                confirmText={t("instagram.disconnect")}
                cancelText={t("common.cancel")}
                variant="destructive"
            />
        </div>
    );
}
