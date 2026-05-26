import { Suspense } from "react";

export const metadata = {
    title: "Ameaças | Trackings",
};

import Threats from "./_components/Threats";

export default function ThreatsPage() {
    return (
        <Suspense fallback={null}>
            <Threats />
        </Suspense>
    );
}
