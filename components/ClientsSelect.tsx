"use client";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

interface IClient {
    id: string;
    email: string;
    companyName: string;
    companyRepresentative: string;
    registrationNumber: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    brand: any[];
}

interface ClientsSearchSelectProps {
    companyName: string;
    value: string;
    onChange: (value: any) => void;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
}

export function ClientsSelect({ companyName, value, onChange, makeRequest }: ClientsSearchSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<IClient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedName, setSelectedName] = useState(companyName);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Busca em tempo real
    useEffect(() => {
        const fetchClients = async () => {
            if (query.trim() === "") {
                setResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            try {
                const response = await makeRequest("get", `/search-client?search=${encodeURIComponent(query)}`);
                setResults(response.client || []);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const delay = setTimeout(fetchClients, 300);
        return () => clearTimeout(delay);
    }, [query]);

    const handleSelect = (client: IClient) => {
        onChange(String(client.id));
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
                <span className={selectedName ? "text-foreground" : "text-muted-foreground"}>{selectedName || "Selecione um cliente"}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                        <input ref={inputRef} type="text" placeholder="Buscar por nome ou email..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                        {isLoading ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">Buscando...</div>
                        ) : results.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-muted-foreground">{query.trim() === "" ? "Digite para buscar" : "Nenhum cliente encontrado."}</div>
                        ) : (
                            results.map((client) => (
                                <button key={client.id} type="button" onClick={() => handleSelect(client)} className="w-full flex items-start gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-left">
                                    <Check className={`h-4 w-4 mt-1 flex-shrink-0 ${value === client.id ? "opacity-100 text-primary" : "opacity-0"}`} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-foreground">{client.companyName}</span>
                                        <span className="text-sm text-muted-foreground truncate">{client.email}</span>
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
