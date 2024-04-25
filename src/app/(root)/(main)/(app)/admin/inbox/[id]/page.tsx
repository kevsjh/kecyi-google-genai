import { getLiveAgentChatsById } from "@/lib/live-agent-actions/live-agent-actions"
import { notFound } from "next/navigation"
import AdminPendingLiveChat from "../../../../../../../components/live-agent-components/pending-live-chat"
import AdminActiveLiveChat from "../../../../../../../components/live-agent-components/active-live-chat"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import LiveAgentCopilotUI from "../components/live-agent-copilot"

export default async function IndexPage({ params, searchParams }: {
    params: {
        id: string
    },
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const showCopilot = (searchParams?.copilot as string)?.toLowerCase() === 'true'
    const { liveAgentDoc, currentMessages } =
        await getLiveAgentChatsById(params.id)



    if (liveAgentDoc === undefined) {
        notFound()
    }

    if (liveAgentDoc.status === 'pending') {
        return <AdminPendingLiveChat liveAgentDoc={liveAgentDoc} />
    }
    if (liveAgentDoc.status === 'active') {
        return <div className="relative h-full flex overflow-hidden">
            <div className=" md:hidden w-full h-full">
                <ResizablePanelGroup direction="vertical" >
                    <ResizablePanel
                        minSize={30}
                    >
                        <AdminActiveLiveChat
                            panel='admin'
                            liveAgentDoc={liveAgentDoc} currentMessages={currentMessages} />
                    </ResizablePanel>
                    {
                        showCopilot && <>
                            <ResizableHandle withHandle />
                            <ResizablePanel
                                minSize={40}
                            >
                                <LiveAgentCopilotUI />
                            </ResizablePanel></>
                    }
                </ResizablePanelGroup>

            </div>

            <div className=" hidden absolute md:inline-flex w-full h-full  " >
                <ResizablePanelGroup direction="horizontal" >
                    <ResizablePanel
                        minSize={35}
                    >
                        <AdminActiveLiveChat
                            panel='admin'
                            liveAgentDoc={liveAgentDoc} currentMessages={currentMessages} />
                    </ResizablePanel>
                    {
                        showCopilot && <>
                            <ResizableHandle withHandle />
                            <ResizablePanel
                                minSize={20}
                            >  <LiveAgentCopilotUI />
                            </ResizablePanel></>
                    }
                </ResizablePanelGroup>
            </div>
        </div>

    }

    notFound()
}