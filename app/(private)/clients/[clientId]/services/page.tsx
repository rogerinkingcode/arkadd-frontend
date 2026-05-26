export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";
import ClientServicesPage from "./_components/ClientServices";
import ClientServicesSkeleton from "./_components/ClientServicesSkeleton";

export const metadata = {
    title: "Configuração de Serviços | Trackings",
};

export default function ClientServicesRoute() {
    return (
        <ClientLayout pageSkeleton={<ClientServicesSkeleton />}>
            <ClientServicesPage pageSkeleton={<ClientServicesSkeleton />} />
        </ClientLayout>
    );
}
