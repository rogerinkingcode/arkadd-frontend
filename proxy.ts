import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuthentication } from "@/lib/api";

/**
 * Rotas que só o dono acessa. Um acesso de cliente que tente entrar nelas é devolvido ao
 * dashboard — ele não gerencia clientes, não contrata serviços, não cadastra ativos e não
 * inspeciona filas.
 *
 * O backend já barra cada uma dessas rotas por conta própria (`requireOwner`); isto evita que
 * o cliente veja uma tela quebrada de erros antes de descobrir que não podia estar ali.
 */
const OWNER_ONLY_PATHS = ["/clients", "/partner", "/settings", "/bullmq"];

/**
 * Rotas exclusivas do admin geral do sistema — o primeiro usuário, gravado em `MasterAdmin`.
 *
 * Cadastrar um usuário é abrir a instalação para mais um escritório; um dono comum não faz
 * isso. O backend já barra com `requireMasterAdmin`, então isto é só para ele não bater numa
 * tela vazia de erro.
 */
const MASTER_ONLY_PATHS = ["/users"];

/** Rotas públicas por natureza — quem chega nelas ainda não tem (ou perdeu) a senha. */
const PUBLIC_PATHS = ["/_next/", "/public/", "/favicon.ico", "/login", "/convite", "/esqueci-senha", "/redefinir-senha"];

export async function proxy(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const url = request.nextUrl;
    const path = url.pathname;

    // Ignorar caminhos públicos
    if (PUBLIC_PATHS.some((p) => path.startsWith(p) || path.includes("/logo"))) {
        return NextResponse.next();
    }

    const { authenticated, user } = await checkAuthentication(cookieHeader);

    if (!authenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user?.role === "client" && OWNER_ONLY_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!user?.isMasterAdmin && MASTER_ONLY_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico|$).*)"],
};
