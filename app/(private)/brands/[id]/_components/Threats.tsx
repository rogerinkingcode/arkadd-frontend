"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Building2, Globe2, Instagram, ShoppingBag, ImageIcon, Filter, AlertCircle } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { IGeneralWeb, IMarketplaces, ISocialMedia, IDomains, ICompanies, ILogoComparisons, ITrustedPartners } from "@/lib/types";
import ThreatTableGeneralWeb from "@/components/ThreatTableGeneralWeb";
import ThreatTableMarketplaces from "@/components/ThreatTableMarketplaces";
import ThreatTableSocialMedia from "@/components/ThreatTableSocialMedia";
import ThreatTableDomains from "@/components/ThreatTableDomains";
import ThreatTableCompanies from "@/components/ThreatTableCompanies";
import ThreatTableLogoComparisons from "@/components/ThreatTableLogoComparisons";
import ThreatsSkeleton from "@/components/ThreatsSkeleton";
import ThreatFiltersSidebar from "./ThreatFiltersSidebar";

interface HeaderFilterSectionProps {
    title: string;
    description: string;
    verifiedThreatFilter: "all" | "unverified" | "verified";
    setVerifiedThreatFilter: (value: "all" | "unverified" | "verified") => void;
    setArchivingThreatFilter: (value: "all" | "unarchived" | "archived") => void;
    archivingThreatFilter: "all" | "unarchived" | "archived";
    setReloadFilter: (value: boolean) => void;
    reloadFilter: boolean;
}

/**
 * Cabeçalho do card de cada aba. Os selects de filtro passaram para a `ThreatFiltersSidebar`,
 * mas o sincronismo entre "Status" e "Análise" continua aqui de propósito: este componente
 * remonta a cada troca de aba, e é essa montagem que dispara o `reloadFilter` — sem ela a aba
 * reaberta continuaria mostrando os dados carregados na entrada da página.
 */
function HeaderFilterSection({ title, description, verifiedThreatFilter, setVerifiedThreatFilter, setArchivingThreatFilter, archivingThreatFilter, setReloadFilter, reloadFilter }: HeaderFilterSectionProps) {
    useEffect(() => {
        if (archivingThreatFilter !== "all") {
            setVerifiedThreatFilter("verified");
            setReloadFilter(!reloadFilter);
        } else {
            setVerifiedThreatFilter("all");
            setReloadFilter(!reloadFilter);
        }
    }, [archivingThreatFilter]);

    useEffect(() => {
        setArchivingThreatFilter(archivingThreatFilter);
        setReloadFilter(!reloadFilter);
    }, [verifiedThreatFilter]);

    return (
        <div className="">
            <CardHeader className="mt-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </div>
    );
}

