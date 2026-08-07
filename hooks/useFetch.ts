"use client";

import { useState } from "react";
import { authenticatedRequest } from "@/lib/api";

type HttpMethod = "get" | "post" | "put" | "delete";

export function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = async (method: HttpMethod, endpoint: string, data?: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authenticatedRequest({
                method,
                url: endpoint,
                data,
            });

            return response;
        } catch (err: any) {
            const message = err.response?.data?.err || err.response?.data?.message || err.message || "Erro inesperado";

            setError(message);

            // Quando o backend responde com status HTTP de erro de verdade — 429 do teto de
            // tentativas, 401 do middleware, 403 do `requireOwner` — o corpo carrega o motivo.
            // Devolvê-lo é o que permite à tela tratar o caso; engolindo tudo em `null`, quem
            // chama só consegue dizer "erro inesperado" (e quebra ao ler `response.status`).
            if (err.response?.data) {
                return err.response.data;
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    return { makeRequest, loading, error };
}
