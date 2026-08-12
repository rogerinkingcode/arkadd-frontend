"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, User, Globe, Save, ChevronDown, LockKeyhole, ArrowRight, UploadCloud } from "lucide-react";
import { ImageDropzone } from "@/components/ImageDropzone";
import { PasswordInput } from "@/components/PasswordInput";
import { useFetch } from "@/hooks/useFetch";
import { IUser, WorkflowRoutine } from "@/lib/types";
import { generateUniqueNumbers } from "@/components/utils/functions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const objects = ["Redes Sociais", "Marketplaces", "Web geral", "Colidência em logos e imagens"];

const workflowRoutine: WorkflowRoutine[] = [
    {
        key: "domains",
        count: 2,
        days: [7, 13],
    },
    {
        key: "companies",
        count: 2,
        days: [8, 14],
    },
];

type SettingsPageProps = {
    pageSkeleton: React.ReactNode;
};

export default function SettingsPage({ pageSkeleton }: SettingsPageProps) {
    const router = useRouter();
    const [dataUser, setDataUser] = useState<IUser>();
    // `user.role` deixou de existir: a distinção de admin geral vem do `/me`.
    const [isMasterAdmin, setIsMasterAdmin] = useState(false);
    const [dataWorkflowRoutine, setDataWorkflowRoutine] = useState<WorkflowRoutine[]>();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [updateStateUser, setUpdateStateUser] = useState<boolean>(false);
    const { makeRequest } = useFetch();

    /** Busca o usuário */
    useEffect(() => {
        async function getUser() {
            const me = await makeRequest("get", "/me");
            setIsMasterAdmin(Boolean(me?.user?.isMasterAdmin));

            const response = await makeRequest("get", `/user`);

            setDataUser(response);

            if (response.credentials.length > 0) {
                if (response.credentials[0].workflowRoutine) {
                    setDataWorkflowRoutine(response.credentials[0].workflowRoutine);
                } else {
                    setDataWorkflowRoutine(workflowRoutine);
                }
            }
        }

        getUser();
    }, [updateStateUser]);

    /** Envia/atualiza a imagem de perfil do usuário (substitui a anterior no Backblaze) */
    const handleUpdateAvatar = async () => {
        if (!avatarFile) return;

        setAvatarLoading(true);

        const formData = new FormData();
        formData.append("image", avatarFile);

        const response = await makeRequest("put", `/user/avatar`, formData);

        if (response?.status === 200) {
            toast.success("Imagem atualizada", {
                description: `Sua imagem de perfil foi atualizada com sucesso`,
            });

            setAvatarFile(null);
            setUpdateStateUser(!updateStateUser);
        } else if (response?.status === 413 || response?.status === 415 || response?.status === 400) {
            toast.error("Imagem inválida", {
                description: response?.message ?? `Verifique o formato e o tamanho da imagem.`,
            });
        } else {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setAvatarLoading(false);
    };

    /** Edita o usuário */
    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const response = await makeRequest("put", `/user`, data);

        if (response.status === 200) {
            toast.success("Usuário atualizado", {
                description: `O usuário foi atualizado com sucesso`,
            });

            setUpdateStateUser(!updateStateUser);
        }

        if (response.status === 401) {
            toast.info("Alteração não permitida", {
                description: `O email não pode ser alterado!`,
            });
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /**
     * Troca a senha da credencial logada.
     *
     * Vai por `/me/password`, e não por `/user`: a senha deixou de morar no perfil do tenant e
     * passou a viver na credencial. E exige a senha atual — sem isso, uma sessão esquecida
     * aberta num computador alheio permitiria tomar a conta em definitivo.
     */
    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // A referência é guardada agora: depois do `await` o React já anulou `e.currentTarget`,
        // e limpar o formulário no fim do fluxo estouraria.
        const form = e.currentTarget;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.password === "") {
            setLoading(false);
            return;
        }

        if (!data.currentPassword) {
            toast.info("Informe a senha atual", {
                description: `É preciso confirmar a senha atual para trocá-la.`,
            });
            setLoading(false);
            return;
        }

        if (String(data.password).length < 8) {
            toast.info("Senha curta", {
                description: `A senha precisa ter ao menos 8 caracteres.`,
            });
            setLoading(false);
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.info("Não confere", {
                description: `Confirme a senha com a mesma senha!`,
            });
            setLoading(false);
            return;
        }

        const response = await makeRequest("put", `/me/password`, { currentPassword: data.currentPassword, password: data.password });

        if (response?.status === 200) {
            toast.success("Senha alterada", {
                description: response.message,
            });

            form.reset();
            setUpdateStateUser(!updateStateUser);
        } else if (response?.status === 401) {
            toast.info("Senha atual incorreta", {
                description: `Confira a senha atual e tente novamente.`,
            });
        } else if (response?.status === 400) {
            toast.info("Senha inválida", {
                description: response.message,
            });
        } else {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Edita a rotina do fluxo */
    const handleUpdateWorkflowRoutine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const daysDomains = generateUniqueNumbers(Number(data.domains));
        const daysCompanies = generateUniqueNumbers(Number(data.companies));

        const payload = [
            {
                key: "domains",
                count: Number(data.domains),
                days: daysDomains,
            },
            {
                key: "companies",
                count: Number(data.companies),
                days: daysCompanies,
            },
        ];

        const response = await makeRequest("put", `/credentials`, { workflowRoutine: payload });

        if (response.status === 200) {
            toast.success("Fluxo atualizado", {
                description: `O fluxo de monitoramento foi atualizado com sucesso`,
            });

            setUpdateStateUser(!updateStateUser);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Cria as credênciais */
    const handleCreateCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.workflowRoutine = workflowRoutine as any;

        const response = await makeRequest("post", `/credentials`, data);

        if (response.status === 201) {
            toast.success("Credênciais criadas", {
                description: `As Credênciais foram criadas com sucesso`,
            });

            setUpdateStateUser(!updateStateUser);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    /** Edita as credênciais */
    const handleUpdateCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const response = await makeRequest("put", `/credentials`, data);

        if (response.status === 200) {
            toast.success("Credênciais atualizadas", {
                description: `As Credênciais foram atualizadas com sucesso`,
            });

            setUpdateStateUser(!updateStateUser);
        }

        if (response.status === 500) {
            toast.error("Erro interno", {
                description: `Tente novamente mais tarde`,
            });
        }

        setLoading(false);
    };

    return (
        <>
            {dataUser ? (
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                        <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema e da sua conta</p>
                    </div>

                    <Tabs defaultValue="account" className="space-y-6">
                        <TabsList className="w-full grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                            <TabsTrigger value="account" className="gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Conta</span>
                                <span className="sm:hidden">Conta</span>
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden sm:inline">Segurança</span>
                                <span className="sm:hidden">Segur.</span>
                            </TabsTrigger>
                            <TabsTrigger value="credentials" className="gap-2">
                                <LockKeyhole className="h-4 w-4" />
                                <span className="hidden sm:inline">Credênciais</span>
                                <span className="sm:hidden">Credên</span>
                            </TabsTrigger>
                            {dataUser?.credentials && dataUser?.credentials.length > 0 && (
                                <TabsTrigger value="monitoring" className="gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span className="hidden sm:inline">Monitoramento</span>
                                    <span className="sm:hidden">Monitor</span>
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="account" className="space-y-6">
                            <Card>
                                <CardHeader className="mb-4">
                                    <CardTitle>Imagem de Perfil</CardTitle>
                                    <CardDescription>Envie uma imagem para identificar sua conta</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={dataUser?.avatarUrl ?? undefined} alt="Imagem de perfil" />
                                            <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">{dataUser?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm text-muted-foreground">
                                            <p className="font-medium text-foreground">{dataUser?.fullName}</p>
                                            <p>{dataUser?.email}</p>
                                        </div>
                                    </div>

                                    <ImageDropzone file={avatarFile} onFileChange={setAvatarFile} existingUrl={dataUser?.avatarUrl} />

                                    <Button onClick={handleUpdateAvatar} disabled={!avatarFile || avatarLoading}>
                                        {avatarLoading ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Enviar imagem
                                                <UploadCloud className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="mb-4">
                                    <CardTitle>Informações da Conta</CardTitle>
                                    <CardDescription>Atualize suas informações pessoais</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleUpdateUser} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Nome Completo</Label>
                                            <Input id="fullName" name="fullName" defaultValue={dataUser?.fullName} maxLength={150} />
                                        </div>
                                        <div className="space-y-2 hidden">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" defaultValue={dataUser?.email} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" disabled defaultValue={dataUser?.email} />
                                        </div>

                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Salvar Alterações
                                                    <Save className="h-4 w-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader className="mb-4">
                                    <CardTitle>Alterar Senha</CardTitle>
                                    <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Senha Atual</Label>
                                            <PasswordInput id="currentPassword" name="currentPassword" autoComplete="current-password" maxLength={60} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Nova Senha</Label>
                                            <PasswordInput id="password" name="password" autoComplete="new-password" maxLength={60} />
                                            <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                            <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" maxLength={60} />
                                        </div>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Atualizar Senha
                                                    <Save className="h-4 w-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="credentials" className="space-y-6">
                            <Card>
                                <CardHeader className="mb-4">
                                    <CardTitle>Credênciais de API</CardTitle>
                                    <CardDescription>Suas credênciais de API para funcionamento</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={dataUser?.credentials.length === 0 ? handleCreateCredentials : handleUpdateCredentials} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKeyGroq">ApiKey Groq</Label>
                                            <Input id="apiKeyGroq" name="apiKeyGroq" defaultValue={dataUser?.credentials[0]?.apiKeyGroq} maxLength={60} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKeyCnpja">ApiKey Cnpja</Label>
                                            <Input id="apiKeyCnpja" name="apiKeyCnpja" defaultValue={dataUser?.credentials[0]?.apiKeyCnpja} maxLength={80} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKeyGoogleSearch">ApiKey Google Search</Label>
                                            <Input id="apiKeyGoogleSearch" name="apiKeyGoogleSearch" defaultValue={dataUser?.credentials[0]?.apiKeyGoogleSearch} maxLength={50} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="socialMediaMonitorId">ID do monitor de Rede Social</Label>
                                            <Input id="socialMediaMonitorId" name="socialMediaMonitorId" defaultValue={dataUser?.credentials[0]?.socialMediaMonitorId} maxLength={20} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="marketplacesMonitorId">ID do monitor de Marketplaces</Label>
                                            <Input id="marketplacesMonitorId" name="marketplacesMonitorId" defaultValue={dataUser?.credentials[0]?.marketplacesMonitorId} maxLength={20} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="generalWebMonitorId">ID do monitor da Web</Label>
                                            <Input id="generalWebMonitorId" name="generalWebMonitorId" defaultValue={dataUser?.credentials[0]?.generalWebMonitorId} maxLength={20} required />
                                        </div>

                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {dataUser?.credentials.length === 0 ? "Criar Credênciais" : "Salvar Alterações"}
                                                    <Save className="h-4 w-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="monitoring" className="space-y-6">
                            <Card>
                                <CardHeader className="mb-4">
                                    <CardTitle>Fluxo de Monitoramento</CardTitle>
                                    <CardDescription>Ajuste a frequência do fluxo de monitoramento no sistema</CardDescription>
                                </CardHeader>
                                <CardContent className="">
                                    <form onSubmit={handleUpdateWorkflowRoutine} className="space-y-4">
                                        {dataWorkflowRoutine?.map((content) => (
                                            <div key={content.key}>
                                                <Label htmlFor={content.key} className="mb-2 ml-4">
                                                    {content.key === "domains" ? "Domínios" : content.key === "companies" ? "Empresas" : ""}
                                                </Label>
                                                <div className="mb-3">
                                                    <div className="flex w-full flex items-center justify-center">
                                                        <details className="w-full">
                                                            <summary className="list-none cursor-pointer">
                                                                <div className="flex items-center justify-between border border-b-1 rounded-t-lg px-4 py-2 hover:text-foreground w-full">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input id={content.key} name={content.key} type="number" defaultValue={content.count} className="w-40" />
                                                                        <p className="text-sm text-muted-foreground whitespace-nowrap">vezes por mês</p>
                                                                    </div>

                                                                    <ChevronDown className="h-4 w-4 transition-transform duration-300 open:rotate-180" />
                                                                </div>
                                                            </summary>
                                                            <div className="border border-t-0 rounded-b-lg bg-muted overflow-hidden">
                                                                <div className="p-4">
                                                                    <div className="grid grid-cols-2 gap-8">
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Esse fluxo de monitoramento é executado todo dia
                                                                            {content.days.map((day, index) => (
                                                                                <span key={index}>{` ${day} ${index + 1 === content.days.length ? "" : "e"} `}</span>
                                                                            ))}
                                                                            do mês
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {objects.map((day) => (
                                            <div key={day}>
                                                <Label className="mb-2 ml-4">{day}</Label>

                                                <div className="mb-3">
                                                    <div className="flex w-full items-center justify-center">
                                                        <details className="w-full">
                                                            <summary className="list-none cursor-pointer">
                                                                <div className="flex items-center justify-between border border-b-1 rounded-t-lg px-4 py-2 hover:text-foreground w-full">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input type="number" defaultValue={30} className="w-40" disabled />
                                                                        <p className="text-sm text-muted-foreground whitespace-nowrap">vezes por mês</p>
                                                                    </div>

                                                                    <ChevronDown className="h-4 w-4 transition-transform duration-300 open:rotate-180" />
                                                                </div>
                                                            </summary>

                                                            <div className="border border-t-0 rounded-b-lg bg-muted overflow-hidden">
                                                                <div className="p-4">
                                                                    <div className="grid grid-cols-2 gap-8">
                                                                        <p className="text-sm text-muted-foreground">Esse fluxo de monitoramento é executado todos os dias</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Salvar Alterações
                                                    <Save className="h-4 w-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    {isMasterAdmin && (
                        <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 5 }}>
                            <Button className="bg-primary text-white" onClick={() => router.push("/bullmq?NewThreat=0&Source=web")}>
                                BullMQ
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                pageSkeleton
            )}
        </>
    );
}
