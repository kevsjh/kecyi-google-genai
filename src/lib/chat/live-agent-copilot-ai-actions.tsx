

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue
} from 'ai/rsc'

import { BotCard, BotMessage, spinner } from '@/components/stocks'

import { formatNumber, nanoid, removeDuplicateMessages, runAsyncFnWithoutBlocking, sleep } from '@/lib/utils'

import { SpinnerMessage, SystemMessage, UserMessage } from '@/components/stocks/message'
import { AIProvider, Chat } from '@/types'

import { experimental_streamText } from 'ai'
import { z } from 'zod'
import { getGoogleAccessToken } from '../auth/access-token'


import { getAuthByCookie } from '../auth/action'
import { saveChat } from '../helper-actions/action'


import { createGoogleGenerativeAI } from '@/packages/google/google-provider'
import RouteAgentUI from '@/components/route-agent/route-agent-ui'
import LLMEntryHelper, { llmStreamEntryHelper } from '../llm-helper/llm-helper'
import { sendLiveAgentRequest } from '../live-agent-actions/live-agent-actions'
import TransferLiveAgentUI from '@/components/route-agent/live-agent-ui'
import TransferLiveAgentUILoading from '@/components/route-agent/live-agent-ui-load'



async function submitUserMessage(content: string) {
  'use server'

  // await rateLimit()
  const aiState = getMutableAIState()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n${content}`
      }
    ]
  })

  const history = aiState.get().messages.map((message: { role: any; content: any }) => ({
    role: message.role,
    content: message.content
  }))

  const textStream = createStreamableValue('')
  const spinnerStream = createStreamableUI(<SpinnerMessage />)
  const messageStream = createStreamableUI(null)

  const uiStream = createStreamableUI()

    ; (async () => {
      try {
        const creds = await Promise.all([
          getAuthByCookie(),
          getGoogleAccessToken()
        ])

        const session = creds[0]
        const accessToken = creds[1]
        if (!accessToken) {

          throw new Error('Failed to get access token')
        }

        if (!session || session?.user?.id?.length === 0) {
          throw new Error('Failed to get user session')
        }


        const assistantChatId = nanoid()

        const googleVertexAI = createGoogleGenerativeAI({
          baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
          apiKey: '',
          headers: ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          })
        })


        const result = await experimental_streamText({
          model: googleVertexAI.chat('models/gemini-1.5-pro-preview-0409',
            // model: googleCloudVertex.generativeAI('models/gemini-1.5-pro-preview-0409',

          ),
          temperature: 0.2,
          tools: {

            retrieveContext: {
              description: 'Tool to retrieve context from knowledge base',
              parameters: z.object({
                query: z
                  .string()
                  .describe(
                    'The query to retrieve context from the knowledge base'
                  ),



              }),
              execute: async ({ query }) => {
                return await llmStreamEntryHelper({
                  query,
                  uid: session.user.id,
                  rephraseQuestion: false,
                  summarizeContext: true,
                  minScore: 0.6,
                  history: history,
                  accessToken,
                  assistantChatId,
                  aiState,
                  messageStreamCallbackFn: (content: string) => {
                    messageStream.update(<BotMessage content={content} />)
                  }
                })
              }
            },

          },
          system: `\
          You are a customer service agent for the company KECYI bank and financial service.Your role is to provide support and information with support from the company retrieve context and data from the user.
         
          If the user query or request for certain tasks that needs to be routed to a different agent, you should
                1. Check if user ask about trending stocks, current stock portfolio, purchase or sell stocks, call the \`routeAgent\` function to route with the path '/client/agent/stockagent/chat' and name 'Stock Agent'.
            2. Check if user needs to view, manage their bank account transaction, report fraud transaction and any related transactions, call the \`routeAgent\` function to route with the path '/client/transactions' and name 'Transactions'.
            3. Do not make up any agent, path or name, beyond the provided exact path and name.

          If you do not have sufficient data, context or information to respond to the user question, call the \`retrieveContext\` function to retrieve context from the knowledge base. Rephrase the question to a standalone query so that the context can be retrieved from the knowledge base.
          
          Think step by step, do not make up any information and assumptions. Respond with a professional answer. If a response to the question cannot be determined from the context, history or the tools available, respond that you do not have enough information to respond to the question.
          If the user wants to complete an impossible task, respond that you are a demo and cannot do that.
          `,
          messages: [...history]
        })

        let textContent = ''
        spinnerStream.done(null)


        // streaming chat response from llm should match the same chatId
        // this allow upserts with same messageId


        let llmToolInvoked = false

        for await (const delta of result.fullStream) {

          // check if tool-call is invoked
          const { type } = delta



          // mark the tool as invoked
          if (type === 'tool-call') {
            llmToolInvoked = true


          }
          if (type === 'text-delta') {



            const { textDelta } = delta


            textContent += textDelta
            messageStream.update(<BotMessage content={textContent} />)

            aiState.update({
              ...aiState.get(),
              final: false,
              messages: [
                ...aiState.get().messages,
                {
                  id: assistantChatId,
                  role: 'assistant',
                  content: textContent
                }
              ]
            })
          }
          // before tools invocation is completed (show skeleton etc...)
          else if (type === 'tool-call') {
            const { toolName, args } = delta

          } else if (type === 'tool-result') {
            const { toolName, args, result } = delta
          }

        }


        const { chatId, messages, interactions, agentChatType } = aiState.get()
        const uniqueMessages = removeDuplicateMessages(messages)

        // mark ai state as done for normal text streaming response
        // only if llm tool is not invoked
        if (!llmToolInvoked) {
          aiState.done({
            ...aiState.get(),
            interactions: [],

            messages: uniqueMessages
          })
        }

        if (session && session.user) {
          const createdAt = new Date()
          const userId = session.user.id as string
          const path = `chat/${chatId}`
          const title = messages[0].content.substring(0, 100)

          const chat: Chat = {
            id: chatId,
            title,
            userId,
            createdAt,
            messages: uniqueMessages,
            path,
            agentChatType
          }


          //  get the last message from unique message
          const lastMessage = uniqueMessages[uniqueMessages.length - 1]
          // we exepect it should not be user message, if it is we do not save
          if (lastMessage.role !== 'user') {
            // await saveChat(chat)
          }
        }

        uiStream.done()
        textStream.done()
        messageStream.done()
        return 'done'
      } catch (e) {
        console.error(`Exception in submitUserMessage: ${e}`)

        const error = e
        uiStream.error(error)
        textStream.error(error)
        messageStream.error(error)
        // @ts-ignore
        aiState.done()
      }
    })()

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
  display?: {
    name: string
    props: Record<string, any>
  }
}

export type AIState = {
  chatId: string
  interactions?: string[]
  messages: Message[],


}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const LiveAgentCopilotAI: AIProvider<AIState, UIState, {}> = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [], },
  onGetUIState: async () => {
    'use server'

    const session = await getAuthByCookie()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
})


// used to load remotely stored chat data to ui form
export const getUIStateFromAIState = (aiState: Chat) => {
  // print last aiState messages
  // @ts-ignore

  return aiState?.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        (message.role === 'assistant' || message.role === 'function') ? (
          (
            <BotMessage content={message.content} />
          )
        ) : message.role === 'user' ? (
          // @ts-ignore
          <UserMessage showAvatar>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
