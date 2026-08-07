export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";
import ClientAccessPage from "./_components/ClientAccess";
import ClientAccessSkeleton from "./_components/ClientAccessSkeleton";

export const metadata = {
    title: "Acessos do Cliente | Trackings",
};

export default function ClientAccessRoute() {
    return (
        <ClientLayout pageSkeleton={<ClientAccessSkeleton />}>
            <ClientAccessPage pageSkeleton={<ClientAccessSkeleton />} />
        </ClientLayout>
    );
}
