import { ClientSidebarDesktop } from "@/components/nav/client-sidebar-desktop"
import { AgentChatTypeEnum } from "@/constant/enum"
import { isAgentChatTypeValid } from "@/lib/utils"
import { notFound, redirect } from "next/navigation"


interface ChatLayoutProps {
    children: React.ReactNode
    params: {
        agent: string
    }
}

export default async function ChatLayout({ children, params }: ChatLayoutProps) {


    // check if params.agent exists under ChatTypeEnum
    // if not, return not found


    const isValid = isAgentChatTypeValid(params.agent)
    if (!isValid) {
        redirect('/client')
    }


    return (
        <div className="relative  h-full flex  overflow-hidden">
            <ClientSidebarDesktop params={params} />
            {children}
        </div>
    )
}
