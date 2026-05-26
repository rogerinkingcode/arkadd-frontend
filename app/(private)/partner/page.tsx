export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Parceiros | Trackings",
};

import PartnerPage from "./_components/Partner";
import PartnerPageSkeleton from "@/components/PartnerPageSkeleton";

export default function BrandPage() {
    return (
        <ClientLayout pageSkeleton={<PartnerPageSkeleton />}>
            <PartnerPage pageSkeleton={<PartnerPageSkeleton />} />
        </ClientLayout>
    );
}
