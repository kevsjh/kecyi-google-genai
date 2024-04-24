import { firestoreAutoId, isAgentChatTypeValid, nanoid } from '@/lib/utils'

import { StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'
import { redirect } from 'next/navigation'
import { Agent } from 'http'
import { AgentChatTypeEnum } from '@/constant/enum'
import { getAuthByCookie } from '@/lib/auth/action'
import { Chat } from '@/components/chat/chat'




export const metadata = {
    title: 'KECYI - Google Cloud GenAI 2024'
}

export default async function IndexPage({ params }: {
    params: {
        agent: string
    }
}) {



    const session = await getAuthByCookie()
    if (!session?.user) {
        redirect(`/?signin=true`)
    }

    const id = firestoreAutoId()

    const isValid = isAgentChatTypeValid(params.agent)
    if (!isValid) {
        redirect('/client')
    }



    if (params.agent?.toUpperCase() === AgentChatTypeEnum.STOCKAGENT) {

        return <StockAgentAI initialAIState={{
            chatId: id, interactions: [], messages: [],
            agentChatType: params.agent as AgentChatTypeEnum
        }}>
            <Chat id={id} session={session}
                chatAgent={params.agent as AgentChatTypeEnum}
            />
        </StockAgentAI>

    }

    return <StockAgentAI initialAIState={{
        chatId: id, interactions: [], messages: [],
        agentChatType: params.agent as AgentChatTypeEnum
    }}>
        <Chat id={id} session={session}
            chatAgent={params.agent as AgentChatTypeEnum}
        />
    </StockAgentAI>
}
