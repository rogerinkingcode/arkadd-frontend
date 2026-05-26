import { Suspense } from "react";

export const metadata = {
    title: "Login | Trackings",
};

import Login from "./_components/Login";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <Login />
        </Suspense>
    );
}
