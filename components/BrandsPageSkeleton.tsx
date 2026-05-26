"use client";

import { Shield, Plus, Search, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BrandsPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ativos de Monitoramento</h1>
                        <p className="text-muted-foreground mt-1">Gerencie seus ativos de monitoramento</p>
                    </div>

                    <Button size="lg" className="w-full lg:w-auto lg:ml-auto" disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Ativo
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar ativo pelo nome..." className="pl-10 bg-card h-11" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
                        <Shield className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <p className="text-xs text-muted-foreground mt-3">Todos os ativos no geral</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Percentual por Tipo</CardTitle>
                        <Shield className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="flex items-center justify-start gap-6">
                        <div>
                            <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                            <p className="text-xs text-muted-foreground mt-3">Marca</p>
                        </div>
                        <div>
                            <ArrowLeftRight size={20} className="text-muted-foreground" />
                        </div>
                        <div>
                            <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                            <p className="text-xs text-muted-foreground mt-3">Produto</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ameaças</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <p className="text-xs text-muted-foreground mt-3">Ameaças de todos os Ativos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Skeleton */}
            <Card>
                <div className="border border-border rounded-lg overflow-hidden mt-4">
                    <Table className="border-b border-border">
                        <TableHeader className="bg-muted">
                            <TableRow className="h-13 border-t border-border">
                                <TableHead className="text-left pl-5">Nome</TableHead>
                                <TableHead className="text-left">Tipo</TableHead>
                                <TableHead className="text-center">Ameaças</TableHead>
                                <TableHead className="text-center">Parceiros</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right pr-5">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium pl-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted animate-pulse">
                                                <div className="h-6 w-6 rounded bg-muted-foreground/40" />
                                            </div>
                                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="h-5 w-8 animate-pulse rounded bg-muted mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="h-5 w-8 animate-pulse rounded bg-muted mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="h-5 w-12 animate-pulse rounded bg-muted mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-right pr-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                                            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                                            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                                            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
