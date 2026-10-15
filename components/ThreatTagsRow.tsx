"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { IOccurrenceTag } from "@/lib/types";

interface IThreatTagsRowProps {
    open: boolean;
    /** Quantidade de colunas da tabela — a linha da sanfona ocupa a largura inteira. */
    columnsCount: number;
    tags?: IOccurrenceTag[];
}

/** Badges das tags que encontraram uma ocorrência — o nome do ativo destacado das variações. */
export function OccurrenceTagBadges({ tags }: { tags?: IOccurrenceTag[] }) {
    if (!tags || tags.length === 0) {
        return <span className="text-muted-foreground">Nenhuma tag registrada</span>;
    }

    return (
        <>
            {tags.map(({ tag }) => (
                <Badge key={tag.id} className={`max-w-full truncate text-white ${tag.source === "original" ? "bg-primary" : "bg-success"}`} title={tag.source === "original" ? "Nome do ativo" : "Variação"}>
                    {tag.term}
                </Badge>
            ))}
        </>
    );
}

/**
 * Linha em sanfona da tabela de ocorrências: mostra quais tags encontraram a ocorrência sem gastar
 * uma coluna. Fica sempre montada e colapsada em `grid-rows-[0fr]` — é isso que permite animar a
 * altura sem precisar medir o conteúdo.
 *
 * A informação é exata (out/2026): cada busca pesquisa uma tag só, então a ligação vem de quem
 * de fato trouxe a ocorrência — inclusive todas as tags, quando mais de uma a encontrou. Antes
 * era um palpite feito procurando as palavras das tags no texto do resultado.
 */
export default function ThreatTagsRow({ open, columnsCount, tags }: IThreatTagsRowProps) {
    return (
        <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={columnsCount} className="p-0 whitespace-normal">
                <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                        <div className="mx-5 mt-1 mb-3 rounded-md border border-border bg-muted/50 p-4 text-sm">
                            <div className="flex w-full flex-col items-center overflow-hidden text-center sm:flex-row sm:items-start sm:text-left">
                                <span className="w-full text-muted-foreground sm:w-[30%]">Encontrada pela tag:</span>

                                <div className="mt-2 flex w-full flex-wrap justify-center gap-2 overflow-hidden sm:mt-0 sm:w-[70%] sm:justify-start">
                                    <OccurrenceTagBadges tags={tags} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}
