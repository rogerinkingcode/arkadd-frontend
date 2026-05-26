"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { makeRequest } = useFetch();

    useEffect(() => {
        async function checkLogin() {
            const response = await makeRequest("get", "/me");
            if (response !== null) {
                router.push("/dashboard");
            }

            const loginCache = localStorage.getItem("loginCache");

            if (loginCache) {
                const parseloginCache = JSON.parse(loginCache);
                setEmail(parseloginCache.email);
                setPassword(parseloginCache.password);
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

        if (response.status === 200) {
            toast.success("Logado com sucesso!", {
                description: `Bem-vindo, ${response.payload.email}`,
            });

            router.push("/dashboard");

            // Salva o login no localStorage
            const credentials = { "email": email, "password": password };
            localStorage.setItem("loginCache", JSON.stringify(credentials));
        }

        if (response.status === 401) {
            toast.info("Atenção a essa senha!", {
                description: response.message,
            });
        }

        if (response.status === 400) {
            toast.info("Atenção a esse e-mail!", {
                description: response.message,
            });
        }

        if (response.status === 500) {
            toast.info("Erro interno", {
                description: response.message,
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
            {/* Brilhos decorativos da marca */}
            <div className="apex-glow absolute -right-24 -top-32 h-96 w-96 rounded-full" aria-hidden="true" />
            <div className="apex-glow absolute -bottom-40 -left-24 h-96 w-96 rounded-full" aria-hidden="true" />

            {/* Alternância de tema */}
            <div className="absolute right-4 top-4 z-20">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-md">
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
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-9" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        {/*<div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Não tem uma conta? </span>
                            <Link href="/cadastro" className="font-medium text-primary hover:underline">
                                Cadastre-se
                            </Link>
                        </div>*/}
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-muted-foreground">Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade</p>
            </div>
        </div>
    );
}
