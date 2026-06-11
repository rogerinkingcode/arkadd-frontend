"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Limite de tamanho de imagem (em MB) — mantido em sincronia com o backend (B2Storage). */
export const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/** Formatos de imagem aceitos (MIME) — espelha a validação do backend. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ACCEPTED_EXTENSIONS_LABEL = "JPG, PNG, WEBP, GIF, SVG";
const ACCEPTED_INPUT_ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

/**
 * Valida tamanho e formato de um arquivo de imagem, exibindo um toast e retornando `false` quando inválido.
 * Reutilizável fora do dropzone (ex.: upload imediato de avatar).
 */
export function validateImageFile(file: File): boolean {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Formato não suportado", { description: `Envie uma imagem nos formatos: ${ACCEPTED_EXTENSIONS_LABEL}.` });
        return false;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("Imagem muito grande", { description: `O tamanho máximo permitido é de ${MAX_IMAGE_SIZE_MB}MB.` });
        return false;
    }

    return true;
}

type ImageDropzoneProps = {
    /** Arquivo selecionado atualmente (controlado pelo componente pai). */
    file: File | null;
    /** Callback disparado ao selecionar ou remover um arquivo. */
    onFileChange: (file: File | null) => void;
    /** URL de uma imagem já existente (ex.: ao editar) — exibida como pré-visualização enquanto nenhum novo arquivo é escolhido. */
    existingUrl?: string | null;
    disabled?: boolean;
    className?: string;
};

/**
 * Área de upload de imagem com seleção por clique ou arrastar-e-soltar.
 * Exibe os formatos aceitos e o limite de tamanho, valida a imagem na seleção e mostra a pré-visualização.
 */
export function ImageDropzone({ file, onFileChange, existingUrl, disabled, className }: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    // Gera (e descarta) a URL de pré-visualização do arquivo selecionado
    useEffect(() => {
        if (!file) {
            setObjectUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const previewUrl = objectUrl ?? existingUrl ?? null;

    const handleFiles = (files: FileList | null) => {
        const selected = files?.[0];
        if (!selected) return;

        if (!validateImageFile(selected)) return;

        onFileChange(selected);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFiles(e.dataTransfer.files);
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className={className}>
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={handleDrop}
                className={cn(
                    "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 p-4 text-center transition-colors hover:border-primary/60 hover:bg-muted/60",
                    isDragging && "border-primary bg-primary/5",
                    disabled && "pointer-events-none opacity-60",
                )}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Pré-visualização da imagem" className="max-h-32 w-auto rounded-md object-contain" />
                        <span className="text-xs text-muted-foreground">{file ? file.name : "Imagem atual"} — clique ou arraste para trocar</span>
                        <button type="button" onClick={clearSelection} className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-destructive" aria-label="Remover imagem">
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">{isDragging ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}</span>
                        <span className="text-sm font-medium">Clique para selecionar ou arraste uma imagem</span>
                    </>
                )}

                <input ref={inputRef} type="file" accept={ACCEPTED_INPUT_ACCEPT} className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={disabled} />
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
                Formatos aceitos: {ACCEPTED_EXTENSIONS_LABEL}. Tamanho máximo: {MAX_IMAGE_SIZE_MB}MB.
            </p>
        </div>
    );
}
