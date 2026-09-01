"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, lookup, type Lang } from "./dictionary";

const STORAGE_KEY = "apex.lang";

interface ILanguageContext {
    lang: Lang;
    setLang: (lang: Lang) => void;
    /** Traduz a chave. `vars` substitui `{nome}` no texto. */
    t: (key: string, vars?: Record<string, string | number>) => string;
    /**
     * Traduz escolhendo entre `<chave>.one` e `<chave>.other` pela contagem, e já injeta
     * `{count}`. Português e inglês concordam na regra (1 é singular, o resto plural), que é
     * o que permite uma função só para os dois.
     */
    tn: (key: string, count: number, vars?: Record<string, string | number>) => string;
    /** Locale para `toLocaleString`/`toLocaleDateString` — datas seguem o idioma da tela. */
    locale: string;
}

const LanguageContext = createContext<ILanguageContext | null>(null);

/**
 * Idioma do painel.
 *
 * Começa em `pt` e só troca depois de montar. É o mesmo motivo do `mounted` no `ThemeToggle`:
 * o servidor não sabe o idioma do navegador, então decidir no primeiro render divergiria da
 * hidratação. Quem está no Brasil não vê troca nenhuma; quem está fora vê o painel virar
 * inglês logo após carregar.
 *
 * A escolha manual vence a detecção e fica salva — o analista da Meta que apertar o seletor
 * continua em inglês nas próximas telas.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("pt");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored === "pt" || stored === "en") {
            setLangState(stored);
            return;
        }

        // Sem escolha salva, o navegador decide. Qualquer variante de português (pt, pt-BR,
        // pt-PT) fica em português; o resto do mundo recebe inglês.
        const browser = navigator.language?.toLowerCase() ?? "";
        setLangState(browser.startsWith("pt") ? "pt" : "en");
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        localStorage.setItem(STORAGE_KEY, next);
        setLangState(next);
    }, []);

    const t = useCallback(
        (key: string, vars?: Record<string, string | number>) => {
            const text = lookup(dictionary[lang], key) ?? lookup(dictionary.pt, key) ?? key;

            if (!vars) {
                return text;
            }

            return Object.entries(vars).reduce((acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)), text);
        },
        [lang],
    );

    const tn = useCallback((key: string, count: number, vars?: Record<string, string | number>) => t(`${key}.${count === 1 ? "one" : "other"}`, { count, ...vars }), [t]);

    const locale = lang === "pt" ? "pt-BR" : "en-US";

    const value = useMemo(() => ({ lang, setLang, t, tn, locale }), [lang, setLang, t, tn, locale]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Fora do provider devolve o português direto, sem quebrar a tela.
 *
 * Há telas públicas que não passam pelo provider, e uma exceção aqui derrubaria a página
 * inteira por causa de um rótulo.
 */
export function useT(): ILanguageContext {
    const context = useContext(LanguageContext);

    if (context) {
        return context;
    }

    const fallback = (key: string, vars?: Record<string, string | number>) => {
        const text = lookup(dictionary.pt, key) ?? key;

        if (!vars) {
            return text;
        }

        return Object.entries(vars).reduce((acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)), text);
    };

    return {
        lang: "pt",
        setLang: () => {},
        t: fallback,
        tn: (key, count, vars) => fallback(`${key}.${count === 1 ? "one" : "other"}`, { count, ...vars }),
        locale: "pt-BR",
    };
}
