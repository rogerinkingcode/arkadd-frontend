"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IPaginationsProps {
    handleChangePagination: (event: React.ChangeEvent<unknown>, value: number) => void;
    count: number | undefined;
    take: number;
}

/** Quantos números de página aparecem de cada lado da página atual. */
const SIBLINGS = 1;

/** Monta a lista de páginas visíveis: sempre a 1ª e a última, uma janela ao
 *  redor da página atual e reticências nos vãos. Mantém a largura limitada
 *  (no máximo ~7 números), sem estourar para os lados. */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
    // Se cabe tudo sem reticências, mostra a sequência inteira.
    if (total <= SIBLINGS * 2 + 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = Math.max(current - SIBLINGS, 1);
    const right = Math.min(current + SIBLINGS, total);
    const list: (number | "ellipsis")[] = [1];

    if (left > 2) list.push("ellipsis");
    for (let page = Math.max(left, 2); page <= Math.min(right, total - 1); page++) {
        list.push(page);
    }
    if (right < total - 1) list.push("ellipsis");

    list.push(total);
    return list;
}

export default function Paginations({ handleChangePagination, count, take }: IPaginationsProps) {
    const [currentPage, setCurrentPage] = React.useState(1);

    const pages = React.useMemo(() => {
        if (!count || count <= 0) return 0;
        if (count <= take) return 1;
        return Math.ceil(count / take);
    }, [count, take]);

    const shouldShow = React.useMemo(() => {
        return count !== undefined && count > take;
    }, [count, take]);

    // Mantém a página atual dentro do intervalo caso a contagem diminua.
    React.useEffect(() => {
        if (pages > 0 && currentPage > pages) {
            setCurrentPage(pages);
        }
    }, [pages, currentPage]);

    if (!shouldShow) return null;

    const goToPage = (event: React.MouseEvent, page: number) => {
        if (page < 1 || page > pages || page === currentPage) return;
        setCurrentPage(page);
        handleChangePagination(event as unknown as React.ChangeEvent<unknown>, page);
    };

    const pageList = buildPageList(currentPage, pages);

    const arrowClasses = "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-40";

    return (
        <div className="mt-5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {/* Página anterior */}
                <button type="button" aria-label="Página anterior" disabled={currentPage === 1} onClick={(e) => goToPage(e, currentPage - 1)} className={arrowClasses}>
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Janela de números de página */}
                {pageList.map((item, index) =>
                    item === "ellipsis" ? (
                        <span key={`ellipsis-${index}`} className="flex h-9 w-9 select-none items-center justify-center text-sm text-muted-foreground">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            aria-current={currentPage === item ? "page" : undefined}
                            onClick={(e) => goToPage(e, item)}
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${currentPage === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"}`}
                        >
                            {item}
                        </button>
                    ),
                )}

                {/* Próxima página */}
                <button type="button" aria-label="Próxima página" disabled={currentPage === pages} onClick={(e) => goToPage(e, currentPage + 1)} className={arrowClasses}>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <p className="text-xs text-muted-foreground">
                Página {currentPage} de {pages}
            </p>
        </div>
    );
}
