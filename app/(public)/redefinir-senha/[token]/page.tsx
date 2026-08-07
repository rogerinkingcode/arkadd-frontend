export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetPassword from "./_components/ResetPassword";

export const metadata = {
    title: "Redefinir senha | Trackings",
};

export default function ResetPasswordRoute() {
    return (
        <Suspense fallback={null}>
            <ResetPassword />
        </Suspense>
    );
}
