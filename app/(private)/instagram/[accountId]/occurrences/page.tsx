export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Ocorrências do Instagram | Trackings",
};

import InstagramOccurrencesPage from "./_components/InstagramOccurrences";
import InstagramOccurrencesSkeleton from "./_components/InstagramOccurrencesSkeleton";

export default function InstagramOccurrencesRoute() {
    return (
        <ClientLayout pageSkeleton={<InstagramOccurrencesSkeleton />}>
            <InstagramOccurrencesPage pageSkeleton={<InstagramOccurrencesSkeleton />} />
        </ClientLayout>
    );
}
