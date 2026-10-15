"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { BrandTagKind, IBrandTag, IBrandTagFrontState } from "@/lib/types";

type BrandTagsManagerProps = {
    brandId: number;
    /** Tags de busca (padrão) ou de domínio — mesma tela, frentes e textos diferentes. */
    kind?: BrandTagKind;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
    /** Chamado depois de qualquer mudança — a tela que hospeda pode atualizar contadores. */
    onChange?: () => void;
};

const SOURCE_LABEL: Record<BrandTagKind, Record<string, string>> = {
    search: { original: "Nome do ativo", ai: "IA", manual: "Manual" },
    domain: { original: "Domínio do ativo", ai: "IA", manual: "Manual" },
};

/** Textos que mudam com o tipo. As de domínio não têm rodízio: toda tag roda em toda rodada. */
const COPY: Record<BrandTagKind, { summary: string; placeholder: string; generated: string; removed: string }> = {
    search: {
        summary: "cada uma é buscada sozinha, uma por dia em cada frente, em rodízio",
        placeholder: "Nova tag (separe várias por vírgula)",
        generated: "Elas entram no rodízio de busca a partir da próxima rodada.",
        removed: "saiu do rodízio. As ocorrências que ela trouxe continuam no ativo.",
    },
    domain: {
        summary: "todas são testadas em cada rodada, em 25 extensões (.com, .com.br, .net…) — sem extensão aqui",
        placeholder: "Novo domínio sem extensão, ex.: minhamarca-oficial (separe vários por vírgula)",
        generated: "Elas são testadas a partir da próxima rodada.",
        removed: "não será mais testada. Os domínios que ela encontrou continuam no ativo.",
    },
};

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString("pt-BR") : "");

/** Situação da tag numa frente, como uma linha curta e colorida. */
function FrontState({ label, state }: { label: string; state?: IBrandTagFrontState }) {
    if (!state) return null;

    if (state.status === "exhausted") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive" title={`Só trouxe resultados já conhecidos. Continua sendo buscada uma vez por mês e volta ao rodízio normal se trouxer algo novo. Buscada ${state.searchCount}x.`}>
                {label}: esgotada em {formatDate(state.exhaustedAt)}
            </span>
        );
    }

    if (state.status === "never") {
        return (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {label}: aguardando a {label === "Domínios" ? "próxima rodada" : "vez"}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success" title={`Última busca em ${formatDate(state.lastSearchedAt)} — buscada ${state.searchCount}x.`}>
            {label}: ativa
        </span>
    );
}

/**
 * Só nas tags de domínio, e só informativo: quando a tag trouxe um domínio novo pela última vez.
 * Não muda o que roda — toda tag de domínio é testada em toda rodada, porque um registro novo pode
 * aparecer a qualquer dia —, mas mostra quais tags estão rendendo.
 */
function DomainNews({ tag }: { tag: IBrandTag }) {
    const state = tag.domains;

    if (!state || state.status === "never") return null;

    const chip = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]";
    const keepsRunning = "Continua sendo testada em toda rodada — um domínio novo pode ser registrado a qualquer dia.";

    if (!tag.lastNewAt) {
        return (
            <span className={`${chip} bg-muted text-muted-foreground`} title={keepsRunning}>
                Nenhum domínio encontrado em {state.searchCount} rodada(s)
            </span>
        );
    }

    // Os domínios são gravados no fim da rodada do ativo, minutos depois de a tag rodar; a janela de
    // 2h separa "veio nesta rodada" de "veio numa rodada anterior do mesmo dia".
    const NEWS_WINDOW_MS = 2 * 60 * 60 * 1000;

    if (state.lastSearchedAt && new Date(tag.lastNewAt).getTime() >= new Date(state.lastSearchedAt).getTime() - NEWS_WINDOW_MS) {
        return <span className={`${chip} bg-primary/10 font-medium text-primary`}>Novidade na última rodada</span>;
    }

    return (
        <span className={`${chip} bg-muted text-muted-foreground`} title={keepsRunning}>
            Sem novidades desde {formatDate(tag.lastNewAt)}
        </span>
    );
}

/**
 * Tags de um ativo — o termo original e as variações. Serve aos dois tipos (`kind`):
 *   - `search`: o nome do ativo e variações, pesquisadas no rodízio de marketplaces e redes sociais;
 *   - `domain`: o domínio do site sem extensão e variações, testadas em toda rodada de domínios.
 *
 * Tags de busca:
 *
 * Substitui o editor de grupos de tags (out/2026): agora há **uma lista só**, e cada tag é
 * pesquisada sozinha no rodízio diário de marketplaces e redes sociais. Por isso cada uma mostra
 * o próprio estado em cada frente e quantas ocorrências trouxe.
 *
 * Incluir, remover e gerar valem na hora — não há "salvar alterações". Do dono apenas: as tags
 * são a estratégia de busca, e a rota recusa o acesso de cliente.
 */
