"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MoneyInputProps = {
    value: number;
    onChange: (value: number) => void;
    /** Casas decimais — o padrão são 2 (centavos). */
    decimals?: number;
    className?: string;
    id?: string;
    disabled?: boolean;
    "aria-label"?: string;
};

/** Teto de dígitos — evita número além da precisão segura e do que a coluna aceita. */
const MAX_DIGITS = 14;

const format = (value: number, decimals: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Campo de valor em reais com máscara: os dígitos entram pela direita, como numa maquininha
 * (digitar 1-5-0 dá R$ 1,50). Não há vírgula para errar nem valor inválido possível.
 */
export function MoneyInput({ value, onChange, decimals = 2, className, ...props }: MoneyInputProps) {
    const factor = 10 ** decimals;

    return (
        <Input
            {...props}
            type="text"
            inputMode="numeric"
            className={cn("tabular-nums", className)}
            value={format(value, decimals)}
            onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS);
                onChange(digits ? Number(digits) / factor : 0);
            }}
            onFocus={(e) => {
                // O cursor no fim: a máscara só faz sentido digitando da direita
                const input = e.currentTarget;
                requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
            }}
        />
    );
}
