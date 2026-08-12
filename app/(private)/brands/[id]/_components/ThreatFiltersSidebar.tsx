"use client";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ThreatFiltersSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Papel da sessão: os selects de gestão só existem para o dono. */
    isOwner: boolean | null;
    verifiedThreatFilter: "all" | "unverified" | "verified";
    setVerifiedThreatFilter: (value: "all" | "unverified" | "verified") => void;
    notifiedThreatFilter: "all" | "unotified" | "notified";
    setNotifiedThreatFilter: (value: "all" | "unotified" | "notified") => void;
    archivingThreatFilter: "all" | "unarchived" | "archived";
    setArchivingThreatFilter: (value: "all" | "unarchived" | "archived") => void;
    /** Filtros exclusivos da aba de marketplaces: `info` (coluna preenchida pela extensão) e `origin` (rastreio de origem). */
    showInfoFilter?: boolean;
    infoThreatFilter?: "all" | "with" | "without";
    setInfoThreatFilter?: (value: "all" | "with" | "without") => void;
    originThreatFilter?: "all" | "search_api" | "reverse_image";
    setOriginThreatFilter?: (value: "all" | "search_api" | "reverse_image") => void;
}

/**
 * Sidebar de filtros das ocorrências de um ativo. Fica escondida à direita e entra deslizando
 * quando o botão "Filtro" é acionado. Guarda só os filtros de gestão — inclusive o de
 * "Informações", que continua aparecendo só na aba de marketplaces. O período saiu daqui e
 * ficou visível acima dos cards, porque é o filtro que todo mundo usa em toda aba.
 */
export default function ThreatFiltersSidebar({ open, onOpenChange, isOwner, verifiedThreatFilter, setVerifiedThreatFilter, notifiedThreatFilter, setNotifiedThreatFilter, archivingThreatFilter, setArchivingThreatFilter, showInfoFilter, infoThreatFilter, setInfoThreatFilter, originThreatFilter, setOriginThreatFilter }: ThreatFiltersSidebarProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader className="border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        Filtros
                    </SheetTitle>
                    <SheetDescription>Refine as ocorrências exibidas na aba selecionada.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
                    {isOwner && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    Status
                                </label>
                                <Select value={archivingThreatFilter} onValueChange={(value: "all" | "unarchived" | "archived") => setArchivingThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por análise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unarchived">Críticas</SelectItem>
                                        <SelectItem value="archived">Arquivadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    Análise
                                </label>
                                <Select value={verifiedThreatFilter} onValueChange={(value: "all" | "unverified" | "verified") => setVerifiedThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por análise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unverified">Novas Ocorrências</SelectItem>
                                        <SelectItem value="verified">Ocorrências Verificadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    Notificação
                                </label>
                                <Select value={notifiedThreatFilter} onValueChange={(value: "all" | "unotified" | "notified") => setNotifiedThreatFilter(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrar por notificação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Geral</SelectItem>
                                        <SelectItem value="unotified">Ocorrências Não Notificadas</SelectItem>
                                        <SelectItem value="notified">Ocorrências Notificadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {showInfoFilter && infoThreatFilter !== undefined && setInfoThreatFilter && (
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        Informações
                                    </label>
                                    <Select value={infoThreatFilter} onValueChange={(value: "all" | "with" | "without") => setInfoThreatFilter(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filtrar por informações" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Geral</SelectItem>
                                            <SelectItem value="with">Com informações extraídas</SelectItem>
                                            <SelectItem value="without">Sem informações extraídas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {showInfoFilter && originThreatFilter !== undefined && setOriginThreatFilter && (
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        Origem
                                    </label>
                                    <Select value={originThreatFilter} onValueChange={(value: "all" | "search_api" | "reverse_image") => setOriginThreatFilter(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filtrar por origem" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Geral</SelectItem>
                                            <SelectItem value="search_api">Busca por tags</SelectItem>
                                            <SelectItem value="reverse_image">Busca reversa de imagem</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <SheetFooter className="border-t">
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Fechar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
