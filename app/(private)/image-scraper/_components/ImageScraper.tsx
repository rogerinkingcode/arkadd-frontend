"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Plus, Trash2, Globe, ExternalLink, Save, RefreshCw, Loader2, Search, Shield, ImagePlus, Clock, CircleDashed, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { ClientsSelect } from "@/components/ClientsSelect";
import { BrandsSelect } from "@/components/BrandsSelect";
import Paginations from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ISiteImage, ISiteScrape } from "@/lib/types";
import Link from "next/link";

type ImageScraperPageProps = {
    pageSkeleton: React.ReactNode;
};

// Limita o texto exibido para não quebrar a linha do input
const truncateLabel = (text: string, max = 25) => (text.length > max ? text.slice(0, max) + "..." : text);

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Aguardando", variant: "secondary" },
    extracting_pages: { label: "Extraindo páginas", variant: "default" },
    extracting_images: { label: "Extraindo imagens", variant: "default" },
    completed: { label: "Concluído", variant: "outline" },
    failed: { label: "Falhou", variant: "destructive" },
};

/** Mapeia o status de pesquisa (`searched`) de uma imagem para o badge visual exibido na grade. */
const SEARCHED_LABEL: Record<"pending" | "processing" | "completed", { label: string; classes: string; Icon: React.ComponentType<{ className?: string }> }> = {
    pending: {
        label: "Aguardando",
        classes: "bg-slate-500/90 text-white",
        Icon: CircleDashed,
    },
    processing: {
        label: "Em processamento",
        classes: "bg-amber-500/90 text-white",
        Icon: Clock,
    },
    completed: {
        label: "Concluído",
        classes: "bg-emerald-600/90 text-white",
        Icon: CheckCircle2,
    },
};

