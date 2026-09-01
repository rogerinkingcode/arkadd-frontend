"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/LanguageProvider";

/**
 * Alternância entre português e inglês.
 *
 * Mostra o código do idioma **atual** ao lado do ícone. A alternativa — mostrar para onde o
 * clique leva — economiza um clique de quem já sabe o que quer e confunde todo o resto.
 *
 * Espera montar antes de escrever o código, como o `ThemeToggle`: o idioma real só é
 * conhecido no cliente, e imprimi-lo no servidor divergiria da hidratação.
 */
export function LanguageToggle({ className }: { className?: string }) {
    const { lang, setLang, t } = useT();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Button variant="ghost" size="sm" className={className} aria-label={t("language.label")} title={lang === "pt" ? "Switch to English" : "Mudar para português"} onClick={() => setLang(lang === "pt" ? "en" : "pt")}>
            <Languages className="h-4 w-4" />
            <span className="ml-1.5 text-xs font-semibold uppercase">{mounted ? lang : ""}</span>
        </Button>
    );
}
