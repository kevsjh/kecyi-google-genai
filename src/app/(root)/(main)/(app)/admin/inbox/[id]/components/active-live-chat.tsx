import { MemoizedReactMarkdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/codeblock"
import { ILiveAgentDoc } from "@/types"
import { notFound } from "next/navigation"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import AgentLiveChatPrompt from "./agent-live-chat-prompt"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminActiveLiveChat({ liveAgentDoc }: { liveAgentDoc: ILiveAgentDoc }) {


    if (liveAgentDoc.status !== 'active') {
        notFound()
    }

    return <div className="relative p-4 flex h-full w-full flex-col gap-6 items-center overflow-auto">

        <Link target="_blank" href={`/client/agent/liveagent/${liveAgentDoc.id}`}><Badge>Simulate Real Time Client Chat Here</Badge></Link>


        <div className="absolute flex justify-center inset-x-0   bg-white/90 bottom-4 w-full duration-300 ease-in-out  dark:from-10%">
            <div className="px-4 max-w-3xl w-full"><AgentLiveChatPrompt id={liveAgentDoc.id} /></div>
        </div>

    </div>
}