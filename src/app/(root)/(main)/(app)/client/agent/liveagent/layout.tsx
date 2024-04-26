import { AdminInboxSidebar } from "@/app/(root)/(main)/(app)/admin/inbox/components/admin-inbox-sidebar";
import { getLiveAgentChats } from "@/lib/live-agent-actions/live-agent-actions";



export default async function ClientRootLayout({
    children,

}: Readonly<{
    children: React.ReactNode;

}>) {

    const liveAgentDocs = await getLiveAgentChats()



    return (
        <div className="relative  h-full flex  overflow-hidden">
            <AdminInboxSidebar liveAgentDocs={liveAgentDocs} panel="client" />

            <div
                className="group  w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[220px]"

            >  {children}


            </div>

        </div>
    )
}