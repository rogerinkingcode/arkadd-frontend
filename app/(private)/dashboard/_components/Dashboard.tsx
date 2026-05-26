"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, ExternalLink, User2, Timer } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { IBrand, IDashboard } from "@/lib/types";
import Link from "next/link";

type DashboardPageProps = {
    pageSkeleton: React.ReactNode;
};

export default function DashboardPage({ pageSkeleton }: DashboardPageProps) {
    const [dataBrand, setDataBrand] = useState<IBrand[]>();
    const [data, setData] = useState<IDashboard>();
    const [totalThreats, setTotalThreats] = useState<number>();
    const { makeRequest } = useFetch();

    /** Busca informações para o Dashboard */
    useEffect(() => {
        async function getDashboard() {
            const response = await makeRequest("get", `/read-dashboard`);

            setTotalThreats(response.data.totalThreats);
            setDataBrand(response.data.data.brand);
            setData(response.data.data);
        }

        getDashboard();
    }, []);

    return (
        <>
            {data ? (
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Visão geral da proteção de seus ativos</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8">
                        <Card className="transition-colors hover:border-primary/40">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ativos</CardTitle>
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?._count.brand}</div>
                                <p className="text-xs text-muted-foreground">Em monitoramento contínuo</p>
                            </CardContent>
                        </Card>

                        <Card className="transition-colors hover:border-primary/40">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <User2 className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?._count.client}</div>
                                <p className="text-xs text-muted-foreground">Ativos no sistema</p>
                            </CardContent>
                        </Card>

                        <Card className="transition-colors hover:border-destructive/40">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Ameaças Ativas</CardTitle>
                                <div className="rounded-lg bg-destructive/10 p-2">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{totalThreats}</div>
                                <p className="text-xs text-muted-foreground">Total de ameaças encontradas</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Threats */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Ativos com Ameaças</CardTitle>
                                        <CardDescription className="mt-2">Alguns ativos já com detecções de ameaças no sistema de monitoramento</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="max-h-190 overflow-y-auto">
                                {dataBrand?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">Nenhuma ameaça detectada</p>
                                        <p className="text-sm text-muted-foreground">Seus ativos estão protegidos</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {dataBrand?.map((threat, index) => (
                                            <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex flex-col items-center gap-2 sm:items-start sm:flex-row sm:flex-wrap">
                                                        <Badge variant="outline" className="border-sky-500/25 bg-sky-500/15 text-sky-700 dark:text-sky-300">{threat?.domains?.length} Domínios</Badge>
                                                        <Badge variant="outline" className="border-indigo-500/25 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">{threat?.companies?.length} Empresas</Badge>
                                                        <Badge variant="outline" className="border-violet-500/25 bg-violet-500/15 text-violet-700 dark:text-violet-300">{threat?.socialMedia?.length} R. Sociais</Badge>
                                                        <Badge variant="outline" className="border-amber-500/25 bg-amber-500/15 text-amber-700 dark:text-amber-300">{threat?.marketplaces?.length} Marketplaces</Badge>
                                                        <Badge variant="outline" className="border-teal-500/25 bg-teal-500/15 text-teal-700 dark:text-teal-300">{threat?.generalWeb?.length} Web</Badge>
                                                        <Badge variant="outline" className="border-rose-500/25 bg-rose-500/15 text-rose-700 dark:text-rose-300">{threat?.logoComparisons?.length} Logos</Badge>
                                                    </div>
                                                    <h4 className="font-medium">{threat?.name}</h4>
                                                    <Badge variant="secondary">{threat.assetType === "product" ? "Produto" : "Marca"}</Badge>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center justify-center gap-1">
                                                            <Timer className="h-3 w-3" />
                                                            <span>{new Date(threat.createdAt).toLocaleString("pt-BR")}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`brands/${threat.id}?NewThreat=0&Source=web`}>
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Threat Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição geral de Ameaças</CardTitle>
                                <CardDescription>Por tipo de detecção</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {["domains", "companies", "socialMedia", "marketplaces", "generalWeb", "logoComparisons"].map((type) => {
                                        const labels = {
                                            domains: "Domínios",
                                            companies: "Empresas",
                                            socialMedia: "Social Media",
                                            marketplaces: "Marketplaces",
                                            generalWeb: "Web geral",
                                            logoComparisons: "Logos Similares",
                                        };

                                        const count = data?._count?.[type as keyof typeof data._count] ?? 0;

                                        const percentage = Math.round((count / (totalThreats || 1)) * 100);

                                        return (
                                            <div key={type} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">{labels[type as keyof typeof labels]}</span>
                                                    <span className="font-medium">{percentage || 0}%</span>
                                                </div>

                                                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                                    <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                pageSkeleton
            )}
        </>
    );
}