export default function ImageScraperPage({ pageSkeleton }: ImageScraperPageProps) {
    const router = useRouter();

    // Diálogo de criação
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Seletor de cliente/marca para a criação
    const [createClientId, setCreateClientId] = useState("");
    const [createClientName, setCreateClientName] = useState("");
    const [createBrandId, setCreateBrandId] = useState("");
    const [createBrandName, setCreateBrandName] = useState("");

    // Seletor de cliente/scraping para a visualização
    const [viewClientId, setViewClientId] = useState("");
    const [viewClientName, setViewClientName] = useState("");
    const [viewSiteScrapeId, setViewSiteScrapeId] = useState("");

    // Dados carregados
    const [scrapes, setScrapes] = useState<ISiteScrape[]>([]);
    const [images, setImages] = useState<ISiteImage[]>([]);
    const [countImages, setCountImages] = useState<number>(0);

    // Paginação
    const [takeImages] = useState<number>(20);
    const [pageImages, setPageImages] = useState(1);

    // Reload state
    const [refreshTick, setRefreshTick] = useState(0);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Confirmação de exclusão
    const [imageToDelete, setImageToDelete] = useState<ISiteImage | null>(null);

    // Diálogo de inserção manual de imagem (por URL)
    const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);
    const [addImageLoading, setAddImageLoading] = useState(false);
    const [addImageUrl, setAddImageUrl] = useState("");
    const [addImageAlt, setAddImageAlt] = useState("");

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const { makeRequest } = useFetch();

    /** Carrega os scrapings do cliente visualizado */
    useEffect(() => {
        async function loadScrapes() {
            if (!viewClientId) {
                setScrapes([]);
                setInitialLoaded(true);
                return;
            }

            const scrapesResp = await makeRequest("get", `/site-scrape?clientId=${viewClientId}`);

            if (scrapesResp?.status === 200) setScrapes(scrapesResp.scrapes);

            setInitialLoaded(true);
        }

        loadScrapes();
    }, [viewClientId, refreshTick]);

    /** Carrega as imagens do scraping (marca) selecionado */
    useEffect(() => {
        async function loadImages() {
            if (!viewClientId || !viewSiteScrapeId) {
                setImages([]);
                setCountImages(0);
                return;
            }

            const skip = pageImages === 1 ? 0 : (pageImages - 1) * takeImages;

            const imagesResp = await makeRequest("get", `/site-images?clientId=${viewClientId}&siteScrapeId=${viewSiteScrapeId}&skip=${skip}&take=${takeImages}`);

            if (imagesResp?.status === 200) {
                const fetchedImages: ISiteImage[] = imagesResp.images || [];

                // Busca o contador de ocorrências por imagem em um único batch
                let counts: Record<string, number> = {};
                if (fetchedImages.length > 0) {
                    const countResp = await makeRequest("post", "/site-images/occurrences/count", { imageIds: fetchedImages.map((i) => i.id) });
                    if (countResp?.status === 200) counts = countResp.counts || {};
                }

                setImages(fetchedImages.map((img) => ({ ...img, occurrencesCount: counts[img.id] ?? 0 })));
                setCountImages(imagesResp.count);
            }
        }

        loadImages();
    }, [viewClientId, viewSiteScrapeId, pageImages, refreshTick]);

    /** Polling enquanto houver scrape em andamento OU imagem sendo processada pela extensão. */
    useEffect(() => {
        const scrapeInProgress = scrapes.some((s) => s.status === "pending" || s.status === "extracting_pages" || s.status === "extracting_images");
        const imageInProgress = images.some((i) => i.searched === "processing");

        if (!scrapeInProgress && !imageInProgress) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        if (pollingRef.current) return;

        pollingRef.current = setInterval(() => {
            setRefreshTick((t) => t + 1);
        }, 5000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [scrapes, images]);

    /** Inicia um novo scraping */
    const handleCreateScrape = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as { domain: string };

        if (!createClientId) {
            toast.info("Selecione o cliente", { description: "É obrigatório que selecione o cliente." });
            setLoading(false);
            return;
        }

        if (!createBrandId) {
            toast.info("Selecione o ativo", { description: "É obrigatório que selecione o ativo do cliente." });
            setLoading(false);
            return;
        }

        if (!data.domain) {
            toast.info("Domínio obrigatório", { description: "Informe o domínio do site." });
            setLoading(false);
            return;
        }

        const response = await makeRequest("post", "/site-scrape", {
            clientId: createClientId,
            brandId: createBrandId,
            domain: data.domain,
        });

        if (response?.status === 201) {
            toast.success("Scraping iniciado", { description: `Iniciamos a extração de ${data.domain}` });
            setIsDialogOpen(false);

            // Após criar, alinha a visualização com o cliente e o scraping recém-criados
            setViewClientId(createClientId);
            setViewClientName(createClientName);
            setViewSiteScrapeId(response?.payload?.id ?? "");
            setPageImages(1);
            setRefreshTick((t) => t + 1);
        } else if (response?.status === 403) {
            toast.warning("Serviço não habilitado", { description: response?.message ?? "O serviço de Pesquisa Reversa de Imagem não está habilitado para este cliente." });
        } else if (response?.status === 400) {
            toast.error("Dados inválidos", { description: response?.message ?? "Verifique os dados." });
        } else if (response?.status === 404) {
            toast.error("Cliente não encontrado", { description: response?.message ?? "Selecione um cliente válido." });
        } else {
            toast.error("Erro interno", { description: "Tente novamente mais tarde." });
        }

        setLoading(false);
    };

    /** Exclui uma imagem individual */
    const handleDeleteImage = async () => {
        if (!imageToDelete) return;

        const response = await makeRequest("delete", `/site-images/${imageToDelete.id}`);

        if (response?.status === 200) {
            toast.success("Imagem excluída", { description: "A imagem foi removida com sucesso." });
            setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
            setCountImages((c) => Math.max(0, c - 1));
        } else {
            toast.error("Erro ao excluir", { description: response?.message ?? "Tente novamente." });
        }

        setImageToDelete(null);
    };

    /** Abre o diálogo de inserção manual de imagem com os campos limpos */
    const openAddImageDialog = () => {
        setAddImageUrl("");
        setAddImageAlt("");
        setIsAddImageDialogOpen(true);
    };

    /** Insere uma imagem individualmente, informada por URL, no scraping selecionado */
    const handleAddImage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!viewSiteScrapeId) {
            toast.info("Selecione um scraping", { description: "Escolha um scraping para adicionar a imagem." });
            return;
        }

        const url = addImageUrl.trim();

        if (!url) {
            toast.info("URL obrigatória", { description: "Informe a URL da imagem." });
            return;
        }

        setAddImageLoading(true);

        const response = await makeRequest("post", "/site-images", {
            siteScrapeId: viewSiteScrapeId,
            url,
            alt: addImageAlt.trim() || undefined,
        });

        if (response?.status === 201) {
            toast.success("Imagem adicionada", { description: "A imagem foi inserida no scraping." });
            setIsAddImageDialogOpen(false);
            setPageImages(1);
            setRefreshTick((t) => t + 1);
        } else if (response?.status === 409) {
            toast.error("Imagem duplicada", { description: response?.message ?? "Esta imagem já existe neste scraping." });
        } else if (response?.status === 400) {
            toast.error("Dados inválidos", { description: response?.message ?? "Verifique a URL informada." });
        } else if (response?.status === 404) {
            toast.error("Scraping não encontrado", { description: response?.message ?? "Selecione um scraping válido." });
        } else {
            toast.error("Erro interno", { description: "Tente novamente mais tarde." });
        }

        setAddImageLoading(false);
    };

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageImages(value);
    };

    // Apenas o scraping escolhido no seletor é exibido — não há listagem
    const selectedScrape = scrapes.find((s) => s.id === viewSiteScrapeId) ?? null;

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Image Scraper</h1>
                        <p className="text-muted-foreground mt-1">Extraia imagens de sites e organize por cliente</p>
                    </div>

                    <Button
                        size="lg"
                        className="w-full lg:w-auto lg:ml-auto"
                        onClick={() => {
                            setCreateClientId("");
                            setCreateClientName("");
                            setCreateBrandId("");
                            setCreateBrandName("");
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Scraping
                    </Button>
                </div>
            </div>

            {/* Diálogo de criação */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="w-[calc(100vw-1rem)] sm:w-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Novo Scraping de Imagens</DialogTitle>
                        <DialogDescription>Escolha um cliente e informe o domínio do site para extrair todas as imagens</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateScrape} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientId">Cliente *</Label>
                            <ClientsSelect
                                companyName={createClientName}
                                value={createClientId}
                                onChange={(v) => {
                                    setCreateClientId(v);
                                    // Ao trocar de cliente, a marca selecionada deixa de ser válida
                                    setCreateBrandId("");
                                    setCreateBrandName("");
                                }}
                                makeRequest={makeRequest}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brandId">Ativo *</Label>
                            <BrandsSelect
                                clientId={createClientId}
                                brandName={createBrandName}
                                value={createBrandId}
                                onChange={(id, name) => {
                                    setCreateBrandId(id);
                                    setCreateBrandName(name);
                                }}
                                makeRequest={makeRequest}
                            />
                            <p className="text-xs text-muted-foreground">A captura ficará associada a este ativo do cliente.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="domain">Domínio do site *</Label>
                            <Input id="domain" name="domain" placeholder="Ex: exemplo.com.br" maxLength={255} required />
                            <p className="text-xs text-muted-foreground">Informe o domínio completo. O scraping será exaustivo, percorrendo todas as páginas internas.</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Iniciar scraping
                                    <Save className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Diálogo de inserção manual de imagem (por URL) */}
            <Dialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen}>
                <DialogContent
                    className="w-[calc(100vw-1rem)] sm:w-auto sm:max-w-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Adicionar imagem</DialogTitle>
                        <DialogDescription>Insira manualmente uma imagem informando a URL. Ela será adicionada ao scraping selecionado.</DialogDescription>
                    </DialogHeader>

                    {selectedScrape && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                            <Shield className="h-4 w-4 text-primary shrink-0" />
                            <span className="font-medium truncate">{selectedScrape.brand?.name ?? "Sem ativo"}</span>
                            <span className="text-muted-foreground truncate">— {selectedScrape.domain.replace(/^https?:\/\//, "")}</span>
                        </div>
                    )}

                    <form onSubmit={handleAddImage} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">URL da imagem *</Label>
                            <Input id="image-url" name="url" type="url" placeholder="https://exemplo.com/imagem.jpg" value={addImageUrl} onChange={(e) => setAddImageUrl(e.target.value)} maxLength={1500} required />
                            <p className="text-xs text-muted-foreground">Informe o endereço http(s) direto da imagem.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image-alt">Descrição (alt)</Label>
                            <Input id="image-alt" name="alt" placeholder="Descrição opcional da imagem" value={addImageAlt} onChange={(e) => setAddImageAlt(e.target.value)} maxLength={500} />
                            <p className="text-xs text-muted-foreground">Texto alternativo opcional para identificar a imagem.</p>
                        </div>

                        {addImageUrl.trim() && (
                            <div className="space-y-2">
                                <Label>Pré-visualização</Label>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                                    <img
                                        src={addImageUrl.trim()}
                                        alt="Pré-visualização da imagem"
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={addImageLoading}>
                            {addImageLoading ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Adicionar imagem
                                    <Save className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Seletores de cliente e scraping (marca) para visualização */}
            <Card className="p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <Label>Cliente *</Label>
                        <ClientsSelect
                            companyName={viewClientName}
                            value={viewClientId}
                            onChange={(v) => {
                                setViewClientId(v);
                                // Ao trocar de cliente, o scraping selecionado deixa de ser válido
                                setViewSiteScrapeId("");
                                setPageImages(1);
                            }}
                            makeRequest={makeRequest}
                        />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                        <Label>Scraping / Ativo *</Label>
                        <Select
                            value={viewSiteScrapeId}
                            onValueChange={(v) => {
                                setViewSiteScrapeId(v);
                                setPageImages(1);
                            }}
                            disabled={!viewClientId || scrapes.length === 0}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={!viewClientId ? "Selecione um cliente primeiro" : scrapes.length === 0 ? "Nenhum scraping disponível" : "Selecione um scraping"} />
                            </SelectTrigger>
                            <SelectContent>
                                {scrapes.map((scrape) => (
                                    <SelectItem key={scrape.id} value={scrape.id}>
                                        {truncateLabel((scrape.brand?.name ?? "Sem ativo") + " — " + scrape.domain.replace(/^https?:\/\//, ""))}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" onClick={() => setRefreshTick((t) => t + 1)} disabled={!viewClientId}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Atualizar
                    </Button>

                    <Button onClick={openAddImageDialog} disabled={!viewSiteScrapeId} title={!viewSiteScrapeId ? "Selecione um scraping para adicionar uma imagem" : "Adicionar uma imagem por URL"}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Adicionar imagem
                    </Button>
                </div>
            </Card>

            {/* Scraping selecionado (exibe apenas o escolhido, não uma listagem) */}
            {viewClientId &&
                selectedScrape &&
                (() => {
                    const meta = STATUS_LABEL[selectedScrape.status] ?? STATUS_LABEL.pending;
                    const selectedInProgress = selectedScrape.status === "pending" || selectedScrape.status === "extracting_pages" || selectedScrape.status === "extracting_images";
                    return (
                        <Card className="p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold">Scraping selecionado</h2>
                                {selectedInProgress && (
                                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Atualizando automaticamente...
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border border-border rounded-lg px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                        <Globe className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium truncate">{selectedScrape.domain}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Shield className="h-3 w-3 text-primary shrink-0" />
                                            <span className="truncate">{selectedScrape.brand?.name ?? "Sem ativo"}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedScrape.pagesCount} página{selectedScrape.pagesCount === 1 ? "" : "s"} · {selectedScrape.imagesCount} imagem{selectedScrape.imagesCount === 1 ? "" : "s"} · {new Date(selectedScrape.createdAt).toLocaleString("pt-BR")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={meta.variant}>{meta.label}</Badge>
                                    {selectedScrape.status === "failed" && selectedScrape.errorMessage && <span className="text-xs text-destructive truncate max-w-[300px]">{selectedScrape.errorMessage}</span>}
                                </div>
                            </div>
                        </Card>
                    );
                })()}

            {/* Grade de imagens */}
            {!viewClientId ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Selecione um cliente</h3>
                        <p className="text-muted-foreground text-center">Escolha um cliente acima para visualizar as imagens extraídas</p>
                    </CardContent>
                </Card>
            ) : !viewSiteScrapeId ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Selecione um scraping</h3>
                        <p className="text-muted-foreground text-center">{scrapes.length === 0 ? "Este cliente ainda não possui scrapings. Inicie um novo scraping para extrair imagens." : "Escolha um scraping (ativo) acima para visualizar as imagens extraídas"}</p>
                    </CardContent>
                </Card>
            ) : countImages === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
                        <p className="text-muted-foreground text-center mb-6">Inicie um novo scraping para extrair imagens do site do cliente ou adicione uma imagem manualmente por URL</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={() => {
                                    setCreateClientId("");
                                    setCreateClientName("");
                                    setCreateBrandId("");
                                    setCreateBrandName("");
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Scraping
                            </Button>
                            <Button variant="outline" onClick={openAddImageDialog}>
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Adicionar imagem
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in duration-500">
                        {images.map((img) => (
                            <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted transition-all hover:shadow-md">
                                <img
                                    src={img.url}
                                    alt={img.alt ?? ""}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";
                                    }}
                                />

                                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <a href={img.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md bg-card/90 hover:bg-card text-foreground h-9 px-3 text-sm font-medium" aria-label="Abrir imagem">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <Link href={`/image-scraper/${img.id}/occurrences`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3 text-sm font-medium" aria-label="Ver ocorrências" title="Ver Ocorrências">
                                        <Search className="h-4 w-4" />
                                    </Link>
                                    <button type="button" onClick={() => setImageToDelete(img)} className="inline-flex items-center justify-center rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 px-3 text-sm font-medium" aria-label="Excluir imagem">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Badge indicando que a imagem foi inserida manualmente pelo usuário */}
                                {img.manual && (
                                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-warning/90 text-white text-[11px] font-semibold px-2 py-1 shadow-sm" title="Imagem adicionada manualmente">
                                        <ImagePlus className="h-3 w-3" />
                                        Manual
                                    </span>
                                )}

                                {/* Badge com o status atual de pesquisa controlado pela extensão */}
                                {(() => {
                                    const meta = SEARCHED_LABEL[img.searched] ?? SEARCHED_LABEL.pending;
                                    const StatusIcon = meta.Icon;
                                    return (
                                        <span
                                            className={`absolute ${img.manual ? "top-10" : "top-2"} right-2 inline-flex items-center gap-1 rounded-full text-[11px] font-semibold px-2 py-1 shadow-sm ${meta.classes}`}
                                            title={img.searchedAt ? `${meta.label} em ${new Date(img.searchedAt).toLocaleString("pt-BR")}` : meta.label}
                                        >
                                            <StatusIcon className={`h-3 w-3 ${img.searched === "processing" ? "animate-pulse" : ""}`} />
                                            {meta.label}
                                        </span>
                                    );
                                })()}

                                {/* Badge com a contagem de ocorrências já coletadas pela extenção */}
                                {(img.occurrencesCount ?? 0) > 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/image-scraper/${img.id}/occurrences`);
                                        }}
                                        className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-1 shadow-sm"
                                        title={`${img.occurrencesCount} ocorrência${img.occurrencesCount === 1 ? "" : "s"} encontrada${img.occurrencesCount === 1 ? "" : "s"}`}
                                    >
                                        <Search className="h-3 w-3" />
                                        {img.occurrencesCount}
                                    </button>
                                )}

                                {img.siteScrape?.domain && (
                                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent">
                                        {img.siteScrape.brand?.name && <p className="text-[10px] font-semibold text-white truncate">{img.siteScrape.brand.name}</p>}
                                        <p className="text-[10px] text-white/80 truncate">{img.siteScrape.domain.replace(/^https?:\/\//, "")}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {countImages > takeImages && <Paginations handleChangePagination={handleChangePagination} count={countImages} take={takeImages} />}
                </>
            )}

            <ConfirmDialog
                open={!!imageToDelete}
                onOpenChange={(open) => {
                    if (!open) setImageToDelete(null);
                }}
                title="Excluir imagem"
                description="Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteImage}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    );
}
