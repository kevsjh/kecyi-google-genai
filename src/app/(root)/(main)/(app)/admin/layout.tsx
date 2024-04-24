import ClientSideNav from "@/components/nav/portal-side-nav";
import { Header } from "@/components/nav/header";
import PortalSideNav from "@/components/nav/portal-side-nav";
import { adminSideNavItems, clientSideNavItems } from "@/config/portal-side-nav-config";
import { getAuthByCookie } from "@/lib/auth/action";
import { redirect } from "next/navigation";

export default async function ClientRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getAuthByCookie()
    if (!session?.user) {
        redirect(`/?signin=true`)
    }


    return (
        <div className="flex min-h-screen w-full flex-col ">
            <PortalSideNav items={adminSideNavItems} />
            <div className="flex flex-col   h-dvh sm:pl-14">
                <Header />
                {children}
            </div>
        </div>
    );
}
