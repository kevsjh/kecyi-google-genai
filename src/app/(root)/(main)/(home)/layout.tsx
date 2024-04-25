'use client'

export const maxDuration = 180;


import { AppHeader } from "@/components/nav/app-header";
import { HomeHeader } from "@/components/nav/home-header";
import RootProviders from "@/providers/root-providers";
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <HomeHeader />
            {children}
        </div>
    );
}
