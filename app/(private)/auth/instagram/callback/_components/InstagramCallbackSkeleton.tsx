"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function InstagramCallbackSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <Card className="mx-auto max-w-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                    <h3 className="mb-2 text-lg font-semibold">Concluindo a conexão</h3>
                    <p className="text-center text-muted-foreground">Aguarde enquanto validamos a autorização do Instagram...</p>
                </CardContent>
            </Card>
        </div>
    );
}
