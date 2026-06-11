"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, Building2, Globe2, Instagram, ShoppingBag, ImageIcon, Filter, AlertCircle, Calendar } from "lucide-react";
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
import PrintButton from "@/components/PrintButton";
import { Input } from "@/components/ui/input";
import PrintAllTabsButtonManualReport from "@/components/PrintButtonManualReport";

interface HeaderFilterSectionProps {
    title: string;
    description: string;
    verifiedThreatFilter: "all" | "unverified" | "verified";
    setVerifiedThreatFilter: (value: "all" | "unverified" | "verified") => void;
    notifiedThreatFilter: "all" | "unotified" | "notified";
    setNotifiedThreatFilter: (value: "all" | "unotified" | "notified") => void;
    setArchivingThreatFilter: (value: "all" | "unarchived" | "archived") => void;
    archivingThreatFilter: "all" | "unarchived" | "archived";
    setReloadFilter: (value: boolean) => void;
    reloadFilter: boolean;
    logged: boolean | null;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    startDate: string;
    /** Filtro exclusivo da aba de marketplaces: filtra por ocorrências com/sem a coluna `info` preenchida pela extensão. */
    showInfoFilter?: boolean;
    infoThreatFilter?: "all" | "with" | "without";
    setInfoThreatFilter?: (value: "all" | "with" | "without") => void;
}