export default function BrandThreatPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const NewThreat = searchParams.get("NewThreat");
    const Source = searchParams.get("Source");
    const brandId = params.id as string;
    // Papel da sessão, não presença dela: a rota é privada, então o que muda a tela é ser dono
    // ou ser um acesso de cliente — o cliente vê a mesma versão reduzida de antes.
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [invalidURL, setInvalidURL] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(Source);
    // Aba realmente aberta — as `Tabs` são não controladas, então guardamos o valor à parte para
    // a sidebar saber quando exibir o filtro de "Informações" (exclusivo de marketplaces).
    const [currentTab, setCurrentTab] = useState<string>(Source || "web");
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const [verifiedThreatFilter, setVerifiedThreatFilter] = useState<"all" | "unverified" | "verified">("all");
    const [notifiedThreatFilter, setNotifiedThreatFilter] = useState<"all" | "unotified" | "notified">("all");
    const [archivingThreatFilter, setArchivingThreatFilter] = useState<"all" | "unarchived" | "archived">("all");
    // Filtro exclusivo da aba de marketplaces — ocorrências com/sem a coluna `info` preenchida pela extensão
    const [infoThreatFilter, setInfoThreatFilter] = useState<"all" | "with" | "without">("all");
    // Filtro exclusivo da aba de marketplaces — rastreio que trouxe a ocorrência (busca por tags ou pesquisa reversa de imagem)
    const [originThreatFilter, setOriginThreatFilter] = useState<"all" | "search_api" | "reverse_image">("all");
    const [reloadFilter, setReloadFilter] = useState<boolean>(false);
    const [assetName, setAssetName] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [dataGeneralWeb, setDataGeneralWeb] = useState<IGeneralWeb[]>();
    const [countGeneralWeb, setCountGeneralWeb] = useState<number>();
    const [countResultsGeneralWeb, setCountResultsGeneralWeb] = useState<number>();
    const [dataMarketplace, setDataMarketplace] = useState<IMarketplaces[]>();
    const [countMarketplace, setCountMarketplace] = useState<number>();
    const [countResultsMarketplace, setCountResultsMarketplace] = useState<number>();
    const [dataSocialMedia, setDataSocialMedia] = useState<ISocialMedia[]>();
    const [countSocialMedia, setCountSocialMedia] = useState<number>();
    const [countResultsSocialMedia, setCountResultsSocialMedia] = useState<number>();
    const [dataDomains, setDataDomains] = useState<IDomains[]>();
    const [countDomains, setCountDomains] = useState<number>();
    const [countResultsDomains, setCountResultsDomains] = useState<number>();
    const [dataCompanies, setDataCompanies] = useState<ICompanies[]>();
    const [countCompanies, setCountCompanies] = useState<number>();
    const [countResultsCompanies, setCountResultsCompanies] = useState<number>();
    const [dataLogoComparisons, setDataLogoComparisons] = useState<ILogoComparisons[]>();
    const [trustedPartnersOfMarketplaces, setTrustedPartnersOfMarketplaces] = useState<ITrustedPartners[]>();
    const [countLogoComparisons, setCountLogoComparisons] = useState<number>();
    const [countResultsLogoComparisons, setCountResultsLogoComparisons] = useState<number>();
    const [countAllThreats, setCountAllThreats] = useState<number>();
    const [allThreats, setAllThreats] = useState<number>();
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);
    const formatDate = (date: Date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const [startDate, setStartDate] = useState<string>(formatDate(pastDate));
    const [endDate, setEndDate] = useState<string>(formatDate(today));

    const { makeRequest } = useFetch();

    useEffect(() => {
        (async () => {
            try {
                const response = await makeRequest("get", "/me");
                // `/me` devolve `{ user: { role } }`; qualquer coisa fora de `owner` (inclusive um
                // corpo de erro devolvido pelo `useFetch`) cai no tratamento de acesso de cliente.
                const owner = response?.user?.role === "owner";
                setIsOwner(owner);

                const res = await makeRequest("get", `/threats/${brandId}?verified=${owner ? verifiedThreatFilter : "verified"}&notified=${owner ? notifiedThreatFilter : "all"}&archiving=${owner ? archivingThreatFilter : "unarchived"}&startDate=${startDate}&endDate=${endDate}`);

                if (res.status === 200) {
                    const totalThreats = res.data.data._count.generalWeb + res.data.data._count.marketplaces + res.data.data._count.socialMedia + res.data.data._count.companies + res.data.data._count.domains + res.data.data._count.logoComparisons;

                    setDataGeneralWeb(res.data.data.generalWeb);
                    setCountGeneralWeb(res.data.data._count.generalWeb);
                    setCountResultsGeneralWeb(res.data.data.generalWeb.length);
                    setDataMarketplace(res.data.data.marketplaces);
                    setCountMarketplace(res.data.data._count.marketplaces);
                    setCountResultsMarketplace(res.data.data.marketplaces.length);
                    setDataSocialMedia(res.data.data.socialMedia);
                    setCountSocialMedia(res.data.data._count.socialMedia);
                    setCountResultsSocialMedia(res.data.data.socialMedia.length);
                    setDataDomains(res.data.data.domains);
                    setCountDomains(res.data.data._count.domains);
                    setCountResultsDomains(res.data.data.domains.length);
                    setDataCompanies(res.data.data.companies);
                    setCountCompanies(res.data.data._count.companies);
                    setCountResultsCompanies(res.data.data.companies.length);
                    setDataLogoComparisons(res.data.data.logoComparisons);
                    setCountLogoComparisons(res.data.data._count.logoComparisons);
                    setCountResultsLogoComparisons(res.data.data.logoComparisons.length);
                    setCountAllThreats(totalThreats);
                    setAllThreats(res.data.allThreats);
                    setAssetName(res.data.data.name);
                    setLogoUrl(res.data.data.logo_url || "void");
                } else {
                    return;
                }
            } catch {
                setIsOwner(false);
            } finally {
                setInvalidURL(![NewThreat, Source].every(Boolean));
                setMounted(true);
            }
        })();
    }, []);

    useEffect(() => {
        mounted && Source && Source !== activeTab && setActiveTab(Source);
    }, [Source, mounted, activeTab]);

    if (!mounted) {
        return <ThreatsSkeleton />;
    }

    return (
        <>
            {!invalidURL ? (
                <div className="p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            {logoUrl === "void" ? (
                                <div className="flex w-30 aspect-square items-center justify-center rounded-xl bg-primary/10">
                                    <Shield className="h-16 w-16 text-primary" />
                                </div>
                            ) : (
                                <div className="flex w-30 aspect-square items-center justify-center -mb-2 md:mb-0">
                                    <img src={logoUrl} alt="Logo do ativo" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div>
                                {isOwner && (
                                    <Button variant="outline" onClick={() => router.push("/clients")}>
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar para Clientes
                                    </Button>
                                )}
                                <h1 className="text-3xl font-bold">{assetName}</h1>
                            </div>
                        </div>

                        <Button variant="outline" onClick={() => setFiltersOpen(true)} className="self-center md:self-auto">
                            <Filter className="h-4 w-4" />
                            Filtro
                        </Button>
                    </div>

                    <ThreatFiltersSidebar
                        open={filtersOpen}
                        onOpenChange={setFiltersOpen}
                        isOwner={isOwner}
                        verifiedThreatFilter={verifiedThreatFilter}
                        setVerifiedThreatFilter={setVerifiedThreatFilter}
                        notifiedThreatFilter={notifiedThreatFilter}
                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                        archivingThreatFilter={archivingThreatFilter}
                        setArchivingThreatFilter={setArchivingThreatFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        showInfoFilter={currentTab === "marketplace"}
                        infoThreatFilter={infoThreatFilter}
                        setInfoThreatFilter={setInfoThreatFilter}
                        originThreatFilter={originThreatFilter}
                        setOriginThreatFilter={setOriginThreatFilter}
                    />

                    <Tabs defaultValue={activeTab || "web"} onValueChange={setCurrentTab} className="space-y-6">
                        {/* Versão Desktop */}
                        <div
                            className="hidden lg:block"
                            onClick={() => {
                                (setVerifiedThreatFilter("all"), setNotifiedThreatFilter("all"), setArchivingThreatFilter("all"), setInfoThreatFilter("all"), setOriginThreatFilter("all"), setStartDate(formatDate(pastDate)), setEndDate(formatDate(today)));
                            }}
                        >
                            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6">
                                <TabsTrigger value="web" className="text-xs sm:text-sm">
                                    <Globe2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Web</span>
                                    <span className="sm:hidden">Web</span>
                                </TabsTrigger>
                                <TabsTrigger value="marketplace" className="text-xs sm:text-sm">
                                    <ShoppingBag className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Marketplaces</span>
                                    <span className="sm:hidden">Market</span>
                                </TabsTrigger>
                                <TabsTrigger value="company" className="text-xs sm:text-sm">
                                    <Building2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Empresas</span>
                                    <span className="sm:hidden">Emp.</span>
                                </TabsTrigger>
                                <TabsTrigger value="domain" className="text-xs sm:text-sm">
                                    <Globe2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Domínios</span>
                                    <span className="sm:hidden">Dom.</span>
                                </TabsTrigger>
                                <TabsTrigger value="social" className="text-xs sm:text-sm">
                                    <Instagram className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Redes Sociais</span>
                                    <span className="sm:hidden">Social</span>
                                </TabsTrigger>
                                <TabsTrigger value="logo" className="text-xs sm:text-sm">
                                    <ImageIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Logos</span>
                                    <span className="sm:hidden">Logos</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Versão Mobile */}
                        <div className="lg:hidden">
                            <TabsList
                                className="overflow-x-auto whitespace-nowrap scrollbar-hide gap-3 min-h-[7rem] bg-transparent pl-80 sm:pl-0 w-full"
                                onClick={() => {
                                    (setVerifiedThreatFilter("all"), setNotifiedThreatFilter("all"), setArchivingThreatFilter("all"), setInfoThreatFilter("all"), setOriginThreatFilter("all"), setStartDate(formatDate(pastDate)), setEndDate(formatDate(today)));
                                }}
                            >
                                <TabsTrigger value="web" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <Globe2 className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Web</span>
                                </TabsTrigger>
                                <TabsTrigger value="marketplace" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <ShoppingBag className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Market</span>
                                </TabsTrigger>
                                <TabsTrigger value="company" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <Building2 className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Emp.</span>
                                </TabsTrigger>
                                <TabsTrigger value="domain" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <Globe2 className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Dom.</span>
                                </TabsTrigger>
                                <TabsTrigger value="social" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <Instagram className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Social</span>
                                </TabsTrigger>
                                <TabsTrigger value="logo" className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border">
                                    <ImageIcon className="!h-8 !w-8" />
                                    <span className="text-xs font-medium">Logos</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="web">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças na Web"
                                    description="Menções e citações de marca e produto em sites, blogs e fóruns"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableGeneralWeb
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataGeneralWeb}
                                        count={countGeneralWeb}
                                        countResults={countResultsGeneralWeb}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        assetName={assetName}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="marketplace">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças em Marketplaces"
                                    description="Menções e citações de marca e produto em marketplaces"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableMarketplaces
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        infoThreatFilter={isOwner ? infoThreatFilter : "all"}
                                        originThreatFilter={isOwner ? originThreatFilter : "all"}
                                        autoOpenThreatId={Source === "marketplace" && NewThreat && NewThreat !== "0" ? NewThreat : null}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataMarketplace}
                                        count={countMarketplace}
                                        countResults={countResultsMarketplace}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        logoUrl={logoUrl}
                                        assetName={assetName}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="company">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças em Empresas"
                                    description="Menções e citações de marca e produto em CNPJ de empresas"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableCompanies
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataCompanies}
                                        count={countCompanies}
                                        countResults={countResultsCompanies}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        assetName={assetName}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="domain">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças em Domínios"
                                    description="Menções e citações de marca e produto em domínios"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableDomains
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataDomains}
                                        count={countDomains}
                                        countResults={countResultsDomains}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        assetName={assetName}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="social">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças em Redes Sociais"
                                    description="Menções e citações de marca e produto em Redes Sociais"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableSocialMedia
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataSocialMedia}
                                        count={countSocialMedia}
                                        countResults={countResultsSocialMedia}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        assetName={assetName}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="logo">
                            <Card>
                                <HeaderFilterSection
                                    title="Ameaças nos Logos"
                                    description="Coincidências nas imagens associadas de ocorrências encontradas com os Logos de marcas e produtos"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                />
                                <CardContent>
                                    <ThreatTableLogoComparisons
                                        brandId={brandId}
                                        verifiedThreatFilter={isOwner ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={isOwner ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={isOwner ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        isOwner={isOwner}
                                        data={dataLogoComparisons}
                                        count={countLogoComparisons}
                                        countResults={countResultsLogoComparisons}
                                        countAllThreats={countAllThreats}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        assetName={assetName}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-muted">
                    <div className="flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="mt-2 text-muted-foreground">A URL foi alterada 😪</p>
                    </div>
                </div>
            )}
        </>
    );
}
