

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
import { TransactionCopilotChat } from '@/types'

import { experimental_streamText } from 'ai'
import { number, symbol, z } from 'zod'

import { CheckIcon, SpinnerIcon } from '@/components/icon'
import { getGoogleAccessToken } from '../auth/access-token'
import { IStockData, googleFinanceRequest, requestTrendingStock, yahooFinancialRequest } from '../helper-agents/stock-agent-helper-request'

import { getAuthByCookie } from '../auth/action'
import { saveChat } from '../helper-actions/action'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { IStock, Stocks } from '@/components/stocks/stocks'
import { Stock } from '@/components/stocks/stock'
import { AgentChatTypeEnum } from '@/constant/enum'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import { Purchase } from '@/components/stocks/stock-purchase'
import { getUserAccountTransactionData, getUserInsurance, markTransactionAsReported, purchaseInsurance } from '../helper-agents/transaction-copilot-request'
import { InsurancePurchase } from '@/components/transactions/insurance-purchase'
import Link from 'next/link'
import { createGoogleGenerativeAI } from '@/packages/google/google-provider'


async function confirmInsurancePurchase(premium: boolean, price: number, insuranceType: 'travel' | 'life',
  existingId?: string

) {
  'use server'

  const aiState = getMutableAIState<typeof TransactionCopilotAI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2 text-white">
        Purchasing {premium ? 'premium' : 'basic'} {insuranceType} insurance for ${price} SGD ...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    const session = await getAuthByCookie()

    if (session && session.user) {

      purchasing.update(
        <div className="inline-flex items-start gap-1 md:items-center">
          {spinner}
          <p className="mb-2 text-primary">
            Purchasing {premium ? 'premium' : 'basic'} {insuranceType} insurance for ${price} SGD ...
          </p>
        </div>
      )
      const { status, error } = await purchaseInsurance({
        uid: session.user.id,
        premium,
        price,
        insuranceType,
        existingId
      })

      if (!status || error) {
        purchasing.done(
          <div>
            <p className="mb-2 text-primary">
              Failed to complete purchase. {error ?? 'Something went wrong. Please try again later'}
            </p>
          </div>
        )
      } else {
        purchasing.done(
          <div>
            <p className="mb-2 text-primary">
              You have successfully purchased {premium ? 'premium' : 'basic'} {insuranceType} insurance for ${price} SGD.

            </p>
            <div className='flex gap-4 items-center'>
              <Link
                className='text-sm px-2 py-0.5 text-primary font-medium border-2 rounded-2xl'
                href='/client/transactions'>View Transactions</Link>
            </div>
          </div>
        )
        systemMessage.done(
          <SystemMessage>
            You have successfully purchased {premium ? 'premium' : 'basic'} {insuranceType} insurance for for ${price} SGD.
          </SystemMessage>
        )
      }

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages.slice(0, -1),
          {
            id: nanoid(),
            role: 'assistant',
            name: 'showPurchaseInsurance',
            content: JSON.stringify({
              premium,
              price,
              insuranceType,
              status: status ? 'completed' : 'error',
              currentInsurance: [],
              error
            }),
            display: {
              name: 'showPurchaseInsurance',
              props: {
                args: {
                  premium,
                  price,
                  insuranceType,
                  status: status ? 'completed' : 'error',
                  currentInsurance: [],
                  error
                }
              }
            }
          }
        ]
      })
    }
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}


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

        // get the latest user's bank transaction data
        // simulate real time rag against transactional database

        const session = await getAuthByCookie()
        if (!session?.user) {
          console.error('User not found')
          throw new Error('User not found')
        }

        const uid = session.user.id
        const userTransactionTable = await getUserAccountTransactionData({ uid })
        const accessToken = await getGoogleAccessToken()

        if (!accessToken) {

          throw new Error('Failed to get access token')
        }

        const googleVertexAI = createGoogleGenerativeAI({
          baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
          apiKey: '',
          headers: ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          }),

        })

        const result = await experimental_streamText({
          model: googleVertexAI.chat('models/gemini-1.5-pro-preview-0409',
            // model: googleCloudVertex.generativeAI('models/gemini-1.5-pro-preview-0409',

          ),

          temperature: 0,

          tools: {
            reportFraud: {
              description: 'Tool used to report a fraud transaction.',
              parameters: z.object({
                id: z
                  .string()
                  .describe(
                    'The id of the transaction to report. This is the id of the transaction in the user\'s bank account transaction data.'
                  ),
                merchantName: z
                  .string()
                  .describe(
                    'The name of the merchant where the fraud transaction occurred.'
                  ),
                amount: z
                  .number()
                  .describe(
                    'The amount of the fraud transaction.'
                  ),
              }),
              execute: async ({ id, merchantName, amount }: { id: string, merchantName: string, amount: number }) => {
                const res = await markTransactionAsReported({
                  id,
                  uid
                })
                return res
              }
            },
            showPurchaseInsurance: {
              description: 'Tool to show purchase insurance.',
              parameters: z.object({
              }),
              execute: async ({ }: {}) => {
                const res = await getUserInsurance({
                  uid
                })
                return res
              }
            },
          },

          system: `\
          You are an AI copilot designed to help users with questions and actions related to their existing bank account transactions.
          You have access to user's bank account transaction data. You can also help users report fraud transactions, purchase insurance, and make payment
          
          ---------
          User's bank account transaction data:
          ${userTransactionTable}
          ----------
          
          If user wants to report a fraud transaction, you should
            1. Verify that you have the necessary information from previous messages to ensure you can identify the transaction id, this may include merchant name, date or amount.
            2. Only transaction status that are possible-fraud can be reported, else you should inform the user that the transaction cannot be reported.
            3. If you have all the necessary information, make sure you call the \`reportFraud\` function to send a report.

          If user wants to purchase insurance, you should
            1. call the \`showPurchaseInsurance\` function to start the purchase process.
          

          Do not make up any information. Only provide information based on the user's bank account transaction data.
          If the user wants to complete an impossible task, respond that you are a demo and cannot do that.
      `,
          messages: [...history]
        })

        let textContent = ''
        spinnerStream.done(null)

        // streaming chat response from llm should match the same chatId
        // this allow upserts with same messageId
        const assistantChatId = nanoid()

        let llmToolInvoked = false

        for await (const delta of result.fullStream) {

          // check if tool-call is invoked
          const { type } = delta


          // mark the tool as invoked
          // if (type === 'tool-call' || type === 'tool-result') {
          //   llmToolInvoked = true
          // }
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


          }
          // tool invocation is completed
          else if (type === 'tool-result') {



            const { toolName, args, result } = delta
            if (toolName === 'reportFraud') {
              textContent += result
              messageStream.update(<BotMessage content={textContent} />)
              aiState.done({
                ...aiState.get(),
                final: false,
                messages: [
                  ...aiState.get().messages,
                  {
                    id: assistantChatId,
                    role: 'assistant',
                    content: textContent,
                    display: {
                      name: 'reportFraud',
                      props: {
                        args,
                        result
                      }
                    }
                  }
                ]
              })
            } else if (toolName === 'showPurchaseInsurance') {

              uiStream.update(
                <BotCard>

                  <InsurancePurchase
                    props={{
                      currentInsurance: result,

                      status: 'requires_action'
                    }}

                  />
                </BotCard>
              )
              aiState.done({
                ...aiState.get(),
                messages: [
                  ...aiState.get().messages,
                  {
                    id: nanoid(),
                    role: 'assistant',
                    name: 'showPurchaseInsurance',
                    content: JSON.stringify({

                      currentInsurance: result,
                      status: 'requires_action'
                    }),
                    display: {
                      name: 'showPurchaseInsurance',
                      props: {
                        args: {
                          ...args,
                          result: {
                            currentInsurance: result,
                          },
                          status: 'requires_action'
                        }
                      }
                    }
                  }
                ]
              })
            }
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

        // if (session && session.user) {
        //   const createdAt = new Date()
        //   const userId = session.user.id as string
        //   const path = `/client/agent/${agentChatType?.toLowerCase()}/chat/${chatId}`
        //   const title = messages[0].content.substring(0, 100)

        //   const chat: TransactionCopilotChat = {
        //     id: chatId,
        //     title,
        //     userId,
        //     createdAt,
        //     messages: uniqueMessages,
        //     path,
        //     // agentChatType
        //   }


        //   //  get the last message from unique message
        //   const lastMessage = uniqueMessages[uniqueMessages.length - 1]
        //   // we exepect it should not be user message, if it is we do not save
        //   if (lastMessage.role !== 'user') {
        //     // await saveChat(chat)
        //   }
        // }
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

export async function requestCode() {
  'use server'

  const aiState = getMutableAIState()

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: 'assistant',
        content:
          "A code has been sent to user's phone. They should enter it in the user interface to continue."
      }
    ]
  })

  const ui = createStreamableUI(
    <div className="animate-spin">
      <SpinnerIcon />
    </div>
  )

    ; (async () => {
      // await sleep(2000)
      ui.done()
    })()

  return {
    status: 'requires_code',
    display: ui.value
  }
}

