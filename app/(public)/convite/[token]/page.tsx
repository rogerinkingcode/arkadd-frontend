export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AcceptInvite from "./_components/AcceptInvite";

export const metadata = {
    title: "Convite de Acesso | Trackings",
};

export default function AcceptInviteRoute() {
    return (
        <Suspense fallback={null}>
            <AcceptInvite />
        </Suspense>
    );
}
