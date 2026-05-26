import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuthentication } from "@/lib/api";

export async function proxy(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const { authenticated, user } = await checkAuthentication(cookieHeader);
    const url = request.nextUrl;
    const path = url.pathname;

    if (path.startsWith("/brands") && [...url.searchParams].length > 0) {
        return NextResponse.next();
    }

    // Ignorar caminhos públicos
    const publicPaths = ["/_next/", "/public/", "/favicon.ico", "/login"];
    if (publicPaths.some((p) => path.startsWith(p) || path.includes("/logo"))) {
        return NextResponse.next();
    }

    if (!authenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico|$).*)"],
};
