"use client";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Users } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

interface IClient {
    id: string;
    email: string;
    companyName: string;
    companyRepresentative: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    brand: any[];
}

interface ClientsSearchSelectProps {
    companyName: string;
    value: string;
    /** Recebe o id do cliente; o objeto completo vem como 2º argumento para quem precisar do nome. */
    onChange: (value: any, client?: IClient) => void;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
}

// Limita o texto exibido para não quebrar a linha do input
const truncateLabel = (text: string, max = 25) => (text.length > max ? text.slice(0, max) + "..." : text);

/** Quantos clientes por requisição. O seletor mostra ~6 de cada vez, então isto já enche a lista
 *  com folga para rolar antes de precisar da próxima página. */
const PAGE_SIZE = 20;

/** Distância do fim da lista, em pixels, que dispara a página seguinte. Carregar antes de bater
 *  no fim é o que faz a rolagem parecer contínua em vez de travar e destravar. */
const SCROLL_THRESHOLD = 48;

/**
 * Imagem do cliente na lista.
 *
 * O `Client` não guarda imagem própria — quem tem logo é o **ativo** (`Brand.logo_url`). Então
 * usamos a do primeiro ativo que tiver uma: `find` em vez de `[0]` porque o primeiro ativo
 * cadastrado pode ter ficado sem logo, e aí a do segundo serve igual para reconhecer o cliente.
 *
 * Sem logo — ou com a URL quebrada — cai no mesmo ícone que a tabela da página de Clientes usa,
 * para a linha nunca ficar com um buraco no lugar da imagem.
 */
function ClientLogo({ client }: { client: IClient }) {
    const [broken, setBroken] = useState(false);
    const logoUrl: string | null = client.brand?.find((brand) => brand?.logo_url)?.logo_url ?? null;

    if (!logoUrl || broken) {
        return (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
            </div>
        );
    }

    // `alt` vazio de propósito: o nome do cliente está ao lado, e repeti-lo faria o leitor de
    // tela anunciar a mesma informação duas vezes.
    return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
            <img src={logoUrl} alt="" className="h-full w-full object-contain" onError={() => setBroken(true)} />
        </div>
    );
}

export function ClientsSelect({ companyName, value, onChange, makeRequest }: ClientsSearchSelectProps) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<IClient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedName, setSelectedName] = useState(companyName);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    /** Identifica a requisição em curso. Digitar rápido dispara várias buscas e elas não voltam
     *  na ordem em que saíram — sem isto, a resposta de "ap" pode chegar depois da de "apex" e
     *  sobrescrever a lista com o resultado do termo antigo. */
    const requestIdRef = useRef(0);

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    /**
     * Carrega uma página de clientes. `append` distingue a rolagem (soma ao que já está na tela)
     * da busca nova (substitui).
     */
    const fetchPage = async (skip: number, search: string, append: boolean) => {
        const requestId = ++requestIdRef.current;

        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await makeRequest("get", `/search-client?search=${encodeURIComponent(search)}&skip=${skip}&take=${PAGE_SIZE}`);

            // Chegou tarde: outra busca já partiu depois desta e é ela que manda na tela.
            if (requestId !== requestIdRef.current) return;

            const page: IClient[] = response?.client ?? [];
            setResults((previous) => (append ? [...previous, ...page] : page));
            setTotal(response?.count ?? 0);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;

            console.error("Erro ao buscar clientes:", error);

            // Numa falha ao rolar, o que já está na tela continua valendo — limpar tudo puniria
            // o usuário por um erro que aconteceu no fim da lista.
            if (!append) {
                setResults([]);
                setTotal(0);
            }
        } finally {
            if (requestId !== requestIdRef.current) return;

            if (append) {
                setIsLoadingMore(false);
            } else {
                setIsLoading(false);
            }
        }
    };

    /**
     * Primeira página: ao abrir o seletor e a cada mudança do termo.
     *
     * Abrir carrega na hora; digitar espera 300ms. A pausa serve para não disparar uma busca por
     * letra, e não faz sentido ao abrir, quando não há o que esperar o usuário terminar.
     */
    useEffect(() => {
        if (!open) return;

        // A lista pode ter ficado rolada da consulta anterior; a nova começa do topo.
        if (listRef.current) listRef.current.scrollTop = 0;

        const delay = setTimeout(() => fetchPage(0, query, false), query.trim() === "" ? 0 : 300);
        return () => clearTimeout(delay);
    }, [open, query]);

    /** Puxa a próxima página quando a rolagem se aproxima do fim. */
    const handleScroll = () => {
        const list = listRef.current;

        if (!list || isLoading || isLoadingMore) return;
        if (results.length >= total) return;
        if (list.scrollHeight - list.scrollTop - list.clientHeight > SCROLL_THRESHOLD) return;

        fetchPage(results.length, query, true);
    };

    const handleSelect = (client: IClient) => {
        onChange(String(client.id), client);
        setSelectedName(client.companyName);
        setQuery("");
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(!open);
        if (!open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/*<input type="hidden" name={companyName || ""} value={value ?? ""} />*/}

            <button type="button" onClick={handleToggle} className="text-sm w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-gray focus:outline-none focus:ring-2 focus:ring-ring">
                <span className={selectedName ? "text-foreground" : "text-muted-foreground"}>{selectedName ? truncateLabel(selectedName) : t("clientsSelect.placeholder")}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                        <input ref={inputRef} type="text" placeholder={t("clientsSelect.searchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div ref={listRef} onScroll={handleScroll} className="max-h-[300px] overflow-auto">
                        {isLoading ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">{t("clientsSelect.searching")}</div>
                        ) : results.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">{t(query.trim() === "" ? "clientsSelect.noneRegistered" : "clientsSelect.noneFound")}</div>
                        ) : (
                            <>
                                {results.map((client) => (
                                    <button key={client.id} type="button" onClick={() => handleSelect(client)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-left">
                                        <Check className={`h-4 w-4 flex-shrink-0 ${value === client.id ? "opacity-100 text-primary" : "opacity-0"}`} />
                                        <ClientLogo client={client} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-foreground">{client.companyName}</span>
                                            <span className="text-sm text-muted-foreground truncate">{client.email}</span>
                                        </div>
                                    </button>
                                ))}

                                {isLoadingMore && <div className="px-3 py-3 text-center text-sm text-muted-foreground">{t("clientsSelect.loadingMore")}</div>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
