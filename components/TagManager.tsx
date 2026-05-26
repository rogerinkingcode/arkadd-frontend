import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Check } from "lucide-react";
import { IVariationsSoldOut } from "@/lib/types";

interface VariationBankEditorProps {
    variationBank: string[][];
    onChange: (updatedBank: string[][]) => void;
    variationsName: string[];
    setVariationsName: (v: string[]) => void;
    setIndexGroupTags: (v: number) => void;
    variationsSoldOut?: IVariationsSoldOut[];
}

function containsTags(data: IVariationsSoldOut[], targetTags: string[]) {
    const targetSet = new Set(targetTags);

    return data.some((item) => {
        if (!Array.isArray(item.tags)) return false;
        if (item.tags.length !== targetTags.length) return false;

        return item.tags.every((tag) => targetSet.has(tag));
    });
}

export function VariationBankEditor({ variationBank, onChange, variationsName, setVariationsName, setIndexGroupTags, variationsSoldOut }: VariationBankEditorProps) {
    const [newTagInputs, setNewTagInputs] = useState<Record<number, string>>({});

    const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
        if (!Array.isArray(variationsName) || variationsName.length === 0) return null;
        const idx = variationBank.findIndex((group) => group.length === variationsName.length && group.every((v, i) => v === variationsName[i]));
        return idx !== -1 ? idx : null;
    });

    const isSelected = (_content: string[], index: number) => index === selectedIndex;

    const handleRemoveTag = (groupIndex: number, tagIndex: number) => {
        const updated = variationBank.map((group, gi) => (gi === groupIndex ? group.filter((_, ti) => ti !== tagIndex) : group));
        onChange(updated);
    };

    const handleAddTag = (groupIndex: number) => {
        const tag = newTagInputs[groupIndex]?.trim();
        if (!tag) return;

        const updated = variationBank.map((group, gi) => (gi === groupIndex ? [...group, tag] : group));
        onChange(updated);

        setNewTagInputs((prev) => ({ ...prev, [groupIndex]: "" }));
    };

    return (
        <div className="flex flex-col items-center justify-start gap-3 p-2 max-h-[350px] overflow-auto">
            {variationBank.map((content, groupIndex) => {
                const selected = isSelected(content, groupIndex);
                const contains_tags = containsTags(variationsSoldOut ?? [], content);

                return (
                    <div
                        key={groupIndex}
                        onClick={() => {
                            setVariationsName(content);
                        }}
                        className="cursor-pointer text-sm text-muted-foreground bg-card text-center px-4 w-full rounded-lg p-2 transition-all"
                        style={{
                            border: selected ? "solid 3px var(--success)" : "solid 1px var(--border)",
                        }}
                    >
                        {selected && <Check size={20} style={{ position: "inherit", marginTop: "-20px", marginLeft: "-25px" }} className="bg-success p-0.5 text-white rounded-full" />}

                        {contains_tags && (
                            <span className="bg-destructive text-white text-xs pt-0.5 pb-0.5 mb-3 rounded-lg w-35" style={{ display: "block", position: "inherit", marginTop: "-18px" }}>
                                Conjunto Esgotado
                            </span>
                        )}

                        {/* Tags com botão de remover */}
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                            {Array.isArray(content) &&
                                content.map((item, tagIndex) => (
                                    <Badge key={tagIndex} variant={selected ? "default" : "secondary"} className="m-1 p-1 flex items-center gap-1 pr-4 relative overflow-visible">
                                        {item}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTag(groupIndex, tagIndex);
                                            }}
                                            className="absolute -top-1 -right-1 hover:opacity-70 transition-opacity"
                                        >
                                            <X size={16} className="bg-foreground text-background border border-background rounded-full p-0.5 opacity-70 transition-opacity cursor-pointer" />
                                        </button>
                                    </Badge>
                                ))}
                        </div>
                        {/* Input para adicionar nova tag */}
                        <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                            <Input
                                value={newTagInputs[groupIndex] ?? ""}
                                onChange={(e) =>
                                    setNewTagInputs((prev) => ({
                                        ...prev,
                                        [groupIndex]: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddTag(groupIndex);
                                }}
                                placeholder="Nova tag..."
                                className="h-7 text-xs text-foreground"
                            />
                            <Button size="sm" variant="outline" className="cursor-pointer h-7 px-2 text-success hover:bg-success hover:text-white transition-colors" onClick={() => handleAddTag(groupIndex)}>
                                <Plus size={14} />
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-success cursor-pointer"
                                onClick={() => {
                                    setSelectedIndex(groupIndex);
                                    setIndexGroupTags(groupIndex);
                                    setVariationsName(content);
                                }}
                            >
                                <Check size={14} />
                                {selected ? "Selecionado" : "Selecionar grupo"}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
