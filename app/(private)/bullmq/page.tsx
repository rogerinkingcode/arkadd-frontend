import { Suspense } from "react";

export const metadata = {
    title: "BullMQ | Trackings",
};

import Bullmq from "./_components/Bullmq";

export default function BullmqPage() {
    return (
        <Suspense fallback={null}>
            <Bullmq />
        </Suspense>
    );
}