export function BrandTagsManager({ brandId, kind = "search", makeRequest, onChange }: BrandTagsManagerProps) {
    const [tags, setTags] = useState<IBrandTag[]>([]);
    const [max, setMax] = useState(100);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<"add" | "generate" | string | null>(null);
    const [newTag, setNewTag] = useState("");

    const load = async () => {
        const response = await makeRequest("get", `/brands/${brandId}/tags?kind=${kind}`);

        if (response?.status === 200) {
            setTags(response.tags ?? []);
            setMax(response.max ?? 100);
        } else {
            toast.error("Não foi possível carregar as tags", { description: response?.message ?? "Tente novamente." });
        }

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        load();
    }, [brandId, kind]);

    const afterChange = async () => {
        await load();
        onChange?.();
    };

    const handleAdd = async () => {
        // Várias de uma vez, separadas por vírgula — é comum colar uma lista.
        const terms = newTag
            .split(",")
            .map((term) => term.trim())
            .filter(Boolean);

        if (terms.length === 0) return;

        setBusy("add");
        const response = await makeRequest("post", `/brands/${brandId}/tags`, { kind, terms });
        setBusy(null);

        if (response?.status === 201) {
            setNewTag("");
            toast.success(response.added === 1 ? "Tag incluída" : `${response.added} tags incluídas`, { description: response.ignored > 0 ? `${response.ignored} já existia(m) e foi(ram) ignorada(s).` : undefined });
            await afterChange();
            return;
        }

        toast.error("Não foi possível incluir", { description: response?.message ?? "Tente novamente." });
    };

    const handleGenerate = async () => {
        setBusy("generate");
        const response = await makeRequest("post", `/brands/${brandId}/tags/generate`, { kind });
        setBusy(null);

        if (response?.status === 201) {
            toast.success(response.added > 0 ? `${response.added} tag(s) nova(s) gerada(s)` : "Nenhuma tag nova", { description: response.added > 0 ? COPY[kind].generated : "A IA só devolveu tags que o ativo já tinha." });
            await afterChange();
            return;
        }

        toast.error("Não foi possível gerar tags", { description: response?.message ?? "Tente novamente." });
    };

    const handleRemove = async (tag: IBrandTag) => {
        setBusy(tag.id);
        const response = await makeRequest("delete", `/brand-tags/${tag.id}`);
        setBusy(null);

        if (response?.status === 200) {
            toast.success("Tag removida", { description: `"${tag.term}" ${COPY[kind].removed}` });
            await afterChange();
            return;
        }

        toast.error("Não foi possível remover", { description: response?.message ?? "Tente novamente." });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const variations = tags.filter((tag) => tag.source !== "original");
    const exhaustedEverywhere = kind === "domain" ? 0 : variations.filter((tag) => tag.marketplaces?.status === "exhausted" && tag.social?.status === "exhausted").length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                    {tags.length} de {max} tags · {COPY[kind].summary}
                </span>
                {exhaustedEverywhere > 0 && <span className="font-medium text-destructive">{exhaustedEverywhere} esgotada(s) nas duas frentes</span>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    placeholder={COPY[kind].placeholder}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    maxLength={1000}
                />
                <Button type="button" variant="outline" onClick={handleAdd} disabled={!newTag.trim() || busy !== null}>
                    {busy === "add" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Incluir
                </Button>
                <Button type="button" onClick={handleGenerate} disabled={busy !== null || tags.length >= max}>
                    {busy === "generate" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Gerar novas tags
                </Button>
            </div>

            <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                {tags.map((tag) => (
                    <div key={tag.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="break-all font-medium">{tag.term}</span>
                                <Badge variant={tag.source === "original" ? "default" : "secondary"} className="text-[10px]">
                                    {SOURCE_LABEL[kind][tag.source] ?? tag.source}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <FrontState label="Marketplaces" state={tag.marketplaces} />
                                <FrontState label="Redes sociais" state={tag.social} />
                                <FrontState label="Domínios" state={tag.domains} />
                                <DomainNews tag={tag} />
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <span className="text-xs text-muted-foreground" title={kind === "domain" ? "Domínios registrados que esta tag encontrou" : "Ocorrências que esta tag trouxe"}>
                                {kind === "domain" ? `${tag.occurrences.domains ?? 0} domínio(s)` : `${(tag.occurrences.marketplaces ?? 0) + (tag.occurrences.social ?? 0)} ocorrência(s)`}
                            </span>
                            {tag.source !== "original" && (
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(tag)} disabled={busy !== null} aria-label={`Remover a tag ${tag.term}`} title="Remover tag">
                                    {busy === tag.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
