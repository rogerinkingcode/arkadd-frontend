export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Ocorrências na web | Trackings",
};

import WebImageOccurrencesPage from "./_components/WebImageOccurrences";
import WebImageOccurrencesSkeleton from "./_components/WebImageOccurrencesSkeleton";

export default function WebImageOccurrencesRoute() {
    return (
        <ClientLayout pageSkeleton={<WebImageOccurrencesSkeleton />}>
            <WebImageOccurrencesPage pageSkeleton={<WebImageOccurrencesSkeleton />} />
        </ClientLayout>
    );
}
