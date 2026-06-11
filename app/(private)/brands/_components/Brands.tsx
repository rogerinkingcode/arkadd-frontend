"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus, Eye, Pencil, Search, Info, Save, Link, ArrowLeft, Settings2, SaveIcon, RefreshCcw, AlertTriangle, ArrowLeftRight, BarChart } from "lucide-react";
import { toast } from "sonner";
import { IBrand } from "@/lib/types";
import { useFetch } from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { ClientsSelect } from "@/components/ClientsSelect";
import { ImageDropzone } from "@/components/ImageDropzone";
import { VariationBankEditor } from "@/components/TagManager";
import Paginations from "@/components/pagination";
import { VariationDomainBankEditor } from "@/components/TagDomainManager";
import FullscreenPopup from "./FullscreenPopup";
import StackedAreaChart, { type IStackedAreaChartData } from "./StackedAreaChart";
import GroupedBarChart, { type IGroupedBarChartData } from "./GroupedBarChart";
import VerificationChart, { type IVerificationChartData } from "./VerificationChart";
import ScoreChart, { type IScoreChartData } from "./ScoreChart";
import VerificationDonutChart from "./VerificationDonutChart";
import RadarPerformanceChart from "./RadarPerformanceChart";
import TagPerformanceChart, { type ITagPerformanceChartData } from "./TagPerformanceChart";
import InertTagsChart, { type IInertTagsChartData } from "./InertTagsChart";

type BrandsPageProps = {
    pageSkeleton: React.ReactNode;
};

