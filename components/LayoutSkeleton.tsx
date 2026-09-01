"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogoImg } from "./LogoImg";
import { navigation, upcomingFeatures } from "./sidebar-nav";
import { useT } from "@/lib/i18n/LanguageProvider";

/**
 * Larguras dos rótulos em skeleton. Variar imita a lista real — barras todas do mesmo
 * tamanho leem como tabela, não como menu.
 */
const LABEL_WIDTHS = ["w-24", "w-20", "w-16", "w-32", "w-24"];

type AppLayoutSkeletonProps = {
    children: React.ReactNode;
};

export function LayoutSkeleton({ children }: AppLayoutSkeletonProps) {
    const { t } = useT();
    const [collapsed, setCollapsed] = useState(false);

    // Mesma leitura do `app-layout`: sem ela, quem deixou a sidebar recolhida via o skeleton
    // largo e a barra saltava para 76px assim que os dados chegavam.
    useEffect(() => {
        const stored = localStorage.getItem("apex-sidebar-collapsed");
        if (stored === "true") setCollapsed(true);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* ===== Sidebar desktop ===== */}
            <aside className={cn("apex-sidebar hidden shrink-0 flex-col border-r border-white/5 lg:flex", collapsed ? "lg:w-[76px]" : "lg:w-64")}>
                {/* Logo — estático, não depende de resposta nenhuma */}
                <div className={cn("flex h-16 items-center border-b border-white/5", collapsed ? "justify-center px-2" : "px-5")}>
                    <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                            <LogoImg className="brightness-200" />
                        </div>
                        {!collapsed && <span className="text-lg font-extrabold tracking-tight text-white">ARKADD</span>}
                    </Link>
                </div>

                {/* Navegação — os itens ficam em skeleton porque a lista depende do papel: só o
                    `/me` diz se "Clientes" entra. Desenhá-los de verdade fazia o acesso de
                    cliente ver um item que sumia logo em seguida. */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item, index) => (
                        <div key={item.name} className={cn("flex items-center rounded-lg", collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5")}>
                            <div className="h-5 w-5 shrink-0 animate-pulse rounded bg-white/15" />
                            {!collapsed && <div className={cn("h-4 animate-pulse rounded bg-white/10", LABEL_WIDTHS[index % LABEL_WIDTHS.length])} />}
                        </div>
                    ))}

                    {/* ===== Funcionalidades em breve ===== */}
                    {/* Aqui nada espera resposta — é a mesma lista fixa da barra pronta, então
                        entra por inteiro e o bloco não "pula" quando os dados chegam. */}
                    <div className="pt-3">
                        <div className="mb-1 border-t border-white/5" />
                        {!collapsed && (
                            <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                <Sparkles className="h-3 w-3" />
                                {t("nav.comingSoon")}
                            </div>
                        )}

                        {upcomingFeatures.map((item) => (
                            <div key={item.name} aria-disabled="true" className={cn("relative flex cursor-default select-none items-center rounded-lg text-sm font-medium text-white/35", collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5")}>
                                <item.icon className="h-5 w-5 shrink-0" />
                                {collapsed ? (
                                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand/70" />
                                ) : (
                                    <>
                                        <span className="truncate">{t(item.labelKey)}</span>
                                        <span className="ml-auto shrink-0 rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">{t("nav.comingSoon")}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Usuário */}
                <div className="border-t border-white/5 p-3">
                    <div className={cn("flex items-center rounded-lg", collapsed ? "justify-center" : "gap-3 px-2 py-1.5")}>
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-white/10">
                                <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />
                            </AvatarFallback>
                        </Avatar>
                        {!collapsed && (
                            <div className="flex-1 space-y-1.5 overflow-hidden">
                                <div className="h-3.5 w-20 animate-pulse rounded bg-white/15" />
                                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ===== Conteúdo ===== */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/70 px-3 backdrop-blur-md lg:px-5">
                    {/* Recolher (desktop) */}
                    <Button variant="ghost" size="icon" className="hidden lg:flex" disabled>
                        <div className="h-5 w-5 animate-pulse rounded bg-muted" />
                    </Button>

                    {/* Menu mobile */}
                    <Button variant="ghost" size="icon" className="lg:hidden" disabled>
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logo mobile */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center">
                            <LogoImg className="brightness-75 dark:brightness-200" />
                        </div>
                        <span className="text-base font-extrabold tracking-tight">ARKADD</span>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-1 items-center justify-end gap-1">
                        {[0, 1, 2].map((i) => (
                            <Button key={i} variant="ghost" size="icon" disabled>
                                <div className="h-5 w-5 animate-pulse rounded bg-muted" />
                            </Button>
                        ))}
                        <Avatar className="ml-1 h-8 w-8">
                            <AvatarFallback className="bg-muted">
                                <div className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/30" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Conteúdo da página */}
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