function HeaderFilterSection({ title, description, verifiedThreatFilter, setVerifiedThreatFilter, notifiedThreatFilter, setNotifiedThreatFilter, setArchivingThreatFilter, archivingThreatFilter, setReloadFilter, reloadFilter, logged, setStartDate, setEndDate, endDate, startDate, showInfoFilter, infoThreatFilter, setInfoThreatFilter }: HeaderFilterSectionProps) {
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
            <CardHeader className="mb-4 mt-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <div className="flex">
                {logged ? (
                    <div className={`grid grid-cols-1 gap-3 px-6 mt-4 w-full ${showInfoFilter ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
                        <div className="text-center">
                            <label className="text-sm">Status</label>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={archivingThreatFilter} onValueChange={(value: "all" | "unarchived" | "archived") => setArchivingThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por análise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unarchived">Críticas</SelectItem>
                                        <SelectItem value="archived">Arquivadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="text-center">
                            <label className="text-sm">Análise</label>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={verifiedThreatFilter} onValueChange={(value: "all" | "unverified" | "verified") => setVerifiedThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por análise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unverified">Novas Ocorrências</SelectItem>
                                        <SelectItem value="verified">Ocorrências Verificadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="text-center">
                            <label className="text-sm">Notificação</label>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={notifiedThreatFilter} onValueChange={(value: "all" | "unotified" | "notified") => setNotifiedThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por notificação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unotified">Ocorrências Não Notificadas</SelectItem>
                                        <SelectItem value="notified">Ocorrências Notificadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {showInfoFilter && infoThreatFilter !== undefined && setInfoThreatFilter && (
                            <div className="text-center">
                                <label className="text-sm">Informações</label>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <Select value={infoThreatFilter} onValueChange={(value: "all" | "with" | "without") => setInfoThreatFilter(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filtrar por informações" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Geral</SelectItem>
                                            <SelectItem value="with">Com informações extraídas</SelectItem>
                                            <SelectItem value="without">Sem informações extraídas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div className="text-center">
                            <label className="text-sm">Início do periodo</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" />
                            </div>
                        </div>

                        <div className="text-center">
                            <label className="text-sm">Fim do periodo</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-6 mt-4 w-full">
                        <div className="text-center">
                            <label className="text-sm">Início do periodo</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" />
                            </div>
                        </div>

                        <div className="text-center">
                            <label className="text-sm">Fim do periodo</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BrandThreatPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const NewThreat = searchParams.get("NewThreat");
    const Source = searchParams.get("Source");
    const StartDate = searchParams.get("StartDate");
    const EndDate = searchParams.get("EndDate");
    const brandId = params.id as string;
    const [logged, setLogged] = useState<boolean | null>(null);
    const [invalidURL, setInvalidURL] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(Source);
    const [mounted, setMounted] = useState(false);
    const [verifiedThreatFilter, setVerifiedThreatFilter] = useState<"all" | "unverified" | "verified">("all");
    const [notifiedThreatFilter, setNotifiedThreatFilter] = useState<"all" | "unotified" | "notified">("all");
    const [archivingThreatFilter, setArchivingThreatFilter] = useState<"all" | "unarchived" | "archived">("all");
    // Filtro exclusivo da aba de marketplaces — ocorrências com/sem a coluna `info` preenchida pela extensão
    const [infoThreatFilter, setInfoThreatFilter] = useState<"all" | "with" | "without">("all");
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
    const [countAllAccesses, setCountAllAccesses] = useState<number>();
    const [allThreats, setAllThreats] = useState<number>();
    const [autoPrint, setAutoPrint] = useState<boolean>(false);
    const [autoPrintManualReport, setAutoPrintManualReport] = useState<boolean>(false);
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);
    const formatDate = (date: Date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const [startDate, setStartDate] = useState<string>(formatDate(pastDate));
    const [endDate, setEndDate] = useState<string>(formatDate(today));

    const { makeRequest } = useFetch();

    useEffect(() => {
        if (StartDate !== null && EndDate !== null) {
            setStartDate(StartDate.split("T")[0]);
            setEndDate(EndDate.split("T")[0]);
            const mediaQuery = window.matchMedia("(min-width: 1024px)");

            if (mediaQuery.matches) {
                setAutoPrint(true);
            }

            setTimeout(() => {
                setAutoPrint(false);
            }, 5000);
        }
    }, []);

    function handlePrint() {
        setAutoPrintManualReport(true);
        setTimeout(() => {
            setAutoPrintManualReport(false);
        }, 5000);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await makeRequest("get", "/me");
                setLogged(!!response);

                if (!!!response && NewThreat) {
                    makeRequest("put", `/access/${NewThreat}?source=${Source}`);
                }

                const res = await makeRequest("get", `/threats/${brandId}?verified=${!!response ? verifiedThreatFilter : "verified"}&notified=${!!response ? notifiedThreatFilter : "all"}&archiving=${!!response ? archivingThreatFilter : "unarchived"}&startDate=${startDate}&endDate=${endDate}`);

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
                    setCountAllAccesses(res.data.countAllAccesses);
                    setAllThreats(res.data.allThreats);
                    setAssetName(res.data.data.name);
                    setLogoUrl(res.data.data.logo_url || "void");
                } else {
                    return;
                }
            } catch {
                setLogged(false);
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
                    <div className="mb-6">
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
                                {logged && (
                                    <Button variant="outline" onClick={() => router.push("/clients")}>
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar para Clientes
                                    </Button>
                                )}
                                <h1 className="text-3xl font-bold">{assetName}</h1>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue={activeTab || "web"} className="space-y-6">
                        {/* Versão Desktop */}
                        <div
                            className="hidden lg:block"
                            onClick={() => {
                                (setVerifiedThreatFilter("all"), setNotifiedThreatFilter("all"), setArchivingThreatFilter("all"), setInfoThreatFilter("all"), setStartDate(formatDate(pastDate)), setEndDate(formatDate(today)));
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
                                    (setVerifiedThreatFilter("all"), setNotifiedThreatFilter("all"), setArchivingThreatFilter("all"), setInfoThreatFilter("all"), setStartDate(formatDate(pastDate)), setEndDate(formatDate(today)));
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

                        <label htmlFor="" onClick={handlePrint} className="hidden lg:block absolute right-[25px] top-[225px] lg:right-[35px] lg:top-[249px]">
                            <PrintAllTabsButtonManualReport tabContainerIds={["tab-2-content"]} buttonText="📄 Gerar Relatório" />
                        </label>

                        <div id="tab-2-content">
                            {autoPrintManualReport && (
                                <div className="mb-6 mt-3">
                                    <div className="flex items-center gap-3">
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
                                            <h1 className="text-3xl font-bold">{assetName}</h1>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <TabsContent value="web">
                                <Card>
                                    <HeaderFilterSection
                                        title="Ameaças na Web"
                                        description="Menções e citações de marca e produto em sites, blogs e fóruns"
                                        verifiedThreatFilter={verifiedThreatFilter}
                                        setVerifiedThreatFilter={setVerifiedThreatFilter}
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                    <CardContent>
                                        <ThreatTableGeneralWeb
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataGeneralWeb}
                                            count={countGeneralWeb}
                                            countResults={countResultsGeneralWeb}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="marketplace">
                                <Card>
                                    <HeaderFilterSection
                                        title="Ameaças em Marktplaces"
                                        description="Menções e citações de marca e produto em marktplaces"
                                        verifiedThreatFilter={verifiedThreatFilter}
                                        setVerifiedThreatFilter={setVerifiedThreatFilter}
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                        showInfoFilter={true}
                                        infoThreatFilter={infoThreatFilter}
                                        setInfoThreatFilter={setInfoThreatFilter}
                                    />
                                    <CardContent>
                                        <ThreatTableMarketplaces
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            infoThreatFilter={logged ? infoThreatFilter : "all"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataMarketplace}
                                            count={countMarketplace}
                                            countResults={countResultsMarketplace}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
                                            logoUrl={logoUrl}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="company">
                                <Card>
                                    <HeaderFilterSection
                                        title="Ameaças em Empresas"
                                        description="Menções e citações de marca e produto em cnpj de empresas"
                                        verifiedThreatFilter={verifiedThreatFilter}
                                        setVerifiedThreatFilter={setVerifiedThreatFilter}
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                    <CardContent>
                                        <ThreatTableCompanies
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataCompanies}
                                            count={countCompanies}
                                            countResults={countResultsCompanies}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
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
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                    <CardContent>
                                        <ThreatTableDomains
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataDomains}
                                            count={countDomains}
                                            countResults={countResultsDomains}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
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
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                    <CardContent>
                                        <ThreatTableSocialMedia
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataSocialMedia}
                                            count={countSocialMedia}
                                            countResults={countResultsSocialMedia}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="logo">
                                <Card>
                                    <HeaderFilterSection
                                        title="Ameaças nos Logos"
                                        description="Colidências nas imagens associadas de ocorrências encontradas com os Logos de marcas e produtos"
                                        verifiedThreatFilter={verifiedThreatFilter}
                                        setVerifiedThreatFilter={setVerifiedThreatFilter}
                                        notifiedThreatFilter={notifiedThreatFilter}
                                        setNotifiedThreatFilter={setNotifiedThreatFilter}
                                        setArchivingThreatFilter={setArchivingThreatFilter}
                                        archivingThreatFilter={archivingThreatFilter}
                                        setReloadFilter={setReloadFilter}
                                        reloadFilter={reloadFilter}
                                        logged={logged}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                    <CardContent>
                                        <ThreatTableLogoComparisons
                                            brandId={brandId}
                                            verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                            notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                            archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                            reloadFilter={reloadFilter}
                                            newThreat={NewThreat}
                                            logged={logged}
                                            data={dataLogoComparisons}
                                            count={countLogoComparisons}
                                            countResults={countResultsLogoComparisons}
                                            countAllThreats={countAllThreats}
                                            countAllAccesses={countAllAccesses}
                                            allThreats={allThreats}
                                            endDate={endDate}
                                            startDate={startDate}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>

                    <div className="hidden">
                        <PrintButton tabContainerIds={["tab-1-content"]} buttonText="📄 Exportar Relatório Completo" autoPrint={autoPrint} />
                    </div>

                    {/* Inicio da sessão de Print para o arquivo */}
                    {autoPrint && (
                        <div id="tab-1-content">
                            <div className="mb-6 mt-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-18 w-18 items-center justify-center rounded-xl bg-primary/10">
                                        <Shield className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">{assetName}</h1>
                                    </div>
                                </div>
                            </div>
                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças na Web"
                                    description="Menções e citações de marca e produto em sites, blogs e fóruns"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableGeneralWeb
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataGeneralWeb}
                                        count={countGeneralWeb}
                                        countResults={countResultsGeneralWeb}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças em Marktplaces"
                                    description="Menções e citações de marca e produto em marktplaces"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableMarketplaces
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataMarketplace}
                                        count={countMarketplace}
                                        countResults={countResultsMarketplace}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                        logoUrl={logoUrl}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças em Empresas"
                                    description="Menções e citações de marca e produto em cnpj de empresas"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableCompanies
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataCompanies}
                                        count={countCompanies}
                                        countResults={countResultsCompanies}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças em Domínios"
                                    description="Menções e citações de marca e produto em domínios"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableDomains
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataDomains}
                                        count={countDomains}
                                        countResults={countResultsDomains}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças em Redes Sociais"
                                    description="Menções e citações de marca e produto em Redes Sociais"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableSocialMedia
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataSocialMedia}
                                        count={countSocialMedia}
                                        countResults={countResultsSocialMedia}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-3">
                                <HeaderFilterSection
                                    title="Ameaças nos Logos"
                                    description="Colidências nas imagens associadas de ocorrências encontradas com os Logos de marcas e produtos"
                                    verifiedThreatFilter={verifiedThreatFilter}
                                    setVerifiedThreatFilter={setVerifiedThreatFilter}
                                    notifiedThreatFilter={notifiedThreatFilter}
                                    setNotifiedThreatFilter={setNotifiedThreatFilter}
                                    setArchivingThreatFilter={setArchivingThreatFilter}
                                    archivingThreatFilter={archivingThreatFilter}
                                    setReloadFilter={setReloadFilter}
                                    reloadFilter={reloadFilter}
                                    logged={logged}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    endDate={endDate}
                                    startDate={startDate}
                                />
                                <CardContent>
                                    <ThreatTableLogoComparisons
                                        brandId={brandId}
                                        verifiedThreatFilter={logged ? verifiedThreatFilter : "verified"}
                                        notifiedThreatFilter={logged ? notifiedThreatFilter : "all"}
                                        archivingThreatFilter={logged ? archivingThreatFilter : "unarchived"}
                                        reloadFilter={reloadFilter}
                                        newThreat={NewThreat}
                                        logged={logged}
                                        data={dataLogoComparisons}
                                        count={countLogoComparisons}
                                        countResults={countResultsLogoComparisons}
                                        countAllThreats={countAllThreats}
                                        countAllAccesses={countAllAccesses}
                                        allThreats={allThreats}
                                        endDate={endDate}
                                        startDate={startDate}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {/* Fim da sessão de Print para o arquivo */}
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-muted">
                    <div className="flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="mt-2 text-muted-foreground">A url foi alterada 😪</p>
                    </div>
                </div>
            )}
        </>
    );
}
