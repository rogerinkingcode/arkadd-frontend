"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Logo com skeleton enquanto o PNG carrega — evita o flash de ícone quebrado
 *  em rotas mais profundas durante o hard refresh. O `<img>` só entra no DOM
 *  quando a imagem já está completamente baixada (pré-carregada via new Image).
 *
 *  Fica em arquivo próprio porque o `app-layout` e o `LayoutSkeleton` mostram a mesma
 *  logo — e é justamente no skeleton, durante o hard refresh, que o ícone quebrado
 *  apareceria. */
export function LogoImg({ className }: { className?: string }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = "/logo.png";
        // Cache hit — `complete` já é true e o onload pode não disparar.
        if (img.complete && img.naturalWidth > 0) {
            setLoaded(true);
            return;
        }
        img.onload = () => setLoaded(true);
        img.onerror = () => setLoaded(false);
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, []);

    if (!loaded) {
        return <div className="h-full w-full rounded-md bg-white/15 animate-pulse" aria-hidden="true" />;
    }

    return <img src="/logo.png" alt="Logo" className={cn("h-full w-full object-contain animate-in fade-in duration-200", className)} />;
}
