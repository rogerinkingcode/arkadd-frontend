"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function InstagramOccurrencesSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <ShieldAlert className="h-7 w-7 text-primary" />
                        Cópias encontradas
                    </h1>
                    <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
                </div>
            </div>

            <Card className="mb-6">
                <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-4 p-4">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                            <div className="space-y-2">
                                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, idx) => (
                    <Card key={idx} className="overflow-hidden">
                        <div className="aspect-[4/3] animate-pulse bg-muted" />
                        <div className="space-y-3 p-3">
                            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                            <div className="h-8 w-full animate-pulse rounded bg-muted" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
