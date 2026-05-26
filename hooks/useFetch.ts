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
            const message = err.response?.data?.err || err.message || "Erro inesperado";

            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { makeRequest, loading, error };
}
