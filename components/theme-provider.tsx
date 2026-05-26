"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Provedor de tema (claro/escuro) baseado em next-themes.
 *  Adiciona/remove a classe `.dark` no <html>, que aciona os tokens de cor
 *  definidos em globals.css. Usado nos layouts de rotas públicas e privadas. */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
