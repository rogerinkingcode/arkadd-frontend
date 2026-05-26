"use client";

import { Card } from "@/components/ui/card";

export default function OccurrencesSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                <div>
                    <div className="h-7 w-72 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </div>
            </div>

            <Card className="p-4 mb-6 flex items-center gap-4">
                <div className="h-24 w-24 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="rounded-lg border border-border overflow-hidden">
                        <div className="aspect-[4/3] bg-muted animate-pulse" />
                        <div className="p-3 space-y-2">
                            <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
