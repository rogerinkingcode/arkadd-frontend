"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
    /** Cadeado à esquerda — as telas de autenticação usam; as de dentro do painel, não. */
    withLockIcon?: boolean;
};

/**
 * Campo de senha com o olho de mostrar/ocultar.
 *
 * O estado é **de cada campo**, não da tela: nos formulários de "nova senha" + "confirme a
 * senha", um botão só revelaria os dois de uma vez, e a confirmação existe justamente para
 * conferir o que foi digitado às cegas.
 *
 * Serve tanto ao uso controlado (`value`/`onChange`) quanto ao não controlado (`name` +
 * `FormData`), porque as telas do projeto usam os dois estilos.
 */
export function PasswordInput({ withLockIcon = false, className, disabled, ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            {withLockIcon && <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}

            <Input {...props} disabled={disabled} type={visible ? "text" : "password"} className={cn(withLockIcon && "pl-9", "pr-9", className)} />

            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                disabled={disabled}
                // O rótulo é o que um leitor de tela anuncia; o ícone sozinho não diz nada.
                aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={visible}
                className="absolute right-3 top-3 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}
