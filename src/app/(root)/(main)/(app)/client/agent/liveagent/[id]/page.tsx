import AdminActiveLiveChat from "@/components/live-agent-components/active-live-chat"
import AdminPendingLiveChat from "@/components/live-agent-components/pending-live-chat"
import { getLiveAgentChatsById } from "@/lib/live-agent-actions/live-agent-actions"
import { notFound } from "next/navigation"
import ClientListenLiveAgentState from "./components/client-listen-live-agent-state"

export default async function IndexPage({ params }: {
    params: {
        id: string

    }
}) {
    const { liveAgentDoc, currentMessages } =
        await getLiveAgentChatsById(params.id)



    if (liveAgentDoc === undefined) {
        notFound()
    }

    if (liveAgentDoc.status === 'pending') {
        return <>
            <ClientListenLiveAgentState id={liveAgentDoc.id} />
            <AdminPendingLiveChat liveAgentDoc={liveAgentDoc} />
        </>
    }
    if (liveAgentDoc.status === 'active') {
        return <AdminActiveLiveChat
            panel='client'
            liveAgentDoc={liveAgentDoc} currentMessages={currentMessages} />
    }

    notFound()
}