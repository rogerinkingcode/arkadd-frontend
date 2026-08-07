"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../../_components/AuthShell";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState<string | null>(null);

    const { makeRequest } = useFetch();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setSubmitting(true);

        const response = await makeRequest("post", "/password/forgot", { email: email.replace(/\s+/g, "") });

        setSubmitting(false);

        if (response?.status === 429) {
            toast.error("Muitas tentativas", { description: response.message });
            return;
        }

        if (response?.status === 200) {
            // A resposta é deliberadamente vaga e idêntica exista ou não a conta: se dissesse
            // "e-mail não encontrado", este formulário viraria um verificador público de quem
            // é cliente da plataforma.
            setSent(response.message);
            return;
        }

        toast.error("Não foi possível concluir", { description: response?.message ?? "Tente novamente." });
    }

    if (sent) {
        return (
            <AuthShell title="Verifique seu e-mail">
                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm text-muted-foreground">{sent}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">O link vale por 1 hora e só pode ser usado uma vez. Pedir um novo invalida o anterior — se receber mais de um e-mail, use sempre o mais recente.</p>
                    <Button asChild className="w-full">
                        <Link href="/login">Voltar ao login</Link>
                    </Button>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell title="Esqueci minha senha" description="Informe seu e-mail e enviaremos as instruções.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-9" maxLength={254} required />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar instruções
                </Button>

                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Voltar ao login
                    </Link>
                </div>
            </form>
        </AuthShell>
    );
}
