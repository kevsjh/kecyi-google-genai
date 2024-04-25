import { AdminInboxSidebar } from "@/components/nav/admin-inbox-sidebar";
import { getLiveAgentChats } from "@/lib/live-agent-actions/live-agent-actions";
import { child } from "firebase/database";

export default async function ClientRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const liveAgentDocs = await getLiveAgentChats()
    return (
        <div className="relative  h-full flex  overflow-hidden">
            <AdminInboxSidebar liveAgentDocs={liveAgentDocs} />
            {children}
        </div>
    )
}