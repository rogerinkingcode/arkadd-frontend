import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Estilo de cada elemento. O projeto não usa o plugin de tipografia do Tailwind, então o visual
 * do markdown é definido aqui — enxuto, para caber no quadro cinza das telas de ameaça.
 */
const COMPONENTS: Components = {
    p: ({ children }) => <p className="leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    // Títulos dentro de uma análise curta: mesmo tamanho do texto, só em destaque
    h1: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h2: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h3: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h4: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
            {children}
        </a>
    ),
    blockquote: ({ children }) => <blockquote className="border-l-2 border-border pl-3 italic">{children}</blockquote>,
    hr: () => <hr className="border-border" />,
    // Tabela larga rola dentro do próprio quadro, em vez de empurrar o popup para os lados
    table: ({ children }) => (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">{children}</table>
        </div>
    ),
    th: ({ children }) => <th className="border border-border px-2 py-1 font-semibold">{children}</th>,
    td: ({ children }) => <td className="border border-border px-2 py-1 align-top">{children}</td>,
    code: ({ children }) => <code className="rounded bg-background px-1 py-0.5 text-xs">{children}</code>,
};

/**
 * Texto da análise de imagem (aba de logos e feedback de marketplaces), renderizado como markdown.
 *
 * Antes isto era um parser improvisado: apagava todo `#`, só entendia negrito e quebrava linha
 * onde encontrasse ". " seguido de dois espaços — listas, títulos e parágrafos se perdiam, e o
 * texto chegava embolado ou parecendo cortado. As análises novas (Gemini, out/2026) vêm montadas
 * pelo backend num formato fixo; as antigas, da Groq, são markdown livre — e as duas passam aqui.
 *
 * `overflow-wrap: anywhere` é o que impede URL ou palavra comprida de estourar a largura.
 */
export function handleMarkdown(text: string) {
    // A linha técnica do marcador de classificação não é para o usuário (análises antigas)
    const clean = (text ?? "").replace(/^\s*classifica[çc][aã]o\s*:?\s*(alta|m[ée]dia|baixa)\s*$/gim, "").trim();

    return (
        <div className="space-y-3 [overflow-wrap:anywhere]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
                {clean}
            </ReactMarkdown>
        </div>
    );
}
