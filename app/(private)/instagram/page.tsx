export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Instagram | Trackings",
};

import InstagramPage from "./_components/Instagram";
import InstagramPageSkeleton from "./_components/InstagramSkeleton";

export default function InstagramRoute() {
    return (
        <ClientLayout pageSkeleton={<InstagramPageSkeleton />}>
            <InstagramPage pageSkeleton={<InstagramPageSkeleton />} />
        </ClientLayout>
    );
}
