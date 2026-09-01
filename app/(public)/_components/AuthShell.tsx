"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useT } from "@/lib/i18n/LanguageProvider";
import WaterSurface from "./WaterSurface";

/**
 * Moldura das telas públicas de credencial (convite, esqueci a senha, redefinir senha).
 *
 * Repete o enquadramento do login por inteiro, superfície de água inclusive: quem chega aqui
 * vem de um e-mail e nunca viu o login, então é esta a primeira tela do sistema para ele.
 */
export default function AuthShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    const { t } = useT();

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="apex-water-panel absolute inset-x-0 bottom-0 h-1/2" aria-hidden="true" />
            <div className="apex-glow absolute -right-24 -top-32 h-96 w-96 rounded-full" aria-hidden="true" />
            <div className="apex-glow absolute -bottom-40 -left-24 h-96 w-96 rounded-full" aria-hidden="true" />

            {/* Superfície de água: cobre a tela inteira, por cima das duas cores, e responde ao
                cursor como se ele fosse um dedo passando na água. */}
            <WaterSurface className="pointer-events-none absolute inset-0 h-full w-full" />

            <div className="absolute right-4 top-4 z-20 flex items-center gap-1">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain brightness-75 dark:brightness-200" />
                        </div>
                        <p className="text-sm text-muted-foreground">{t("login.tagline")}</p>
                    </div>

                    <Card className="border-border/70 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                            {description && <CardDescription>{description}</CardDescription>}
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
