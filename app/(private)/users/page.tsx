export const dynamic = "force-dynamic";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "Usuários | Trackings",
};

import UsersPage from "./_components/Users";
import UsersPageSkeleton from "@/components/UsersPageSkeleton";

export default function Page() {
    return (
        <ClientLayout pageSkeleton={<UsersPageSkeleton />}>
            <UsersPage pageSkeleton={<UsersPageSkeleton />} />
        </ClientLayout>
    );
}