export async function validateCode() {
  'use server'

  const aiState = getMutableAIState()

  const status = createStreamableValue('in_progress')
  const ui = createStreamableUI(
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-zinc-500">
      <div className="animate-spin">
        <SpinnerIcon />
      </div>
      <div className="text-sm text-zinc-500">
        Please wait while we fulfill your order.
      </div>
    </div>
  )

    ; (async () => {
      await sleep(2000)

      ui.done(
        <div className="flex flex-col items-center text-center justify-center gap-3 p-4 text-emerald-700">
          <CheckIcon />
          <div>Payment Succeeded</div>
          <div className="text-sm text-zinc-600">
            Thanks for your purchase! You will receive an email confirmation
            shortly.
          </div>
        </div>
      )

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages.slice(0, -1),
          {
            role: 'assistant',
            content: 'The purchase has completed successfully.'
          }
        ]
      })

      status.done('completed')
    })()

  return {
    status: status.value,
    display: ui.value
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
  // agentChatType: AgentChatTypeEnum


}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const TransactionCopilotAI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmInsurancePurchase,

    // describeImage
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
export const getUIStateFromAIState = (aiState: TransactionCopilotChat) => {
  // print last aiState messages
  // @ts-ignore

  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        (message.role === 'assistant' || message.role === 'function') ? (
          // @ts-ignore
          message.display?.name === 'showStockData' ? (
            <BotCard>
              {
                // @ts-ignore
                message.display?.props?.result ? <Stock
                  // @ts-ignore
                  props={message.display?.props?.result}
                /> : <div>Something went wrong. Please try again later</div>
              }
            </BotCard>
          ) :
            // @ts-ignore
            message.display?.name === 'showPurchaseInsurance' ? (
              <BotCard>
                {
                  // @ts-ignore
                  message.display?.props?.result ? <purchaseInsurance
                    // @ts-ignore
                    props={message.display?.props?.result}
                  /> : <div>Something went wrong. Please try again later</div>
                }
              </BotCard>
            ) :
              // @ts-ignore
              message.display?.name === 'trendingStocks' ? (

                // < SpinnerMessage />
                <BotCard>
                  {/* @ts-ignore */}
                  <Stocks props={message.display?.props?.result} />
                </BotCard>
                // @ts-ignore
              ) : message.display?.name === 'showStockPurchase' ? (
                <BotCard>
                  {
                    // @ts-ignore
                    message.display?.props?.args ? <Purchase
                      // @ts-ignore
                      props={message.display?.props?.args}
                    /> : <div>Something went wrong. Please try again later</div>
                  }
                </BotCard>
              ) : (
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
