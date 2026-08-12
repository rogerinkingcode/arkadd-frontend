"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { TagAnalysis } from "@/lib/types";

interface IThreatTagsRowProps {
    open: boolean;
    /** Quantidade de colunas da tabela — a linha da sanfona ocupa a largura inteira. */
    columnsCount: number;
    feedbackTags?: TagAnalysis | null;
}

/**
 * Linha em sanfona da tabela de ocorrências: repete as tags que o popup de detalhes mostra
 * ("Tags monitoradas ativadas" e "Correspondências da ameaça") sem gastar uma coluna. Fica sempre montada e colapsada
 * em `grid-rows-[0fr]` — é isso que permite animar a altura sem precisar medir o conteúdo.
 */
export default function ThreatTagsRow({ open, columnsCount, feedbackTags }: IThreatTagsRowProps) {
    const activatedTags = feedbackTags?.activatedTags ?? [];
    const matches = feedbackTags?.matches ?? [];

    return (
        <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={columnsCount} className="p-0 whitespace-normal">
                <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                        <div className="mx-5 mt-1 mb-3 space-y-3 rounded-md border border-border bg-muted/50 p-4 text-sm">
                            <div className="flex w-full flex-col items-center overflow-hidden text-center sm:flex-row sm:items-start sm:text-left">
                                <span className="w-full text-muted-foreground sm:w-[30%]">Tags monitoradas ativadas:</span>

                                <div className="mt-2 flex w-full flex-wrap justify-center gap-2 overflow-hidden sm:mt-0 sm:w-[70%] sm:justify-start">
                                    {activatedTags.length > 0 ? (
                                        activatedTags.map((tag, index) => (
                                            <Badge key={`${tag}-${index}`} className="bg-success text-white max-w-full truncate">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">Nenhuma tag ativada</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-col items-center overflow-hidden text-center sm:flex-row sm:items-start sm:text-left">
                                <span className="w-full text-muted-foreground sm:w-[30%]">Correspondências da ameaça:</span>

                                <div className="mt-2 flex w-full flex-wrap justify-center gap-2 overflow-hidden sm:mt-0 sm:w-[70%] sm:justify-start">
                                    {matches.length > 0 ? (
                                        matches.map((tag, index) => (
                                            <Badge key={`${tag}-${index}`} variant="default" className="text-white max-w-full truncate">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">Nenhuma correspondência</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}
