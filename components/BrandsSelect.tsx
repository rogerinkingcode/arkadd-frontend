"use client";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

interface IBrandOption {
    id: number;
    name: string;
    assetType?: string;
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
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Carrega as marcas do cliente selecionado sempre que o cliente muda
    useEffect(() => {
        const fetchBrands = async () => {
            if (!clientId) {
                setBrands([]);
                return;
            }

            setIsLoading(true);

            try {
                const response = await makeRequest("get", `/brand-list?clientId=${encodeURIComponent(clientId)}&skip=0&take=1000`);
                setBrands(response?.brands || []);
            } catch (error) {
                console.error("Erro ao buscar marcas:", error);
                setBrands([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrands();
        setQuery("");
        setOpen(false);
    }, [clientId]);

    const filtered = brands.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase()));

    const handleSelect = (brand: IBrandOption) => {
        onChange(String(brand.id), brand.name);
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
            <button type="button" onClick={handleToggle} disabled={isDisabled} className={`text-sm w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-gray focus:outline-none focus:ring-2 focus:ring-ring ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}>
                <span className={brandName ? "text-foreground" : "text-muted-foreground"}>{brandName || (clientId ? "Selecione uma marca" : "Selecione um cliente primeiro")}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                        <input ref={inputRef} type="text" placeholder="Buscar marca pelo nome..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                        {isLoading ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">Buscando...</div>
                        ) : filtered.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">{brands.length === 0 ? "Nenhuma marca cadastrada para este cliente." : "Nenhuma marca encontrada."}</div>
                        ) : (
                            filtered.map((brand) => (
                                <button key={brand.id} type="button" onClick={() => handleSelect(brand)} className="w-full flex items-start gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-left">
                                    <Check className={`h-4 w-4 mt-1 flex-shrink-0 ${value === String(brand.id) ? "opacity-100 text-primary" : "opacity-0"}`} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-foreground">{brand.name}</span>
                                        {brand.assetType && <span className="text-sm text-muted-foreground truncate">{brand.assetType === "product" ? "Produto" : "Marca"}</span>}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
