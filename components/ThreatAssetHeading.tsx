"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

interface IThreatAssetHeadingProps {
    assetName?: string;
    /** URL do logo do ativo. A página envia `"void"` quando o ativo não tem logo cadastrado. */
    logoUrl?: string;
}

/**
 * Logo + nome do ativo dentro do popup de detalhes — a mesma dupla exibida no topo da página.
 * Repete-se aqui porque o popup cobre a tela e, sem isso, a ocorrência aparece sem indicar a
 * qual ativo pertence.
 */
export default function ThreatAssetHeading({ assetName, logoUrl }: IThreatAssetHeadingProps) {
    const [logoError, setLogoError] = useState(false);
    const hasLogo = !!logoUrl && logoUrl !== "void" && !logoError;

    if (!assetName && !hasLogo) {
        return null;
    }

    return (
        <div className="flex items-center gap-3 border-b pb-4 text-left">
            {hasLogo ? (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                    <img src={logoUrl} alt={`Logo de ${assetName || "ativo"}`} className="h-full w-full object-contain" onError={() => setLogoError(true)} />
                </div>
            ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                </div>
            )}
            {assetName && <span className="text-lg font-semibold break-words">{assetName}</span>}
        </div>
    );
}
