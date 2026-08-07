"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, User, Globe, Save, LockKeyhole } from "lucide-react";

/**
 * A barra de abas é imitada com `div`, e não com o `Tabs` do Radix.
 *
 * O Radix gera ids via `useId`, e o id codifica a posição do componente na árvore. Este
 * skeleton é renderizado em dois lugares diferentes conforme o estado (dentro do
 * `LayoutSkeleton` enquanto o layout carrega, e dentro do `<main>` depois, enquanto a página
 * carrega), então servidor e cliente chegavam nele por caminhos distintos e produziam ids
 * diferentes — o que quebrava a hidratação ao dar F5 em `/settings`.
 *
 * Aqui não se perde nada: as abas do skeleton já eram `disabled` e nunca respondiam a clique.
 */
// As classes são as mesmas que `Tabs`/`TabsList`/`TabsTrigger` aplicavam, já resolvidas: o
// `cn()` daqueles componentes passava por `twMerge`, que descartava o conflito de `display`
// (`inline-flex` perdia para `grid`) e de `gap` (`gap-1.5` perdia para `gap-2`). Concatenando
// string crua isso não acontece, então as perdedoras saem daqui.
const TAB_LIST_CLASS = "bg-muted text-muted-foreground grid h-9 w-full grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center justify-center rounded-lg p-[3px]";
const TAB_CLASS = "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap opacity-50";
const TAB_ACTIVE_CLASS = "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm";

export default function SettingsPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header - Estático */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema e da sua conta</p>
            </div>

            <div className="flex flex-col gap-2 space-y-6">
                <div className={TAB_LIST_CLASS} aria-hidden="true">
                    <div className={`${TAB_CLASS} ${TAB_ACTIVE_CLASS}`}>
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Conta</span>
                        <span className="sm:hidden">Conta</span>
                    </div>
                    <div className={TAB_CLASS}>
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Segurança</span>
                        <span className="sm:hidden">Segur.</span>
                    </div>
                    <div className={TAB_CLASS}>
                        <LockKeyhole className="h-4 w-4" />
                        <span className="hidden sm:inline">Credênciais</span>
                        <span className="sm:hidden">Credên</span>
                    </div>
                    <div className={TAB_CLASS}>
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Monitoramento</span>
                        <span className="sm:hidden">Monitor</span>
                    </div>
                </div>

                {/* Só o painel da aba ativa. Os outros três eram renderizados e escondidos pelo
                    Radix — invisíveis, mas ocupando DOM. */}
                <div className="flex-1 outline-none space-y-6">
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
                </div>
            </div>
        </div>
    );
}
