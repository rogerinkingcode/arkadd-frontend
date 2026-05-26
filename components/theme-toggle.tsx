"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Botão de alternância entre tema claro e escuro.
 *  Espera o componente montar antes de exibir o ícone para evitar
 *  divergência de hidratação (o tema só é conhecido no cliente). */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";

    return (
        <Button variant="ghost" size="icon" className={className} aria-label="Alternar tema claro/escuro" onClick={() => setTheme(isDark ? "light" : "dark")}>
            {mounted ? isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 opacity-0" />}
        </Button>
    );
}
