'use client'

export const maxDuration = 180;

import RootProviders from "@/providers/root-providers";
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RootProviders>

            {children}
        </RootProviders>
    );
}
