"use client";

import { Card } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function ClientAccessSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="h-9 w-44 animate-pulse rounded bg-muted mb-4" />

            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <div className="h-8 w-72 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-52 animate-pulse rounded bg-muted" />
                </div>
            </div>

            <Card className="p-5 mb-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted sm:w-48" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted sm:w-36" />
                </div>
            </Card>

            <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-start gap-4">
                            <div className="h-11 w-11 rounded-full bg-muted animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                            </div>
                            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
