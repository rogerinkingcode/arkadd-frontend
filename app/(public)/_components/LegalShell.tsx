import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Moldura das páginas jurídicas públicas (política de privacidade e termos de uso).
 *
 * Deliberadamente sem a moldura de credencial do `AuthShell`: aqui não se preenche formulário,
 * se lê texto longo — e quem chega pode ser um revisor da Meta ou alguém que nem tem conta.
 * Por isso é um componente de servidor, sem estado e sem chamada à API: a página precisa abrir
 * para qualquer visitante, inclusive deslogado.
 */
export default function LegalShell({ title, updatedAt, children }: { title: string; updatedAt: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border/70">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
                    <Link href="/login" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao login
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-12">
                <div className="mb-10 flex flex-col items-start gap-5">
                    <div className="flex h-16 w-16 items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="h-full w-full object-contain brightness-75 dark:brightness-200" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
                    </div>
                </div>

                {/* O texto é longo e denso: sem hierarquia forte e respiro entre blocos, ninguém
                    acha a seção que veio buscar. Cada `h2` abre um bloco com régua acima; os
                    parágrafos e itens de lista ganham entrelinha e distância maiores que o
                    padrão do `prose`, que é apertado demais para leitura corrida. */}
                <div
                    className="prose max-w-none dark:prose-invert
                        prose-headings:font-semibold prose-headings:tracking-tight
                        prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-t prose-h2:border-border/70 prose-h2:pt-8 prose-h2:text-2xl
                        prose-h3:mt-9 prose-h3:mb-3 prose-h3:text-lg prose-h3:text-foreground/90
                        prose-p:my-5 prose-p:leading-[1.85] prose-p:text-muted-foreground
                        prose-strong:font-semibold prose-strong:text-foreground
                        prose-a:font-medium prose-a:text-primary prose-a:underline-offset-4
                        prose-ul:my-6 prose-ul:space-y-3 prose-ol:my-6 prose-ol:space-y-3
                        prose-li:leading-relaxed prose-li:text-muted-foreground prose-li:pl-1.5
                        prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none"
                >
                    {children}
                </div>

                <footer className="mt-16 border-t border-border/70 pt-6 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href="/politica-de-privacidade" className="transition-colors hover:text-foreground">
                            Política de Privacidade
                        </Link>
                        <Link href="/termos-de-uso" className="transition-colors hover:text-foreground">
                            Termos de Uso
                        </Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
