export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Image Scraper | Trackings",
};

import ImageScraperPage from "./_components/ImageScraper";
import ImageScraperPageSkeleton from "./_components/ImageScraperSkeleton";

export default function ImageScraperRoute() {
    return (
        <ClientLayout pageSkeleton={<ImageScraperPageSkeleton />}>
            <ImageScraperPage pageSkeleton={<ImageScraperPageSkeleton />} />
        </ClientLayout>
    );
}
