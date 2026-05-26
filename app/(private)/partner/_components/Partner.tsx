"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const [selectNameThreatPoints, setSelectNameThreatPoints] = useState("0");
    const [selectPriceThreatPoints, setSelectPriceThreatPoints] = useState("0");
    const [selectImageThreatPoints, setSelectImageThreatPoints] = useState("0");
    const [typeOfHost, setTypeOfHost] = useState<boolean | null>(null);
    const [nameThreatPoints, setNameThreatPoints] = useState<number | string>("0");
    const [priceThreatPoints, setPriceThreatPoints] = useState<number | string>("0");
    const [imageThreatPoints, setImageThreatPoints] = useState<number | string>("0");
    const [productPrice, setProductPrice] = useState<number | string>("R$ 0,00");
    const [selectedItemsCurrency, setSelectedItemsCurrency] = useState<string | null>("R$ 0,00");
    const { makeRequest } = useFetch();

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
        data.productPrice = productPrice as any;
        const nameThreatPoints = Number(data.nameThreatPoints);
        data.nameThreatPoints = nameThreatPoints as any;
        const priceThreatPoints = Number(data.priceThreatPoints);
        data.priceThreatPoints = priceThreatPoints as any;
        const imageThreatPoints = Number(data.imageThreatPoints);
        data.imageThreatPoints = imageThreatPoints as any;

        if (!data.brandId) {
            toast.info("Selecione o ativo", {
                description: `É obrigatório que selecione o ativo!`,
            });

            setLoading(false);
            return;
        }

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
        data.productPrice = productPrice as any;
        const nameThreatPoints = Number(data.nameThreatPoints);
        data.nameThreatPoints = nameThreatPoints as any;
        const priceThreatPoints = Number(data.priceThreatPoints);
        data.priceThreatPoints = priceThreatPoints as any;
        const imageThreatPoints = Number(data.imageThreatPoints);
        data.imageThreatPoints = imageThreatPoints as any;

        if (!data.brandId) {
            toast.info("Selecione o ativo", {
                description: `É obrigatório que selecione o ativo!`,
            });

            setLoading(false);
            return;
        }

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
                                        setSelectNameThreatPoints("0");
                                        setSelectPriceThreatPoints("0");
                                        setSelectImageThreatPoints("0");
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
                                                <Label htmlFor="name">Nome do parceiro *</Label>
                                                <Input id="name" name="name" placeholder="" maxLength={255} required />
                                            </div>
                                            <div className="w-24 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="nameThreatPoints">Nível</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde o vendedor ou lojista não faz parte da base de parceiros confiavéis.</div>
                                                    </div>
                                                </div>
                                                <Select name="nameThreatPoints" defaultValue={nameThreatPoints ? String(nameThreatPoints) : selectNameThreatPoints} onValueChange={setSelectNameThreatPoints} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">0</SelectItem>
                                                        <SelectItem value="10" className="text-primary">
                                                            10 - Baixa
                                                        </SelectItem>
                                                        <SelectItem value="30" className="text-warning">
                                                            30 - Média
                                                        </SelectItem>
                                                        <SelectItem value="50" className="text-destructive">
                                                            50 - Alta
                                                        </SelectItem>
                                                    </SelectContent>
                                                    <input type="hidden" name="nameThreatPoints" value={nameThreatPoints ? String(nameThreatPoints) : selectNameThreatPoints} />
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2">
                                            <div className="flex-1 col-span-2 space-y-2">
                                                <Label htmlFor="productPrice">Preço base *</Label>
                                                <Input id="productPrice" inputMode="numeric" name="productPrice" value={selectedItemsCurrency || ""} onChange={handleChangeTextFieldCurrency} placeholder="" maxLength={255} required />
                                            </div>
                                            <div className="w-24 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="priceThreatPoints">Nível</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde o preço não está de acordo com o preço estabelecido.</div>
                                                    </div>
                                                </div>
                                                <Select name="priceThreatPoints" defaultValue={priceThreatPoints ? String(priceThreatPoints) : selectPriceThreatPoints} onValueChange={setSelectPriceThreatPoints} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">0</SelectItem>
                                                        <SelectItem value="10" className="text-primary">
                                                            10 - Baixa
                                                        </SelectItem>
                                                        <SelectItem value="30" className="text-warning">
                                                            30 - Média
                                                        </SelectItem>
                                                        <SelectItem value="50" className="text-destructive">
                                                            50 - Alta
                                                        </SelectItem>
                                                    </SelectContent>
                                                    <input type="hidden" name="priceThreatPoints" value={priceThreatPoints ? String(priceThreatPoints) : selectPriceThreatPoints} />
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2">
                                            <a href={logoUrl} target="_blank" className="flex-1 col-span-2 space-y-2">
                                                <div className="flex-1 col-span-2 space-y-2">
                                                    <Label htmlFor="urlImage">URL da imagem *</Label>
                                                    <Input id="urlImage" value={logoUrl} disabled />
                                                </div>
                                            </a>
                                            <div className="w-24 col-span-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    <Label htmlFor="priceThreatPoints">Nível</Label>
                                                    <div className="group relative cursor-help">
                                                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde a imagem é reconhecida como colidente.</div>
                                                    </div>
                                                </div>
                                                <Select name="imageThreatPoints" defaultValue={imageThreatPoints ? String(imageThreatPoints) : selectImageThreatPoints} onValueChange={setSelectImageThreatPoints} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">0</SelectItem>
                                                        <SelectItem value="10" className="text-primary">
                                                            10 - Baixa
                                                        </SelectItem>
                                                        <SelectItem value="30" className="text-warning">
                                                            30 - Média
                                                        </SelectItem>
                                                        <SelectItem value="50" className="text-destructive">
                                                            50 - Alta
                                                        </SelectItem>
                                                    </SelectContent>
                                                    <input type="hidden" name="imageThreatPoints" value={imageThreatPoints ? String(imageThreatPoints) : selectImageThreatPoints} />
                                                </Select>
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
                                            <Label htmlFor="name">Nome do parceiro*</Label>
                                            <Input id="name" name="name" defaultValue={editingPartner?.name} placeholder="" maxLength={255} required />
                                        </div>
                                        <div className="w-24 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="nameThreatPoints">Nível</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde o vendedor ou lojista não faz parte da base de parceiros confiavéis.</div>
                                                </div>
                                            </div>
                                            <Select name="nameThreatPoints" defaultValue={nameThreatPoints ? String(nameThreatPoints) : selectNameThreatPoints} onValueChange={setSelectNameThreatPoints} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0</SelectItem>
                                                    <SelectItem value="10" className="text-primary">
                                                        10 - Baixa
                                                    </SelectItem>
                                                    <SelectItem value="30" className="text-warning">
                                                        30 - Média
                                                    </SelectItem>
                                                    <SelectItem value="50" className="text-destructive">
                                                        50 - Alta
                                                    </SelectItem>
                                                </SelectContent>
                                                <input type="hidden" name="nameThreatPoints" value={nameThreatPoints ? String(nameThreatPoints) : selectNameThreatPoints} />
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <div className="flex-1 col-span-2 space-y-2">
                                            <Label htmlFor="productPrice">Preço base *</Label>
                                            <Input id="productPrice" inputMode="numeric" name="productPrice" value={selectedItemsCurrency || ""} onChange={handleChangeTextFieldCurrency} placeholder="" maxLength={255} required />
                                        </div>
                                        <div className="w-24 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="priceThreatPoints">Nível</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde o preço não está de acordo com o preço estabelecido.</div>
                                                </div>
                                            </div>
                                            <Select name="priceThreatPoints" defaultValue={priceThreatPoints ? String(priceThreatPoints) : selectPriceThreatPoints} onValueChange={setSelectPriceThreatPoints} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0</SelectItem>
                                                    <SelectItem value="10" className="text-primary">
                                                        10 - Baixa
                                                    </SelectItem>
                                                    <SelectItem value="30" className="text-warning">
                                                        30 - Média
                                                    </SelectItem>
                                                    <SelectItem value="50" className="text-destructive">
                                                        50 - Alta
                                                    </SelectItem>
                                                </SelectContent>
                                                <input type="hidden" name="priceThreatPoints" value={priceThreatPoints ? String(priceThreatPoints) : selectPriceThreatPoints} />
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <a href={logoUrl} target="_blank" className="flex-1 col-span-2 space-y-2">
                                            <div className="flex-1 col-span-2 space-y-2">
                                                <Label htmlFor="urlImage">URL da imagem *</Label>
                                                <Input id="urlImage" value={logoUrl} disabled />
                                            </div>
                                        </a>
                                        <div className="w-24 col-span-2 space-y-1.5">
                                            <div className="flex gap-1">
                                                <Label htmlFor="priceThreatPoints">Nível</Label>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="w-50 p-2.5 bg-foreground/70 absolute right-0 -mt-15 rounded text-[0.7rem] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">Pontuação que determina o nível de criticidade em ocorrências onde a imagem é reconhecida como colidente.</div>
                                                </div>
                                            </div>
                                            <Select name="imageThreatPoints" defaultValue={imageThreatPoints ? String(imageThreatPoints) : selectImageThreatPoints} onValueChange={setSelectImageThreatPoints} required>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0</SelectItem>
                                                    <SelectItem value="10" className="text-primary">
                                                        10 - Baixa
                                                    </SelectItem>
                                                    <SelectItem value="30" className="text-warning">
                                                        30 - Média
                                                    </SelectItem>
                                                    <SelectItem value="50" className="text-destructive">
                                                        50 - Alta
                                                    </SelectItem>
                                                </SelectContent>
                                                <input type="hidden" name="imageThreatPoints" value={imageThreatPoints ? String(imageThreatPoints) : selectImageThreatPoints} />
                                            </Select>
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
