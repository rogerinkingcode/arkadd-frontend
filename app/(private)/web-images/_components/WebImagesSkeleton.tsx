"use client";

import { Card } from "@/components/ui/card";
import { Globe2, ImageIcon } from "lucide-react";

export default function WebImagesSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Globe2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Imagens na web</h1>
                    <p className="mt-1 text-muted-foreground">Envie as imagens do cliente e encontre cópias delas em sites da web</p>
                </div>
            </div>

            <Card className="mb-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-2">
                        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(10)].map((_, idx) => (
                    <div key={idx} className="flex aspect-square animate-pulse items-center justify-center rounded-lg bg-muted">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                ))}
            </div>
        </div>
    );
}
