"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Menu, Users, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Ativos", href: "/brands", icon: Shield },
    { name: "Image Scraper", href: "/image-scraper", icon: ImageIcon },
];

type AppLayoutSkeletonProps = {
    children: React.ReactNode;
};

export function LayoutSkeleton({ children }: AppLayoutSkeletonProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* ===== Sidebar desktop ===== */}
            <aside className="apex-sidebar hidden shrink-0 flex-col border-r border-white/5 lg:flex lg:w-64">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-white/5 px-5">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                            <img src="logo.png" alt="Logo" className="h-full w-full object-contain brightness-200" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-white">ARKADD</span>
                    </Link>
                </div>

                {/* Navegação */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} className={cn("relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all", isActive ? "bg-brand/15 text-brand" : "text-white/65 hover:bg-white/5 hover:text-white")}>
                                {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />}
                                <item.icon className="h-5 w-5 shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Usuário */}
                <div className="border-t border-white/5 p-3">
                    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-white/10">
                                <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1.5 overflow-hidden">
                            <div className="h-3.5 w-20 animate-pulse rounded bg-white/15" />
                            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                        </div>
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
                            <img src="logo.png" alt="Logo" className="h-full w-full object-contain brightness-75 dark:brightness-200" />
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
