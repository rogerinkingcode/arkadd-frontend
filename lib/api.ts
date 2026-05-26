import axios, { AxiosRequestConfig } from "axios";

export interface IUserToken {
    id: string;
    email: string;
    role: string;
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

    const user = (await response.json()) as IUserToken;

    return { authenticated: true, user };
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
