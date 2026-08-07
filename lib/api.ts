import axios, { AxiosRequestConfig } from "axios";

export interface IUserToken {
    accountId: string;
    email: string;
    /** `owner` é você; `client` é um acesso de cliente, que só alcança os dados dele. */
    role: "owner" | "client";
    ownerUserId: string;
    /** `null` no acesso de dono. */
    clientId: string | null;
    /** Mesmo valor de `ownerUserId` — o dono dos dados. */
    id: string;
    /** Nome da empresa, só no acesso de cliente. */
    companyName: string | null;
    /** Admin geral do sistema — libera atalhos internos como o Bull Board. */
    isMasterAdmin: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true,
});

/** Verifica autenticação e retorna payload do usuário */
export async function checkAuthentication(cookieHeader: string | null): Promise<{ authenticated: boolean; user?: IUserToken }> {
    if (!cookieHeader) {
        return { authenticated: false };
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
            Cookie: cookieHeader,
        },
        cache: "no-store",
    });

    if (response.status === 401) {
        return { authenticated: false };
    }

    if (!response.ok) {
        return { authenticated: false };
    }

    // O backend responde `{ user: {...} }` — sem desembrulhar, `user.role` seria `undefined`
    // e a proteção por papel do `proxy.ts` não teria em que se basear.
    const body = (await response.json()) as { user?: IUserToken };

    if (!body?.user) {
        return { authenticated: false };
    }

    return { authenticated: true, user: body.user };
}

/** Executa requisição apenas se o usuário estiver autenticado (validação feita pelo backend via cookie JWT) */
export async function authenticatedRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
        const response = await api.request<T>(config);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            // Usuário não autenticado
            throw new Error("Usuário não autenticado");
        }

        throw error;
    }
}
