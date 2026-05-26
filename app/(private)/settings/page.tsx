export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Configurações | Trackings",
};

import SettingsPage from "./_components/Settings";
import SettingsPageSkeleton from "@/components/SettingsSkeleton";

export default function SettingPage() {
    return (
        <ClientLayout pageSkeleton={<SettingsPageSkeleton />}>
            <SettingsPage pageSkeleton={<SettingsPageSkeleton />} />
        </ClientLayout>
    );
}
