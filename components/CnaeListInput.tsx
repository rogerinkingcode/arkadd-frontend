"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/** `4751201` → `4751-2/01`, o formato do IBGE. */
export const formatCnae = (code: string) => (code.length === 7 ? `${code.slice(0, 4)}-${code.slice(4, 5)}/${code.slice(5)}` : code);

/** Só os dígitos, e só se forem os 7 de um CNAE. */
const toCode = (text: string) => {
    const digits = text.replace(/\D/g, "");
    return digits.length === 7 ? digits : null;
};

type CnaeListInputProps = {
    id?: string;
    /** Controlado: a lista e quem a altera. Sem eles, o campo guarda a própria lista. */
    value?: string[];
    onChange?: (codes: string[]) => void;
    /** Não controlado: a lista inicial. */
    defaultValue?: string[];
    /** Com `name`, a lista vai no formulário como JSON num campo oculto (o `FormData` a lê). */
    name?: string;
    /** Exige ao menos um CNAE para enviar o formulário. */
    required?: boolean;
    placeholder?: string;
    max?: number;
};

/**
 * Vários CNAEs num campo só: digite o código (com ou sem máscara) e Enter, vírgula ou espaço o
 * transforma num selo; o "x" remove. O primeiro da lista é o principal.
 *
 * O código digitado e ainda não confirmado também conta — quem digita um CNAE e já clica em
 * salvar não perde o que escreveu.
 */
export function CnaeListInput({ id, value, onChange, defaultValue = [], name, required, placeholder = "Ex: 4751201 e Enter", max = 20 }: CnaeListInputProps) {
    const [own, setOwn] = useState<string[]>(defaultValue);
    const [text, setText] = useState("");

    const codes = value ?? own;
    const setCodes = (next: string[]) => (onChange ? onChange(next) : setOwn(next));

    const pending = toCode(text);
    const submitted = pending && !codes.includes(pending) ? [...codes, pending] : codes;

    const commit = () => {
        const parts = text
            .split(/[,;\s]+/)
            .map(toCode)
            .filter((code): code is string => Boolean(code));
        const next = [...codes];

        for (const code of parts) if (!next.includes(code) && next.length < max) next.push(code);

        if (next.length !== codes.length) setCodes(next);
        setText("");
    };

    return (
        <div className="space-y-2">
            {codes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {codes.map((code, index) => (
                        <Badge key={code} variant={index === 0 ? "default" : "secondary"} className="gap-1 pr-1 tabular-nums" title={index === 0 ? "CNAE principal" : "CNAE secundário"}>
                            {formatCnae(code)}
                            <button type="button" onClick={() => setCodes(codes.filter((item) => item !== code))} aria-label={`Remover o CNAE ${formatCnae(code)}`} className="rounded-sm p-0.5 hover:bg-black/10">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <Input
                id={id}
                value={text}
                inputMode="numeric"
                placeholder={codes.length >= max ? `Máximo de ${max} CNAEs` : placeholder}
                disabled={codes.length >= max}
                onChange={(event) => setText(event.target.value.replace(/[^\d.\-/,;\s]/g, ""))}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === "," || event.key === ";") {
                        event.preventDefault();
                        commit();
                    }

                    if (event.key === "Backspace" && !text && codes.length > 0) setCodes(codes.slice(0, -1));
                }}
                onBlur={commit}
                // Sem nenhum CNAE, o próprio campo de texto barra o envio do formulário
                required={required && submitted.length === 0}
            />

            {name && <input type="hidden" name={name} value={JSON.stringify(submitted)} />}
        </div>
    );
}
