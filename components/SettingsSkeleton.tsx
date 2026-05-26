"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Globe, Save, ChevronDown, LockKeyhole } from "lucide-react";

export default function SettingsPageSkeleton() {
    const objects = ["Redes Sociais", "Marketplaces", "Web geral", "Colidência em logos e imagens"];

    return (
        <div className="p-6 lg:p-8">
            {/* Header - Estático */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema e da sua conta</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="w-full grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                    <TabsTrigger value="account" className="gap-2" disabled>
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Conta</span>
                        <span className="sm:hidden">Conta</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2" disabled>
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Segurança</span>
                        <span className="sm:hidden">Segur.</span>
                    </TabsTrigger>
                    <TabsTrigger value="credentials" className="gap-2" disabled>
                        <LockKeyhole className="h-4 w-4" />
                        <span className="hidden sm:inline">Credênciais</span>
                        <span className="sm:hidden">Credên</span>
                    </TabsTrigger>
                    <TabsTrigger value="monitoring" className="gap-2" disabled>
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Monitoramento</span>
                        <span className="sm:hidden">Monitor</span>
                    </TabsTrigger>
                </TabsList>

                {/* Account Tab Skeleton */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader className="mb-4">
                            <CardTitle>Informações da Conta</CardTitle>
                            <CardDescription>Atualize suas informações pessoais</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nome Completo</Label>
                                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                </div>

                                <Button disabled className="w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        <Save className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab Skeleton */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader className="mb-4">
                            <CardTitle>Alterar Senha</CardTitle>
                            <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nova Senha</Label>
                                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                </div>
                                <Button disabled className="w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        <Save className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Credentials Tab Skeleton */}
                <TabsContent value="credentials" className="space-y-6">
                    <Card>
                        <CardHeader className="mb-4">
                            <CardTitle>Credênciais de API</CardTitle>
                            <CardDescription>Suas credênciais de API para funcionamento</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                {["ApiKey Groq", "ApiKey Cnpja", "ApiKey Google Search", "ID do monitor de Rede Social", "ID do monitor de Marketplaces", "ID do monitor da Web"].map((label, index) => (
                                    <div key={index} className="space-y-2">
                                        <Label>{label}</Label>
                                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                    </div>
                                ))}
                                <Button disabled className="w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        <Save className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Monitoring Tab Skeleton */}
                <TabsContent value="monitoring" className="space-y-6">
                    <Card>
                        <CardHeader className="mb-4">
                            <CardTitle>Fluxo de Monitoramento</CardTitle>
                            <CardDescription>Ajuste a frequência do fluxo de monitoramento no sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="">
                            <div className="space-y-4">
                                {/* Domínios Skeleton */}
                                <div>
                                    <Label className="mb-2 ml-4">Domínios</Label>
                                    <div className="mb-3">
                                        <div className="flex w-full items-center justify-center">
                                            <details className="w-full">
                                                <summary className="list-none cursor-pointer">
                                                    <div className="flex items-center justify-between border border-b-1 rounded-t-lg px-4 py-2 hover:text-foreground w-full">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-10 w-40 animate-pulse rounded bg-muted" />
                                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </summary>
                                                <div className="border border-t-0 rounded-b-lg bg-muted overflow-hidden">
                                                    <div className="p-4">
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>

                                {/* Empresas Skeleton */}
                                <div>
                                    <Label className="mb-2 ml-4">Empresas</Label>
                                    <div className="mb-3">
                                        <div className="flex w-full items-center justify-center">
                                            <details className="w-full">
                                                <summary className="list-none cursor-pointer">
                                                    <div className="flex items-center justify-between border border-b-1 rounded-t-lg px-4 py-2 hover:text-foreground w-full">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-10 w-40 animate-pulse rounded bg-muted" />
                                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </summary>
                                                <div className="border border-t-0 rounded-b-lg bg-muted overflow-hidden">
                                                    <div className="p-4">
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>

                                {/* Objetos fixos Skeleton */}
                                {objects.map((day, index) => (
                                    <div key={index}>
                                        <Label className="mb-2 ml-4">{day}</Label>
                                        <div className="mb-3">
                                            <div className="flex w-full items-center justify-center">
                                                <details className="w-full">
                                                    <summary className="list-none cursor-pointer">
                                                        <div className="flex items-center justify-between border border-b-1 rounded-t-lg px-4 py-2 hover:text-foreground w-full">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-10 w-40 animate-pulse rounded bg-muted" />
                                                                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                            </div>
                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </summary>
                                                    <div className="border border-t-0 rounded-b-lg bg-muted overflow-hidden">
                                                        <div className="p-4">
                                                            <div className="grid grid-cols-2 gap-8">
                                                                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button disabled className="w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        <Save className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
