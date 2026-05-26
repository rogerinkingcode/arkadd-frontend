export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Clientes | Trackings",
};

import ClientsPage from "./_components/Clients";
import ClientsPageSkeleton from "@/components/ClientsPageSkeleton";

export default function ClientPage() {
    return (
        <ClientLayout pageSkeleton={<ClientsPageSkeleton />}>
            <ClientsPage pageSkeleton={<ClientsPageSkeleton />} />
        </ClientLayout>
    );
}
