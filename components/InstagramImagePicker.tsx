"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Instagram, Loader2 } from "lucide-react";

interface IAccountOption {
    id: string;
    username: string;
    imagesCount: number;
}

interface IStoredImage {
    id: string;
    url: string;
}

interface InstagramImagePickerProps {
    clientId: string;
    /**
     * Ativo de destino. O seletor mostra só as imagens que ainda **não** foram adicionadas a ele
     * — cada ativo tem a própria lista. Sem ativo escolhido, a lista não carrega.
     */
    brandId: string | number | null | undefined;
    /** Tela que recebe as imagens: é o acervo dela que diz o que já foi adicionado. */
    target: "web-images" | "site-images";
    /** URLs escolhidas, controladas pelo formulário que hospeda o seletor. */
    selectedUrls: string[];
    onChange: (urls: string[]) => void;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
}

/** Placeholder de imagem quebrada — a URL do bucket pode ter expirado ou o objeto saído. */
const BROKEN_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/**
 * Aproveita as imagens já importadas do Instagram na inserção de outra tela — hoje o
 * image-scraper e as Imagens na web.
 *
 * O seletor só devolve URLs. Quem recebe é que **copia** o arquivo para a pasta da sua tela no
 * bucket: cada acervo fica com o seu, e apagar a imagem num lado não derruba o outro.
 *
 * **Anda de 500 em 500.** Só aparecem as imagens ainda não adicionadas ao ativo de destino, as
 * mais recentes primeiro: adicionadas as primeiras 500, a próxima abertura traz as seguintes, e
 * as de uma importação nova do Instagram entram no topo. Sem nenhuma restante, o bloco diz que
 * todas já foram adicionadas.
 *
 * **Some por inteiro quando não há o que oferecer.** Cliente sem perfil conectado, ou com perfis
 * sem imagem baixada, não vê bloco nenhum: um seletor vazio no meio do formulário só faria
 * pensar que algo quebrou.
 */
export function InstagramImagePicker({ clientId, brandId, target, selectedUrls, onChange, makeRequest }: InstagramImagePickerProps) {
    const [accounts, setAccounts] = useState<IAccountOption[]>([]);
    const [accountId, setAccountId] = useState("");
    const [images, setImages] = useState<IStoredImage[]>([]);
    /** Imagens ainda não adicionadas ao ativo (a lista mostra até 500 delas). */
    const [remaining, setRemaining] = useState(0);
    /** Todas as imagens baixadas do perfil — para a mensagem de "todas adicionadas". */
    const [total, setTotal] = useState(0);
    const [loadingAccounts, setLoadingAccounts] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);

    const selected = new Set(selectedUrls);

    // Perfis do cliente que têm imagem baixada. Trocar de cliente zera tudo.
    useEffect(() => {
        setAccounts([]);
        setAccountId("");
        setImages([]);
        setTotal(0);
        onChange([]);

        if (!clientId) return;

        let active = true;

        (async () => {
            setLoadingAccounts(true);

            const response = await makeRequest("get", `/instagram/accounts?clientId=${encodeURIComponent(clientId)}`);

            if (!active) return;

            const withImages: IAccountOption[] = (response?.accounts ?? []).filter((account: IAccountOption) => (account.imagesCount ?? 0) > 0);

            setAccounts(withImages);

            // Perfil único não merece seletor: já abre nele.
            if (withImages.length > 0) setAccountId(withImages[0].id);

            setLoadingAccounts(false);
        })();

        return () => {
            active = false;
        };
    }, [clientId]);

    /**
     * Imagens do perfil aberto que ainda faltam no ativo de destino.
     *
     * Trocar o ativo relê a lista e desmarca tudo: o que estava marcado era o que faltava no ativo
     * anterior, e mandá-lo para o novo seria uma escolha que ninguém fez.
     */
    useEffect(() => {
        setImages([]);
        setRemaining(0);
        setTotal(0);

        if (!accountId || !brandId) return;

        let active = true;

        (async () => {
            setLoadingImages(true);

            const query = new URLSearchParams({ accountId, brandId: String(brandId), target });
            const response = await makeRequest("get", `/instagram/stored-images?${query.toString()}`);

            if (!active) return;

            setImages(response?.images ?? []);
            setRemaining(response?.remaining ?? 0);
            setTotal(response?.count ?? 0);
            setLoadingImages(false);
        })();

        return () => {
            active = false;
        };
    }, [accountId, brandId, target]);

    // Ativo trocado: as marcações eram para o anterior
    useEffect(() => {
        if (selectedUrls.length > 0) onChange([]);
    }, [brandId]);

    const toggle = (url: string) => {
        const next = new Set(selected);

        if (next.has(url)) next.delete(url);
        else next.add(url);

        onChange([...next]);
    };

    /** Marca todas as imagens **do perfil aberto**, preservando o que já estava marcado em outros. */
    const selectAll = () => {
        const next = new Set(selected);

        for (const image of images) next.add(image.url);

        onChange([...next]);
    };

    /** Desmarca só as do perfil aberto — o que veio de outro perfil continua escolhido. */
    const clearCurrent = () => {
        const current = new Set(images.map((image) => image.url));

        onChange(selectedUrls.filter((url) => !current.has(url)));
    };

    if (loadingAccounts) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Procurando imagens do Instagram deste cliente...
            </div>
        );
    }

    // Nada a oferecer: o bloco não existe.
    if (accounts.length === 0) return null;

    const selectedHere = images.filter((image) => selected.has(image.url)).length;

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Aproveitar imagens do Instagram
                </Label>

                {selectedUrls.length > 0 && <span className="text-xs font-medium text-primary">{selectedUrls.length} selecionada(s)</span>}
            </div>

            {/* Só com mais de um perfil há o que escolher */}
            {accounts.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {accounts.map((account) => (
                        <Button key={account.id} type="button" size="sm" variant={account.id === accountId ? "default" : "outline"} onClick={() => setAccountId(account.id)}>
                            @{account.username}
                        </Button>
                    ))}
                </div>
            )}

            <div className="rounded-lg border border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                        {!brandId ? "Escolha o ativo" : loadingImages ? "Carregando..." : `${images.length} de ${remaining} ainda não adicionada(s)`}
                        {selectedHere > 0 && ` · ${selectedHere} marcada(s) aqui`}
                    </span>

                    <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={selectAll} disabled={loadingImages || images.length === 0}>
                            Selecionar todas
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={clearCurrent} disabled={selectedHere === 0}>
                            Limpar
                        </Button>
                    </div>
                </div>

                <div className="max-h-[260px] overflow-auto p-2">
                    {!brandId ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">Escolha o ativo para ver as imagens que ainda podem ser adicionadas a ele.</p>
                    ) : loadingImages ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : images.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            {total > 0 ? "Todas as imagens deste perfil já foram adicionadas a este ativo. As novas aparecem aqui quando o Instagram for importado de novo." : "Nenhuma imagem baixada neste perfil."}
                        </p>
                    ) : (
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                            {images.map((image) => {
                                const isSelected = selected.has(image.url);

                                return (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => toggle(image.url)}
                                        aria-pressed={isSelected}
                                        className={`relative aspect-square overflow-hidden rounded-md border transition-all ${isSelected ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-muted-foreground/40"}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = BROKEN_IMAGE;
                                            }}
                                        />

                                        {isSelected && (
                                            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="h-3 w-3" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {!loadingImages && remaining > images.length && <p className="text-xs text-muted-foreground">Mostrando {images.length} das {remaining} que faltam. Adicione estas e reabra para ver as próximas.</p>}
        </div>
    );
}
