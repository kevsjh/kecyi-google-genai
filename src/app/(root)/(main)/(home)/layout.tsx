'use client'

export const maxDuration = 180;


import { AppHeader } from "@/components/nav/app-header";
import RootProviders from "@/providers/root-providers";
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col ">
            <AppHeader />
            {children}
        </div>
    );
}
