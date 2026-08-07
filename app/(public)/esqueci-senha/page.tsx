export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ForgotPassword from "./_components/ForgotPassword";

export const metadata = {
    title: "Esqueci minha senha | Trackings",
};

export default function ForgotPasswordRoute() {
    return (
        <Suspense fallback={null}>
            <ForgotPassword />
        </Suspense>
    );
}
