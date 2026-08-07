"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";
import AuthShell from "../../../_components/AuthShell";

const MIN_PASSWORD_LENGTH = 8;

type ResetState = { loading: true } | { loading: false; valid: true; email: string } | { loading: false; valid: false };

export default function ResetPassword() {
    const params = useParams<{ token: string }>();
    const router = useRouter();
    const token = params?.token;

    const [state, setState] = useState<ResetState>({ loading: true });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { makeRequest } = useFetch();

    useEffect(() => {
        async function inspect() {
            if (!token) return;

            const response = await makeRequest("get", `/password/reset/${token}`);

            setState(response?.valid ? { loading: false, valid: true, email: response.email } : { loading: false, valid: false });
        }

        inspect();
    }, [token]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (password.length < MIN_PASSWORD_LENGTH) {
            toast.error(`A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("As senhas não conferem", { description: "Confirme a senha com a mesma senha." });
            return;
        }

        setSubmitting(true);

        const response = await makeRequest("post", "/password/reset", { token, password });

        setSubmitting(false);

        if (response?.status === 200) {
            toast.success("Senha redefinida", { description: "Entre com a nova senha." });
            router.push("/login");
            return;
        }

        toast.error("Não foi possível redefinir", { description: response?.message ?? "Solicite um novo link." });
    }

    if (state.loading) {
        return (
            <AuthShell title="Redefinir senha">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </AuthShell>
        );
    }

    if (!state.valid) {
        return (
            <AuthShell title="Link inválido ou expirado" description="Links de redefinição valem por 1 hora e só podem ser usados uma vez.">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Se você pediu mais de um link, use sempre o e-mail mais recente — pedir um novo invalida os anteriores.</p>
                    <Button asChild className="w-full">
                        <Link href="/esqueci-senha">Solicitar novo link</Link>
                    </Button>
                    <div className="text-center text-sm">
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Voltar ao login
                        </Link>
                    </div>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell title="Nova senha" description={state.email}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Nova senha</Label>
                    <PasswordInput id="password" withLockIcon value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                    <p className="text-xs text-muted-foreground">Mínimo de {MIN_PASSWORD_LENGTH} caracteres.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
                    <PasswordInput id="confirmPassword" withLockIcon value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Redefinir senha
                </Button>
            </form>
        </AuthShell>
    );
}
