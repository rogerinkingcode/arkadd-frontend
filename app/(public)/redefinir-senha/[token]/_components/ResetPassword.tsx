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
import { useT } from "@/lib/i18n/LanguageProvider";
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
    const { t } = useT();

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
            toast.error(t("auth.passwordTooShort", { count: MIN_PASSWORD_LENGTH }));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t("auth.passwordMismatchTitle"), { description: t("auth.passwordMismatchDescription") });
            return;
        }

        setSubmitting(true);

        const response = await makeRequest("post", "/password/reset", { token, password });

        setSubmitting(false);

        if (response?.status === 200) {
            toast.success(t("reset.successTitle"), { description: t("reset.successDescription") });
            router.push("/login");
            return;
        }

        toast.error(t("reset.failTitle"), { description: response?.message ?? t("reset.failDescription") });
    }

    if (state.loading) {
        return (
            <AuthShell title={t("reset.title")}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </AuthShell>
        );
    }

    if (!state.valid) {
        return (
            <AuthShell title={t("reset.invalidTitle")} description={t("reset.invalidDescription")}>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{t("reset.invalidHint")}</p>
                    <Button asChild className="w-full">
                        <Link href="/esqueci-senha">{t("reset.requestNew")}</Link>
                    </Button>
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
        <AuthShell title={t("reset.newPasswordTitle")} description={state.email}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">{t("reset.newPassword")}</Label>
                    <PasswordInput id="password" withLockIcon value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                    <p className="text-xs text-muted-foreground">{t("auth.minChars", { count: MIN_PASSWORD_LENGTH })}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("reset.confirmNewPassword")}</Label>
                    <PasswordInput id="confirmPassword" withLockIcon value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={60} required />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("reset.submit")}
                </Button>
            </form>
        </AuthShell>
    );
}
