"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BullmqPage() {
    const router = useRouter();

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 5 }}>
                <Button className="bg-primary text-white" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
            </div>
            <iframe
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/queues/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`}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                }}
            />
        </div>
    );
}
