import { getLiveAgentChatsById } from "@/lib/live-agent-actions/live-agent-actions"
import { notFound } from "next/navigation"
import AdminPendingLiveChat from "../../../../../../../components/live-agent-components/pending-live-chat"
import AdminActiveLiveChat from "../../../../../../../components/live-agent-components/active-live-chat"

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
        return <AdminPendingLiveChat liveAgentDoc={liveAgentDoc} />
    }
    if (liveAgentDoc.status === 'active') {
        return <AdminActiveLiveChat
            panel='admin'
            liveAgentDoc={liveAgentDoc} currentMessages={currentMessages} />
    }

    notFound()
}