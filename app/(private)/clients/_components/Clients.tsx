"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Pencil, Search, Mail, Building, Info, Save, Eye, SlidersHorizontal } from "lucide-react";
import { IClient } from "@/lib/types";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { CountrySelect } from "@/components/CountrySelect";
import Paginations from "@/components/pagination";
import { useRouter } from "next/navigation";

type ClientsPageProps = {
    pageSkeleton: React.ReactNode;
};

export default function ClientsPage({ pageSkeleton }: ClientsPageProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<IClient | null>(null);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [viewingClient, setViewingClient] = useState<IClient | null>(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [updateStateClients, setUpdateStateClients] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataClients, setDataClients] = useState<IClient[]>();
    const [countClients, setCountClients] = useState<number>();
    const [countResultsClients, setCountResultsClients] = useState<number>();
    const [searchClientsName, setSearchClientsName] = useState<string>("");
    const [takeClients] = useState<number>(10);
    const [pageClients, setPageClients] = useState(1);
    const { makeRequest } = useFetch();

    /** Busca os clientes */
    useEffect(() => {
        async function getClients() {
            const response = await makeRequest("get", `/client?skip=${pageClients == 1 ? 0 : (pageClients - 1) * takeClients}&take=${takeClients}`);

            setDataClients(response.clients);
            setCountClients(response.count);
            setCountResultsClients(response.clients.length);
        }

        const searchClients = async () => {
            const response = await makeRequest("get", `/search-client?search=${searchClientsName}`);

            setDataClients(response.client);
            setCountResultsClients(response.client.length);
        };

        if (searchClientsName) {
            searchClients();
        } else {
            getClients();
        }
    }, [pageClients, searchClientsName, updateStateClients]);

    /** Cria clientes */
    const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.country) {
            toast.info("Selecione o país", {
                description: `É obrigatório que selecione seu país`,
            });

            setLoading(false);
            return;
        }

        const response = await makeRequest("post", `/client`, data);

        if (response.status === 201) {
            toast.success("Novo cliente adicionado", {
                description: `O cliente "${data.email}" foi adicionado com sucesso`,
            });

            setUpdateStateClients(!updateStateClients);
            setIsDialogOpen(false);
        }

        if (response.status === 401) {
            toast.info("Cliente já cadastrado", {
                description: `O cliente já existe no sistema`,
            });
        }

        if (response.status === 402) {
            toast.info("Configurações obrigatórias", {
                description: `Vá em configurações e configure suas chaves de API!`,
            });
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
        setSelectedCountry("");
    };

    /** Edita um cliente */
    const handleUpdateClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.country) {
            toast.info("Selecione o país", {
                description: `É obrigatório que selecione seu país`,
            });

            setLoading(false);
            return;
        }

        const response = await makeRequest("put", `/client`, data);

        if (response.status === 200) {
            toast.success("Cliente atualizado", {
                description: `O cliente "${data.email}" foi atualizado com sucesso`,
            });

            setUpdateStateClients(!updateStateClients);
            setIsEditDialogOpen(false);
            setSelectedCountry("");
        }

        if (response.status === 401) {
            toast.info("Alteração não permitida", {
                description: `O número de registro e o email não pode ser alterado`,
            });
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Controla a caixa de mais informações */
    const handleViewClient = (client: IClient) => {
        setViewingClient(client);
        setIsInfoDialogOpen(true);
    };

    /** Controla a caixa de edição */
    const handleEditClient = (client: IClient) => {
        setEditingClient(client);
        setSelectedCountry(client.country);
        setIsEditDialogOpen(true);
    };

    /** Controla a paginação das clientes */
    const handleChangePaginationClients = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageClients(value);
    };

    return (
        <>
            {dataClients ? (
                <div className="p-6 lg:p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                                <p className="text-muted-foreground mt-1">Gerencie os clientes do sistema</p>
                            </div>

                            <Button
                                size="lg"
                                className="w-full lg:w-auto lg:ml-auto"
                                onClick={() => {
                                    setIsDialogOpen(!isDialogOpen);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Cliente
                            </Button>
                        </div>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={() => {
                                (setIsDialogOpen(!isDialogOpen), setSelectedCountry(""));
                            }}
                        >
                            <DialogContent
                                className="w-[calc(100vw-1rem)] sm:w-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                                onInteractOutside={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <DialogHeader className="mb-4">
                                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                                    <DialogDescription>Preencha as informações do cliente</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateClient} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientCompany">Nome da empresa *</Label>
                                            <Input id="clientCompany" name="companyName" placeholder="" maxLength={200} required />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientName">Nome completo do responsável *</Label>
                                            <Input id="clientName" name="companyRepresentative" placeholder="" maxLength={150} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="clientCnpj">Número de registro *</Label>
                                            <Input id="clientCnpj" name="registrationNumber" placeholder="" maxLength={50} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="clientEmail">E-mail *</Label>
                                            <Input id="clientEmail" name="email" type="email" placeholder="" maxLength={254} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>País *</Label>
                                            <CountrySelect name="country" value={selectedCountry} onChange={(v) => setSelectedCountry(v)} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Salvar cliente
                                                <Save className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent
                            className="w-[calc(100vw-1rem)] sm:w-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader>
                                <DialogTitle>Editar Cliente</DialogTitle>
                                <DialogDescription>Atualize as informações do cliente</DialogDescription>
                            </DialogHeader>
                            {editingClient && (
                                <form onSubmit={handleUpdateClient} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input id="id" name="id" type="hidden" defaultValue={editingClient.id} placeholder="" required />
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientCompany">Nome da empresa *</Label>
                                            <Input id="clientCompany" name="companyName" defaultValue={editingClient.companyName} placeholder="" maxLength={200} required />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="clientName">Nome completo do responsável *</Label>
                                            <Input id="clientName" name="companyRepresentative" defaultValue={editingClient.companyRepresentative} placeholder="" maxLength={150} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="clientCnpj">Número de registro *</Label>
                                            <Input id="clientCnpj" name="registrationNumber" defaultValue={editingClient.registrationNumber} placeholder="" maxLength={50} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="clientEmail">E-mail *</Label>
                                            <Input id="clientEmail" name="email" type="email" defaultValue={editingClient.email} placeholder="" maxLength={254} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>País *</Label>
                                            <CountrySelect name="country" value={selectedCountry} onChange={(v) => setSelectedCountry(v)} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Salvar alterações
                                                <Save className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                        <DialogContent
                            className="w-[calc(100vw-1rem)] sm:w-auto sm:max-w-2xl animate-in slide-in-from-top-40 duration-300"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader className="mb-5">
                                <DialogTitle>Informações do Cliente</DialogTitle>
                                <DialogDescription>Detalhes do cliente</DialogDescription>
                            </DialogHeader>
                            {viewingClient && (
                                <div className="space-y-6 pb-10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">Empresa</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-base">{viewingClient.companyName}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">Nome do responsável</Label>
                                            <p className="text-base font-medium mt-1">{viewingClient.companyRepresentative}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">Número do registro</Label>
                                            <p className="text-base font-mono mt-1">{viewingClient.registrationNumber}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">País</Label>
                                            <p className="text-base mt-1">{viewingClient.country}</p>
                                        </div>

                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">E-mail</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-base">{viewingClient.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">Ativos</Label>
                                            <p className="text-base font-bold mt-1">{viewingClient.brand.length}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs uppercase">Data de Cadastro</Label>
                                            <p className="text-base mt-1">{new Date(viewingClient.createdAt).toLocaleString("pt-BR")}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {countClients === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
                                <p className="text-muted-foreground text-center mb-6">Adicione seu primeiro cliente para começar</p>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeiro Cliente
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Buscar cliente pelo email..." value={searchClientsName} onChange={(e) => setSearchClientsName(e.target.value)} className="pl-10 bg-card h-11" />
                                </div>
                            </div>
                            <Card>
                                <div className="border border-border rounded-lg overflow-hidden mt-4">
                                    <div className="animate-in slide-in-from-right-100 duration-600">
                                        <Table className="border-b border-border">
                                            <TableHeader className="bg-muted">
                                                <TableRow className="h-13 border-t border-border">
                                                    <TableHead className="text-left pl-5">Nome</TableHead>
                                                    <TableHead className="text-left">Email</TableHead>
                                                    <TableHead className="text-center">Ativos</TableHead>
                                                    <TableHead className="text-center">Data de Cadastro</TableHead>
                                                    <TableHead className="text-right pr-5">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {countResultsClients === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                            Nenhum cliente encontrado com "{searchClientsName}"
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    dataClients?.map((client, index) => {
                                                        return (
                                                            <TableRow key={client.id} className="transition-all duration-900 ease-out animate-[slideDown_0.8s_ease-out]">
                                                                <TableCell className="font-medium pl-5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                                            <Users className="h-5 w-5 text-primary" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">{client.companyName}</p>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground">{client.email}</p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className="text-sm text-muted-foreground">{client.brand.length}</span>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className="text-sm text-muted-foreground">{new Date(client.createdAt).toLocaleDateString("pt-BR")}</span>
                                                                </TableCell>
                                                                <TableCell className="text-right pr-5">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="sm" onClick={() => router.push(`/brands?clientId=${client.id}&clientName=${client.companyName}`)}>
                                                                            <Eye className="mr-1 h-4 w-4" />
                                                                            Ativos
                                                                        </Button>
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="sm" onClick={() => router.push(`/clients/${client.id}/services`)}>
                                                                            <SlidersHorizontal className="mr-1 h-4 w-4" />
                                                                            Serviços
                                                                        </Button>
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => handleViewClient(client)}>
                                                                            <Info className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="outline" className="hover:bg-muted-foreground/30" size="icon" onClick={() => handleEditClient(client)}>
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </Card>
                            {dataClients && countClients !== 0 && countResultsClients !== 0 && <Paginations handleChangePagination={handleChangePaginationClients} count={countClients} take={takeClients} />}
                        </>
                    )}
                </div>
            ) : (
                pageSkeleton
            )}
        </>
    );
}
