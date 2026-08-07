"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, ShieldCheck, UserPlus, Users2 } from "lucide-react";

export default function UsersPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Cabeçalho — estático, não depende de resposta */}
            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Usuários do sistema</h1>
                    <p className="text-sm text-muted-foreground">Cada usuário é uma operação independente — com os próprios clientes, ativos e acessos. Nenhum enxerga os dados do outro.</p>
                </div>
            </div>

            {/* Cadastro — o formulário é estático; só fica desabilitado enquanto carrega */}
            <Card className="mb-6 p-5">
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label>E-mail</Label>
                            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label>Senha inicial</Label>
                            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button disabled>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar usuário
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Lista */}
            <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Avatar className="h-11 w-11 shrink-0">
                                <AvatarFallback className="bg-muted">
                                    <div className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/30" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                                <div className="h-3.5 w-56 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4" />
                                    <div className="h-3.5 w-16 animate-pulse rounded bg-muted" />
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4" />
                                    <div className="h-3.5 w-14 animate-pulse rounded bg-muted" />
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
