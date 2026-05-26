"use client";

import { useState } from "react";
import { countries } from "@/lib/countries";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
}

export function CountrySelect({ name, value, onChange }: CountrySelectProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Campo invisível que garante o envio via submit */}
            <input type="hidden" name={name} value={value} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                        {value || "Selecione o país"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {countries
                                .sort((a, b) => a.name.common.localeCompare(b.name.common))
                                .map((country) => (
                                    <CommandItem
                                        key={country.cca3}
                                        value={country.name.common}
                                        onSelect={(selected) => {
                                            onChange(selected);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", value === country.name.common ? "opacity-100" : "opacity-0")} />
                                        {country.name.common}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                        <CommandInput placeholder="Buscar país..." />

                        <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
