"use client";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Shield } from "lucide-react";

interface IBrandOption {
    id: number;
    name: string;
    assetType?: string;
    logo_url?: string | null;
}

/** Quantos ativos por requisição — enche a janela de 300px com folga antes de precisar da próxima. */
const PAGE_SIZE = 20;

/** Distância do fim da lista, em pixels, que dispara a página seguinte. */
const SCROLL_THRESHOLD = 48;

/** Miniatura do ativo: exibe a imagem (logo_url) quando houver, com fallback no ícone Shield — igual à página de ativos. */
function BrandThumb({ logoUrl }: { logoUrl?: string | null }) {
    if (logoUrl) {
        return (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
                <img
                    src={logoUrl}
                    alt="Imagem do ativo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
        </div>
    );
}

interface BrandsSelectProps {
    clientId: string;
    brandName: string;
    value: string;
    onChange: (value: string, name: string) => void;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
    disabled?: boolean;
}

export function BrandsSelect({ clientId, brandName, value, onChange, makeRequest, disabled }: BrandsSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [brands, setBrands] = useState<IBrandOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);

    /**
     * Ativo escolhido, guardado inteiro.
     *
     * A miniatura do botão saía de procurar o `value` na lista carregada — o que funcionava
     * quando a lista vinha inteira de uma vez. Com paginação o escolhido pode não estar na
     * página atual, e a imagem sumiria do botão ao reabrir o seletor.
     */
    const [selectedOption, setSelectedOption] = useState<IBrandOption | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    /** Identifica a requisição em curso: digitando rápido as respostas não voltam na ordem em
     *  que saíram, e a de um termo antigo não pode sobrescrever a do atual. */
    const requestIdRef = useRef(0);

    const isDisabled = disabled || !clientId;

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

    // Trocar de cliente invalida tudo: os ativos são outros.
    useEffect(() => {
        setBrands([]);
        setTotal(0);
        setSelectedOption(null);
        setQuery("");
        setOpen(false);
    }, [clientId]);

    /**
     * Carrega uma página de ativos. `append` distingue a rolagem (soma ao que já está na tela)
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
            const response = await makeRequest("get", `/brand-options?clientId=${encodeURIComponent(clientId)}&search=${encodeURIComponent(search)}&skip=${skip}&take=${PAGE_SIZE}`);

            // Chegou tarde: outra busca já partiu depois desta e é ela que manda na tela.
            if (requestId !== requestIdRef.current) return;

            const page: IBrandOption[] = response?.brands ?? [];
            setBrands((previous) => (append ? [...previous, ...page] : page));
            setTotal(response?.count ?? 0);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;

            console.error("Erro ao buscar marcas:", error);

            // Numa falha ao rolar, o que já está na tela continua valendo.
            if (!append) {
                setBrands([]);
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
     * Abrir carrega na hora; digitar espera 300ms para não disparar uma busca por letra.
     */
    useEffect(() => {
        if (!open || !clientId) return;

        // A lista pode ter ficado rolada da consulta anterior; a nova começa do topo.
        if (listRef.current) listRef.current.scrollTop = 0;

        const delay = setTimeout(() => fetchPage(0, query, false), query.trim() === "" ? 0 : 300);
        return () => clearTimeout(delay);
    }, [open, query, clientId]);

    /** Puxa a próxima página quando a rolagem se aproxima do fim. */
    const handleScroll = () => {
        const list = listRef.current;

        if (!list || isLoading || isLoadingMore) return;
        if (brands.length >= total) return;
        if (list.scrollHeight - list.scrollTop - list.clientHeight > SCROLL_THRESHOLD) return;

        fetchPage(brands.length, query, true);
    };

    // Ativo atualmente selecionado, para exibir sua miniatura no botão
    const selectedBrand = selectedOption ?? brands.find((brand) => String(brand.id) === value) ?? null;

    const handleSelect = (brand: IBrandOption) => {
        onChange(String(brand.id), brand.name);
        setSelectedOption(brand);
        setQuery("");
        setOpen(false);
    };

    const handleToggle = () => {
        if (isDisabled) return;
        setOpen(!open);
        if (!open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button type="button" onClick={handleToggle} disabled={isDisabled} className={`text-sm w-full flex items-center justify-between gap-2 px-3 py-2 border border-border rounded-md bg-gray focus:outline-none focus:ring-2 focus:ring-ring ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}>
                <span className="flex items-center gap-2 min-w-0">
                    {brandName && <BrandThumb logoUrl={selectedBrand?.logo_url} />}
                    <span className={`truncate ${brandName ? "text-foreground" : "text-muted-foreground"}`}>{brandName || (clientId ? "Selecione uma marca" : "Selecione um cliente primeiro")}</span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                        <input ref={inputRef} type="text" placeholder="Buscar marca pelo nome..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div ref={listRef} onScroll={handleScroll} className="max-h-[300px] overflow-auto">
                        {isLoading ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">Buscando...</div>
                        ) : brands.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">{query.trim() === "" ? "Nenhuma marca cadastrada para este cliente." : "Nenhuma marca encontrada."}</div>
                        ) : (
                            <>
                                {brands.map((brand) => (
                                    <button key={brand.id} type="button" onClick={() => handleSelect(brand)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-left">
                                        <Check className={`h-4 w-4 flex-shrink-0 ${value === String(brand.id) ? "opacity-100 text-primary" : "opacity-0"}`} />
                                        <BrandThumb logoUrl={brand.logo_url} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-foreground truncate">{brand.name}</span>
                                            {brand.assetType && <span className="text-sm text-muted-foreground truncate">{brand.assetType === "product" ? "Produto" : "Marca"}</span>}
                                        </div>
                                    </button>
                                ))}

                                {isLoadingMore && <div className="px-3 py-3 text-center text-sm text-muted-foreground">Carregando mais...</div>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
