"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, SlidersHorizontal, Globe, ShoppingCart, Building2, Network, Share2, ScanSearch, ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { IClientServices } from "@/lib/types";

type ClientServicesPageProps = {
    pageSkeleton: React.ReactNode;
};

/** Catálogo de serviços que a plataforma oferece e que o cliente pode contratar. */
const SERVICES: { key: keyof IClientServices; title: string; description: string; icon: React.ComponentType<{ className?: string }>; iconBg: string }[] = [
    { key: "webMonitoring", title: "Monitoramento da Web", description: "Sites em geral na web, citações em portais, blogs, sites e etc...", icon: Globe, iconBg: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
    { key: "marketplacesMonitoring", title: "Monitoramento de Marketplaces", description: "Mercado Livre, Amazon, Shopee, Aliexpress.", icon: ShoppingCart, iconBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
    { key: "companiesMonitoring", title: "Monitoramento de Empresas", description: "CNPJs de empresas na junta comercial.", icon: Building2, iconBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { key: "domainsMonitoring", title: "Monitoramento de Domínios", description: "Domínios registrados.", icon: Network, iconBg: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
    { key: "socialMediaMonitoring", title: "Monitoramento de Redes Sociais", description: "Instagram, Linkedin, Tiktok, Facebook.", icon: Share2, iconBg: "bg-pink-500/15 text-pink-700 dark:text-pink-300" },
    { key: "logoComparisonMonitoring", title: "Monitoramento de Comparação de Logos", description: "Análise comparativa das imagens obtidas durante o processo de monitoramento das frentes em vigor.", icon: ScanSearch, iconBg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
    { key: "reverseImageSearchMonitoring", title: "Pesquisa Reversa de Imagem", description: "Busca reversa das imagens da marca nos motores de busca de imagem do Google e do Bing.", icon: ImageIcon, iconBg: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
];

const DEFAULT_SERVICES: IClientServices = {
    webMonitoring: false,
    marketplacesMonitoring: false,
    companiesMonitoring: false,
    domainsMonitoring: false,
    socialMediaMonitoring: false,
    logoComparisonMonitoring: false,
    reverseImageSearchMonitoring: false,
};

export default function ClientServicesPage({ pageSkeleton }: ClientServicesPageProps) {
    const params = useParams<{ clientId: string }>();
    const router = useRouter();
    const clientId = params?.clientId;

    const [services, setServices] = useState<IClientServices>(DEFAULT_SERVICES);
    const [initialServices, setInitialServices] = useState<IClientServices>(DEFAULT_SERVICES);
    const [clientName, setClientName] = useState("");
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [saving, setSaving] = useState(false);

    const { makeRequest } = useFetch();

    /** Carrega a configuração de serviços atual do cliente */
    useEffect(() => {
        async function load() {
            if (!clientId) return;

            const response = await makeRequest("get", `/client-services/${clientId}`);

            if (response?.status === 200) {
                setServices(response.services);
                setInitialServices(response.services);
                setClientName(response.client?.companyName ?? "");
            } else if (response?.status === 404) {
                toast.error("Cliente não encontrado", { description: "Selecione um cliente válido." });
                router.push("/clients");
                return;
            } else {
                toast.error("Erro ao carregar", { description: "Não foi possível carregar a configuração de serviços." });
            }

            setInitialLoaded(true);
        }

        load();
    }, [clientId]);

    const activeCount = SERVICES.filter((s) => services[s.key]).length;
    const hasChanges = JSON.stringify(services) !== JSON.stringify(initialServices);

    /** Alterna um serviço individual */
    const toggleService = (key: keyof IClientServices) => {
        setServices((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    /** Ativa ou desativa todos os serviços de uma vez */
    const setAll = (value: boolean) => {
        setServices({
            webMonitoring: value,
            marketplacesMonitoring: value,
            companiesMonitoring: value,
            domainsMonitoring: value,
            socialMediaMonitoring: value,
            logoComparisonMonitoring: value,
            reverseImageSearchMonitoring: value,
        });
    };

    /** Persiste a configuração de serviços */
    const handleSave = async () => {
        if (!clientId) return;

        setSaving(true);

        const response = await makeRequest("put", `/client-services/${clientId}`, services);

        if (response?.status === 200) {
            toast.success("Serviços salvos", { description: "A configuração de serviços do cliente foi atualizada com sucesso." });
            setServices(response.services);
            setInitialServices(response.services);
        } else if (response?.status === 404) {
            toast.error("Cliente não encontrado", { description: "Selecione um cliente válido." });
        } else {
            toast.error("Erro ao salvar", { description: "Tente novamente mais tarde." });
        }

        setSaving(false);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Voltar */}
            <Button variant="ghost" onClick={() => router.push("/clients")} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para clientes
            </Button>

            {/* Cabeçalho */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <SlidersHorizontal className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configuração de Serviços</h1>
                    <p className="text-muted-foreground mt-1">
                        {clientName && <span className="font-medium text-foreground">{clientName}</span>}
                        {clientName && " · "}
                        {activeCount} de {SERVICES.length} serviços ativos
                    </p>
                </div>
            </div>

            {/* Barra de ações */}
            <Card className="p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setAll(true)} disabled={activeCount === SERVICES.length}>
                            Ativar todos
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setAll(false)} disabled={activeCount === 0}>
                            Desativar todos
                        </Button>
                        {hasChanges && <Badge className="ml-1 border-transparent bg-warning/15 text-warning hover:bg-warning/15">Alterações não salvas</Badge>}
                    </div>
                    <Button onClick={handleSave} disabled={saving || !hasChanges}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                Salvar alterações
                                <Save className="h-4 w-4" />
                            </div>
                        )}
                    </Button>
                </div>
            </Card>

            <p className="text-sm text-muted-foreground mb-4">Selecione abaixo os serviços que este cliente deseja contratar da plataforma. Clique em um cartão para ativar ou desativar o serviço.</p>

            {/* Grade de serviços */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {SERVICES.map((service) => {
                    const Icon = service.icon;
                    const active = services[service.key];

                    return (
                        <div
                            key={service.key}
                            role="button"
                            tabIndex={0}
                            aria-pressed={active}
                            onClick={() => toggleService(service.key)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleService(service.key);
                                }
                            }}
                            className={`group cursor-pointer rounded-xl border p-5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-border hover:shadow-sm"}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${service.iconBg}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold leading-tight">{service.title}</h3>
                                        <Switch checked={active} onCheckedChange={() => {}} className="pointer-events-none mt-0.5 shrink-0" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                    <div className="mt-3">
                                        {active ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Ativo
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-muted-foreground">Inativo</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Salvar (rodapé) */}
            <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={handleSave} disabled={saving || !hasChanges}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            Salvar alterações
                            <Save className="h-4 w-4" />
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}
