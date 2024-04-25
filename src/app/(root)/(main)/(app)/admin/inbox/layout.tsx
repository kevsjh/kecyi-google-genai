import { AdminInboxSidebar } from "@/app/(root)/(main)/(app)/admin/inbox/components/admin-inbox-sidebar";
import { getLiveAgentChats } from "@/lib/live-agent-actions/live-agent-actions";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import LiveAgentCopilotUI from "./components/live-agent-copilot";


export default async function ClientRootLayout({
    children,
    searchParams
}: Readonly<{
    children: React.ReactNode;
    searchParams: { [key: string]: string | string[] | undefined }
}>) {
    const showCopilot = (searchParams?.copilot as string)?.toLowerCase() === 'true'
    const liveAgentDocs = await getLiveAgentChats()



    return (
        <div className="relative  h-full flex  overflow-hidden">
            <AdminInboxSidebar liveAgentDocs={liveAgentDocs} />

            <div
                className="group  w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[220px]"

            >  {children}


            </div>

        </div>
    )
}