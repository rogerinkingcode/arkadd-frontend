"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe2, ImageIcon, ImagePlus, Loader2, ExternalLink, AlertCircle, ShieldCheck, Search, Trash2, Users, Instagram, Shield, Save, Clock } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { ClientsSelect } from "@/components/ClientsSelect";
import { ImageDropzone } from "@/components/ImageDropzone";
import { InstagramImagePicker } from "@/components/InstagramImagePicker";
import Paginations from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IWebImage, IWebImageBrand } from "@/lib/types";

type WebImagesPageProps = {
    pageSkeleton: React.ReactNode;
};

/**
 * Intervalo de consulta enquanto o ativo aberto tem imagem aguardando a primeira busca. A busca
 * roda num worker e leva de segundos a minutos; sem isso a grade só mudaria com um F5.
 */
const PROTECTION_POLL_INTERVAL = 5000;

/**
 * Tamanho de cada envio das imagens do Instagram. Cada uma é **copiada** para o bucket (download
 * mais upload) dentro da requisição, e o backend recusa acima de 60 — mesmo teto do image-scraper.
 */
const BATCH_SIZE = 60;

/** Placeholder exibido quando a imagem não carrega (objeto removido do bucket, por exemplo). */
const BROKEN_IMAGE_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

const plural = (count: number, one: string, other: string) => `${count} ${count === 1 ? one : other}`;

