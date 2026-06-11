"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus, Pencil, Search, Save, Link2, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { ITrustedPartners } from "@/lib/types";
import { useFetch } from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import Paginations from "@/components/pagination";

type PartnerPageProps = {
    pageSkeleton: React.ReactNode;
};

export default function PartnerPage({ pageSkeleton }: PartnerPageProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<ITrustedPartners | null>(null);
    const [infoDialogPartner, setInfoDialogPartner] = useState<ITrustedPartners | null>(null);
    const [updateStatePartners, setUpdateStatePartners] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataPartners, setDataPartners] = useState<ITrustedPartners[]>();
    const [countPartners, setCountPartners] = useState<number>();
    const [countResultsPartners, setCountResultsPartners] = useState<number>();
    const [searchPartnerName, setSearchPartnerName] = useState<string>("");
    const [takePartners] = useState<number>(10);
    const [pagePartners, setPagePartners] = useState(1);
    const searchParams = useSearchParams();
    const brandId = searchParams.get("brandId");
    const clientId = searchParams.get("clientId");
    const brandName = searchParams.get("brandName");
    const clientName = searchParams.get("clientName");
    const brandLogo = searchParams.get("brandLogo");
    const [brandID, setBrandID] = useState("");
    const [client_name, setClient_name] = useState("");
    const [logoUrl] = useState<string>(brandLogo || "null");
    const [selectPlatform, setSelectPlatform] = useState("");
    const [selectType, setSelectType] = useState("");
    const [selectCategory, setSelectCategory] = useState("");
    // Chaves seletoras: definem quais critérios (nome, preço, imagem) entram na pontuação do ativo.
    const [nameActive, setNameActive] = useState<boolean>(true);
    const [priceActive, setPriceActive] = useState<boolean>(true);
    const [imageActive, setImageActive] = useState<boolean>(true);
    const [typeOfHost, setTypeOfHost] = useState<boolean | null>(null);
    const [nameThreatPoints, setNameThreatPoints] = useState<number | string>("0");
    const [priceThreatPoints, setPriceThreatPoints] = useState<number | string>("0");
    const [imageThreatPoints, setImageThreatPoints] = useState<number | string>("0");
    const [productPrice, setProductPrice] = useState<number | string>("R$ 0,00");
    const [selectedItemsCurrency, setSelectedItemsCurrency] = useState<string | null>("R$ 0,00");
    const { makeRequest } = useFetch();

    /** Distribui dinamicamente os 100 pontos entre os critérios ativos (nome, preço, imagem):
     *  - 1 ativo  -> 100 pontos no critério ativo
     *  - 2 ativos -> 50 pontos em cada
     *  - 3 ativos -> 25 (nome) + 25 (preço) + 50 (imagem) = 100
     *  Critérios desativados recebem 0. */
    function computeThreatPoints(name: boolean, price: boolean, image: boolean) {
        const count = [name, price, image].filter(Boolean).length;

        if (count === 1) {
            return { nameThreatPoints: name ? 100 : 0, priceThreatPoints: price ? 100 : 0, imageThreatPoints: image ? 100 : 0 };
        }

        if (count === 2) {
            return { nameThreatPoints: name ? 50 : 0, priceThreatPoints: price ? 50 : 0, imageThreatPoints: image ? 50 : 0 };
        }

        if (count === 3) {
            return { nameThreatPoints: 25, priceThreatPoints: 25, imageThreatPoints: 50 };
        }

        return { nameThreatPoints: 0, priceThreatPoints: 0, imageThreatPoints: 0 };
    }

    // Pontuação calculada em tempo real conforme as chaves seletoras — usada nos badges do formulário.
    const livePoints = computeThreatPoints(nameActive, priceActive, imageActive);

    /** Busca os parceiros do ativo */
    useEffect(() => {
        async function getPartners() {
            brandId && setBrandID(brandId);
            brandName && setClient_name(brandName);

            if (!(brandId && clientId && clientName && brandName && brandLogo)) {
                router.push("/dashboard");
            }

            const response = await makeRequest("get", `/trusted-partners/${brandId}?skip=${pagePartners == 1 ? 0 : (pagePartners - 1) * takePartners}&take=${takePartners}`);

            if (response.partners) {
                setTypeOfHost(response.partners[0]?.brand.typeOfHost);
                setNameThreatPoints(response.partners[0]?.brand.nameThreatPoints);
                setPriceThreatPoints(response.partners[0]?.brand.priceThreatPoints);
                setImageThreatPoints(response.partners[0]?.brand.imageThreatPoints);

                if (!response.partners[0]?.brand.productPrice) {
                    setProductPrice("R$ 0,00");
                    setSelectedItemsCurrency("R$ 0,00");
                } else {
                    const productPrice = (response.partners[0]?.brand.productPrice / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });

                    setProductPrice(productPrice);
                    setSelectedItemsCurrency(productPrice);
                }
            }

            setDataPartners(response.partners);
            setCountPartners(response.count);
            setCountResultsPartners(response.partners.length);
        }

        const searchPartner = async () => {
            const response = await makeRequest("get", `/trusted-partners-search/${brandId}?search=${searchPartnerName}`);

            setDataPartners(response);
            setCountResultsPartners(response.length);
            setTypeOfHost(response[0]?.brand.typeOfHost);
            setNameThreatPoints(response[0]?.brand.nameThreatPoints);
            setPriceThreatPoints(response[0]?.brand.priceThreatPoints);
            setImageThreatPoints(response[0]?.brand.imageThreatPoints);

            if (!response[0]?.brand.productPrice) {
                setProductPrice("R$ 0,00");
                setSelectedItemsCurrency("R$ 0,00");
            } else {
                const productPrice = (response[0]?.brand.productPrice / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                setProductPrice(productPrice);
                setSelectedItemsCurrency(productPrice);
            }
        };

        if (searchPartnerName) {
            searchPartner();
        } else {
            getPartners();
        }
    }, [pagePartners, searchPartnerName, updateStatePartners]);

    /** Cria parceiros */
    const handleCreatePartner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const productPrice = parseInt(((data.productPrice as string) ?? "").replace(/\D/g, ""), 10);
        data.productPrice = (Number.isNaN(productPrice) ? 0 : productPrice) as any;

        if (!data.brandId) {
            toast.info("Selecione o ativo", {
                description: `É obrigatório que selecione o ativo!`,
            });

            setLoading(false);
            return;
        }

        if (!nameActive && !priceActive && !imageActive) {
            toast.info("Selecione um critério", {
                description: `Ative pelo menos um critério de pontuação (nome, preço ou imagem).`,
            });

            setLoading(false);
            return;
        }

        // Pontuação dinâmica conforme as chaves seletoras ativas.
        const points = computeThreatPoints(nameActive, priceActive, imageActive);
        data.nameThreatPoints = points.nameThreatPoints as any;
        data.priceThreatPoints = points.priceThreatPoints as any;
        data.imageThreatPoints = points.imageThreatPoints as any;

        const response = await makeRequest("post", `/trusted-partners`, data);

        if (response.status === 201) {
            toast.success("Novo parceiro adicionado", {
                description: `O parceiro foi adicionado com sucesso`,
            });

            setUpdateStatePartners(!updateStatePartners);
            setIsDialogOpen(false);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Edita parceiros */
    const handleUpdatePartner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const productPrice = parseInt(((data.productPrice as string) ?? "").replace(/\D/g, ""), 10);
        data.productPrice = (Number.isNaN(productPrice) ? 0 : productPrice) as any;

        if (!data.brandId) {
            toast.info("Selecione o ativo", {
                description: `É obrigatório que selecione o ativo!`,
            });

            setLoading(false);
            return;
        }

        if (!nameActive && !priceActive && !imageActive) {
            toast.info("Selecione um critério", {
                description: `Ative pelo menos um critério de pontuação (nome, preço ou imagem).`,
            });

            setLoading(false);
            return;
        }

        // Pontuação dinâmica conforme as chaves seletoras ativas.
        const points = computeThreatPoints(nameActive, priceActive, imageActive);
        data.nameThreatPoints = points.nameThreatPoints as any;
        data.priceThreatPoints = points.priceThreatPoints as any;
        data.imageThreatPoints = points.imageThreatPoints as any;

        const response = await makeRequest("put", `/trusted-partners/${editingPartner?.id}`, data);

        if (response.status === 200) {
            toast.success("Parceiro atualizado", {
                description: `O parceiro foi atualizado com sucesso`,
            });

            setUpdateStatePartners(!updateStatePartners);
            setIsEditDialogOpen(false);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Lidar com a caixa de edição do parceiro */
    const handleEditPartner = (partner: ITrustedPartners) => {
        setSelectedItemsCurrency(String(productPrice));
        setSelectPlatform(partner.platform);
        setSelectCategory(partner.category);
        // Reconstrói as chaves seletoras a partir da pontuação salva (>0 = critério ativo).
        setNameActive(Number(partner.nameThreatPoints) > 0);
        setPriceActive(Number(partner.priceThreatPoints) > 0);
        setImageActive(Number(partner.imageThreatPoints) > 0);
        setEditingPartner(partner);
        setIsEditDialogOpen(true);
    };

    /** Controla a paginação dos parceiros */
    const handleChangePaginationPartners = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagePartners(value);
    };

    /** Lica com a máscara monetária (parte 1) */
    function formatCurrency(value: string) {
        const cleanValue = value.replace(/\D/g, "");
        const formattedValue = (Number(cleanValue) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        return formattedValue;
    }

    /** Lica com a máscara monetária (parte 2) */
    const handleChangeTextFieldCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCurrency(event.target.value);
        setSelectedItemsCurrency(formattedValue);
    };

    return (
        <>
            {dataPartners ? (
                <div className="p-6 lg:p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <Button variant="ghost" onClick={() => router.push(`/brands?clientId=${clientId}&clientName=${clientName}`)} className="mb-4">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Voltar para os ativos
                                    </Button>

                                    <div className="flex flex-col md:flex-row items-center gap-4 -mt-3">
                                        <div className="flex h-16 w-16 items-center justify-center">
                                            {logoUrl === "null" ? (
                                                <div className="flex w-16 aspect-square items-center justify-center rounded-xl bg-primary/10">
                                                    <Shield className="h-10 w-10 text-primary" />
                                                </div>
                                            ) : (
                                                <div className="flex w-30 aspect-square items-center justify-center -mb-2 md:mb-0">
                                                    <img src={logoUrl} alt="Logo do ativo" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">{client_name}</h1>
                                            <p className="text-muted-foreground">
                                                {countPartners} parceiro{(countPartners && countPartners > 1) || countPartners === 0 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full lg:w-auto lg:ml-auto"
                                    onClick={() => {
                                        setIsDialogOpen(true);
                                        setSelectCategory("");
                                        // Inicializa as chaves a partir da configuração já salva no ativo; sem config, todos ativos.
                                        const hasConfig = Number(nameThreatPoints) > 0 || Number(priceThreatPoints) > 0 || Number(imageThreatPoints) > 0;
                                        setNameActive(hasConfig ? Number(nameThreatPoints) > 0 : true);
                                        setPriceActive(hasConfig ? Number(priceThreatPoints) > 0 : true);
                                        setImageActive(hasConfig ? Number(imageThreatPoints) > 0 : true);
                                        setSelectedItemsCurrency(String(productPrice));
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Parceiro
                                </Button>
                            </div>

                            <DialogContent
                                className="w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[500px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                                onInteractOutside={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <DialogHeader className="mb-4">
                                    <DialogTitle>Novo Parceiro</DialogTitle>
                                    <DialogDescription>Preencha as informações do seu parceiro</DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleCreatePartner} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="brandId">Ativo *</Label>
                                            <Select name="brandId" disabled defaultValue={brandID} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione a plataforma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={brandID}>{brandName}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" name="brandId" defaultValue={brandID} />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="platform">Plataforma *</Label>
                                            <Select name="platform" onValueChange={setSelectPlatform} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione a plataforma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mercado Livre">Mercado Livre</SelectItem>
                                                    <SelectItem value="Amazon">Amazon</SelectItem>
                                                    <SelectItem value="Shopee">Shopee</SelectItem>
                                                    <SelectItem value="AliExpress">AliExpress</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="type">Tipo *</Label>
                                            <Select name="type" disabled={typeOfHost ? true : false} defaultValue={typeOfHost ? "partner" : ""} onValueChange={setSelectType} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="partner">Parceiro</SelectItem>
                                                    <SelectItem value="host">Anfitrião</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" name="type" value={typeOfHost ? "partner" : selectType} />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="category">Categoria *</Label>
                                            <Select name="category" defaultValue={selectCategory} onValueChange={setSelectCategory} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione a categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="marketplaces">Marketplaces</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" name="category" value={selectCategory} />
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2">
                                            <div className="flex-1 col-span-2 space-y-2">
                                                <Label htmlFor="name">Nome do parceiro</Label>
                                                <Input id="name" name="name" placeholder="" maxLength={255} required={nameActive} />
                                            </div>
                                            <div className="w-28 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="nameThreatPoints">Pontuação</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                                            Ative para pontuar ocorrências onde o vendedor ou lojista não faz parte da base de parceiros confiáveis. Os pontos são distribuídos automaticamente entre os critérios ativos.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 h-9">
                                                    <Switch checked={nameActive} onCheckedChange={setNameActive} />
                                                    <Badge variant={nameActive ? "default" : "outline"} className="text-xs">
                                                        {livePoints.nameThreatPoints} pts
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2">
                                            <div className="flex-1 col-span-2 space-y-2">
                                                <Label htmlFor="productPrice">Preço base</Label>
                                                <Input id="productPrice" inputMode="numeric" name="productPrice" value={selectedItemsCurrency || ""} onChange={handleChangeTextFieldCurrency} placeholder="" maxLength={255} />
                                            </div>
                                            <div className="w-28 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="priceThreatPoints">Pontuação</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                                            Ative para pontuar ocorrências onde o preço não está de acordo com o preço estabelecido. Os pontos são distribuídos automaticamente entre os critérios ativos.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 h-9">
                                                    <Switch checked={priceActive} onCheckedChange={setPriceActive} />
                                                    <Badge variant={priceActive ? "default" : "outline"} className="text-xs">
                                                        {livePoints.priceThreatPoints} pts
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2">
                                            <a href={logoUrl} target="_blank" className="flex-1 col-span-2 space-y-2">
                                                <div className="flex-1 col-span-2 space-y-2">
                                                    <Label htmlFor="urlImage">URL da imagem</Label>
                                                    <Input id="urlImage" value={logoUrl} disabled />
                                                </div>
                                            </a>
                                            <div className="w-28 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="imageThreatPoints">Pontuação</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Ative para pontuar ocorrências onde a imagem é reconhecida como colidente. Os pontos são distribuídos automaticamente entre os critérios ativos.</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 h-9">
                                                    <Switch checked={imageActive} onCheckedChange={setImageActive} />
                                                    <Badge variant={imageActive ? "default" : "outline"} className="text-xs">
                                                        {livePoints.imageThreatPoints} pts
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="partnerUrl">URL do Parceiro (Opcional)</Label>
                                            <Input id="partnerUrl" placeholder="Ex: https://mercadolivre.com/parceiro" maxLength={1000} name="partnerUrl" />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Salvar Parceiro
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
                                <DialogTitle>Editar Parceiro</DialogTitle>
                                <DialogDescription>Atualize as informações do seu parceiro</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleUpdatePartner} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="brandId">Ativo *</Label>
                                        <Select name="brandId" disabled defaultValue={brandID} required>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a plataforma" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={brandID}>{brandName}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input type="hidden" name="brandId" defaultValue={brandID} />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="platform">Plataforma *</Label>
                                        <Select name="platform" defaultValue={selectPlatform} onValueChange={setSelectPlatform} required>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a plataforma" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mercado Livre">Mercado Livre</SelectItem>
                                                <SelectItem value="Amazon">Amazon</SelectItem>
                                                <SelectItem value="Shopee">Shopee</SelectItem>
                                                <SelectItem value="AliExpress">AliExpress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="type">Tipo *</Label>
                                        <Select name="type" disabled defaultValue={editingPartner?.type} onValueChange={setSelectType} required>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="partner">Parceiro</SelectItem>
                                                <SelectItem value="host">Anfitrião</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="category">Categoria *</Label>
                                        <Select name="category" defaultValue={editingPartner?.category} onValueChange={setSelectCategory} required>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="marketplaces">Marketplaces</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* <input type="hidden" name="category" value={selectCategory} /> */}
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <div className="flex-1 col-span-2 space-y-2">
                                            <Label htmlFor="name">Nome do parceiro</Label>
                                            <Input id="name" name="name" defaultValue={editingPartner?.name} placeholder="" maxLength={255} />
                                        </div>
                                        <div className="w-28 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="nameThreatPoints">Pontuação</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                                        Ative para pontuar ocorrências onde o vendedor ou lojista não faz parte da base de parceiros confiáveis. Os pontos são distribuídos automaticamente entre os critérios ativos.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 h-9">
                                                <Switch checked={nameActive} onCheckedChange={setNameActive} />
                                                <Badge variant={nameActive ? "default" : "outline"} className="text-xs">
                                                    {livePoints.nameThreatPoints} pts
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <div className="flex-1 col-span-2 space-y-2">
                                            <Label htmlFor="productPrice">Preço base</Label>
                                            <Input id="productPrice" inputMode="numeric" name="productPrice" value={selectedItemsCurrency || ""} onChange={handleChangeTextFieldCurrency} placeholder="" maxLength={255} disabled={!priceActive} />
                                        </div>
                                        <div className="w-28 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="priceThreatPoints">Pontuação</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                                        Ative para pontuar ocorrências onde o preço não está de acordo com o preço estabelecido. Os pontos são distribuídos automaticamente entre os critérios ativos.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 h-9">
                                                <Switch checked={priceActive} onCheckedChange={setPriceActive} />
                                                <Badge variant={priceActive ? "default" : "outline"} className="text-xs">
                                                    {livePoints.priceThreatPoints} pts
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <a href={logoUrl} target="_blank" className="flex-1 col-span-2 space-y-2">
                                            <div className="flex-1 col-span-2 space-y-2">
                                                <Label htmlFor="urlImage">URL da imagem</Label>
                                                <Input id="urlImage" value={logoUrl} disabled />
                                            </div>
                                        </a>
                                        <div className="w-28 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="imageThreatPoints">Pontuação</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Ative para pontuar ocorrências onde a imagem é reconhecida como colidente. Os pontos são distribuídos automaticamente entre os critérios ativos.</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 h-9">
                                                <Switch checked={imageActive} onCheckedChange={setImageActive} />
                                                <Badge variant={imageActive ? "default" : "outline"} className="text-xs">
                                                    {livePoints.imageThreatPoints} pts
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="partnerUrl">URL do Parceiro (Opcional)</Label>
                                        <Input id="partnerUrl" defaultValue={editingPartner?.partnerUrl || ""} placeholder="Ex: https://mercadolivre.com/parceiro" maxLength={1000} name="partnerUrl" />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Salvar Alterações
                                            <Save className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!infoDialogPartner} onOpenChange={(open) => !open && setInfoDialogPartner(null)}>
                        <DialogContent
                            className="w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[500px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader className="mb-4">
                                <DialogTitle>Informações do Parceiro</DialogTitle>
                                <DialogDescription>Detalhes do parceiro confiável</DialogDescription>
                            </DialogHeader>
                            {infoDialogPartner && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs">Nome do Parceiro</Label>
                                            <p className="font-semibold">{infoDialogPartner.name || "Não informado"}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Plataforma</Label>
                                            <p className="font-medium">{infoDialogPartner.platform || "Não informado"}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Preço base</Label>
                                            <p className="font-medium text-success">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((infoDialogPartner.productPrice || 0) / 100)}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Tipo</Label>
                                            <Badge variant={infoDialogPartner.type === "partner" ? "outline" : "default"} className="text-xs">
                                                {infoDialogPartner.type === "partner" ? "Parceiro" : "Anfitrião"}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Categoria</Label>
                                            <Badge variant="outline" className="text-xs">
                                                {infoDialogPartner.category === "marketplaces" ? "Marketplaces" : infoDialogPartner.category || "Não informado"}
                                            </Badge>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-muted-foreground text-xs">Critérios de pontuação</Label>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant={Number(infoDialogPartner.nameThreatPoints) > 0 ? "default" : "outline"} className="text-xs">
                                                    Nome: {infoDialogPartner.nameThreatPoints} pts
                                                </Badge>
                                                <Badge variant={Number(infoDialogPartner.priceThreatPoints) > 0 ? "default" : "outline"} className="text-xs">
                                                    Preço: {infoDialogPartner.priceThreatPoints} pts
                                                </Badge>
                                                <Badge variant={Number(infoDialogPartner.imageThreatPoints) > 0 ? "default" : "outline"} className="text-xs">
                                                    Imagem: {infoDialogPartner.imageThreatPoints} pts
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs">URL do Parceiro</Label>
                                            {infoDialogPartner.partnerUrl ? (
                                                <p className="font-medium flex items-center gap-1 break-all">
                                                    {infoDialogPartner.partnerUrl}{" "}
                                                    <a href={infoDialogPartner.partnerUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        <Link2 className="mr-1 h-4 w-4" />
                                                    </a>
                                                </p>
                                            ) : (
                                                <p className="font-medium">Sem essa informação</p>
                                            )}
                                        </div>

                                        {infoDialogPartner.createdAt && (
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-muted-foreground text-xs">Data de Cadastro</Label>
                                                <p className="font-medium">
                                                    {new Date(infoDialogPartner.createdAt).toLocaleDateString("pt-BR")} às {new Date(infoDialogPartner.createdAt).toLocaleTimeString("pt-BR")}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            const partner = infoDialogPartner;
                                            setInfoDialogPartner(null);
                                            handleEditPartner(partner);
                                        }}
                                    >
                                        <Pencil className="mr-1 h-4 w-4" />
                                        Editar Parceiro
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {countPartners === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Nenhum parceiro cadastrado</h3>
                                <p className="text-muted-foreground text-center mb-6">Adicione seu primeiro parceiro</p>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeiro Parceiro
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Buscar parceiro pelo nome..." value={searchPartnerName} onChange={(e) => setSearchPartnerName(e.target.value)} className="pl-10 bg-card h-11" />
                                </div>
                            </div>

                            <Card>
                                <div className="border border-border rounded-lg overflow-hidden mt-4">
                                    <div className="animate-in slide-in-from-right-100 duration-600">
                                        <Table className="border-b border-border">
                                            <TableHeader className="bg-muted">
                                                <TableRow className="h-13 border-t border-border">
                                                    <TableHead className="text-left pl-5">Nome</TableHead>
                                                    <TableHead className="text-left">Preço</TableHead>
                                                    <TableHead className="text-left">Plataforma</TableHead>
                                                    <TableHead className="text-left">Tipo</TableHead>
                                                    <TableHead className="text-left">Categoria</TableHead>
                                                    <TableHead className="text-right pr-5">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {countResultsPartners === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                            Nenhum ativo encontrado com "{searchPartnerName}"
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    dataPartners?.map((partner) => {
                                                        return (
                                                            <TableRow key={partner.id} className="transition-all duration-900 ease-out animate-[slideDown_0.8s_ease-out]">
                                                                <TableCell className="font-medium pl-5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                                            <Shield className="h-5 w-5 text-primary" />
                                                                        </div>
                                                                        <span>{partner.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-wrap gap-1 text-success">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((partner.productPrice || 0) / 100)}</div>
                                                                </TableCell>
                                                                <TableCell className="text-left">
                                                                    <span className={`text-sm text-muted-foreground`}>{partner.platform}</span>
                                                                </TableCell>
                                                                <TableCell className="text-left">{partner.type === "partner" ? <Badge variant="outline">Parceiro</Badge> : <Badge variant="default">Anfitrião</Badge>}</TableCell>
                                                                <TableCell className="text-left">{partner.category === "marketplaces" ? <Badge variant="outline">Marketplaces</Badge> : <Badge variant="default"></Badge>}</TableCell>
                                                                <TableCell className="text-right pr-5">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => setInfoDialogPartner(partner)} title="Ver informações">
                                                                            <Info className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => handleEditPartner(partner)}>
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                        {partner.partnerUrl ? (
                                                                            <a href={`${partner.partnerUrl}`} target="_blank">
                                                                                <Button variant="outline" className="hover:bg-muted-foreground/30" size="sm">
                                                                                    <Link2 className="mr-1 h-4 w-4" />
                                                                                    Visitar
                                                                                </Button>
                                                                            </a>
                                                                        ) : (
                                                                            <Button variant="outline" disabled className="hover:bg-muted-foreground/30" size="sm">
                                                                                <Link2 className="mr-1 h-4 w-4" />
                                                                                Visitar
                                                                            </Button>
                                                                        )}
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
                            {dataPartners && countPartners !== 0 && countResultsPartners !== 0 && <Paginations handleChangePagination={handleChangePaginationPartners} count={countPartners} take={takePartners} />}
                        </>
                    )}
                </div>
            ) : (
                pageSkeleton
            )}
        </>
    );
}
