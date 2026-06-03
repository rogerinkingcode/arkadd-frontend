"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";

export default function HomePage() {
    const router = useRouter();
    const { makeRequest } = useFetch();

    useEffect(() => {
        async function checkLogin() {
            const res = await makeRequest("get", "/me");
            if (res !== null) {
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        }

        checkLogin();
    }, []);

    return (
        <html lang="pt-BR">
            <body>
                <div className="flex h-screen items-center justify-center bg-background">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </body>
        </html>
    );
}
