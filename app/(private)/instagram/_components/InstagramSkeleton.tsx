"use client";

import { Card } from "@/components/ui/card";
import { ImageIcon, Instagram } from "lucide-react";

export default function InstagramPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Instagram className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Instagram</h1>
                        <p className="mt-1 text-muted-foreground">Conecte um perfil e importe as imagens das publicações</p>
                    </div>
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