export default function WebImagesPage({ pageSkeleton }: WebImagesPageProps) {
    // Cliente em foco
    const [clientId, setClientId] = useState("");
    const [clientName, setClientName] = useState("");

    // Ativos do cliente e o que está aberto na grade
    const [brands, setBrands] = useState<IWebImageBrand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [loadingBrands, setLoadingBrands] = useState(false);

    const [images, setImages] = useState<IWebImage[]>([]);
    const [countImages, setCountImages] = useState(0);
    const [takeImages] = useState(50);
    const [pageImages, setPageImages] = useState(1);

    const [initialLoaded, setInitialLoaded] = useState(false);

    // Imagem aberta no visualizador e a que aguarda confirmação de exclusão
    const [openedImage, setOpenedImage] = useState<IWebImage | null>(null);
    const [imageToDelete, setImageToDelete] = useState<IWebImage | null>(null);
    const [deletingImage, setDeletingImage] = useState(false);

    // Inserção de imagens
    const [addBrand, setAddBrand] = useState<IWebImageBrand | null>(null);
    const [addFile, setAddFile] = useState<File | null>(null);
    const [addInstagramUrls, setAddInstagramUrls] = useState<string[]>([]);
    const [adding, setAdding] = useState(false);

    // Ativo cuja busca manual está sendo disparada
    const [protectingBrandId, setProtectingBrandId] = useState<number | null>(null);

    /**
     * Inserir, apagar e buscar são do dono — cada imagem é uma consulta paga no Vision. Começa
     * `null` (ainda não sabemos) e os botões só entram quando a resposta chega: mostrá-los antes
     * faria eles piscarem na tela do cliente e sumirem em seguida.
     */
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    /**
     * Liga a consulta periódica. Só depois de uma ação nesta tela (inserir ou buscar): imagem
     * pendente de um cliente sem o serviço contratado nunca vai sair de `pending`, e consultar
     * por ela a cada 5s para sempre não ajudaria ninguém.
     */
    const [watching, setWatching] = useState(false);

    const { makeRequest } = useFetch();

    // `makeRequest` muda a cada render (novo closure); a ref evita recriar os efeitos por isso.
    const requestRef = useRef(makeRequest);
    requestRef.current = makeRequest;

    /** Ativo a abrir quando os ativos do cliente chegarem (retorno da tela de ocorrências). */
    const preferredBrandRef = useRef<number | null>(null);

    /**
     * Link para a tela de ocorrências. Leva o cliente junto para o botão de voltar de lá
     * reabrir esta tela já com ele selecionado.
     */
    const occurrencesHref = (brandId: number, imageId?: number | string) => {
        const query = new URLSearchParams({ clientId, clientName });
        if (imageId) query.set("imageId", String(imageId));
        return `/web-images/${brandId}/occurrences?${query.toString()}`;
    };

    /** Lê os ativos do cliente com a situação da proteção de cada um. */
    const loadBrands = async (targetClientId: string): Promise<IWebImageBrand[]> => {
        const response = await requestRef.current("get", `/web-images/brands?clientId=${encodeURIComponent(targetClientId)}`);

        if (response?.status === 200) {
            const loaded: IWebImageBrand[] = response.brands ?? [];
            setBrands(loaded);
            return loaded;
        }

        toast.error("Não foi possível carregar os ativos", { description: response?.message ?? "Tente novamente." });
        setBrands([]);
        return [];
    };

    /** Lê uma página de imagens do ativo aberto. */
    const loadImages = async (brandId: number | null, page: number = pageImages) => {
        if (!brandId) {
            setImages([]);
            setCountImages(0);
            return;
        }

        const skip = (page - 1) * takeImages;
        const response = await requestRef.current("get", `/web-images?brandId=${brandId}&skip=${skip}&take=${takeImages}`);

        if (response?.status === 200) {
            setImages(response.images ?? []);
            setCountImages(response.count ?? 0);
        } else {
            setImages([]);
            setCountImages(0);
        }
    };

    // Papel da sessão: decide quais botões entram e se o cliente já vem escolhido.
    useEffect(() => {
        (async () => {
            const response = await requestRef.current("get", "/me");

            // Qualquer coisa fora de `owner` — inclusive um corpo de erro — é acesso de cliente.
            const owner = response?.user?.role === "owner";

            setIsOwner(owner);

            // O retorno da tela de ocorrências chega com o cliente (e o ativo) na URL — sem isso
            // o botão de voltar caía no seletor vazio. Lidos uma vez e tirados da barra de
            // endereço, para um F5 depois de trocar de cliente não ressuscitar o anterior.
            const query = new URLSearchParams(window.location.search);
            const queryClientId = query.get("clientId");

            if (queryClientId) {
                preferredBrandRef.current = Number(query.get("brandId")) || null;
                window.history.replaceState(null, "", window.location.pathname);
            }

            // O acesso de cliente alcança um cliente só, o próprio: pedir que ele selecione seria
            // teatro, e a tela ficaria parada em "Selecione um cliente".
            if (!owner && response?.user?.clientId) {
                setClientId(String(response.user.clientId));
                setClientName(response.user.companyName ?? "");
            } else if (owner && queryClientId) {
                setClientId(queryClientId);
                setClientName(query.get("clientName") ?? "");
            }

            setInitialLoaded(true);
        })();
    }, []);

    // Troca de cliente: recarrega os ativos e abre o primeiro
    useEffect(() => {
        if (!initialLoaded) return;

        async function load() {
            setSelectedBrandId(null);
            setImages([]);
            setCountImages(0);
            setPageImages(1);
            setWatching(false);

            if (!clientId) {
                setBrands([]);
                return;
            }

            setLoadingBrands(true);
            const loaded = await loadBrands(clientId);
            setLoadingBrands(false);

            // Volta para o ativo de onde se saiu, se veio da tela de ocorrências; senão abre o
            // primeiro que já tem imagem e, não havendo nenhum, o primeiro da lista
            const preferred = loaded.find((brand) => brand.id === preferredBrandRef.current);
            preferredBrandRef.current = null;

            const first = preferred ?? loaded.find((brand) => brand.protection.total > 0) ?? loaded[0];

            if (first) setSelectedBrandId(first.id);
        }

        load();
    }, [clientId, initialLoaded]);

    // Troca de ativo ou de página da grade
    useEffect(() => {
        if (!initialLoaded) return;
        loadImages(selectedBrandId, pageImages);
    }, [selectedBrandId, pageImages]);

    const selectedBrand = brands.find((brand) => brand.id === selectedBrandId) ?? null;
    const selectedPending = selectedBrand?.protection.pending ?? 0;

    /** Enquanto o ativo aberto tiver imagem aguardando busca, relê os contadores e a grade. */
    useEffect(() => {
        if (!watching || !clientId || !selectedBrandId) return;

        if (selectedPending === 0) {
            setWatching(false);
            return;
        }

        const interval = setInterval(async () => {
            await loadBrands(clientId);
            await loadImages(selectedBrandId);
        }, PROTECTION_POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [watching, clientId, selectedBrandId, selectedPending]);

    const handleSelectBrand = (brandId: number) => {
        if (brandId === selectedBrandId) return;

        setPageImages(1);
        setSelectedBrandId(brandId);
    };

    const openAddDialog = (brand: IWebImageBrand) => {
        setAddFile(null);
        setAddInstagramUrls([]);
        setAddBrand(brand);
    };

    /**
     * Insere as imagens escolhidas. As do Instagram vão em lotes por URL (o backend copia cada
     * arquivo para a pasta desta tela); o arquivo do computador, quando houver, vai em seguida
     * por upload.
     */
    const handleAddImages = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!addBrand || !clientId) return;

        if (!addFile && addInstagramUrls.length === 0) {
            toast.info("Imagem obrigatória", { description: "Envie um arquivo ou escolha imagens do Instagram." });
            return;
        }

        setAdding(true);

        let added = 0;

        if (addInstagramUrls.length > 0) {
            const total = { added: 0, duplicates: 0, invalid: 0 };

            // Em série: são transferências de arquivo, e lotes em paralelo só disputariam a banda.
            for (let i = 0; i < addInstagramUrls.length; i += BATCH_SIZE) {
                const slice = addInstagramUrls.slice(i, i + BATCH_SIZE);
                const batch = await makeRequest("post", "/web-images/batch", { clientId, brandId: addBrand.id, urls: slice });

                if (batch?.status !== 201) {
                    setAdding(false);
                    // O que já entrou continua valendo — dizer isso evita que tudo seja reenviado.
                    const partial = total.added > 0 ? ` ${total.added} imagem(ns) já foram inseridas antes da falha.` : "";
                    toast.error("Não foi possível inserir as imagens", { description: (batch?.message ?? "Tente novamente.") + partial });
                    if (total.added > 0) await refreshAfterChange(addBrand.id);
                    return;
                }

                total.added += batch.added ?? 0;
                total.duplicates += batch.duplicates ?? 0;
                total.invalid += batch.invalid ?? 0;
            }

            const parts = [`${total.added} adicionada(s)`];

            if (total.duplicates > 0) parts.push(`${total.duplicates} já existia(m)`);
            if (total.invalid > 0) parts.push(`${total.invalid} com problema`);

            toast.success("Imagens do Instagram inseridas", { description: parts.join(", ") + "." });

            added += total.added;
        }

        if (addFile) {
            const formData = new FormData();
            formData.append("clientId", clientId);
            formData.append("brandId", String(addBrand.id));
            formData.append("image", addFile);

            const response = await makeRequest("post", "/web-images", formData);

            if (response?.status === 201) {
                toast.success("Imagem adicionada", { description: "A busca por cópias começa em instantes." });
                added++;
            } else if (response?.status === 403) {
                toast.warning("Serviço não habilitado", { description: response?.message ?? "O serviço de Imagens na web não está contratado para este cliente." });
            } else {
                toast.error("Não foi possível adicionar a imagem", { description: response?.message ?? "Tente novamente." });
            }
        }

        setAdding(false);

        if (added > 0) {
            setAddBrand(null);
            await refreshAfterChange(addBrand.id);
        }
    };

    /** Depois de inserir ou buscar: abre o ativo afetado, relê tudo e liga a consulta periódica. */
    const refreshAfterChange = async (brandId: number) => {
        await loadBrands(clientId);

        if (brandId === selectedBrandId) {
            setPageImages(1);
            await loadImages(brandId, 1);
        } else {
            setPageImages(1);
            setSelectedBrandId(brandId);
        }

        setWatching(true);
    };

    /** Dispara a busca das imagens vencidas do ativo — as já buscadas este mês ficam de fora. */
    const handleProtect = async (brand: IWebImageBrand) => {
        setProtectingBrandId(brand.id);

        const response = await makeRequest("post", `/web-images/brands/${brand.id}/protect`);

        setProtectingBrandId(null);

        if (response?.status === 202) {
            if (response.enqueued === 0) {
                toast.info("Nada a buscar agora", { description: "Todas as imagens deste ativo já foram verificadas nos últimos 30 dias." });
                return;
            }

            toast.success("Busca iniciada", {
                description: `${plural(response.enqueued, "imagem enviada", "imagens enviadas")} para busca.${response.remaining > 0 ? ` ${response.remaining} entra(m) na próxima execução.` : ""}`,
            });

            await refreshAfterChange(brand.id);
            return;
        }

        toast.error("Não foi possível iniciar a busca", { description: response?.message ?? "Tente novamente." });
    };

    const handleDeleteImage = async () => {
        if (!imageToDelete) return;

        setDeletingImage(true);

        const response = await makeRequest("delete", `/web-images/${imageToDelete.id}`);

        setDeletingImage(false);

        if (response?.status === 200) {
            toast.success("Imagem excluída", { description: "A imagem e as ocorrências dela foram removidas." });

            setImageToDelete(null);
            setOpenedImage(null);

            // Recarrega a página atual em vez de só tirar o item: os contadores do card mudam e a
            // vaga aberta na página é preenchida pelo item seguinte.
            if (clientId) await loadBrands(clientId);
            await loadImages(selectedBrandId, pageImages);
            return;
        }

        toast.error("Não foi possível excluir a imagem", { description: response?.message ?? "Tente novamente." });
        setImageToDelete(null);
    };

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageImages(value);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Cabeçalho */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Globe2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Imagens na web</h1>
                    <p className="mt-1 text-muted-foreground">Envie as imagens do cliente e encontre cópias delas em sites da web</p>
                </div>
            </div>

            {/* Seleção do cliente — o acesso de cliente já entra com o próprio escolhido */}
            {isOwner && (
                <Card className="mb-6 p-4">
                    <div className="flex-1">
                        <Label className="mb-2 block">Cliente</Label>
                        <ClientsSelect companyName={clientName} value={clientId} onChange={(value, client) => {
                            setClientId(String(value));
                            setClientName(client?.companyName ?? "");
                        }} makeRequest={makeRequest} />
                    </div>
                </Card>
            )}

            {!clientId ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">Selecione um cliente</h3>
                        <p className="text-center text-muted-foreground">Escolha um cliente para ver os ativos e as imagens monitoradas.</p>
                    </CardContent>
                </Card>
            ) : loadingBrands ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="mb-4 h-10 w-10 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">Carregando ativos...</p>
                    </CardContent>
                </Card>
            ) : brands.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Shield className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">Nenhum ativo cadastrado</h3>
                        <p className="max-w-md text-center text-muted-foreground">As imagens ficam organizadas por ativo. Cadastre um ativo para este cliente antes de enviar imagens.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* ===== Ativos do cliente ===== */}
                    <div className="mb-6 space-y-4">
                        {brands.map((brand) => {
                            const isOpen = brand.id === selectedBrandId;
                            const { total, checked, pending, failed, occurrences } = brand.protection;
                            const isProtecting = protectingBrandId === brand.id;

                            return (
                                <Card key={brand.id} className={`p-6 transition-all ${isOpen ? "border-primary bg-primary/5" : ""}`}>
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <button type="button" onClick={() => handleSelectBrand(brand.id)} className="flex items-center gap-4 text-left" aria-pressed={isOpen}>
                                            {/* `object-contain` com folga interna: logos raramente são
                                                quadrados, e `object-cover` cortava as laterais. A
                                                folga mantém os cantos da imagem dentro do círculo. */}
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                                                {brand.logo_url ? (
                                                    <img
                                                        src={brand.logo_url}
                                                        alt={`Logo de ${brand.name}`}
                                                        className="h-full w-full object-contain p-3"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE_FALLBACK;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Shield className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="truncate text-xl font-bold">{brand.name}</h2>
                                                    <Badge variant="secondary">{brand.assetType === "product" ? "Produto" : "Marca"}</Badge>
                                                    {isOpen && brands.length > 1 && <Badge>Exibindo</Badge>}
                                                </div>
                                                {brand.domain && <p className="truncate text-muted-foreground">{brand.domain}</p>}
                                                <p className="mt-1 text-xs text-muted-foreground">{plural(total, "imagem monitorada", "imagens monitoradas")}</p>
                                            </div>
                                        </button>

                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            {isOwner && (
                                                <Button onClick={() => openAddDialog(brand)}>
                                                    <ImagePlus className="mr-2 h-4 w-4" />
                                                    Adicionar imagens
                                                </Button>
                                            )}

                                            {isOwner && total > 0 && (
                                                <Button variant="secondary" onClick={() => handleProtect(brand)} disabled={isProtecting}>
                                                    {isProtecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                                    Buscar cópias
                                                </Button>
                                            )}

                                            {/* Nova aba: a tela de ocorrências é consultada em paralelo ao trabalho
                                                aqui — navegar para fora obrigaria a refazer a seleção na volta. */}
                                            {occurrences > 0 && (
                                                <Button variant="outline" asChild>
                                                    <a href={occurrencesHref(brand.id)} target="_blank" rel="noreferrer noopener">
                                                        <Search className="mr-2 h-4 w-4" />
                                                        {plural(occurrences, "ocorrência", "ocorrências")}
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Situação da proteção — as imagens são rebuscadas uma vez por mês, então
                                        o que interessa é quanto do acervo já passou pela primeira verificação. */}
                                    {total > 0 && (
                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                {pending > 0 && isOpen && watching ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" /> : <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />}
                                                {checked === 0 ? (
                                                    <>Nenhuma imagem verificada ainda</>
                                                ) : (
                                                    <>
                                                        <span className="tabular-nums">
                                                            {checked} de {total}
                                                        </span>{" "}
                                                        {total === 1 ? "imagem verificada" : "imagens verificadas"}
                                                    </>
                                                )}
                                                {pending > 0 && <span className="text-xs">· {pending} aguardando busca</span>}
                                            </span>

                                            {occurrences > 0 && (
                                                <a href={occurrencesHref(brand.id)} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {plural(occurrences, "cópia encontrada", "cópias encontradas")}
                                                </a>
                                            )}

                                            {failed > 0 && <span className="text-xs">{plural(failed, "busca falhou", "buscas falharam")} — {failed === 1 ? "será refeita" : "serão refeitas"} na próxima varredura</span>}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* ===== Imagens do ativo aberto ===== */}
                    {countImages === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">Nenhuma imagem neste ativo</h3>
                                <p className="mb-6 max-w-md text-center text-muted-foreground">{isOwner ? "Adicione imagens do computador ou do Instagram do cliente. A primeira busca por cópias começa logo depois." : "Assim que imagens forem adicionadas a este ativo, elas aparecem aqui."}</p>
                                {isOwner && selectedBrand && (
                                    <Button size="lg" onClick={() => openAddDialog(selectedBrand)}>
                                        <ImagePlus className="mr-2 h-4 w-4" />
                                        Adicionar imagens
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {brands.length > 1 && selectedBrand && (
                                <p className="mb-3 text-sm text-muted-foreground">
                                    Imagens de <span className="font-medium text-foreground">{selectedBrand.name}</span>
                                </p>
                            )}

                            <div className="grid animate-in grid-cols-2 gap-4 duration-500 fade-in sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {images.map((image) => (
                                    <button key={image.id} type="button" onClick={() => setOpenedImage(image)} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted text-left transition-all hover:shadow-md" title="Ver imagem">
                                        <img
                                            src={image.url}
                                            alt="Imagem monitorada"
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE_FALLBACK;
                                            }}
                                        />

                                        {/* Ocorrências da imagem: canto oposto ao da origem, para os dois
                                            marcadores não disputarem o mesmo espaço. */}
                                        {image.occurrencesCount > 0 && (
                                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[11px] font-semibold text-destructive-foreground shadow-sm">
                                                <Search className="h-3 w-3" />
                                                {image.occurrencesCount}
                                            </span>
                                        )}

                                        {/* Veio do acervo do Instagram (a cópia é independente de lá) */}
                                        {image.sourceUrl && (
                                            <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-foreground/70 p-1 text-background shadow-sm" title="Copiada do Instagram">
                                                <Instagram className="h-3 w-3" />
                                            </span>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                                            <p className="truncate text-[10px] text-white/90">
                                                {image.protectionStatus === "checked" && image.lastCheckedAt
                                                    ? `Verificada em ${new Date(image.lastCheckedAt).toLocaleDateString("pt-BR")}`
                                                    : image.protectionStatus === "failed"
                                                      ? "Falha na busca"
                                                      : "Aguardando busca"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {countImages > takeImages && <Paginations handleChangePagination={handleChangePagination} count={countImages} take={takeImages} />}
                        </>
                    )}
                </>
            )}

            {/* Visualizador da imagem */}
            <Dialog
                open={!!openedImage}
                onOpenChange={(open) => {
                    if (!open) setOpenedImage(null);
                }}
            >
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Imagem monitorada
                        </DialogTitle>
                        <DialogDescription>{openedImage ? `Adicionada em ${new Date(openedImage.createdAt).toLocaleString("pt-BR")}${openedImage.sourceUrl ? " · copiada do Instagram" : ""}` : ""}</DialogDescription>
                    </DialogHeader>

                    {openedImage && (
                        <div className="space-y-4">
                            <a href={openedImage.url} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-lg border border-border bg-muted">
                                <img
                                    src={openedImage.url}
                                    alt="Imagem monitorada"
                                    className="max-h-[60vh] w-full object-contain"
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

                            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                {openedImage.protectionStatus === "failed" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> : openedImage.protectionStatus === "checked" ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <Clock className="mt-0.5 h-4 w-4 shrink-0" />}
                                <span>
                                    {openedImage.protectionStatus === "checked" && openedImage.lastCheckedAt
                                        ? `Última busca em ${new Date(openedImage.lastCheckedAt).toLocaleDateString("pt-BR")} — a próxima acontece automaticamente em até 30 dias.`
                                        : openedImage.protectionStatus === "failed"
                                          ? `A última busca falhou e será refeita na próxima varredura.${openedImage.checkError ? ` ${openedImage.checkError}` : ""}`
                                          : "A imagem está na fila para a primeira busca por cópias."}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                {openedImage.occurrencesCount > 0 && selectedBrandId && (
                                    <Button variant="default" asChild className="w-full sm:w-auto">
                                        <a href={occurrencesHref(selectedBrandId, openedImage.id)} target="_blank" rel="noreferrer noopener">
                                            <Search className="mr-2 h-4 w-4" />
                                            {plural(openedImage.occurrencesCount, "ocorrência desta imagem", "ocorrências desta imagem")}
                                        </a>
                                    </Button>
                                )}

                                {isOwner && (
                                    <Button variant="outline" className="w-full text-destructive hover:text-destructive sm:w-auto" onClick={() => setImageToDelete(openedImage)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir imagem
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Inserção de imagens — mesmo formato da inserção avulsa do image-scraper */}
            <Dialog
                open={!!addBrand}
                onOpenChange={(open) => {
                    if (!open && !adding) setAddBrand(null);
                }}
            >
                <DialogContent
                    className="max-h-[90vh] w-[calc(100vw-1rem)] animate-in overflow-y-auto duration-300 slide-in-from-top-40 sm:w-auto sm:max-w-xl"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Adicionar imagens</DialogTitle>
                        <DialogDescription>
                            As imagens entram em <span className="font-medium text-foreground">{addBrand?.name}</span> e a busca por cópias começa logo depois.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddImages} className="space-y-4">
                        <InstagramImagePicker clientId={clientId} selectedUrls={addInstagramUrls} onChange={setAddInstagramUrls} makeRequest={makeRequest} />

                        {addInstagramUrls.length > 0 && <p className="text-xs text-muted-foreground">As imagens escolhidas são copiadas para esta tela: excluir uma delas aqui ou no Instagram não afeta a outra.</p>}

                        <div className="space-y-2">
                            <Label>Imagem do computador{addInstagramUrls.length > 0 ? "" : " *"}</Label>
                            <ImageDropzone file={addFile} onFileChange={setAddFile} allowSvg={false} />
                        </div>

                        <Button type="submit" className="w-full" disabled={adding}>
                            {adding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    Adicionar imagens
                                    <Save className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!imageToDelete}
                onOpenChange={(open) => {
                    if (!open && !deletingImage) setImageToDelete(null);
                }}
                title="Excluir imagem"
                description="A imagem e todas as ocorrências encontradas para ela serão removidas. Se ela veio do Instagram, a publicação de lá continua intacta."
                onConfirm={handleDeleteImage}
                confirmText="Excluir imagem"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    );
}
