import { Button } from "@/components/ui/button";
import { Sparkle, XCircle } from "@phosphor-icons/react/dist/ssr";
import CloseCopilotButton from "./close-copilot";
import { TransactionCopilotAI } from "@/lib/chat/transaction-copilot-actions";
import { getAuthByCookie } from "@/lib/auth/action";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat/chat";
import { transactionCopilotSuggestionMessages } from "@/constant/enum";

export default async function TransactionCopilot() {
    const session = await getAuthByCookie()

    if (!session?.user) {
        redirect(`/?signin=true`)
    }



    return <div className="relative w-full h-full flex flex-col overflow-hidden p-4 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Sparkle size={25} />
                <h3 className="text-xl font-semibold">Copilot</h3>
            </div>
            <CloseCopilotButton />
        </div>
        <TransactionCopilotAI
            initialAIState={{
                chatId: '',
                messages: [],
                interactions: [],

            }}
        >
            <Chat
                id={''}

                initialMessages={[]}
                uiStateType={typeof TransactionCopilotAI}
                chatListClassname="max-w-xl w-full"
                suggestionMessages={transactionCopilotSuggestionMessages}

            />
        </TransactionCopilotAI>

    </div>
}