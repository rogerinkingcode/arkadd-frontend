"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/PasswordInput";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import WaterSurface from "../../_components/WaterSurface";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { makeRequest } = useFetch();

    useEffect(() => {
        async function checkLogin() {
            const response = await makeRequest("get", "/me");
            if (response !== null) {
                router.push("/dashboard");
            }

            // E-mail e senha do último login bem-sucedido, para o formulário já vir preenchido.
            //
            // ATENÇÃO: a senha fica em texto puro no `localStorage` — legível por qualquer script
            // que rode nesta página e por quem abrir o DevTools na máquina. Como a mesma tela
            // atende os acessos de cliente, o que fica guardado pode ser a senha deles, num
            // computador que não é seu. Foi uma escolha consciente de conveniência.
            const loginCache = localStorage.getItem("loginCache");

            if (loginCache) {
                const parseloginCache = JSON.parse(loginCache);
                setEmail(parseloginCache.email ?? "");
                setPassword(parseloginCache.password ?? "");
            }
        }

        checkLogin();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const payload = { email, password };

        const response = await makeRequest("post", `/login`, payload);

        if (response?.status === 200) {
            toast.success("Logado com sucesso!", {
                description: `Bem-vindo, ${response.payload.email}`,
            });

            router.push("/dashboard");

            // Só grava depois do 200: senha errada não vale a pena lembrar, e sobrescrever o
            // cache com ela faria o próximo acesso vir preenchido com o que não funciona.
            localStorage.setItem("loginCache", JSON.stringify({ email, password }));
        } else if (response?.status === 429) {
            // Teto de tentativas: a mensagem já vem com o prazo. "Muitas tentativas" sem prazo
            // gera chamado de suporte; com prazo, a pessoa espera.
            toast.error("Muitas tentativas", { description: response.message });
            setError(response.message);
        } else {
            // Mensagem única, de propósito: distinguir "e-mail não existe" de "senha errada"
            // entregaria quais endereços têm conta no sistema.
            const message = response?.message ?? "Não foi possível entrar. Tente novamente.";
            toast.error("Não foi possível entrar", { description: message });
            setError(message);
        }

        setIsLoading(false);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Segunda cor da página: faixa na metade de baixo, corte horizontal. O card fica por
                cima da emenda — é o que amarra as duas cores em vez de deixá-las só empilhadas. */}
            <div className="apex-water-panel absolute inset-x-0 bottom-0 h-1/2" aria-hidden="true" />

            {/* Brilhos decorativos da marca */}
            <div className="apex-glow absolute -right-24 -top-32 h-96 w-96 rounded-full" aria-hidden="true" />
            <div className="apex-glow absolute -bottom-40 -left-24 h-96 w-96 rounded-full" aria-hidden="true" />

            {/* Superfície de água: cobre a tela inteira, por cima das duas cores, e responde ao
                cursor como se ele fosse um dedo passando na água. */}
            <WaterSurface className="pointer-events-none absolute inset-0 h-full w-full" />

            {/* Alternância de tema */}
            <div className="absolute right-4 top-4 z-20">
                <ThemeToggle />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4 lg:justify-start lg:p-0 lg:pl-[6vw]">
                <div className="w-full w-md">
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="flex h-32 w-32 items-center justify-center">
                            <img src="logo.png" alt="Logo" className="h-full w-full object-contain brightness-75 dark:brightness-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Proteção Inteligente de Ativos de Marca</p>
                        </div>
                    </div>

                    <Card className="border-border/70 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
                            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <PasswordInput id="password" withLockIcon placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                                </div>

                                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Entrando..." : "Entrar"}
                                </Button>
                            </form>

                            <div className="mt-4 text-center text-sm">
                                <Link href="/esqueci-senha" className="font-medium text-primary hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>

                            {/*<div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Não tem uma conta? </span>
                            <Link href="/cadastro" className="font-medium text-primary hover:underline">
                                Cadastre-se
                            </Link>
                        </div>*/}
                        </CardContent>
                    </Card>

                    {/* Sempre cai sobre a faixa colorida: é o último elemento de um bloco centrado
                        na vertical, então fica abaixo da emenda em qualquer altura de tela. Por
                        isso a cor é branca fixa, e não `muted-foreground`. */}
                    <p className="mt-8 text-center text-xs text-white/65">
                        Ao continuar, você concorda com nossos{" "}
                        <Link href="/termos-de-uso" className="underline underline-offset-2 transition-colors hover:text-white">
                            Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/politica-de-privacidade" className="underline underline-offset-2 transition-colors hover:text-white">
                            Política de Privacidade
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
