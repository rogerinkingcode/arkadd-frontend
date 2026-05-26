"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Building2, Globe2, Instagram, ShoppingBag, ImageIcon, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BrandThreatPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header Section - Estático com Skeleton */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Logo/Imagem Skeleton */}
                    <div className="flex w-30 aspect-square items-center justify-center rounded-xl bg-muted animate-pulse">
                        <Shield className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div>
                        {/* Botão Voltar Skeleton */}
                        <Button variant="outline" className="mb-2" disabled>
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para Ativos
                        </Button>
                        {/* Título Skeleton */}
                        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="web" className="space-y-6">
                {/* Versão Desktop */}
                <div className="hidden lg:block">
                    <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6">
                        <TabsTrigger value="web" className="text-xs sm:text-sm" disabled>
                            <Globe2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Web</span>
                            <span className="sm:hidden">Web</span>
                        </TabsTrigger>
                        <TabsTrigger value="marketplace" className="text-xs sm:text-sm" disabled>
                            <ShoppingBag className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Marketplaces</span>
                            <span className="sm:hidden">Market</span>
                        </TabsTrigger>
                        <TabsTrigger value="company" className="text-xs sm:text-sm" disabled>
                            <Building2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Empresas</span>
                            <span className="sm:hidden">Emp.</span>
                        </TabsTrigger>
                        <TabsTrigger value="domain" className="text-xs sm:text-sm" disabled>
                            <Globe2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Domínios</span>
                            <span className="sm:hidden">Dom.</span>
                        </TabsTrigger>
                        <TabsTrigger value="social" className="text-xs sm:text-sm" disabled>
                            <Instagram className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Redes Sociais</span>
                            <span className="sm:hidden">Social</span>
                        </TabsTrigger>
                        <TabsTrigger value="logo" className="text-xs sm:text-sm" disabled>
                            <ImageIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Logos</span>
                            <span className="sm:hidden">Logos</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Versão Mobile */}
                <div className="lg:hidden">
                    <div className="overflow-x-auto whitespace-nowrap scrollbar-hide gap-3 min-h-[7rem] bg-transparent pl-80 sm:pl-0 w-full">
                        <div className="flex gap-3">
                            {["web", "marketplace", "company", "domain", "social", "logo"].map((tab) => (
                                <div key={tab} className="shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] flex-shrink-0 w-[45vw] min-w-25 h-22 flex flex-col items-center justify-center p-0 rounded-lg border bg-muted">
                                    {tab === "web" && <Globe2 className="!h-8 !w-8 text-muted-foreground" />}
                                    {tab === "marketplace" && <ShoppingBag className="!h-8 !w-8 text-muted-foreground" />}
                                    {tab === "company" && <Building2 className="!h-8 !w-8 text-muted-foreground" />}
                                    {tab === "domain" && <Globe2 className="!h-8 !w-8 text-muted-foreground" />}
                                    {tab === "social" && <Instagram className="!h-8 !w-8 text-muted-foreground" />}
                                    {tab === "logo" && <ImageIcon className="!h-8 !w-8 text-muted-foreground" />}
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {tab === "web" && "Web"}
                                        {tab === "marketplace" && "Market"}
                                        {tab === "company" && "Emp."}
                                        {tab === "domain" && "Dom."}
                                        {tab === "social" && "Social"}
                                        {tab === "logo" && "Logos"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Conteúdo Skeleton para Web */}
                <TabsContent value="web">
                    <Card>
                        <CardHeader className="mb-4 mt-2">
                            <CardTitle>
                                <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                            </CardTitle>
                            <CardDescription>
                                <div className="h-4 w-96 animate-pulse rounded bg-muted" />
                            </CardDescription>
                        </CardHeader>

                        {/* Filtros Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 px-6 mt-4 w-full">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="text-center">
                                    <div className="h-4 w-16 animate-pulse rounded bg-muted mx-auto mb-2" />
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <CardContent className="mt-4">
                            {/* Stats Cards Skeleton */}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8">
                                {[...Array(3)].map((_, index) => (
                                    <Card key={index}>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                                            <div className="h-3 w-32 animate-pulse rounded bg-muted mt-2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Table Skeleton */}
                            <div className="border border-border rounded-lg overflow-hidden mt-4">
                                <Table className="border-b border-l border-r rounded-lg border-border">
                                    <TableHeader className="bg-muted">
                                        <TableRow className="h-13 border-t border-border">
                                            <TableHead className="text-left pl-5">Imagem</TableHead>
                                            <TableHead className="text-left pl-5">Plataforma</TableHead>
                                            <TableHead className="text-center">Análise</TableHead>
                                            <TableHead className="text-center">Detectado em</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-right pr-5">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(5)].map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium pl-5">
                                                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="h-6 w-28 animate-pulse rounded bg-muted mx-auto" />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="h-5 w-24 animate-pulse rounded bg-muted mx-auto" />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="h-6 w-20 animate-pulse rounded bg-muted mx-auto" />
                                                </TableCell>
                                                <TableCell className="text-right pr-5">
                                                    <div className="h-8 w-20 animate-pulse rounded bg-muted ml-auto" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Skeleton */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="h-10 w-10 animate-pulse rounded bg-muted" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
