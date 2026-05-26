"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Bell, CheckCircle2, AlertTriangle, Shield, TrendingUp, EyeIcon, Dot, FileArchive } from "lucide-react";
import { ICompanies } from "@/lib/types";
import { useFetch } from "@/hooks/useFetch";
import { useConfirmation } from "@/hooks/use-confirmation";
import { formatCNPJ } from "./utils/functions";
import { toast } from "sonner";
import Paginations from "./pagination";
import TableSkeleton from "./BrandsPageSkeleton";

interface IThreatTableCompaniesProps {
    brandId: string | undefined;
    verifiedThreatFilter: string | undefined;
    notifiedThreatFilter: string | undefined;
    archivingThreatFilter: string | undefined;
    reloadFilter: boolean;
    newThreat: string | null;
    logged: boolean | null;
    data: ICompanies[] | undefined;
    count: number | undefined;
    countResults: number | undefined;
    countAllThreats: number | undefined;
    countAllAccesses: number | undefined;
    allThreats: number | undefined;
    endDate: string;
    startDate: string;
}

export default function ThreatTableCompanies({ brandId, verifiedThreatFilter, notifiedThreatFilter, archivingThreatFilter, reloadFilter, newThreat, logged, data, count, countResults, countAllThreats, countAllAccesses, allThreats, endDate, startDate }: IThreatTableCompaniesProps) {
    const [updateStateCompanies, setUpdateStateCompanies] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataCompanies, setDataCompanies] = useState<ICompanies[] | undefined>(data);
    const [countCompanies, setCountCompanies] = useState<number | undefined>(count);
    const [countResultsCompanies, setCountResultsCompanies] = useState<number | undefined>(countResults);
    const [takeCompanies] = useState<number>(10);
    const [pageCompanies, setPageCompanies] = useState(1);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedThreat, setSelectedThreat] = useState<ICompanies | null>(null);
    const [heightImage, setHeightImage] = useState(0);
    const [openImage, setOpenImage] = useState(false);
    const [render, setRender] = useState(true);
    const { makeRequest } = useFetch();
    const { confirm, ConfirmationDialog } = useConfirmation();
    const divRef = useRef<HTMLDivElement>(null);

    /** Busca as ameaças dos (Empresas) */
    useEffect(() => {
        if (render) {
            setRender(false);
            return;
        }

        async function getCompaniesThreats() {
            const response = await makeRequest("get", `/companies/${brandId}?skip=${pageCompanies == 1 ? 0 : (pageCompanies - 1) * takeCompanies}&take=${takeCompanies}&verified=${verifiedThreatFilter}&notified=${notifiedThreatFilter}&archiving=${archivingThreatFilter}&startDate=${startDate}&endDate=${endDate}`);

            if ("status" in response) {
                return;
            } else {
                setDataCompanies(response.companies);
                setCountCompanies(response.count);
                setCountResultsCompanies(response.companies.length);
            }
        }

        getCompaniesThreats();
    }, [pageCompanies, verifiedThreatFilter, reloadFilter, notifiedThreatFilter, updateStateCompanies, startDate, endDate]);

    /** Resetar para a primeira página quando necessário */
    useEffect(() => {
        setPageCompanies(1);
    }, [verifiedThreatFilter, notifiedThreatFilter]);

    /** Controla a paginação dos ativos de monitoramento (Marcas) */
    const handleChangePaginationCompanies = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageCompanies(value);
    };

    /** Abre o modal com os detalhes da ameaça */
    const openDetailDialog = (threat: ICompanies) => {
        setSelectedThreat(threat);
        setIsDetailDialogOpen(true);
    };

    /** Arquiva uma ameaça */
    const archiveThreat = async (id: string, archiving: string) => {
        setLoading(true);

        const response = await makeRequest("put", `/companies-archive/${id}`, { archiving });

        if (response.status === 200) {
            if (archiving === "archived") {
                toast.success("Arquivamento bem-sucedido", {
                    description: `A ameaça foi arquivada com sucesso!`,
                });
            } else {
                toast.success("Arquivamento desfeito", {
                    description: `A ameaça teve seu arquivamento desfeito com sucesso!`,
                });
            }

            setUpdateStateCompanies(!updateStateCompanies);
            openDetailDialog(response.payload);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Envia uma notificação de ameaça para o cliente */
    const sendNotification = async (threat: ICompanies) => {
        setLoading(true);

        threat.source = "company";

        const response = await makeRequest("post", `/notification`, threat);

        if (response.status === 200) {
            toast.success("Envio bem-sucedido", {
                description: `O e-mail foi enviado com sucesso!`,
            });

            setUpdateStateCompanies(!updateStateCompanies);
            openDetailDialog(response.payload);
        }

        if (response.status === 400) {
            toast.error("Envio falho", {
                description: `Problema no envio do e-mail!`,
            });
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Abre a modal de confirmação para o envio da notificação uma ameaça para o cliente */
    const handleSendNotification = async (Threat: ICompanies) => {
        const confirmed = await confirm({
            title: "Enviar Notificação",
            description: "Deseja mesmo enviar esta notificação? Esta ação não pode ser desfeita.",
            confirmText: "Confirmar Envio",
            cancelText: "Cancelar",
            variant: "default",
        });

        if (confirmed) {
            await sendNotification(Threat);
        }
    };

    /** Marca uma ameaça como verificada */
    const markAsVerified = async (id: string, verifiedThreat: string) => {
        setLoading(true);

        const response = await makeRequest("put", `/companies/${id}`, { verifiedThreat });

        if (response.status === 200) {
            if (verifiedThreat === "verified") {
                toast.success("Verificação bem-sucedida", {
                    description: `A ameaça foi verificada com sucesso!`,
                });
            } else {
                toast.success("Verificação desfeita", {
                    description: `A ameaça teve sua verificação desfeita com sucesso!`,
                });
            }

            setUpdateStateCompanies(!updateStateCompanies);
            openDetailDialog(response.payload);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Caixa animada de imagem */
    useEffect(() => {
        if (divRef.current) {
            setHeightImage(divRef.current.scrollHeight);
        }
    }, [openImage]);

    return (
        <>
            {dataCompanies !== undefined ? (
                <>
                    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                        <DialogContent
                            className="w-full sm:[min-width:650px] max-h-[90vh] overflow-y-auto overflow-x-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            {loading ? (
                                <div className="text-center mt-8 mb-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-muted-foreground">Processando...</p>
                                </div>
                            ) : (
                                <>
                                    <DialogHeader className="mt-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0 text-left">
                                                <DialogTitle className="text-2xl break-words">Ocorrência de Possível Ameaça Suspeita na empresa com CNPJ: {formatCNPJ(selectedThreat?.cnpj || "")}</DialogTitle>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 flex-shrink-0 mt-4">
                                            <Badge variant="default" className={selectedThreat?.verifiedThreat === "verified" ? "bg-success text-white" : "bg-primary text-white"}>
                                                {selectedThreat?.verifiedThreat === "verified" ? "Ameaça Verificada" : "Nova Ameaça"}
                                            </Badge>
                                            {logged && (
                                                <Badge variant="default" className={selectedThreat?.notified === "notified" ? "bg-success/25 text-success border-success" : "bg-warning text-white"}>
                                                    {selectedThreat?.notified === "notified" ? "Notificada" : "Não notificada"}
                                                </Badge>
                                            )}
                                            <Badge variant="default" className={selectedThreat?.accesses && selectedThreat?.accesses > 0 ? "bg-foreground text-white" : "bg-warning text-white border-border"}>
                                                {selectedThreat?.accesses && selectedThreat?.accesses > 0 ? "Visualizada" : "Não Visualizada"}
                                            </Badge>
                                        </div>
                                    </DialogHeader>

                                    <div className="space-y-6 mt-4">
                                        <div className="space-y-4">
                                            {selectedThreat?.data && (
                                                <div>
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                                                        <p className="text-sm text-muted-foreground">Informações da empresa</p>
                                                        <div className="flex gap-2 flex items-center justify-center">
                                                            <Button variant="outline" size="sm" onClick={() => setOpenImage(!openImage)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Ver informações
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div style={{ height: openImage ? `${heightImage}px` : "0px", transition: "height 300ms ease" }} className="overflow-hidden mt-2">
                                                        <div ref={divRef} className="p-6 border rounded bg-muted">
                                                            <div className="relative aspect-video w-full rounded-lg">
                                                                <div className="space-y-6 pb-10">
                                                                    <div className="grid grid-cols-2 gap-8">
                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Cnpj</span>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <p className="text-base">{formatCNPJ(selectedThreat?.data.taxId || "")}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-span-2 sm:col-span-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Status</span>
                                                                            <p className="text-base mt-1">{selectedThreat?.data.status.text || ""}</p>
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Emails</span>
                                                                            {selectedThreat?.data?.emails?.map((email, index) => (
                                                                                <div key={index}>
                                                                                    <p className="text-base mt-1">
                                                                                        {email?.address || ""}
                                                                                        <small> - ({email?.ownership || ""})</small>
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Telefones</span>
                                                                            {selectedThreat?.data?.phones?.map((phone, index) => (
                                                                                <div key={index}>
                                                                                    <p className="text-base mt-1">
                                                                                        ({phone?.area || ""}) {phone?.number || ""}
                                                                                        <small> - ({phone?.type || ""})</small>
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Razão social</span>
                                                                            <p className="text-base mt-1">{selectedThreat?.data.company.name || ""}</p>
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Porte</span>
                                                                            <p className="text-base mt-1">
                                                                                {selectedThreat?.data.company.size.text || ""} - ({selectedThreat?.data.company.size.acronym || ""})
                                                                            </p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Capital Social</span>
                                                                            <p className="text-base mt-1">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedThreat?.data.company.equity || 0)}</p>
                                                                        </div>

                                                                        <div className="col-span-2 sm:col-span-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Data da fundação</span>
                                                                            <p className="text-base mt-1">{new Date(selectedThreat?.data.founded ?? "").toLocaleDateString("pt-BR")}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Atualizada em</span>
                                                                            <p className="text-base mt-1">{new Date(selectedThreat?.data.updated ?? "").toLocaleDateString("pt-BR")}</p>
                                                                        </div>

                                                                        <div className="col-span-2 sm:col-span-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Atividade principal</span>
                                                                            <p className="text-base mt-1">{selectedThreat?.data.mainActivity.text ?? ""}</p>
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Natureza</span>
                                                                            <p className="text-base mt-1">{selectedThreat?.data.company.nature.text || ""}</p>
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Outras atividades</span>
                                                                            {selectedThreat?.data?.sideActivities?.map((activities, index) => (
                                                                                <div key={index} className="flex items-center">
                                                                                    <Dot className="h-4 w-4 text-muted-foreground" />
                                                                                    <p className="text-base mt-1">{activities?.text || ""}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <div className="col-span-2 space-y-1">
                                                                            <span className="text-muted-foreground text-xs uppercase">Endereço</span>
                                                                            <p className="text-base mt-1">
                                                                                {selectedThreat?.data.address.street || ""}, {selectedThreat?.data.address.number || ""}, {selectedThreat?.data.address.details || ""} - {selectedThreat?.data.address.district || ""} {selectedThreat?.data.address.city || ""} ({selectedThreat?.data.address.state || ""}) - CEP {selectedThreat?.data.address.zip || ""}{" "}
                                                                                {selectedThreat?.data.address.country.name || ""}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Plataforma:</span>
                                                <span className="font-medium">{formatCNPJ(selectedThreat?.cnpj || "")}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Fonte de Monitoramento:</span>
                                                <span className="font-medium">Empresas</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Detectado em:</span>
                                                <span className="font-medium">{new Date(selectedThreat?.createdAt ?? "").toLocaleString("pt-BR")}</span>
                                            </div>
                                        </div>

                                        {logged ? (
                                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t sm:justify-end sm:items-center">
                                                <Button variant="outline" className={selectedThreat?.verifiedThreat === "verified" ? "bg-success text-white hover:bg-success/90" : "sm:w-auto"} onClick={() => markAsVerified(selectedThreat?.id || "", selectedThreat?.verifiedThreat === "verified" ? "unverified" : "verified")}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    {selectedThreat?.verifiedThreat === "verified" ? "Desmarcar como Verificada" : "Marcar como Verificada"}
                                                </Button>
                                                <Button className="sm:w-auto" onClick={() => selectedThreat && handleSendNotification(selectedThreat)}>
                                                    <Bell className="mr-2 h-4 w-4" />
                                                    Notificar Cliente
                                                </Button>
                                                <Button variant="destructive" className={selectedThreat?.archiving === "archived" ? "bg-success text-white hover:bg-success/90" : "sm:w-auto"} onClick={() => archiveThreat(selectedThreat?.id || "", selectedThreat?.archiving === "unarchived" ? "archived" : "unarchived")}>
                                                    <FileArchive className="mr-2 h-4 w-4" />
                                                    {selectedThreat?.archiving === "unarchived" ? "Arquivar" : "Desarquivar"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3 pt-4 border-t items-center">
                                                <span className="text-muted-foreground">Entre em contato para mais informações</span>
                                                <Button variant="default" onClick={() => window.open(`https://wa.me/5551999596750`, "_blank")} className="w-full h-13 bg-success hover:bg-success/90 text-lg font-semibold" size="lg">
                                                    Enviar Mensagem
                                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "30px", height: "30px" }} viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8">
                                                        <path d="M16 .667C7.64.667.667 7.64.667 16c0 2.798.732 5.53 2.12 7.927L.667 31.333l7.6-2.093A15.28 15.28 0 0 0 16 31.333c8.36 0 15.333-6.973 15.333-15.333S24.36.667 16 .667zm0 27.466a12.09 12.09 0 0 1-6.173-1.707l-.44-.26-4.507 1.24 1.2-4.386-.287-.454A12.101 12.101 0 1 1 16 28.133zm6.64-9.04c-.36-.18-2.12-1.04-2.453-1.16-.333-.12-.573-.18-.813.18-.24.36-.933 1.16-1.147 1.4-.213.24-.427.27-.787.09-.36-.18-1.52-.56-2.893-1.787-1.067-.953-1.787-2.133-1.993-2.493-.207-.36-.022-.56.157-.74.16-.16.36-.427.54-.64.18-.213.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.813-1.96-1.113-2.68-.293-.707-.593-.613-.813-.627l-.693-.013c-.24 0-.63.09-.96.45s-1.26 1.233-1.26 3c0 1.767 1.293 3.467 1.473 3.707.18.24 2.547 3.893 6.16 5.453.86.373 1.533.6 2.053.773.86.273 1.64.233 2.253.14.687-.1 2.12-.867 2.42-1.707.3-.84.3-1.56.213-1.707-.087-.147-.327-.24-.687-.42z" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Stats Cards */}
                    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8">
                        {!logged && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Ameaças não Apuradas</CardTitle>
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{allThreats}</div>
                                    <p className="text-xs text-muted-foreground">Total de Ameaças não Apuradas</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total de Ameaças</CardTitle>
                                <Shield className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{countAllThreats}</div>
                                <p className="text-xs text-muted-foreground">Ameaças detectadas no geral</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Ameaças em Empresas</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{countCompanies}</div>
                                <p className="text-xs text-muted-foreground">Ameaças detectadas somente em Empresas</p>
                            </CardContent>
                        </Card>

                        {logged && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
                                    <EyeIcon className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{countAllAccesses}</div>
                                    <p className="text-xs text-muted-foreground">Acessos do cliente a esse Ativo</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Taxa de Detecção</CardTitle>
                                <TrendingUp className="h-4 w-4 text-success" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-success">{countCompanies && countAllThreats && Math.round((countCompanies / countAllThreats) * 100)}%</div>
                                <p className="text-xs text-muted-foreground">Percentual de Detecção em Empresas</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="border border-border rounded-lg overflow-hidden mt-4 no-export">
                        <div className="animate-in slide-in-from-right-100 duration-600">
                            <Table className="border-b border-l border-r rounded-lg border-border">
                                <TableHeader className="bg-muted">
                                    <TableRow className="h-13 border-t border-border">
                                        <TableHead className="text-left pl-5">Cnpj</TableHead>
                                        {logged && <TableHead className="text-left">Notificação</TableHead>}
                                        <TableHead className="text-center">Análise</TableHead>
                                        {logged && <TableHead className="text-center">Visualização</TableHead>}
                                        <TableHead className="text-center">Detectado em</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right pr-5">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {countCompanies === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                Nenhuma ameaça encontrada nesta categoria
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        dataCompanies?.map((threat) => (
                                            <TableRow key={threat.id} className="transition-all duration-900 ease-out animate-[slideDown_0.8s_ease-out]">
                                                <TableCell className="font-medium pl-5">
                                                    <Badge variant="outline">{formatCNPJ(threat?.cnpj || "")}</Badge>
                                                </TableCell>
                                                {logged && (
                                                    <TableCell>
                                                        <Badge variant="default" className={threat?.notified === "notified" ? "bg-success/25 text-success border-success" : "bg-warning text-white"}>
                                                            {threat?.notified === "notified" ? "Notificada" : "Não notificada"}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-center">
                                                    <Badge variant="default" className={threat?.verifiedThreat === "verified" ? "bg-success text-white" : "bg-primary text-white"}>
                                                        {threat?.verifiedThreat === "verified" ? "Ameaça Verificada" : "Nova Ameaça"}
                                                    </Badge>
                                                </TableCell>
                                                {logged && (
                                                    <TableCell className="text-center">
                                                        <Badge variant="default" className={threat?.accesses && threat?.accesses > 0 ? "bg-foreground text-white" : "bg-warning text-white border-border"}>
                                                            {threat?.accesses && threat?.accesses > 0 ? "Visualizada" : "Não Visualizada"}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-center">{new Date(threat.createdAt ?? "").toLocaleDateString("pt-BR")}</TableCell>
                                                {threat?.verifiedThreat === "verified" ? (
                                                    <TableCell className="text-center">
                                                        {threat?.archiving === "unarchived" ? (
                                                            <Badge variant="outline" className="p-1 border-destructive text-destructive">
                                                                <AlertTriangle style={{ width: "15px", height: "15px", color: "var(--destructive)" }} />
                                                                Crítica
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="p-1 border-foreground text-foreground bg-muted">
                                                                <FileArchive style={{ width: "15px", height: "15px", color: "var(--foreground)" }} />
                                                                Arquivada
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                ) : (
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="p-1 border-primary text-primary">
                                                            Aguardando Análise
                                                        </Badge>
                                                    </TableCell>
                                                )}

                                                <TableCell className="text-right pr-5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            openDetailDialog(threat);
                                                            setOpenImage(false);
                                                        }}
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        Detalhes
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="no-export">{dataCompanies && countCompanies !== 0 && countResultsCompanies !== 0 && <Paginations handleChangePagination={handleChangePaginationCompanies} count={countCompanies} take={takeCompanies} />}</div>
                    <ConfirmationDialog />
                </>
            ) : (
                <TableSkeleton />
            )}
        </>
    );
}
