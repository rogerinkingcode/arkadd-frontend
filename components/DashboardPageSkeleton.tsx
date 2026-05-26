"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, ExternalLink, User2, Timer } from "lucide-react";

export default function DashboardPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header - Estático */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da proteção de seus ativos</p>
            </div>

            {/* Stats Cards - Apenas números em skeleton */}
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <p className="text-xs text-muted-foreground mt-1">Em monitoramento contínuo</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                        <User2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <p className="text-xs text-muted-foreground mt-1">Ativos no sistema</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ameaças Ativas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <p className="text-xs text-muted-foreground mt-1">Total de ameaças encontradas</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Threats - Dados dinâmicos em skeleton */}
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
                        <div className="space-y-4">
                            {/* Skeleton para 3 itens de ameaças */}
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex flex-col items-center gap-2 sm:items-start sm:flex-row sm:flex-wrap">
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                                        </div>
                                        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                                        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                            <div className="flex items-center justify-center gap-1">
                                                <Timer className="h-3 w-3 text-muted-foreground" />
                                                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" disabled>
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Threat Distribution - Dados dinâmicos em skeleton */}
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

                                return (
                                    <div key={type} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{labels[type as keyof typeof labels]}</span>
                                            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                                        </div>

                                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                            <div className="h-full w-0 bg-primary transition-all" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
