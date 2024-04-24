import { Chat } from "@/components/chat/chat";
import { AgentChatTypeEnum } from "@/constant/enum";
import { getAuthByCookie } from "@/lib/auth/action";
import { StockAgentAI } from "@/lib/chat/stock-agent-ai-actions";
import { getChat } from "@/lib/helper-actions/action";
import { isAgentChatTypeValid } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";

export default async function IndexPage({ params }: {
    params: {
        id: string
        agent: string
    }
}) {

    const isValid = isAgentChatTypeValid(params.agent)
    if (!isValid) {
        redirect('/client')
    }

    const session = await getAuthByCookie()

    if (!session?.user) {
        redirect(`/?signin=true`)
    }


    const chat = await getChat({
        uid: session.user.id,
        chatId: params?.id ?? ''
    })


    if (!chat) {
        redirect(`/client/agent/${params.agent}/chat`)
    }

    if (chat?.uid !== session?.user?.id) {
        notFound()
    }


    if (chat.agentChatType?.toUpperCase() === AgentChatTypeEnum.STOCKAGENT) {
        return <StockAgentAI
            initialAIState={{
                chatId: chat.id,
                messages: chat.messages,
                interactions: [],
                agentChatType: chat.agentChatType
            }}
        >
            <Chat
                id={chat.id}
                session={session}
                initialMessages={chat.messages}
                chatAgent={params.agent as AgentChatTypeEnum}

            />
        </StockAgentAI>
    }


    return (
        <StockAgentAI
            initialAIState={{
                chatId: chat.id,
                messages: chat.messages,
                interactions: [],
                agentChatType: chat.agentChatType
            }}
        >
            <Chat
                id={chat.id}
                session={session}
                initialMessages={chat.messages}
                chatAgent={params.agent as AgentChatTypeEnum}

            />
        </StockAgentAI>
    )
}