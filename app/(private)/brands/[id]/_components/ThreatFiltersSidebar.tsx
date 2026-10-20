"use client";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CnaeListInput, formatCnae } from "@/components/CnaeListInput";

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
    /** Só a aba de empresas tem CNAE. */
    showCnaeFilter?: boolean;
    cnaeFilter?: string[];
    setCnaeFilter?: (value: string[]) => void;
    /** CNAEs do próprio ativo — viram o atalho de um clique. */
    brandCnaes?: string[];
    infoThreatFilter?: "all" | "with" | "without";
    setInfoThreatFilter?: (value: "all" | "with" | "without") => void;
    originThreatFilter?: "all" | "search_api" | "reverse_image";
    setOriginThreatFilter?: (value: "all" | "search_api" | "reverse_image") => void;
    /** Filtro por tag — abas de marketplaces e redes sociais, só do dono. */
    showTagFilter?: boolean;
    /** Triagem da IA — não existe nos domínios, que têm filtro de tag mas não de triagem. */
    showTriageFilter?: boolean;
    /** `count`: ocorrências que a tag trouxe na frente da aba aberta. */
    tagOptions?: { id: string; label: string; count?: number }[];
    tagFilter?: string;
    setTagFilter?: (value: string) => void;
    /** Triagem da IA — mesmas abas e mesmo dono do filtro por tag. */
    triageFilter?: "all" | "relevant" | "irrelevant" | "pending";
    setTriageFilter?: (value: "all" | "relevant" | "irrelevant" | "pending") => void;
}

/**
 * Sidebar de filtros das ocorrências de um ativo. Fica escondida à direita e entra deslizando
 * quando o botão "Filtro" é acionado. Guarda só os filtros de gestão — inclusive o de
 * "Informações", que continua aparecendo só na aba de marketplaces. O período saiu daqui e
 * ficou visível acima dos cards, porque é o filtro que todo mundo usa em toda aba.
 */
export default function ThreatFiltersSidebar({
    open,
    onOpenChange,
    isOwner,
    verifiedThreatFilter,
    setVerifiedThreatFilter,
    notifiedThreatFilter,
    setNotifiedThreatFilter,
    archivingThreatFilter,
    setArchivingThreatFilter,
    showInfoFilter,
    infoThreatFilter,
    setInfoThreatFilter,
    originThreatFilter,
    setOriginThreatFilter,
    showCnaeFilter,
    cnaeFilter,
    setCnaeFilter,
    brandCnaes = [],
    showTagFilter,
    tagOptions,
    tagFilter,
    setTagFilter,
    triageFilter,
    setTriageFilter,
    showTriageFilter = true,
}: ThreatFiltersSidebarProps) {
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

                            {showCnaeFilter && cnaeFilter !== undefined && setCnaeFilter && (
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm" htmlFor="cnae-filter">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        CNAEs
                                    </label>

                                    {/* Campo livre, e não um seletor fechado: o universo de CNAEs é
                                        grande demais para uma lista, e o caso comum — os CNAEs do
                                        próprio ativo — vira um atalho de um clique logo abaixo. */}
                                    <CnaeListInput id="cnae-filter" value={cnaeFilter} onChange={setCnaeFilter} placeholder="Todos os CNAEs — digite e Enter" />

                                    <div className="flex flex-wrap gap-2">
                                        {brandCnaes.length > 0 && (
                                            <Button type="button" size="sm" variant={cnaeFilter.length === brandCnaes.length && brandCnaes.every((code) => cnaeFilter.includes(code)) ? "default" : "outline"} onClick={() => setCnaeFilter(brandCnaes)} title={brandCnaes.map(formatCnae).join(", ")}>
                                                {brandCnaes.length === 1 ? `CNAE do ativo (${formatCnae(brandCnaes[0])})` : `CNAEs do ativo (${brandCnaes.length})`}
                                            </Button>
                                        )}

                                        {cnaeFilter.length > 0 && (
                                            <Button type="button" size="sm" variant="ghost" onClick={() => setCnaeFilter([])}>
                                                Limpar
                                            </Button>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">Vazio lista todos. Com CNAEs, mostra as empresas que têm qualquer um deles, como atividade principal ou secundária.</p>
                                </div>
                            )}

                            {showTagFilter && tagFilter !== undefined && setTagFilter && (
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        Tag
                                    </label>
                                    <Select value={tagFilter} onValueChange={setTagFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filtrar por tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as tags</SelectItem>
                                            {(tagOptions ?? []).map((option) => (
                                                <SelectItem key={option.id} value={option.id}>
                                                    {option.label}
                                                    {option.count !== undefined && (
                                                        <span className="ml-1 tabular-nums text-muted-foreground">
                                                            · {option.count.toLocaleString("pt-BR")} {option.count === 1 ? "ocorrência" : "ocorrências"}
                                                        </span>
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">Mostra só as ocorrências que a tag escolhida encontrou.</p>
                                </div>
                            )}

                            {showTagFilter && showTriageFilter && triageFilter !== undefined && setTriageFilter && (
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        Triagem da IA
                                    </label>
                                    <Select value={triageFilter} onValueChange={(value: "all" | "relevant" | "irrelevant" | "pending") => setTriageFilter(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filtrar pela triagem" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Geral</SelectItem>
                                            <SelectItem value="relevant">Relacionadas ao ativo</SelectItem>
                                            <SelectItem value="irrelevant">Sem relação</SelectItem>
                                            <SelectItem value="pending">Ainda não triadas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">A IA só marca: nada é apagado por ela.</p>
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
