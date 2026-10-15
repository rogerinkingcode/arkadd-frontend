export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Custos | Trackings",
};

import CostsPage from "./_components/Costs";
import CostsSkeleton from "./_components/CostsSkeleton";

export default function CostsRoute() {
    return (
        <ClientLayout pageSkeleton={<CostsSkeleton />}>
            <CostsPage pageSkeleton={<CostsSkeleton />} />
        </ClientLayout>
    );
}
