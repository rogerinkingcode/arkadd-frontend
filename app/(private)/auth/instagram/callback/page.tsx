export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Conectando Instagram | Trackings",
};

import InstagramCallback from "./_components/InstagramCallback";
import InstagramCallbackSkeleton from "./_components/InstagramCallbackSkeleton";

export default function InstagramCallbackRoute() {
    return (
        <ClientLayout pageSkeleton={<InstagramCallbackSkeleton />}>
            {/* `useSearchParams` exige um limite de Suspense no App Router */}
            <Suspense fallback={<InstagramCallbackSkeleton />}>
                <InstagramCallback />
            </Suspense>
        </ClientLayout>
    );
}
