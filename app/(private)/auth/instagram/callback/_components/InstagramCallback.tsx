"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, Instagram } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import InstagramCallbackSkeleton from "./InstagramCallbackSkeleton";

/**
 * Página de retorno do OAuth do Instagram (`/auth/instagram/callback`).
 *
 * O Instagram redireciona para cá com `code` e `state` (ou com `error`, quando o usuário nega
 * a permissão). O código é apenas repassado ao backend, que é quem detém a chave secreta do
 * app e faz a troca pelo token — o frontend nunca vê nem armazena token nenhum.
 */
/** Explicação em português para o caso mais comum de recusa: perfil que não é conta profissional. */
const NOT_PROFESSIONAL_MESSAGE = "Este perfil não é uma conta profissional do Instagram. Abra o app do Instagram, vá em Configurações › Tipo de conta e ferramentas e mude para conta Comercial ou de Criador de conteúdo — depois tente conectar de novo.";

/**
 * Traduz o motivo que o Instagram devolve na URL de retorno.
 *
 * A Meta responde em inglês e com texto de plataforma, não de produto. Dois casos merecem
 * texto próprio: o perfil sem conta profissional (o motivo nº 1 de falha, e que a mensagem
 * original não ajuda a resolver) e a recusa deliberada da permissão.
 *
 * Fora esses, o texto original é preservado — inventar uma explicação genérica esconderia a
 * única pista disponível para diagnosticar um caso novo.
 */
function translateInstagramError(errorDescription: string | null): string {
    const original = (errorDescription ?? "").trim();
    const normalized = original.toLowerCase();

    if (/professional|business account|creator account/.test(normalized)) {
        return NOT_PROFESSIONAL_MESSAGE;
    }

    if (/denied|cancel/.test(normalized)) {
        return "A autorização foi cancelada na tela do Instagram.";
    }

    return original || "A autorização não foi concluída no Instagram.";
}

export default function InstagramCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { makeRequest } = useFetch();

    const [state, setState] = useState<"processing" | "success" | "error">("processing");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [companyName, setCompanyName] = useState("");

    // O React executa os efeitos duas vezes em desenvolvimento (StrictMode). O código de
    // autorização é de uso único, então a segunda troca falharia — esta trava evita isso.
    const processedRef = useRef(false);

    /**
     * Encerra o fluxo em erro: o card explica e o toast avisa.
     *
     * Os dois, e não só o card: quem chega aqui acabou de voltar de outro site e o toast é o
     * que registra que algo deu errado mesmo se a pessoa já estiver saindo da tela.
     */
    const fail = (reason: string) => {
        setState("error");
        setMessage(reason);
        toast.error("Não foi possível conectar o Instagram", { description: reason, duration: 10000 });
    };

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        async function finishConnection() {
            const code = searchParams.get("code");
            const returnedState = searchParams.get("state");
            const error = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            // O usuário recusou a permissão na tela do Instagram — ou o próprio Instagram
            // barrou o login (é o que acontece com perfil que não é conta profissional).
            if (error) {
                fail(translateInstagramError(errorDescription));
                return;
            }

            if (!code || !returnedState) {
                fail("O Instagram não retornou os dados de autorização esperados.");
                return;
            }

            const response = await makeRequest("post", "/instagram/callback", { code, state: returnedState });

            if (response?.status === 200) {
                const connectedUsername = response.account?.username ?? "";
                const connectedClient = response.client?.companyName ?? "";

                setState("success");
                setUsername(connectedUsername);
                setCompanyName(connectedClient);
                toast.success("Instagram conectado", { description: `O perfil @${connectedUsername} foi conectado${connectedClient ? ` ao cliente ${connectedClient}` : ""}.` });

                // Dá um instante para o usuário ver a confirmação antes de seguir. A tela de
                // Instagram reabre no mesmo cliente, restaurado da sessão da aba.
                setTimeout(() => router.push("/instagram"), 1500);
                return;
            }

            fail(response?.message ?? "Não foi possível concluir a conexão com o Instagram.");
        }

        finishConnection();
    }, []);

    if (state === "processing") {
        return <InstagramCallbackSkeleton />;
    }

    return (
        <div className="p-6 lg:p-8">
            <Card className="mx-auto max-w-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    {state === "success" ? (
                        <>
                            <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
                            <h3 className="mb-2 text-lg font-semibold">Perfil conectado</h3>
                            <p className="mb-6 text-center text-muted-foreground">
                                {username ? `@${username}` : "O perfil"} foi autorizado{companyName ? ` para o cliente ${companyName}` : ""}. Redirecionando...
                            </p>
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </>
                    ) : (
                        <>
                            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                            <h3 className="mb-2 text-lg font-semibold">Não foi possível conectar</h3>
                            <p className="mb-6 max-w-md text-center text-muted-foreground">{message}</p>
                            <Button onClick={() => router.push("/instagram")}>
                                <Instagram className="mr-2 h-4 w-4" />
                                Voltar e tentar novamente
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
