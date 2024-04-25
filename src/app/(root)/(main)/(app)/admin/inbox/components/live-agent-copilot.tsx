import { Button } from "@/components/ui/button";
import { Sparkle, XCircle } from "@phosphor-icons/react/dist/ssr";

import { TransactionCopilotAI } from "@/lib/chat/transaction-copilot-actions";
import { getAuthByCookie } from "@/lib/auth/action";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat/chat";
import { liveAgentCopilotSuggestionMessages, transactionCopilotSuggestionMessages } from "@/constant/enum";
import CloseCopilotButton from "../../../client/transactions/components/close-copilot";
import { LiveAgentCopilotAI } from "@/lib/chat/live-agent-copilot-ai-actions";
import { CopilotChat } from "@/components/chat/copilot-chat";
import { LiveAgentCopilotEmptyScreen } from "@/components/chat/empty-screens/liveagent-copilot-empty-screen";

export default async function LiveAgentCopilotUI() {
    const session = await getAuthByCookie()

    if (!session?.user) {
        redirect(`/?signin=true`)
    }



    return <div className="relative  w-full h-full flex flex-col overflow-hidden p-4 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Sparkle size={25} />
                <h3 className="text-xl font-semibold">Copilot</h3>
            </div>
            <CloseCopilotButton />
        </div>
        <LiveAgentCopilotAI
            initialAIState={{
                chatId: '',
                messages: [],
                interactions: [],

            }}
        >
            <CopilotChat
                id={''}
                emptyScreen={<LiveAgentCopilotEmptyScreen />}
                initialMessages={[]}
                uiStateType={typeof LiveAgentCopilotAI}
                chatListClassname="max-w-xl w-full"
                suggestionMessages={liveAgentCopilotSuggestionMessages}

            />
        </LiveAgentCopilotAI>

    </div>
}