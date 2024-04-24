'use client'

export const maxDuration = 180;

import { Header } from "@/components/nav/header";
import RootProviders from "@/providers/root-providers";
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col ">
            <Header />
            {children}
        </div>
    );
}
