"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";
import { useT } from "@/lib/i18n/LanguageProvider";
import AuthShell from "../../../_components/AuthShell";

const MIN_PASSWORD_LENGTH = 8;

type InviteState = { loading: true } | { loading: false; valid: true; email: string; companyName: string } | { loading: false; valid: false; expired: boolean; alreadyAccepted?: boolean };

export default function AcceptInvite() {
    const params = useParams<{ token: string }>();
    const router = useRouter();
    const token = params?.token;

    const [state, setState] = useState<InviteState>({ loading: true });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const { makeRequest } = useFetch();
    const { t } = useT();

    useEffect(() => {
        async function inspect() {
            if (!token) return;

            const response = await makeRequest("get", `/invite/${token}`);

            if (response?.valid) {
                setState({ loading: false, valid: true, email: response.email, companyName: response.companyName });
                return;
            }

            setState({ loading: false, valid: false, expired: Boolean(response?.expired), alreadyAccepted: Boolean(response?.alreadyAccepted) });
        }

        inspect();
    }, [token]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (password.length < MIN_PASSWORD_LENGTH) {
            toast.error(t("auth.passwordTooShort", { count: MIN_PASSWORD_LENGTH }));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t("auth.passwordMismatchTitle"), { description: t("auth.passwordMismatchDescription") });
            return;
        }

        setSubmitting(true);

        const response = await makeRequest("post", "/invite/accept", { token, password, fullName: fullName.trim() || undefined });

        setSubmitting(false);

        if (response?.status === 200) {
            // Já entra logado: quem acabou de clicar no link do próprio e-mail provou que é dono
            // dele. Pedir a senha de novo em seguida seria só atrito.
            toast.success(t("invite.successTitle"), { description: t("invite.successDescription") });
            router.push("/dashboard");
            return;
        }

        toast.error(t("invite.failTitle"), { description: response?.message ?? t("auth.tryAgain") });
    }

    async function handleResend() {
        setResending(true);

        const response = await makeRequest("post", "/invite/resend", { token });

        setResending(false);

        if (response?.status === 200) {
            setResent(true);
            toast.success(t("invite.renewedTitle"), { description: response.message });
            return;
        }

        toast.error(t("invite.renewFailTitle"), { description: response?.message ?? t("invite.renewFailDescription") });
    }

    if (state.loading) {
        return (
            <AuthShell title={t("invite.title")}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </AuthShell>
        );
    }

    if (!state.valid) {
        // Um convite expirado é o caso comum e tem saída própria: o convidado renova sozinho, e
        // o novo link vai para o mesmo e-mail — nunca para um endereço digitado aqui.
        if (state.expired) {
            return (
                <AuthShell title={t("invite.expiredTitle")} description={t("invite.expiredDescription")}>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                            <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{t(resent ? "invite.expiredResent" : "invite.expiredCanResend")}</p>
                        </div>

                        {!resent && (
                            <Button onClick={handleResend} disabled={resending} className="w-full">
                                {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("invite.resend")}
                            </Button>
                        )}

                        <div className="text-center text-sm">
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                {t("auth.backToLogin")}
                            </Link>
                        </div>
                    </div>
                </AuthShell>
            );
        }

        return (
            <AuthShell title={t("invite.invalidTitle")} description={t(state.alreadyAccepted ? "invite.alreadyAccepted" : "invite.notValid")}>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{t(state.alreadyAccepted ? "invite.alreadyAcceptedHint" : "invite.invalidHint")}</p>
                    <Button asChild className="w-full">
                        <Link href="/login">{t("auth.goToLogin")}</Link>
                    </Button>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell title={t("invite.createTitle")} description={t("invite.createDescription", { company: state.companyName })}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    {/* Vem do token, não é editável: o convite é para este endereço. */}
                    <Input id="email" value={state.email} disabled readOnly />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fullName">{t("invite.yourName")}</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("invite.yourNamePlaceholder")} maxLength={150} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">{t("invite.password")}</Label>
                    <PasswordInput id="password" withLockIcon value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                    <p className="text-xs text-muted-foreground">{t("auth.minChars", { count: MIN_PASSWORD_LENGTH })}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("invite.confirmPassword")}</Label>
                    <PasswordInput id="confirmPassword" withLockIcon value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("invite.submit")}
                </Button>
            </form>
        </AuthShell>
    );
}
