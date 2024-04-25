import { MemoizedReactMarkdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/codeblock"
import { ILiveAgentDoc, ILiveAgentMessage } from "@/types"
import { notFound } from "next/navigation"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import AgentLiveChatPrompt from "./agent-live-chat-prompt"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import ActiveLiveChatList from "./active-live-chat-list"

export default function AdminActiveLiveChat({ liveAgentDoc, currentMessages, panel }: {
    liveAgentDoc: ILiveAgentDoc,
    currentMessages: ILiveAgentMessage[]
    panel: 'admin' | 'client'

}) {


    if (liveAgentDoc.status !== 'active') {
        notFound()
    }

    return <div className="relative  p-4 flex h-full w-full flex-col gap-6 items-center overflow-hidden">

        <div className="flex flex-wrap gap-2">
            <Link target="_blank" href={
                panel === 'admin' ? `/client/agent/liveagent/${liveAgentDoc.id}` : `/admin/inbox/${liveAgentDoc.id}`

            }><Badge>{
                panel === 'admin' ? 'Simulate Real Time Client Chat Here' : 'Simulate Real Time Admin Chat Here'
            }</Badge></Link>

            {
                panel === 'admin' && <Link href={`/admin/inbox/${liveAgentDoc.id}?copilot=true`}><Badge>
                    Access Copilot
                </Badge></Link>
            }

        </div>

        <div className="pb-[200px] h-full w-full"> <ActiveLiveChatList panel={panel} currentMessages={currentMessages} id={liveAgentDoc.id} /></div>
        <div className="absolute flex justify-center inset-x-0   bg-white/90 bottom-4 w-full duration-300 ease-in-out  dark:from-10%">
            <div className="px-4 max-w-4xl w-full"><AgentLiveChatPrompt panel={panel} id={liveAgentDoc.id} /></div>
        </div>

    </div>
}