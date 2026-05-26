"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, ImageIcon, Search } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import Paginations from "@/components/pagination";
import { ISiteImageOccurrence } from "@/lib/types";

type OccurrencesPageProps = {
    pageSkeleton: React.ReactNode;
};

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/** Retorna o hostname amigável de uma URL — fallback para a própria string. */
function getHostname(url?: string | null): string {
    if (!url) return "";
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export default function OccurrencesPage({ pageSkeleton }: OccurrencesPageProps) {
    const params = useParams<{ imageId: string }>();
    const router = useRouter();
    const imageId = params?.imageId;

    const [occurrences, setOccurrences] = useState<ISiteImageOccurrence[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [take] = useState<number>(20);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const { makeRequest } = useFetch();

    useEffect(() => {
        async function load() {
            if (!imageId) return;

            const skip = page === 1 ? 0 : (page - 1) * take;
            const response = await makeRequest("get", `/site-images/${imageId}/occurrences?skip=${skip}&take=${take}`);

            if (response?.status === 200) {
                setOccurrences(response.occurrences || []);
                setCount(response.count || 0);
            } else {
                setOccurrences([]);
                setCount(0);
            }

            setInitialLoaded(true);
        }

        load();
    }, [imageId, page]);

    const handleChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (!initialLoaded) {
        return <>{pageSkeleton}</>;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Search className="h-7 w-7 text-primary" />
                        Ocorrências encontradas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {count} resultado{count === 1 ? "" : "s"} para esta imagem
                    </p>
                </div>
            </div>

            {count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhuma ocorrência ainda</h3>
                        <p className="text-muted-foreground text-center">A extenção ainda não pesquisou esta imagem ou nenhum resultado foi encontrado.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
                        {occurrences.map((occ) => {
                            const mainImage = occ.thumbnail || occ.image || FALLBACK_IMAGE;
                            const host = getHostname(occ.href);
                            const title = occ.text?.trim() || host || "Sem título";

                            const content = (
                                <Card className="overflow-hidden h-full hover:shadow-md transition-all border border-border group">
                                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                        <img
                                            src={mainImage}
                                            alt={title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                                            }}
                                        />
                                        {occ.href && (
                                            <div className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md bg-card/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 space-y-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {occ.image ? (
                                                <img
                                                    src={occ.image}
                                                    alt=""
                                                    loading="lazy"
                                                    className="h-5 w-5 rounded-sm object-cover shrink-0 bg-muted"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center shrink-0">
                                                    <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span className="text-xs text-muted-foreground truncate">{host || "—"}</span>
                                        </div>

                                        <p className="text-sm font-medium line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">{title}</p>
                                    </div>
                                </Card>
                            );

                            if (occ.href) {
                                return (
                                    <a key={occ.id} href={occ.href} target="_blank" rel="noreferrer noopener" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
                                        {content}
                                    </a>
                                );
                            }

                            return <div key={occ.id}>{content}</div>;
                        })}
                    </div>

                    {count > take && <Paginations handleChangePagination={handleChangePagination} count={count} take={take} />}
                </>
            )}
        </div>
    );
}
