import { Button } from "@/components/ui/button";
import { Sparkle, XCircle } from "@phosphor-icons/react/dist/ssr";
import CloseCopilotButton from "./close-copilot";

import { getAuthByCookie } from "@/lib/auth/action";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat/chat";
import { AgentChatTypeEnum, portfolioCopilotSuggestionMessages, transactionCopilotSuggestionMessages } from "@/constant/enum";
import { firestoreAutoId } from "@/lib/utils";
import { StockAgentAI } from "@/lib/chat/stock-agent-ai-actions";
import { StockAgentEmptyScreen } from "@/components/chat/empty-screens/stock-agent-empty-screen";

export default async function PortfolioCopilot() {
    const session = await getAuthByCookie()

    if (!session?.user) {
        redirect(`/?signin=true`)
    }

    const id = firestoreAutoId()


    return <div className="relative w-full h-full flex flex-col overflow-hidden p-4 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Sparkle size={25} />
                <h3 className="text-xl font-semibold">Copilot</h3>
            </div>
            <CloseCopilotButton />
        </div>
        <StockAgentAI
            initialAIState={{
                chatId: id,
                messages: [],
                interactions: [],
                agentChatType: AgentChatTypeEnum.STOCKAGENT

            }}
        >
            <Chat
                id={id}
                allowNavigate={false}
                initialMessages={[]}
                uiStateType={typeof StockAgentAI}
                chatListClassname="max-w-md w-full"
                suggestionMessages={portfolioCopilotSuggestionMessages}
                emptyScreen={<StockAgentEmptyScreen />}


            />
        </StockAgentAI>

    </div>
}