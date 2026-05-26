"use client";

import { AppLayoutWrapper } from "./AppLayoutWrapper";

type ClientLayoutProps = {
    children: React.ReactNode;
    pageSkeleton: React.ReactNode;
};

export default function ClientLayout({ children, pageSkeleton }: ClientLayoutProps) {
    return <AppLayoutWrapper pageSkeleton={pageSkeleton}>{children}</AppLayoutWrapper>;
}
