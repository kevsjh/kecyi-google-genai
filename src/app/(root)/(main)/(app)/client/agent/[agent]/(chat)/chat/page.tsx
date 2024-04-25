import { firestoreAutoId, isAgentChatTypeValid, nanoid } from '@/lib/utils'

import { StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'
import { notFound, redirect } from 'next/navigation'
import { Agent } from 'http'
import { AgentChatTypeEnum, customerServiceAgentSuggestionMessages, stockAgentSuggestionMessages } from '@/constant/enum'
import { getAuthByCookie } from '@/lib/auth/action'
import { Chat } from '@/components/chat/chat'
import { StockAgentEmptyScreen } from '@/components/chat/empty-screens/stock-agent-empty-screen'
import { CustomerServiceAgentAI } from '@/lib/chat/customer-service-agent-ai-actions'
import { CustomerServiceAgentEmptyScreen } from '@/components/chat/empty-screens/customer-service-agent-empty-screen'




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
            <Chat id={id}
                chatAgent={params.agent as AgentChatTypeEnum}
                uiStateType={typeof StockAgentAI}
                suggestionMessages={stockAgentSuggestionMessages}
                emptyScreen={<StockAgentEmptyScreen />}
            />
        </StockAgentAI>

    } else if (params.agent?.toUpperCase() === AgentChatTypeEnum.CUSTOMERSERVICE) {

        return <CustomerServiceAgentAI initialAIState={{
            chatId: id, interactions: [], messages: [],
            agentChatType: params.agent as AgentChatTypeEnum
        }}>
            <Chat id={id}
                chatAgent={params.agent as AgentChatTypeEnum}
                uiStateType={typeof StockAgentAI}
                suggestionMessages={customerServiceAgentSuggestionMessages}
                emptyScreen={<CustomerServiceAgentEmptyScreen />}
            />
        </CustomerServiceAgentAI>

    } else {
        notFound()
    }


}
