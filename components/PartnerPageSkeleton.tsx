"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, ArrowLeft } from "lucide-react";

export default function PartnerPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header Section - Estático */}
            <div className="mb-8 flex items-center justify-between">
                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <Button variant="ghost" className="mb-4" disabled>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para os ativos
                        </Button>

                        <div className="flex flex-col md:flex-row items-center gap-4 -mt-3">
                            <div className="flex h-16 w-16 items-center justify-center">
                                <div className="flex w-16 aspect-square items-center justify-center rounded-xl bg-muted animate-pulse">
                                    <div className="h-10 w-10 rounded bg-muted-foreground/40" />
                                </div>
                            </div>
                            <div>
                                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-32 animate-pulse rounded bg-muted mt-2" />
                            </div>
                        </div>
                    </div>
                    <Button size="lg" className="w-full lg:w-auto lg:ml-auto" disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Parceiro
                    </Button>
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar parceiro pelo nome..." className="pl-10 bg-card h-11" disabled />
                </div>
            </div>

            {/* Table Skeleton */}
            <Card>
                <div className="border border-border rounded-lg overflow-hidden mt-4">
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
                            {[...Array(4)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium pl-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted animate-pulse">
                                                <div className="h-5 w-5 rounded bg-muted-foreground/40" />
                                            </div>
                                            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                    <TableCell className="text-right pr-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                                            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
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