export default function BrandsPage({ pageSkeleton }: BrandsPageProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
    const [updateStateBrands, setUpdateStateBrands] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataBrands, setDataBrands] = useState<IBrand[]>();
    const [countBrands, setCountBrands] = useState<number>();
    const [countResultsBrands, setCountResultsBrands] = useState<number>();
    const [countBrand, setCountBrand] = useState<number>();
    const [countProduct, setCountProduct] = useState<number>();
    const [countThreats, setCountThreats] = useState<number>();
    const [searchBrandsName, setSearchBrandsName] = useState<string>("");
    const [takeBrands] = useState<number>(10);
    const [pageBrands, setPageBrands] = useState(1);
    const searchParams = useSearchParams();
    const clientId = searchParams.get("clientId");
    const clientName = searchParams.get("clientName");
    const [clientID, setClientID] = useState("");
    const [client_name, setClient_name] = useState("");
    const [assetType, setAssetType] = useState("brand");
    const [createLogoFile, setCreateLogoFile] = useState<File | null>(null);
    const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
    const [infoDialogBrand, setInfoDialogBrand] = useState<IBrand | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [openVariationsName, setOpenVariationsName] = useState(false);
    const [openVariationsNameDomain, setOpenVariationsNameDomain] = useState(false);
    const [heightVariationsName, setHeightVariationsName] = useState(0);
    const [heightVariationsNameDomain, setHeightVariationsNameDomain] = useState(0);
    const divRefVariationsName = useRef<HTMLDivElement>(null);
    const divRefVariationsNameDomain = useRef<HTMLDivElement>(null);
    const [variationsName, setVariationsName] = useState<any[]>([]);
    const [variationsNameDomain, setVariationsNameDomain] = useState<any[]>([]);
    const [indexGroupTags, setIndexGroupTags] = useState<number>();
    const [indexGroupTagsDomain, setIndexGroupTagsDomain] = useState<number>();
    const [graphPopupOpen, setGraphPopupOpen] = useState(false);
    const [stackedAreaChartData, setStackedAreaChartData] = useState<IStackedAreaChartData>({ labels: [], series: [] });
    const [groupedBarChartData, setGroupedBarChartData] = useState<IGroupedBarChartData>({ labels: [], channels: [] });
    const [verificationChartData, setVerificationChartData] = useState<IVerificationChartData>({ labels: [], channels: [] });
    const [scoreChartData, setScoreChartData] = useState<IScoreChartData>({ labels: [], data: [] });
    const [tagPerformanceData, setTagPerformanceData] = useState<ITagPerformanceChartData>({ tags: [], activated: [], relevant: [] });
    const [inertTagsData, setInertTagsData] = useState<IInertTagsChartData>({ tags: [], values: [] });
    const { makeRequest } = useFetch();

    /** Busca os ativos de monitoramento (Marcas) */
    useEffect(() => {
        async function getBrands() {
            let client_id;
            clientId ? (client_id = `&clientId=${clientId}`) : (client_id = "");

            clientId && setClientID(clientId);
            clientName && setClient_name(clientName);

            const response = await makeRequest("get", `/brand-list?skip=${pageBrands == 1 ? 0 : (pageBrands - 1) * takeBrands}&take=${takeBrands}${client_id}`);

            console.log(response);

            setDataBrands(response.brands);
            setCountBrands(response.count);
            setCountResultsBrands(response.brands.length);
            setCountBrand(response.countBrand);
            setCountProduct(response.countProduct);
            setCountThreats(response.countThreats);
        }

        const searchBrands = async () => {
            let client_id;
            clientId ? (client_id = `&clientId=${clientId}`) : (client_id = "");

            const response = await makeRequest("get", `/search-brand?search=${searchBrandsName}${client_id}`);

            setDataBrands(response.brand);
            setCountResultsBrands(response.brand.length);
        };

        if (searchBrandsName) {
            searchBrands();
        } else {
            getBrands();
        }
    }, [pageBrands, searchBrandsName, updateStateBrands]);

    /** Cria ativos de monitoramento (Marcas) */
    const handleCreateBrand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.clientId) {
            toast.info("Selecione o cliente", {
                description: `É obrigatório que selecione o cliente!`,
            });

            setLoading(false);
            return;
        }

        // Anexa a imagem do ativo (quando selecionada) — enviada como multipart para upload no Backblaze
        if (createLogoFile) formData.append("image", createLogoFile);

        const response = await makeRequest("post", `/brand`, formData);

        if (response.status === 201) {
            toast.success("Novo ativo adicionado", {
                description: `O ativo foi adicionado com sucesso`,
            });

            setCreateLogoFile(null);
            setUpdateStateBrands(!updateStateBrands);
            setIsDialogOpen(false);
        }

        if (response.status === 402) {
            toast.info("Crie um cliente", {
                description: `Você precisa criar um cliente primeiro!`,
            });
        }

        if (response.status === 403) {
            toast.info("Configurações obrigatórias", {
                description: `Vá em configurações e configure suas chaves de API!`,
            });
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Edita um ativo de monitoramento (Marcas)  */
    const handleUpdateBrand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const brandId = formData.get("id");

        // O id vai pela URL (param), não no corpo — evita conflito ao atualizar o registro
        formData.delete("id");

        // Anexa a nova imagem (quando trocada) — o backend substitui a antiga no Backblaze
        if (editLogoFile) formData.append("image", editLogoFile);

        const response = await makeRequest("put", `/brand/${brandId}`, formData);

        if (response.status === 200) {
            toast.success("Ativo atualizado", {
                description: `O ativo foi atualizado com sucesso`,
            });

            setEditLogoFile(null);
            setUpdateStateBrands(!updateStateBrands);
            setEditingBrand(null);
            setIsEditDialogOpen(false);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Atualiza variações do nome do ativo */
    const changeVariations = async (id: number) => {
        setLoading(true);

        const response = await makeRequest("put", `/change-variations/${id}`, { variations: editingBrand?.variationBank?.[indexGroupTags ?? 0], variationBank: editingBrand?.variationBank });

        if (response.status === 200) {
            toast.success("Alterada com sucesso", {
                description: `Variações do nome do ativo alteradas com sucesso!`,
            });

            setUpdateStateBrands(!updateStateBrands);
            setEditingBrand(response.payload);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Atualiza variações do domínio */
    const changeVariationsDomain = async (id: number) => {
        setLoading(true);

        const response = await makeRequest("put", `/change-variations-domain/${id}`, { DomainVariations: editingBrand?.domainVariationDatabase?.[indexGroupTagsDomain ?? 0], domainVariationDatabase: editingBrand?.domainVariationDatabase });

        if (response.status === 200) {
            toast.success("Alterada com sucesso", {
                description: `Variações do domínio alteradas com sucesso!`,
            });

            setUpdateStateBrands(!updateStateBrands);
            setEditingBrand(response.payload);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Atualiza gerando novas variações do nome do ativo */
    const generateNewVariations = async (id: number) => {
        setLoading(true);

        const response = await makeRequest("put", `/updates-variations/${id}`);

        if (response.status === 200) {
            toast.success("Geradas com sucesso", {
                description: `Novas Variações geradas com sucesso!`,
            });

            setUpdateStateBrands(!updateStateBrands);
            setEditingBrand(response.payload);
        } else if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        } else {
            toast.error("Não foi possível gerar as variações", {
                description: response.message || `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Atualiza gerando novas variações do domínio */
    const generateNewVariationsDomain = async (id: number) => {
        setLoading(true);

        const response = await makeRequest("put", `/updates-variations-domain/${id}`);

        if (response.status === 200) {
            toast.success("Geradas com sucesso", {
                description: `Novas Variações geradas com sucesso!`,
            });

            setUpdateStateBrands(!updateStateBrands);
            setEditingBrand(response.payload);
        } else if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        } else {
            toast.error("Não foi possível gerar as variações de domínio", {
                description: response.message || `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Busca dados do Gráfico de área empilhada */
    const feedsStackedAreaChart = async (id: number) => {
        // Zera os gráficos antes de buscar — garante que um ativo sem dados (ou uma falha de
        // requisição) não exiba os dados do ativo aberto anteriormente; os gráficos aparecem zerados.
        setStackedAreaChartData({ labels: [], series: [] });
        setGroupedBarChartData({ labels: [], channels: [] });
        setVerificationChartData({ labels: [], channels: [] });
        setScoreChartData({ labels: [], data: [] });
        setTagPerformanceData({ tags: [], activated: [], relevant: [] });
        setInertTagsData({ tags: [], values: [] });

        try {
            const response = await makeRequest("get", `/brand-dashboard-graphic/${id}`);

            if (response?.status === 200 && response.data) {
                setStackedAreaChartData(response.data.stackedAreaChart ?? { labels: [], series: [] });
                setGroupedBarChartData(response.data.groupedBarChart ?? { labels: [], channels: [] });
                setVerificationChartData(response.data.verificationChart ?? { labels: [], channels: [] });
                setScoreChartData(response.data.scoreChart ?? { labels: [], data: [] });
                setTagPerformanceData(response.data.tagPerformanceChart ?? { tags: [], activated: [], relevant: [] });
                setInertTagsData(response.data.inertTagsChart ?? { tags: [], values: [] });
            }
        } catch (error) {
            // Falha ao carregar os dados dos gráficos — mantém tudo zerado, sem quebrar a tela.
            console.error("Erro ao carregar os gráficos do ativo:", error);
        }
    };

    /** Lidar com a caixa de edição do ativo (Marca) */
    const handleEditBrand = (brand: IBrand) => {
        setEditingBrand(brand);
        setEditLogoFile(null);
        setClient_name(brand.client.companyName);
        setClientID(brand.client.id);
        setIsEditDialogOpen(true);
    };

    /** Lidar com a caixa de atualização de variações do ativo (Marca) */
    const handleUpdatesVariations = (brand: IBrand) => {
        setEditingBrand(brand);
        setIsDetailDialogOpen(true);
    };

    /** Controla a paginação dos ativos de monitoramento (Marcas) */
    const handleChangePaginationBrands = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageBrands(value);
    };

    /** Caixa animada da lista de variações do ativo */
    useEffect(() => {
        if (divRefVariationsName.current) {
            setHeightVariationsName(divRefVariationsName.current.scrollHeight);
        }
    }, [openVariationsName]);

    /** Caixa animada da lista de variações do domínio */
    useEffect(() => {
        if (divRefVariationsNameDomain.current) {
            setHeightVariationsNameDomain(divRefVariationsNameDomain.current.scrollHeight);
        }
    }, [openVariationsNameDomain]);

    useEffect(() => {
        if (Array.isArray(editingBrand?.variations)) {
            setVariationsName(editingBrand.variations);
        }
    }, [editingBrand]);

    useEffect(() => {
        if (Array.isArray(editingBrand?.DomainVariations)) {
            setVariationsNameDomain(editingBrand.DomainVariations);
        }
    }, [editingBrand]);

    return (
        <>
            {dataBrands ? (
                <div className="p-6 lg:p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setCreateLogoFile(null);
                            }}
                        >
                            {clientId && clientName ? (
                                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <Button variant="ghost" onClick={() => router.push("/clients")} className="mb-4">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Voltar para clientes
                                        </Button>

                                        <div className="flex flex-col md:flex-row items-center gap-4 -mt-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                                                <Shield className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold tracking-tight">{client_name}</h1>
                                                <p className="text-muted-foreground">
                                                    {countBrands} ativo{(countBrands && countBrands > 1) || countBrands === 0 ? "s" : ""} de monitoramento
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full lg:w-auto lg:ml-auto"
                                        onClick={() => {
                                            setIsDialogOpen(true);
                                            setAssetType("brand");
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Novo Ativo
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">Ativos de Monitoramento</h1>
                                        <p className="text-muted-foreground mt-1">Gerencie seus ativos de monitoramento</p>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full lg:w-auto lg:ml-auto"
                                        onClick={() => {
                                            setIsDialogOpen(true);
                                            setAssetType("brand");
                                            setClient_name("");
                                            setClientID("");
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Novo Ativo
                                    </Button>
                                </div>
                            )}

                            <DialogContent
                                className="w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[500px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                                onInteractOutside={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <DialogHeader className="mb-4">
                                    <DialogTitle>Novo Ativo de Monitoramento</DialogTitle>
                                    <DialogDescription>Preencha as informações do seu ativo para iniciar o monitoramento</DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleCreateBrand} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientId">Cliente *</Label>
                                            <ClientsSelect companyName={client_name} value={clientID} onChange={setClientID} makeRequest={makeRequest} />
                                            <input type="hidden" name="clientId" defaultValue={clientID} />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientId">Tipo do Ativo *</Label>

                                            <Select name="assetType" defaultValue="brand" onValueChange={setAssetType}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o tipo de ativo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="brand">Marca</SelectItem>
                                                    <SelectItem value="product">Produto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="name">Nome do ativo *</Label>
                                            <Input id="name" name="name" placeholder="" maxLength={100} required />
                                        </div>

                                        <div className={assetType === "brand" ? "space-y-2" : "hidden"}>
                                            <Label htmlFor="class">Classe *</Label>
                                            <Input id="class" defaultValue={assetType === "brand" ? "" : "empty"} placeholder="Ex: 25" maxLength={10} name="class" required />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="domain">Domínio Oficial</Label>
                                            <Input id="domain" placeholder="Ex: suamarca.com.br" maxLength={50} name="domain" />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Imagem do ativo</Label>
                                            <ImageDropzone file={createLogoFile} onFileChange={setCreateLogoFile} />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="specifications">Ramo de Atividades</Label>
                                            <Textarea id="specifications" placeholder="Descreva as especificações da marca..." maxLength={200} name="specifications" rows={3} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Salvar Ativo
                                                <Save className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent
                            className="w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[500px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader className="mb-4">
                                <DialogTitle>Editar Ativo</DialogTitle>
                                <DialogDescription>Atualize as informações desse ativo</DialogDescription>
                            </DialogHeader>{" "}
                            {editingBrand && (
                                <form onSubmit={handleUpdateBrand} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input id="id" name="id" type="hidden" defaultValue={editingBrand.id} placeholder="" required />
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientId">Cliente *</Label>
                                            <Select disabled defaultValue={client_name}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={client_name}>{client_name}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientId">Tipo do Ativo *</Label>
                                            <Select disabled defaultValue={editingBrand.assetType}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="brand">Marca</SelectItem>
                                                    <SelectItem value="product">Produto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="name">Nome do ativo *</Label>
                                            <Input id="name" name="name" placeholder="" defaultValue={editingBrand.name} maxLength={100} required />
                                        </div>

                                        <div className={assetType === editingBrand.assetType ? "space-y-2" : "hidden"}>
                                            <Label htmlFor="class">Classe *</Label>
                                            <Input id="class" defaultValue={assetType === "brand" ? `${editingBrand.class}` : "empty"} placeholder="Ex: 25" maxLength={10} name="class" required />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="domain">Domínio Oficial</Label>
                                            <Input id="domain" placeholder="Ex: suamarca.com.br" defaultValue={editingBrand.domain || ""} maxLength={50} name="domain" />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Imagem do ativo</Label>
                                            {/* Preserva a imagem atual quando nenhuma nova é enviada; o backend a substitui ao receber um arquivo */}
                                            <input type="hidden" name="logo_url" defaultValue={editingBrand.logo_url || ""} />
                                            <ImageDropzone file={editLogoFile} onFileChange={setEditLogoFile} existingUrl={editingBrand.logo_url} />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="specifications">Ramo de Atividades</Label>
                                            <Textarea id="specifications" placeholder="Descreva as especificações da marca..." defaultValue={editingBrand.specifications} maxLength={200} name="specifications" rows={3} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Salvar Atualizações
                                                <Save className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!infoDialogBrand} onOpenChange={(open) => !open && setInfoDialogBrand(null)}>
                        <DialogContent
                            className="w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[500px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader className="mb-4">
                                <DialogTitle>Informações do Ativo</DialogTitle>
                                <DialogDescription>Detalhes do ativo de monitoramento</DialogDescription>
                            </DialogHeader>
                            {infoDialogBrand && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs">Cliente</Label>
                                            <p className="font-semibold">{infoDialogBrand.client.companyName}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Nome do Ativo</Label>
                                            <p className="font-semibold">{infoDialogBrand.name}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Tipo</Label>
                                            <Badge variant="outline" className="text-xs">
                                                {infoDialogBrand.assetType === "product" ? "Produto" : "Marca"}
                                            </Badge>
                                        </div>

                                        <div className={infoDialogBrand.assetType === "product" ? "hidden" : "space-y-1"}>
                                            <Label className="text-muted-foreground text-xs">Classe</Label>
                                            <p className="font-medium">{infoDialogBrand.class || "Não informado"}</p>
                                        </div>

                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs">Domínio Oficial</Label>
                                            {infoDialogBrand.domain ? (
                                                <p className="font-medium flex items-center gap-1">
                                                    {infoDialogBrand.domain}{" "}
                                                    <a href={infoDialogBrand.domain} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        <Link className="mr-1 h-4 w-4" />
                                                    </a>
                                                </p>
                                            ) : (
                                                <p className="font-medium">Sem essa informação</p>
                                            )}
                                        </div>

                                        {infoDialogBrand.logo_url && (
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-muted-foreground text-xs">Imagem do ativo</Label>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={infoDialogBrand.logo_url || "/placeholder.svg"}
                                                        alt="Logo da marca"
                                                        className="h-16 w-16 object-contain border rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                    <a href={infoDialogBrand.logo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        Ver imagem
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {infoDialogBrand.specifications && (
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-muted-foreground text-xs">Especificações</Label>
                                                <p className="font-medium text-sm">{infoDialogBrand.specifications}</p>
                                            </div>
                                        )}

                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs">Data de Cadastro</Label>
                                            <p className="font-medium">
                                                {new Date(infoDialogBrand.createdAt).toLocaleDateString("pt-BR")} às {new Date(infoDialogBrand.createdAt).toLocaleTimeString("pt-BR")}
                                            </p>
                                        </div>
                                    </div>

                                    <Button className="w-full" onClick={() => router.push(`/brands/${infoDialogBrand.id}?NewThreat=0&Source=web`)}>
                                        <Eye className="mr-1 h-4 w-4" />
                                        Ameaças
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                        <DialogContent
                            className="w-full sm:[min-width:650px] max-h-[90vh] overflow-y-auto overflow-x-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            {loading ? (
                                <div className="text-center mt-8 mb-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-muted-foreground">Processando...</p>
                                </div>
                            ) : (
                                <>
                                    <DialogHeader className="mt-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0 text-left">
                                                <DialogTitle className="text-2xl break-words">Gerencie Variações de Tags Nesse Ativo</DialogTitle>
                                                <DialogDescription className="mt-4 break-words">Atualização e troca de Variações de Tags do nome do Ativo e do Domínio.</DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <div className="space-y-6 mt-4">
                                        <div className="space-y-4 border-t">
                                            <div className="mt-4">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                                                    <p className="text-sm text-muted-foreground text-center">Variações do Nome do Ativo</p>
                                                    <div className="flex gap-2 flex items-center justify-center">
                                                        <Button variant="outline" size="sm" onClick={() => setOpenVariationsName(!openVariationsName)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver Variações do Ativo
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div style={{ height: openVariationsName ? `${heightVariationsName}px` : "0px", transition: "height 300ms ease" }} className="overflow-hidden mt-2">
                                                    <div ref={divRefVariationsName} className="p-4 border rounded-lg bg-muted h-full">
                                                        <div className="relative aspect-video w-full rounded-lg border bg-muted">
                                                            {editingBrand?.variationBank ? (
                                                                <VariationBankEditor variationBank={editingBrand?.variationBank ?? []} onChange={(updated) => setEditingBrand((prev: any) => ({ ...prev, variationBank: updated }))} variationsName={variationsName} setVariationsName={setVariationsName} setIndexGroupTags={setIndexGroupTags} variationsSoldOut={editingBrand?.variationsSoldOut} />
                                                            ) : (
                                                                <VariationBankEditor variationBank={[editingBrand?.variations]} onChange={(updated) => setEditingBrand((prev: any) => ({ ...prev, variationBank: updated }))} variationsName={variationsName} setVariationsName={setVariationsName} setIndexGroupTags={setIndexGroupTags} variationsSoldOut={editingBrand?.variationsSoldOut} />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:justify-end sm:items-center pb-4">
                                                            <Button variant="default" className="sm:w-auto" onClick={() => generateNewVariations(editingBrand?.id || 0)}>
                                                                <RefreshCcw className="mr-2 h-4 w-4" />
                                                                Gerar Novas Variações
                                                            </Button>
                                                            <Button className="sm:w-auto bg-success hover:bg-success/90" onClick={() => changeVariations(editingBrand?.id || 0)}>
                                                                <SaveIcon className="mr-2 h-4 w-4" />
                                                                Salvar Alterações
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {editingBrand?.DomainVariations && (
                                            <div className="space-y-4 border-t">
                                                <div className="mt-4">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                                                        <p className="text-sm text-muted-foreground text-center">Variações do Nome do Domínio</p>
                                                        <div className="flex gap-2 flex items-center justify-center">
                                                            <Button variant="outline" size="sm" onClick={() => setOpenVariationsNameDomain(!openVariationsNameDomain)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Ver Variações do Domínio
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div style={{ height: openVariationsNameDomain ? `${heightVariationsNameDomain}px` : "0px", transition: "height 300ms ease" }} className="overflow-hidden mt-2">
                                                        <div ref={divRefVariationsNameDomain} className="p-4 border rounded-lg bg-muted h-full">
                                                            <div className="relative aspect-video w-full rounded-lg border bg-muted">
                                                                {editingBrand?.domainVariationDatabase ? (
                                                                    <VariationDomainBankEditor
                                                                        variationDomainBank={editingBrand?.domainVariationDatabase ?? []}
                                                                        onChange={(updated) => setEditingBrand((prev: any) => ({ ...prev, domainVariationDatabase: updated }))}
                                                                        variationsDomainName={variationsNameDomain}
                                                                        setVariationsDomainName={setVariationsNameDomain}
                                                                        setIndexGroupTagsDomain={setIndexGroupTagsDomain}
                                                                    />
                                                                ) : (
                                                                    <VariationDomainBankEditor variationDomainBank={[editingBrand?.DomainVariations]} onChange={(updated) => setEditingBrand((prev: any) => ({ ...prev, domainVariationDatabase: updated }))} variationsDomainName={variationsNameDomain} setVariationsDomainName={setVariationsNameDomain} setIndexGroupTagsDomain={setIndexGroupTagsDomain} />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:justify-end sm:items-center pb-4">
                                                                <Button variant="default" className="sm:w-auto" onClick={() => generateNewVariationsDomain(editingBrand?.id || 0)}>
                                                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                                                    Gerar Novas Variações
                                                                </Button>
                                                                <Button className="sm:w-auto bg-success hover:bg-success/90" onClick={() => changeVariationsDomain(editingBrand?.id || 0)}>
                                                                    <SaveIcon className="mr-2 h-4 w-4" />
                                                                    Salvar Alterações
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {countBrands === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Nenhum ativo cadastrado</h3>
                                <p className="text-muted-foreground text-center mb-6">Adicione seu primeiro ativo para monitoramento</p>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeiro Ativo
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Buscar ativo pelo nome..." value={searchBrandsName} onChange={(e) => setSearchBrandsName(e.target.value)} className="pl-10 bg-card h-11" />
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
                                        <Shield className="h-4 w-4 text-success" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-success">{countBrands}</div>
                                        <p className="text-xs text-muted-foreground">Todos os ativos no geral</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Percentual por Tipo</CardTitle>
                                        <Shield className="h-4 w-4 text-primary" />
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-start gap-6">
                                        <div>
                                            <div className="text-2xl font-bold text-primary">{countBrand && countBrands && Math.round((countBrand / countBrands) * 100)}%</div>
                                            <p className="text-xs text-muted-foreground">Marca</p>
                                        </div>
                                        <div>
                                            <ArrowLeftRight size={20} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-primary">{countProduct && countBrands && Math.round((countProduct / countBrands) * 100)}%</div>
                                            <p className="text-xs text-muted-foreground">Produto</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total de Ameaças</CardTitle>
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-destructive">{countThreats}</div>
                                        <p className="text-xs text-muted-foreground">Ameaças de todos os Ativos</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/** Popup de gráficos */}
                            <FullscreenPopup open={graphPopupOpen} onClose={() => setGraphPopupOpen(false)} title="Gráficos gerais">
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <StackedAreaChart data={stackedAreaChartData} title="Análise de Ocorrências por Canal" />
                                    </div>
                                    <div className="h-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <ScoreChart data={scoreChartData} title="Score de Ameaça — Marketplaces" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <VerificationDonutChart data={verificationChartData} title="Análise de Ocorrências Verificadas" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <RadarPerformanceChart data={groupedBarChartData} title="Análise de Ocorrências Arquivadas" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <VerificationChart data={verificationChartData} title="Análise de Ocorrências Verificadas - (Temporal)" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <GroupedBarChart data={groupedBarChartData} title="Análise de Ocorrências Arquivadas - (Temporal)" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <TagPerformanceChart data={tagPerformanceData} title="Melhores Tags — Acionamentos × Relevância" />
                                    </div>
                                </div>
                                <div className="w-full gap-4 mt-4">
                                    <div className="w-[100%] md:h-auto aspect-square md:aspect-auto rounded-2xl shadow-lg bg-card p-5">
                                        <InertTagsChart data={inertTagsData} title="Tags Inertes" />
                                    </div>
                                </div>
                            </FullscreenPopup>

                            <Card>
                                <div className="border border-border rounded-lg overflow-hidden mt-4">
                                    <div className="animate-in slide-in-from-right-100 duration-600">
                                        <Table className="border-b border-border">
                                            <TableHeader className="bg-muted">
                                                <TableRow className="h-13 border-t border-border">
                                                    <TableHead className="text-left pl-5">Nome</TableHead>
                                                    <TableHead className="text-left">Tipo</TableHead>
                                                    <TableHead className="text-center">Ameaças</TableHead>
                                                    <TableHead className="text-center">Parceiros</TableHead>
                                                    <TableHead className="text-right pr-5">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {countResultsBrands === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                            Nenhum ativo encontrado com "{searchBrandsName}"
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    dataBrands?.map((brand) => {
                                                        const totalOccurrences = brand._count.companies + brand._count.domains + brand._count.generalWeb + brand._count.logoComparisons + brand._count.marketplaces + brand._count.socialMedia;

                                                        return (
                                                            <TableRow key={brand.id} className="transition-all duration-900 ease-out animate-[slideDown_0.8s_ease-out]">
                                                                <TableCell className="font-medium pl-5">
                                                                    <div className="flex items-center gap-3">
                                                                        {brand?.logo_url ? (
                                                                            <div className="flex w-10 aspect-square items-center justify-center -mb-2 md:mb-0">
                                                                                <img src={brand.logo_url || ""} alt="Logo do ativo" className="w-full h-full object-contain" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                                                <Shield className="h-5 w-5 text-primary" />
                                                                            </div>
                                                                        )}
                                                                        <span>{brand.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {brand.assetType === "product" ? "Produto" : "Marca"}
                                                                        </Badge>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className={`text-sm`}>{totalOccurrences}</span>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className={`text-sm`}>{brand._count.trustedPartners}</span>
                                                                </TableCell>

                                                                <TableCell className="text-right pr-5">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => setInfoDialogBrand(brand)} title="Ver informações">
                                                                            <Info className="h-4 w-4" />
                                                                        </Button>

                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="sm" onClick={() => window.open(`/brands/${brand.id}?NewThreat=0&Source=web`, "_blank")}>
                                                                            <Eye className="mr-1 h-4 w-4" />
                                                                            Ameaças
                                                                        </Button>
                                                                        {clientId && clientName && (
                                                                            <Button variant="outline" className="hover:bg-muted-foreground/30" size="sm" onClick={() => router.push(`/partner?clientId=${clientID}&brandId=${brand.id}&clientName=${clientName}&brandName=${brand.name}&brandLogo=${brand.logo_url || "null"}`)}>
                                                                                <Eye className="mr-1 h-4 w-4" />
                                                                                Parceiros
                                                                            </Button>
                                                                        )}
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => handleEditBrand(brand)}>
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="hover:bg-muted-foreground/30"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                (handleUpdatesVariations(brand), setOpenVariationsName(false), setOpenVariationsNameDomain(false));
                                                                            }}
                                                                        >
                                                                            <Settings2 className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="hover:bg-muted-foreground/30"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                feedsStackedAreaChart(brand.id);
                                                                                setGraphPopupOpen(true);
                                                                            }}
                                                                        >
                                                                            <BarChart className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </Card>
                            {dataBrands && countBrands !== 0 && countResultsBrands !== 0 && <Paginations handleChangePagination={handleChangePaginationBrands} count={countBrands} take={takeBrands} />}
                        </>
                    )}
                </div>
            ) : (
                pageSkeleton
            )}
        </>
    );
}
