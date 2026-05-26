"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Plus } from "lucide-react";

export default function ImageScraperPageSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Image Scraper</h1>
                        <p className="text-muted-foreground mt-1">Extraia imagens de sites e organize por cliente</p>
                    </div>

                    <Button size="lg" className="w-full lg:w-auto lg:ml-auto" disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Scraping
                    </Button>
                </div>
            </div>

            <Card className="p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted mb-2" />
                        <Input placeholder="Selecione um cliente" className="bg-card h-11" disabled />
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, idx) => (
                    <div key={idx} className="aspect-square rounded-lg bg-muted animate-pulse flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                ))}
            </div>
        </div>
    );
}
