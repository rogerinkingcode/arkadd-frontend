"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/app-layout";

type AppLayoutWrapperProps = {
    children: React.ReactNode;
    pageSkeleton: React.ReactNode;
};

export function AppLayoutWrapper({ children, pageSkeleton }: AppLayoutWrapperProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const newThreat = searchParams.get("NewThreat");
    const source = searchParams.get("Source");

    let shouldUseLayout: boolean = true;

    // Rotas que NÃO devem usar o AppLayout
    const noLayoutRoutes = ["/brands"];

    const containsPage = !noLayoutRoutes.includes(pathname);

    if (containsPage) {
        if (newThreat || source) {
            shouldUseLayout = false;
        }
    }

    if (!shouldUseLayout) {
        return <>{children}</>;
    }

    return <AppLayout pageSkeleton={pageSkeleton}>{children}</AppLayout>;
}
