export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";
import OccurrencesPage from "./_components/Occurrences";
import OccurrencesSkeleton from "./_components/OccurrencesSkeleton";

export const metadata = {
    title: "Ocorrências da imagem | Trackings",
};

export default function OccurrencesRoute() {
    return (
        <ClientLayout pageSkeleton={<OccurrencesSkeleton />}>
            <OccurrencesPage pageSkeleton={<OccurrencesSkeleton />} />
        </ClientLayout>
    );
}
