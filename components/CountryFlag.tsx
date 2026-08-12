"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { countryCodeFromValue, countryName } from "@/lib/countryDisplay";

interface CountryFlagProps {
    /** O que veio do banco na coluna `country`. Aceita sujeira e resolve o que der. */
    country?: string | null;
    /** Como o país foi determinado (`tld`, `domain`, `url`, `ai`, `manual`). */
    countrySource?: string | null;
    /** Esconde o código ao lado da bandeira — para colunas apertadas. */
    compact?: boolean;
    className?: string;
}

/** Rótulo de cada origem, para o title do elemento. */
const SOURCE_LABEL: Record<string, string> = {
    tld: "identificado pelo domínio do país",
    domain: "identificado pela plataforma",
    url: "identificado por marcador na URL",
    ai: "deduzido por IA",
    manual: "definido manualmente",
};

/**
 * Bandeira do país de uma ocorrência.
 *
 * A bandeira vem como imagem, e não como emoji: o Windows não tem fonte de bandeira, e
 * `🇧🇷` aparece por lá como as duas letras "BR" — justamente onde o sistema é operado. O
 * `onError` devolve ao código em texto se a imagem não carregar, então a coluna nunca fica
 * vazia nem quebrada.
 */
export default function CountryFlag({ country, countrySource, compact = false, className }: CountryFlagProps) {
    const [imageError, setImageError] = useState(false);

    const code = countryCodeFromValue(country);

    // Sem país (acervo antigo, ou a IA indisponível na hora da gravação). Um traço diz
    // "ainda não sabemos" — esconder a célula faria parecer que a coluna não se aplica ali.
    if (!code) {
        return (
            <span className={cn("text-muted-foreground", className)} title="País ainda não identificado">
                —
            </span>
        );
    }

    const name = countryName(code);
    const origem = countrySource ? SOURCE_LABEL[countrySource] : undefined;
    const title = origem ? `${name} — ${origem}` : name;

    return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal", className)} title={title}>
            {!imageError ? (
                <img src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} alt="" aria-hidden="true" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" onError={() => setImageError(true)} loading="lazy" />
            ) : null}
            <span className={cn(compact && !imageError && "sr-only")}>{compact ? code : name}</span>
            {/* A origem só aparece quando foi palpite da IA: o que o domínio provou não precisa
                de ressalva, e marcar tudo poluiria a tabela. */}
            {countrySource === "ai" && !compact && <span className="text-[10px] text-muted-foreground">IA</span>}
        </Badge>
    );
}
