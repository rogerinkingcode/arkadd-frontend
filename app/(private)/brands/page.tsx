export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Ativos | Trackings",
};

import BrandsPage from "./_components/Brands";
import BrandsPageSkeleton from "@/components/BrandsPageSkeleton";

export default function BrandPage() {
    return (
        <ClientLayout pageSkeleton={<BrandsPageSkeleton />}>
            <BrandsPage pageSkeleton={<BrandsPageSkeleton />} />
        </ClientLayout>
    );
}
