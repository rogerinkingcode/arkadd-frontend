"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Bell, Settings, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { INotice } from "@/lib/types";
import { IUserToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LayoutSkeleton } from "./LayoutSkeleton";
import { LogoImg } from "./LogoImg";
import { navigation, upcomingFeatures } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useT } from "@/lib/i18n/LanguageProvider";

/** Só o que o cabeçalho e a sidebar realmente consomem — no acesso de cliente não há perfil
 *  de tenant para carregar, então exigir o `IUser` inteiro aqui seria pedir o que não existe. */
type HeaderProfile = {
    fullName?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    notices?: INotice[];
};

type AppLayoutProps = {
    children: React.ReactNode;
    pageSkeleton: React.ReactNode;
};

export function AppLayout({ children, pageSkeleton }: AppLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean | undefined>(undefined);
    const [collapsed, setCollapsed] = useState(false);
    const [data, setData] = useState<HeaderProfile>();
    const [session, setSession] = useState<IUserToken>();
    const [deletingNoticeId, setDeletingNoticeId] = useState<string | null>(null);
    const { makeRequest } = useFetch();

    useEffect(() => {
        async function getLoggedUser() {
            // `/me` responde para qualquer sessão e diz o papel; `/user` é o perfil do tenant e
            // é restrito ao dono. Sem essa separação, a tela de um cliente ficaria presa no
            // skeleton esperando uma resposta que nunca vem.
            const me = await makeRequest("get", "/me");
            const identity: IUserToken | undefined = me?.user;

            setSession(identity);
            setMobileMenuOpen(false);

            if (identity?.role === "owner") {
                const response = await makeRequest("get", "/user");
                setData(response);
                return;
            }

            // No acesso de cliente o cabeçalho se identifica pela empresa; não há perfil de
            // tenant nem avisos a carregar.
            setData({ fullName: identity?.companyName ?? identity?.email, email: identity?.email, notices: [] });
        }
        getLoggedUser();
    }, []);

    const { t } = useT();
    const isOwner = session?.role === "owner";
    const isMasterAdmin = Boolean(session?.isMasterAdmin);
    const visibleNavigation = navigation.filter((item) => (!item.ownerOnly || isOwner) && (!item.masterOnly || isMasterAdmin));

    // Restaura o estado recolhido/expandido da sidebar salvo na sessão anterior
    useEffect(() => {
        const stored = localStorage.getItem("apex-sidebar-collapsed");
        if (stored === "true") setCollapsed(true);
    }, []);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("apex-sidebar-collapsed", String(next));
            return next;
        });
    };

    const handleLogout = async () => {
        const result = await makeRequest("post", "/logout");

        if (result) {
            router.push("/login");
        }
    };

    /**
     * Apaga um aviso pelo "x" do próprio card.
     *
     * A remoção é otimista: o card sai na hora e volta se a requisição falhar. Esperar a
     * resposta com a caixinha aberta deixaria o clique sem efeito visível por um instante —
     * e a lista some da tela junto com o dropdown se o usuário desistir de esperar.
     */
    const handleDeleteNotice = async (id: string) => {
        const previous = data?.notices ?? [];

        setDeletingNoticeId(id);
        setData((current) => (current ? { ...current, notices: (current.notices ?? []).filter((n) => n.id !== id) } : current));

        const response = await makeRequest("delete", `/notices/${id}`);

        setDeletingNoticeId(null);

        if (response?.status === 200) return;

        setData((current) => (current ? { ...current, notices: previous } : current));
        toast.error("Não foi possível remover o aviso", { description: response?.message ?? "Tente novamente." });
    };

    const noticesCount = data?.notices?.length ?? 0;

    return (
        <>
            {data ? (
                <div className="flex h-screen overflow-hidden bg-background">
                    {/* ===== Sidebar desktop (retrátil) ===== */}
                    <aside className={cn("apex-sidebar hidden shrink-0 flex-col border-r border-white/5 transition-[width] duration-300 ease-in-out lg:flex", collapsed ? "lg:w-[76px]" : "lg:w-64")}>
                        {/* Logo */}
                        <div className={cn("flex h-16 items-center border-b border-white/5", collapsed ? "justify-center px-2" : "px-5")}>
                            <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                    <LogoImg className="brightness-200" />
                                </div>
                                {!collapsed && <span className="text-lg font-extrabold tracking-tight text-white">ARKADD</span>}
                            </Link>
                        </div>

                        {/* Navegação */}
                        <nav className="flex-1 space-y-1 px-3 py-4">
                            {visibleNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                const link = (
                                    <Link href={item.href} className={cn("group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200", collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5", isActive ? "bg-brand/15 text-brand" : "text-white/65 hover:bg-white/5 hover:text-white")}>
                                        {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />}
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
                                    </Link>
                                );

                                return collapsed ? (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                                        <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div key={item.name}>{link}</div>
                                );
                            })}

                            {/* ===== Funcionalidades em breve (apenas visual) ===== */}
                            <div className="pt-3">
                                <div className="mb-1 border-t border-white/5" />
                                {!collapsed && (
                                    <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                        <Sparkles className="h-3 w-3" />
                                        {t("nav.comingSoon")}
                                    </div>
                                )}

                                {upcomingFeatures.map((item) => {
                                    const upcoming = (
                                        <div aria-disabled="true" className={cn("group relative flex cursor-default select-none items-center rounded-lg text-sm font-medium text-white/35", collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5")}>
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
                                    );

                                    return collapsed ? (
                                        <Tooltip key={item.name}>
                                            <TooltipTrigger asChild>{upcoming}</TooltipTrigger>
                                            <TooltipContent side="right">
                                                {t(item.labelKey)} — {t("nav.comingSoon")}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <div key={item.name}>{upcoming}</div>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Usuário */}
                        <div className="border-t border-white/5 p-3">
                            <div className={cn("flex items-center rounded-lg", collapsed ? "justify-center" : "gap-3 px-2 py-1.5")}>
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarImage src={data?.avatarUrl ?? undefined} alt="Imagem de perfil" />
                                    <AvatarFallback className="bg-brand/20 text-sm font-semibold text-brand ring-1 ring-brand/30">{data?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-sm font-semibold text-white">{isOwner ? "Administrador" : (session?.companyName ?? "Cliente")}</p>
                                        <p className="truncate text-xs text-white/50">{data?.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* ===== Conteúdo ===== */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Top bar */}
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/70 px-3 backdrop-blur-md lg:px-5">
                            {/* Recolher/expandir (desktop) */}
                            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden lg:flex" aria-label="Recolher ou expandir menu">
                                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                            </Button>

                            {/* Menu mobile */}
                            <Sheet open={mobileMenuOpen ?? false} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="apex-sidebar w-64 border-white/5 p-0 text-white">
                                    <SheetHeader>
                                        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                            <LogoImg className="brightness-200" />
                                        </div>
                                        <span className="text-lg font-extrabold tracking-tight text-white">ARKADD</span>
                                    </div>

                                    <nav className="space-y-1 px-3 py-4">
                                        {visibleNavigation.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn("relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all", isActive ? "bg-brand/15 text-brand" : "text-white/65 hover:bg-white/5 hover:text-white")}>
                                                    {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />}
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                    {t(item.labelKey)}
                                                </Link>
                                            );
                                        })}

                                        {/* ===== Funcionalidades em breve (apenas visual) ===== */}
                                        <div className="mt-1 border-t border-white/5 pt-3">
                                            <div className="flex items-center gap-1.5 px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                                <Sparkles className="h-3 w-3" />
                                                {t("nav.comingSoon")}
                                            </div>
                                            {upcomingFeatures.map((item) => (
                                                <div key={item.name} aria-disabled="true" className="relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/35">
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                    <span className="truncate">{t(item.labelKey)}</span>
                                                    <span className="ml-auto shrink-0 rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">{t("nav.comingSoon")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </nav>
                                </SheetContent>
                            </Sheet>

                            {/* Logo mobile */}
                            <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                                <div className="flex h-9 w-9 items-center justify-center">
                                    <LogoImg className="brightness-75 dark:brightness-200" />
                                </div>
                                <span className="text-base font-extrabold tracking-tight">ARKADD</span>
                            </Link>

                            {/* Ações */}
                            <div className="flex flex-1 items-center justify-end gap-1">
                                <LanguageToggle />
                                <ThemeToggle />

                                {/* Notificações — os avisos dos rastreios são do dono */}
                                {isOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            {/* Wrapper relative + badge irmã do Button — o Button tem `overflow-hidden`
                                            (por causa do pulse animation) e recortaria a bolinha se ela estivesse dentro. */}
                                            <span className="relative inline-flex">
                                                <Button variant="ghost" size="icon" aria-label="Notificações">
                                                    <Bell className="h-5 w-5" />
                                                </Button>
                                                {noticesCount > 0 && (
                                                    <Badge className="pointer-events-none absolute -right-1 -top-1 z-10 h-5 min-w-5 justify-center rounded-full p-0 px-1 text-xs leading-none" variant="destructive">
                                                        {noticesCount}
                                                    </Badge>
                                                )}
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[92vw] max-w-sm sm:w-96">
                                            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <div className="max-h-80 overflow-y-auto">
                                                {noticesCount === 0 ? (
                                                    <div className="py-8 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
                                                ) : (
                                                    data?.notices?.map((notif) => (
                                                        // `onSelect` barrado: o card não leva a lugar nenhum, e sem isso
                                                        // qualquer clique dentro dele — inclusive no "x" — fecharia a caixinha.
                                                        <DropdownMenuItem key={notif.id} onSelect={(event) => event.preventDefault()} className="flex-col items-start gap-1 py-3">
                                                            <div className="flex w-full items-start gap-2">
                                                                <Badge variant={notif.recipient === "threat" ? "destructive" : "secondary"} className="mt-0.5">
                                                                    {notif.recipient}
                                                                </Badge>

                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{notif.title}</p>
                                                                    <p className="text-xs text-muted-foreground line-clamp-4">
                                                                        {notif.message}
                                                                        {notif.title === "Atualize as tags já" ? (notif?.brand ? ` no ativo ${notif?.brand?.name}.` : ".") : notif?.brand ? ` no ativo ${notif?.brand?.name}, durante o monitoramento em ${notif.subject}!` : "."}
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    // `stopPropagation` para o clique não subir ao item do menu.
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        handleDeleteNotice(notif.id);
                                                                    }}
                                                                    disabled={deletingNoticeId === notif.id}
                                                                    aria-label="Excluir notificação"
                                                                    className="-mr-1 -mt-0.5 shrink-0 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {/* Atalho de configurações — credenciais e perfil do tenant são do dono */}
                                {isOwner && (
                                    <Button variant="ghost" size="icon" asChild aria-label="Configurações">
                                        <Link href="/settings">
                                            <Settings className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}

                                {/* Conta */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button type="button" className="group ml-1 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Minha conta">
                                            {/* Anel temático para destacar a imagem: usa o ring na cor primária + um offset
                                                na cor de fundo, funcionando bem nos temas claro e escuro. */}
                                            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/70 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary">
                                                <AvatarImage src={data?.avatarUrl ?? undefined} alt="Imagem de perfil" />
                                                <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">{data?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {isOwner && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/settings">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        {t("nav.settings")}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            {t("nav.logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </header>

                        {/* Conteúdo da página */}
                        <main className="flex-1 overflow-auto">{children}</main>
                    </div>
                </div>
            ) : (
                <LayoutSkeleton children={pageSkeleton} />
            )}
        </>
    );
}
