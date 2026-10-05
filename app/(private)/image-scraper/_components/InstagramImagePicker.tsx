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
    /** URLs escolhidas, controladas pelo formulário que hospeda o seletor. */
    selectedUrls: string[];
    onChange: (urls: string[]) => void;
    makeRequest: (method: "get" | "post" | "put" | "delete", endpoint: string, data?: any) => Promise<any>;
}

/** Placeholder de imagem quebrada — a URL do bucket pode ter expirado ou o objeto saído. */
const BROKEN_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'><rect width='20' height='20' x='2' y='2' rx='3'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

/**
 * Aproveita as imagens já importadas do Instagram na inserção avulsa do image-scraper.
 *
 * As imagens já estão no nosso bucket, então inseri-las aqui é mandar a URL — não há novo upload
 * nem cópia de arquivo.
 *
 * **Some por inteiro quando não há o que oferecer.** Cliente sem perfil conectado, ou com perfis
 * sem imagem baixada, não vê bloco nenhum: um seletor vazio no meio do formulário só faria
 * pensar que algo quebrou.
 */
export function InstagramImagePicker({ clientId, selectedUrls, onChange, makeRequest }: InstagramImagePickerProps) {
    const [accounts, setAccounts] = useState<IAccountOption[]>([]);
    const [accountId, setAccountId] = useState("");
    const [images, setImages] = useState<IStoredImage[]>([]);
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

    // Imagens do perfil aberto.
    useEffect(() => {
        setImages([]);
        setTotal(0);

        if (!accountId) return;

        let active = true;

        (async () => {
            setLoadingImages(true);

            const response = await makeRequest("get", `/instagram/stored-images?accountId=${encodeURIComponent(accountId)}`);

            if (!active) return;

            setImages(response?.images ?? []);
            setTotal(response?.count ?? 0);
            setLoadingImages(false);
        })();

        return () => {
            active = false;
        };
    }, [accountId]);

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
                        {loadingImages ? "Carregando..." : `${images.length} de ${total} imagem(ns)`}
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
                    {loadingImages ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : images.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma imagem baixada neste perfil.</p>
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

            {total > images.length && <p className="text-xs text-muted-foreground">Mostrando as {images.length} mais recentes. Insira estas e reabra para ver as demais.</p>}
        </div>
    );
}
