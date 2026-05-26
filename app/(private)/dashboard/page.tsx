export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Dashboard | Trackings",
};

import Dashboard from "./_components/Dashboard";
import DashboardPageSkeleton from "@/components/DashboardPageSkeleton";

export default function DashboardPage() {
    return (
        <ClientLayout pageSkeleton={<DashboardPageSkeleton />}>
            <Dashboard pageSkeleton={<DashboardPageSkeleton />} />
        </ClientLayout>
    );
}
