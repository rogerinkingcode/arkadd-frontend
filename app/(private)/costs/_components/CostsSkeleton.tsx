"use client";

import { Card } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";

export default function CostsSkeleton() {
    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CircleDollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Custos</h1>
                    <p className="mt-1 text-muted-foreground">Quanto cada serviço custa, quanto é cobrado e o lucro por cliente e por ativo</p>
                </div>
            </div>

            {[0, 1].map((card) => (
                <Card key={card} className="space-y-3 p-6">
                    <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
                    {[...Array(4)].map((_, row) => (
                        <div key={row} className="h-10 w-full animate-pulse rounded bg-muted" />
                    ))}
                </Card>
            ))}
        </div>
    );
}
