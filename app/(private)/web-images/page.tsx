export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Imagens na web | Trackings",
};

import WebImagesPage from "./_components/WebImages";
import WebImagesSkeleton from "./_components/WebImagesSkeleton";

export default function WebImagesRoute() {
    return (
        <ClientLayout pageSkeleton={<WebImagesSkeleton />}>
            <WebImagesPage pageSkeleton={<WebImagesSkeleton />} />
        </ClientLayout>
    );
}
