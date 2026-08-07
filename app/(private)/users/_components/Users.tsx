"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Crown, Loader2, ShieldCheck, UserPlus, Users2 } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { PasswordInput } from "@/components/PasswordInput";
import { IManagedUser } from "@/lib/types";

const MIN_PASSWORD_LENGTH = 8;

type UsersPageProps = {
    pageSkeleton: React.ReactNode;
};

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("pt-BR", { dateStyle: "short" });
}

export default function UsersPage({ pageSkeleton }: UsersPageProps) {
    const [users, setUsers] = useState<IManagedUser[]>([]);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);

    const { makeRequest } = useFetch();

    async function load() {
        const response = await makeRequest("get", "/users");

        if (response?.status === 200) {
            setUsers(response.users ?? []);
        } else if (response?.message) {
            toast.error("Não foi possível carregar os usuários", { description: response.message });
        }

        setInitialLoaded(true);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleCreate(event: React.FormEvent) {
        event.preventDefault();

        const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();

        if (!cleanedEmail.includes("@")) {
            toast.error("Informe um e-mail válido");
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            toast.error(`A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`);
            return;
        }

        setCreating(true);

        const response = await makeRequest("post", "/user", { fullName: fullName.trim() || undefined, email: cleanedEmail, password });

        setCreating(false);

        if (response?.status === 201) {
            toast.success("Usuário criado", { description: `${cleanedEmail} já consegue entrar e montar a operação dele.` });

            setFullName("");
            setEmail("");
            setPassword("");
            load();
            return;
        }

        toast.error("Não foi possível criar", { description: response?.message ?? "Tente novamente." });
    }

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Usuários do sistema</h1>
                    <p className="text-sm text-muted-foreground">Cada usuário é uma operação independente — com os próprios clientes, ativos e acessos. Nenhum enxerga os dados do outro.</p>
                </div>
            </div>

            {/* Cadastro */}
            <Card className="mb-6 p-5">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="nome do escritório ou responsável" maxLength={150} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@escritorio.com.br" maxLength={254} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha inicial</Label>
                            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* A senha é digitada por você e entregue junto com o acesso — por isso o
                            aviso. Quem recebe troca em Configurações → Segurança. */}
                        <p className="text-xs text-muted-foreground">Mínimo de {MIN_PASSWORD_LENGTH} caracteres. Combine com a pessoa que ela troque a senha no primeiro acesso, em Configurações → Segurança.</p>
                        <Button type="submit" disabled={creating} className="sm:w-auto">
                            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Criar usuário
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Lista */}
            <div className="space-y-3">
                {users.map((user) => (
                    <Card key={user.id} className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Avatar className="h-11 w-11 shrink-0">
                                <AvatarFallback className="bg-primary/15 font-semibold text-primary">{(user.fullName || user.email).charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate font-medium">{user.fullName || user.email}</p>
                                    {user.isMasterAdmin && (
                                        <Badge variant="default">
                                            <Crown className="mr-1 h-3 w-3" />
                                            Admin geral
                                        </Badge>
                                    )}
                                    {user.isBlocked && <Badge variant="destructive">Bloqueado</Badge>}
                                </div>
                                {user.fullName && <p className="truncate text-sm text-muted-foreground">{user.email}</p>}
                                <p className="mt-1 text-xs text-muted-foreground">No sistema desde {formatDate(user.createdAt)}</p>
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4" />
                                    {user._count.client} {user._count.client === 1 ? "cliente" : "clientes"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4" />
                                    {user._count.brand} {user._count.brand === 1 ? "ativo" : "ativos"}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
