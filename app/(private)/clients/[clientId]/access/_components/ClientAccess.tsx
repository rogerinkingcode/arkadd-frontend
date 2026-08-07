"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, KeyRound, Loader2, Mail, RotateCw, ShieldOff, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { useConfirmation } from "@/hooks/use-confirmation";
import { AccessStatus, IClientAccess } from "@/lib/types";

type ClientAccessPageProps = {
    pageSkeleton: React.ReactNode;
};

/** Como cada estado se apresenta. O texto de apoio diz o que aquele estado significa na prática. */
const STATUS_META: Record<AccessStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; hint: string }> = {
    ativo: { label: "Ativo", variant: "default", hint: "Senha criada, acesso valendo." },
    pendente: { label: "Convite pendente", variant: "secondary", hint: "Convite enviado, aguardando a criação da senha." },
    expirado: { label: "Convite expirado", variant: "outline", hint: "O link venceu. O convidado pode renovar sozinho, ou você reenvia." },
    desativado: { label: "Desativado", variant: "destructive", hint: "Acesso revogado. O histórico fica preservado e dá para reativar." },
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function ClientAccessPage({ pageSkeleton }: ClientAccessPageProps) {
    const params = useParams<{ clientId: string }>();
    const router = useRouter();
    const clientId = params?.clientId;

    const [access, setAccess] = useState<IClientAccess[]>([]);
    const [clientName, setClientName] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [inviting, setInviting] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);

    const { makeRequest } = useFetch();
    const { confirm, ConfirmationDialog } = useConfirmation();

    async function load() {
        if (!clientId) return;

        const response = await makeRequest("get", `/clients/${clientId}/access`);

        if (response?.status === 200) {
            setAccess(response.access ?? []);
            setClientName(response.client?.companyName ?? "");
        } else if (response?.message) {
            toast.error("Não foi possível carregar os acessos", { description: response.message });
        }

        setInitialLoaded(true);
    }

    useEffect(() => {
        load();
    }, [clientId]);

    async function handleInvite(event: React.FormEvent) {
        event.preventDefault();

        const cleaned = email.replace(/\s+/g, "");

        if (!cleaned.includes("@")) {
            toast.error("Informe um e-mail válido");
            return;
        }

        setInviting(true);

        const response = await makeRequest("post", `/clients/${clientId}/access`, { email: cleaned, fullName: fullName.trim() || undefined });

        setInviting(false);

        if (response?.status === 201) {
            // Quem já tinha senha no sistema não recebe convite: o acesso nasce valendo.
            const jaTinhaSenha = response.payload?.status === "ativo";

            toast.success(jaTinhaSenha ? "Acesso liberado" : "Convite enviado", {
                description: jaTinhaSenha ? `${cleaned} já tinha uma senha no sistema e passou a ver os dados deste cliente.` : `${cleaned} vai receber um e-mail para criar a senha.`,
            });

            setEmail("");
            setFullName("");
            load();
            return;
        }

        toast.error("Não foi possível convidar", { description: response?.message ?? "Tente novamente." });
    }

    async function handleResend(item: IClientAccess) {
        setBusyId(item.id);
        const response = await makeRequest("post", `/client-access/${item.id}/resend`);
        setBusyId(null);

        if (response?.status === 200) {
            toast.success("Convite reenviado", { description: `Um novo link foi enviado para ${item.email}.` });
            load();
            return;
        }

        toast.error("Não foi possível reenviar", { description: response?.message ?? "Tente novamente." });
    }

    async function handleToggleActive(item: IClientAccess) {
        const desativando = item.status !== "desativado";

        if (desativando) {
            const ok = await confirm({
                title: "Desativar este acesso?",
                description: `${item.email} deixa de entrar imediatamente. O histórico é preservado e você pode reativar depois, sem refazer o convite.`,
                confirmText: "Desativar",
                variant: "destructive",
            });

            if (!ok) return;
        }

        setBusyId(item.id);
        const response = await makeRequest("put", `/client-access/${item.id}/active`, { isActive: !desativando });
        setBusyId(null);

        if (response?.status === 200) {
            toast.success(response.message);
            load();
            return;
        }

        toast.error("Não foi possível alterar o acesso", { description: response?.message ?? "Tente novamente." });
    }

    async function handleRemove(item: IClientAccess) {
        const ok = await confirm({
            title: "Remover este acesso?",
            description: `O vínculo de ${item.email} com este cliente é apagado, junto com o histórico. Para apenas suspender o acesso, prefira desativar.`,
            confirmText: "Remover",
            variant: "destructive",
        });

        if (!ok) return;

        setBusyId(item.id);
        const response = await makeRequest("delete", `/client-access/${item.id}`);
        setBusyId(null);

        if (response?.status === 200) {
            toast.success(response.message);
            load();
            return;
        }

        toast.error("Não foi possível remover", { description: response?.message ?? "Tente novamente." });
    }

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <ConfirmationDialog />

            <Button variant="ghost" onClick={() => router.push("/clients")} className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para clientes
            </Button>

            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Acessos {clientName ? `— ${clientName}` : ""}</h1>
                    <p className="text-sm text-muted-foreground">Cada pessoa da empresa tem o seu próprio login. Revogar um não derruba os outros.</p>
                </div>
            </div>

            {/* Convite */}
            <Card className="mb-6 p-5">
                <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-mail de quem vai acessar" maxLength={254} className="flex-1" />
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="nome (opcional)" maxLength={150} className="sm:w-48" />
                    <Button type="submit" disabled={inviting} className="sm:w-auto">
                        {inviting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        Convidar
                    </Button>
                </form>
                <p className="mt-3 text-xs text-muted-foreground">A senha é criada pela própria pessoa, pelo link do e-mail — você nunca precisa manuseá-la. O link vale por 48 horas e, se expirar, o convidado consegue renovar sozinho.</p>
            </Card>

            {/* Lista */}
            {access.length === 0 ? (
                <Card className="p-10 text-center">
                    <Mail className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="font-medium">Nenhum acesso criado</p>
                    <p className="mt-1 text-sm text-muted-foreground">Este cliente ainda não consegue entrar no sistema. Convide alguém acima para liberar.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {access.map((item) => {
                        const meta = STATUS_META[item.status];
                        const busy = busyId === item.id;
                        const podeReenviar = item.status === "pendente" || item.status === "expirado";

                        return (
                            <Card key={item.id} className="p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <Avatar className="h-11 w-11 shrink-0">
                                        <AvatarFallback className="bg-primary/15 font-semibold text-primary">{item.email.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate font-medium">{item.fullName || item.email}</p>
                                            <Badge variant={meta.variant}>{meta.label}</Badge>
                                            {/* Reenvio repetido quase nunca é convidado desatento — é e-mail que não chega. */}
                                            {item.inviteSentCount >= 3 && !item.acceptedAt && <Badge variant="destructive">{item.inviteSentCount}º envio</Badge>}
                                        </div>
                                        {item.fullName && <p className="truncate text-sm text-muted-foreground">{item.email}</p>}
                                        <p className="mt-1 text-xs text-muted-foreground">{meta.hint}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{item.acceptedAt ? `Último acesso: ${formatDate(item.lastLoginAt)}` : `Convite enviado: ${formatDate(item.inviteSentAt)}`}</p>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                                        {podeReenviar && (
                                            <Button variant="outline" size="sm" onClick={() => handleResend(item)} disabled={busy}>
                                                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                                                Reenviar
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" onClick={() => handleToggleActive(item)} disabled={busy}>
                                            {item.status === "desativado" ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                                            {item.status === "desativado" ? "Reativar" : "Desativar"}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemove(item)} disabled={busy} aria-label="Remover acesso" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
