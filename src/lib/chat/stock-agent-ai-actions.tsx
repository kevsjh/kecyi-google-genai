

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

// You are a stock trading assistant bot, you can provide user with latest trending stocks, provide market asessment and you can help user buy stocks, step by step.
//       You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.
//       The date today is ${format(new Date(), 'd LLLL, yyyy')}. 

//       If the user requests to buy or purchase stocks, check if you have sufficient context regarding stock symbol, stock price and number of shares from previous messages, if you have enough context for stock purchase, call \`show_stock_purchase\` to show the stock purchase UI; if you do not have enough context, ask for the stock name or company name so you can eventually call \`show_stock_data\`  .
//       If the user just wants stock price or data, call \`show_stock_data\` to show the stock price and information.
//       If you want to show trending stocks, call \`trending_stocks\`.

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


import { format } from 'date-fns'
import { experimental_streamText } from 'ai'

import { number, symbol, z } from 'zod'

// import { createGoogleGenerativeAI } from '@repo/google';

import { getGoogleAccessToken } from '../auth/access-token'
import { IStockData, getUserPortfolio, googleFinanceRequest, purchaseStockAction, requestTrendingStock, sellStockAction, yahooFinancialRequest } from '../helper-agents/stock-agent-helper-request'

import { getAuthByCookie } from '../auth/action'
import { saveChat } from '../helper-actions/action'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { IStock, Stocks } from '@/components/stocks/stocks'
import { Stock } from '@/components/stocks/stock'
import { AgentChatTypeEnum } from '@/constant/enum'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import { Purchase } from '@/components/stocks/stock-purchase'
import Link from 'next/link'
import { ListStockPortfolioSkeleton } from '@/components/stocks/list-stock-portfolio-skeleton'
import { ListStockPortfolio } from '@/components/stocks/list-stock-portfolio'
import { SellStock } from '@/components/stocks/sell-stock'
import { createGoogleGenerativeAI } from '@/packages/google/google-provider'
import RouteAgentUI from '@/components/route-agent/route-agent-ui'


async function confirmPurchase(symbol: string, price: number, amount: number, numberOfShares: number) {
  'use server'

  const aiState = getMutableAIState<typeof StockAgentAI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2 text-white">
        Purchasing {amount} ${symbol}...
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
            Purchasing {amount} ${symbol}... working on it...
          </p>
        </div>
      )
      const { status, error } = await purchaseStockAction({ symbol, price, uid: session?.user.id, numberOfShares })



      if (error || !status) {
        purchasing.done(
          <div>
            <p className="mb-2 text-primary">
              Failed to purchase {symbol}. {error ?? 'Something went wrong. Please try again later'}
            </p>
          </div>
        )
      } else {

        purchasing.done(
          <div>
            <p className="mb-2 text-primary">
              You have successfully purchased {amount} ${symbol}. Total cost:{' '}
              {formatNumber(amount * price)}
            </p>
            <div className='flex gap-4 items-center'>
              <Link
                className='text-sm px-2 py-0.5 font-medium text-primary  border-2 rounded-2xl'
                href='/client/portfolio'>View Portfolio</Link>
              <Link
                className='text-sm px-2 py-0.5 text-primary font-medium border-2 rounded-2xl'
                href='/client/transactions'>View Transactions</Link>
            </div>
          </div>
        )
        systemMessage.done(
          <SystemMessage>
            You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
            {formatNumber(amount * price)}.

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
            name: 'showStockPurchase',
            content: JSON.stringify({
              symbol,
              price,
              defaultAmount: amount,
              status: status ? 'completed' : 'error',
              numberOfShares: amount,
              purchaseStatus: status,
              purchaseError: error,
            }),
            display: {
              name: 'showStockPurchase',
              props: {
                args: {
                  symbol,
                  price,
                  defaultAmount: amount,
                  status: status ? 'completed' : 'error',
                  numberOfShares: amount,
                  purchaseStatus: status,
                  purchaseError: error,
                }
              }
            }
          }
        ]
      })

      const { chatId, messages, interactions, agentChatType } = aiState.get()
      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/client/agent/${agentChatType?.toLowerCase()}/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        // @ts-ignore
        messages: messages,
        path,
        agentChatType
      }

      await saveChat(chat)
    } else {
      await sleep(1000)
      purchasing.update(
        <div className="inline-flex items-start gap-1 md:items-center">
          {spinner}
          <p className="mb-2 text-primary">
            Purchasing {amount} ${symbol}... working on it...
          </p>
        </div>
      )
      await sleep(1000)
      purchasing.done(
        <div>
          <p className="mb-2 text-primary">
            You have successfully purchased {amount} ${symbol}. Total cost:{' '}
            {formatNumber(amount * price)}
          </p>
        </div>
      )

      systemMessage.done(
        <SystemMessage>
          You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
          {formatNumber(amount * price)}.
        </SystemMessage>
      )

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages.slice(0, -1),
          {
            id: nanoid(),
            role: 'assistant',
            name: 'showStockPurchase',
            content: JSON.stringify({
              symbol,
              price,
              defaultAmount: amount,
              status: 'completed',
              numberOfShares: amount
            }),
            display: {
              name: 'showStockPurchase',
              props: {
                args: {
                  symbol,
                  price,
                  defaultAmount: amount,
                  status: 'completed',
                  numberOfShares: amount
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



async function confirmStockSell(symbol: string, price: number, amount: number, numberOfShares: number, sharesToSell: number) {
  'use server'

  const aiState = getMutableAIState<typeof StockAgentAI>()

  const selling = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2 text-white">
        Selling {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {

    const session = await getAuthByCookie()

    if (session && session.user) {
      const { status, error } = await sellStockAction({ symbol, uid: session?.user.id, sharesToSell })

      selling.update(
        <div className="inline-flex items-start gap-1 md:items-center">
          {spinner}
          <p className="mb-2 text-primary">
            Selling {sharesToSell} ${symbol}... working on it...
          </p>
        </div>
      )

      if (error || !status) {
        selling.done(
          <div>
            <p className="mb-2 text-primary">
              Failed to sell {symbol}. {error ?? 'Something went wrong. Please try again later'}
            </p>
          </div>
        )
      } else {

        selling.done(
          <div>
            <p className="mb-2 text-primary">
              You have successfully sold {sharesToSell} ${symbol}. Total amount sold:{' '}
              {formatNumber(amount * price)} USD
            </p>
            <div className='flex gap-4 items-center'>
              <Link
                className='text-sm px-2 py-0.5 text-primary font-medium border-2 rounded-2xl'
                href='/client/portfolio'>View Portfolio</Link>
              <Link
                className='text-sm px-2 py-0.5 text-primary font-medium border-2 rounded-2xl'
                href='/client/transactions'>View Transactions</Link>
            </div>
          </div>
        )
        systemMessage.done(
          <SystemMessage>
            You have successfully sold {sharesToSell} shares of {symbol} at ${price}. Total price ={' '}
            {formatNumber(amount * price)}.

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
            name: 'showSellStock',
            content: JSON.stringify({
              symbol,
              price,
              defaultAmount: amount,
              status: status ? 'completed' : 'error',
              numberOfShares: amount,
              error: error,
              sharesToSell
            }),
            display: {
              name: 'showSellStock',
              props: {
                args: {
                  symbol,
                  price,
                  defaultAmount: amount,
                  status: status ? 'completed' : 'error',
                  numberOfShares: amount,
                  error: error,
                  sharesToSell
                }
              }
            }
          }
        ]
      })

      const { chatId, messages, interactions, agentChatType } = aiState.get()
      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/client/agent/${agentChatType?.toLowerCase()}/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        // @ts-ignore
        messages: messages,
        path,
        agentChatType
      }

      await saveChat(chat)
    } else {
      selling.done(
        <div>
          <p className="mb-2 text-primary">
            You are not logged in
          </p>
        </div>
      )

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages.slice(0, -1),
          {
            id: nanoid(),
            role: 'assistant',
            name: 'showSellStock',
            content: JSON.stringify({
              symbol,
              price,
              defaultAmount: amount,
              status: 'error',
              numberOfShares: numberOfShares,
              sharesToSell
            }),
            display: {
              name: 'showSellStock',
              props: {
                args: {
                  symbol,
                  price,
                  defaultAmount: amount,
                  status: 'error',
                  numberOfShares: numberOfShares,
                  sharesToSell,
                  error: 'You were not logged in'
                }
              }
            }
          }
        ]
      })


    }



  })

  return {
    sellingUI: selling.value,
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
          })
        })




        const result = await experimental_streamText({
          model: googleVertexAI.chat('models/gemini-1.5-pro-preview-0409',
            // model: googleCloudVertex.generativeAI('models/gemini-1.5-pro-preview-0409',

          ),
          temperature: 0.1,
          tools: {
            trendingStocks: {
              description: 'Useful to get trending stocks and financial stock information about the trending stock.',
              parameters: z.object({
                window: z.string().describe('Window for query, where 1D is 1 day, 5D is past 5 days, 1M is past 1 month, 6M, is past 6 months, YTD is past 1 year, 5Y is past 5 years and MAX is maximum. Default is "1D'),
              }),
              execute: async ({ window }: { window: string }) => {
                const data = await requestTrendingStock({
                  window
                }).catch((e) => {
                  console.error(`Error in requestTrendingStock: ${e}`)
                  return undefined
                })
                const stockDataList: IStock[] = data?.map((stock: IStockData, i) => {
                  const stockInfo: IStock = {
                    symbol: stock?.symbol,
                    price: stock?.price,
                    delta: stock?.delta,
                    moveAmount: stock?.moveAmount,
                    ticker: stock.ticker
                  }
                  return stockInfo
                }) ?? []
                return stockDataList
              },
            },
            showStockData: {
              description: 'Get the current stock price of a given stock or public company. Use this to show the stock price and data to the user.',
              parameters: z.object({
                query: z.string().describe('Stock to be queried. Query could either be the company name, or the stock symbol in the form of AAPL or GOOG.'),
              }),
              execute: async ({ query, window, }: { query: string, window: string }) => {
                // get the correct ticker from the query (either by company name or symbol)
                const symbol = await yahooFinancialRequest({
                  query: query
                })
                if (!symbol) {
                  return undefined
                }
                const res = await googleFinanceRequest({
                  query: symbol,
                  window
                })
                return res
              },
            },
            routeAgent: {
              description: 'Tool to route user to a different agent.',
              parameters: z.object({
                path: z
                  .string()
                  .describe(
                    'The path to the agent to route the user to. e.g. /client/agent/stock/chat'
                  ),
                name: z
                  .string()
                  .describe(
                    'The name of the agent to route the user to. e.g. Stock Agent.'
                  ),

              }),
            },
            showStockPurchase: {
              description: 'Show stock price and the UI to purchase a stock. Use this if the user wants to purchase or buy stock.',
              parameters: z.object({
                symbol: z
                  .string()
                  .describe(
                    'The name or symbol of the stock or currency. e.g. AAPL/GOOG.'
                  ),
                price: z.number().describe('The price of the stock.'),
                numberOfShares: z
                  .number()
                  .optional()
                  .describe(
                    'The number of shares for a stock to purchase. Default to 10 shares if not available or specified. The range is between 1 to 100. If the user specifies a number smaller or larger than the range, set it to the closest range value.'
                  ),
              }),
            },
            showSellStock: {
              description: 'Show stock price and the UI to sell a stock. Use this if the user wants to sell or short stock.',
              parameters: z.object({
                symbol: z
                  .string()
                  .describe(
                    'The name or symbol of the stock or currency. e.g. AAPL/GOOG.'
                  ),
                price: z.number().describe('The price of the stock.'),
                numberOfShares: z
                  .number()
                  .describe(
                    'The total number of shares the user currnetly owns.'
                  ),
                sharesToSell: z
                  .number()
                  .optional()
                  .describe(
                    'The number of shares for a stock to sell. Default to 1 shares if not available or specified.'
                  ),
              }),
            },
            showUserPortfolio: {
              description: 'Show the user portfolio. Use this to show the user portfolio and the stocks they own.',
              parameters: z.object({
              }),
              execute: async () => {
                const session = await getAuthByCookie()
                if (session && session.user) {
                  const response = await getUserPortfolio({ uid: session.user.id })
                  return response
                } else {
                  return undefined
                }

              }
            },
          },
          system: `\
          You are a stock trading assistant AI. Your role is to provide information and guidance to help users make informed decisions about buying and selling stocks.
          
          You have access to real-time stock market data and can provide the latest prices, trends, and analysis for individual stocks or the overall market.
          You also have access to help user to purchase and sell stocks. You may also route the user to the relevant agent based on their tasks.

          When the user wants to purchase or buy stocks, you should:
          
            1. Verify that you have the necessary information from previous messages, including the stock symbol, current price, and the number of shares the user wants to buy.
            2. If you have all the required details, call the \`showStockPurchase\` function to display the stock purchase interface, allowing the user to review and confirm their order.
            3. If you're missing any critical information, politely ask the user to provide the stock name or company name so that you can call the \`showStockData\` function and retrieve the necessary details.
          
          If the user simply wants to view stock data or prices, call the \`showStockData\` function, which will display the current price and relevant information for the specified stock.
         
          To showcase trending or popular stocks, call the \`trendingStocks\` function, which will provide a list of stocks that are currently experiencing significant trading volume or price movements.
         
          When the user view their stock portfolio, or wants to sell or short stocks, you should:
          
            1. Verify that you have the necessary information from previous messages, including the user entire stock portfolio, stock symbol, and the number of shares the user wants to sell. If you do not have the necessary information, call the \`showUserPortfolio\` function and retrieve the necessary details.
            2. If user want to sell a stock, check if the user own that stock in their portfolio, if they do not own that particular stock, inform them about it. 
            3. If the stock is available and you have the necessary details including symbol, stock price, and total shares owned from previous context or messages, call the \`showSellStock\` function to display the stock selling and shorting interface, allowing the user to review and confirm their action.
          
          If the user query or request for certain tasks that needs to be routed to a different agent, you should
            1. If user needs to talk to customer service agent such as asking about insurance, promotion etc..., call the \`routeAgent\` function to route with the path '/client/agent/customerservice/chat' and name 'Customer Service Agent'.
            2. Check if user needs to view, manage their bank account transaction, report fraud transaction and any related transactions, call the \`routeAgent\` function to route with the path '/client/transactions' and name 'Transactions'.
            3. Do not make up any agent, path or name, beyond the provided exact path and name.

          Throughout the conversation, feel free to provide additional context, analysis, or recommendations based on your knowledge of the stock market.

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
          if (type === 'tool-call' || type === 'tool-result') {
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

            if (toolName === 'trendingStocks') {
              uiStream.update(
                <BotCard>
                  <StocksSkeleton />
                </BotCard>
              )
            }


            else if (toolName === 'showStockData') {
              uiStream.update(
                <BotCard>
                  <StockSkeleton />
                </BotCard>
              )
            }
            else if (toolName === 'showUserPortfolio') {
              uiStream.update(
                <BotCard>
                  <ListStockPortfolioSkeleton />
                </BotCard>
              )
            }

            else if (toolName === 'routeAgent') {
              uiStream.update(
                <BotCard>

                  <RouteAgentUI
                    props={{
                      path: args.path,
                      name: args.name
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
                    name: 'routeAgent',
                    content: JSON.stringify({
                      path: args.path,
                      name: args.name,

                    }),
                    display: {
                      name: 'routeAgent',
                      props: {
                        args: {
                          ...args,

                        }
                      }
                    }
                  }
                ]
              })
            }
            else if (toolName === 'showStockPurchase') {

              uiStream.update(
                <BotCard>

                  <Purchase
                    props={{
                      // @ts-ignore
                      numberOfShares: args.numberOfShares,
                      // @ts-ignore
                      price: args.price,
                      // @ts-ignore
                      symbol: args.symbol,
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
                    name: 'showStockPurchase',
                    content: JSON.stringify({
                      symbol: args.symbol,
                      price: args.price,
                      numberOfShares: args.numberOfShares,
                      status: 'requires_action'
                    }),
                    display: {
                      name: 'showStockPurchase',
                      props: {
                        args: {
                          ...args,
                          status: 'requires_action'
                        }
                      }
                    }
                  }
                ]
              })
            }

            else if (toolName === 'showSellStock') {

              uiStream.update(
                <BotCard>

                  <SellStock
                    props={{
                      // @ts-ignore
                      sharesToSell: args.sharesToSell,
                      // @ts-ignore
                      price: args.price,
                      // @ts-ignore
                      symbol: args.symbol,
                      numberOfShares: args.numberOfShares,
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
                    name: 'showSellStock',
                    content: JSON.stringify({
                      symbol: args.symbol,
                      price: args.price,
                      sharesToSell: args.sharesToSell,
                      numberOfShares: args.numberOfShares,
                      status: 'requires_action'
                    }),
                    display: {
                      name: 'showSellStock',
                      props: {
                        args: {
                          ...args,
                          status: 'requires_action'
                        }
                      }
                    }
                  }
                ]
              })

            }


          }
          // tool invocation is completed
          else if (type === 'tool-result') {

            const { toolName, args, result } = delta

            if (toolName === 'showStockData') {
              uiStream.update(
                <BotCard>
                  {
                    result ? <Stock
                      props={result}
                    /> : <div>Something went wrong. Please try again later</div>
                  }
                </BotCard>
              )
              aiState.done({
                ...aiState.get(),
                interactions: [],
                final: true,

                messages: [
                  ...aiState.get().messages,
                  {
                    id: assistantChatId,
                    role: 'assistant',
                    content: `The stock information for ${args.query}. ${JSON.stringify({
                      symbol:
                        result?.symbol,
                      price:
                        result?.price,
                      delta: result?.delta,
                      financialData: result?.financialData
                    })}`,
                    display: {
                      name: 'showStockData',
                      props: {
                        result
                      }
                    }
                  }
                ]
              })
            }
            else if (toolName === 'showUserPortfolio') {
              uiStream.update(
                <BotCard>
                  {
                    result?.portfolios ? <ListStockPortfolio
                      props={result}
                    /> : <div>Something went wrong. Please try again later</div>
                  }
                </BotCard>
              )
              aiState.done({
                ...aiState.get(),
                interactions: [],
                final: true,

                messages: [
                  ...aiState.get().messages,
                  {
                    id: assistantChatId,
                    role: 'assistant',
                    content: `User existing portfolios \n 
                      ${result?.portfolioTableString}
                    `,
                    display: {
                      name: 'showUserPortfolio',
                      props: {
                        result
                      }
                    }
                  }
                ]
              })
            }
            else if (toolName === 'trendingStocks') {
              uiStream.update(

                <BotCard>
                  <Stocks props={result} />
                </BotCard>
              )
              aiState.done({
                ...aiState.get(),
                interactions: [],
                final: true,
                messages: [
                  ...aiState.get().messages,
                  {
                    id: assistantChatId,
                    role: 'assistant',
                    content: `Trending stocks are ${JSON.stringify({
                      stocks:
                        result?.map((stock: IStock) => {
                          return {
                            symbol: stock?.symbol,
                            price: stock?.price,
                            delta: stock?.delta,
                            financialData: stock?.financialData
                          }
                        }),
                    })}`,
                    display: {
                      name: 'trendingStocks',
                      props: {
                        result
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
        const session = await getAuthByCookie()
        if (session && session.user) {
          const createdAt = new Date()
          const userId = session.user.id as string
          const path = `/client/agent/${agentChatType?.toLowerCase()}/chat/${chatId}`
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
            await saveChat(chat)
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
  agentChatType: AgentChatTypeEnum


}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const StockAgentAI: AIProvider<AIState, UIState, {}> = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,

    confirmPurchase,
    confirmStockSell
    // describeImage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [], agentChatType: AgentChatTypeEnum.STOCKAGENT },
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
            message.display?.name === 'showUserPortfolio' ? (
              <BotCard>
                {
                  // @ts-ignore
                  message.display?.props?.result ? <ListStockPortfolio
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
              ) :
                // @ts-ignore
                message.display?.name === 'routeAgent' ? (

                  // < SpinnerMessage />
                  <BotCard>
                    {/* @ts-ignore */}
                    <RouteAgentUI props={message.display?.props?.args} />
                  </BotCard>
                  // @ts-ignore
                )
                  :
                  // @ts-ignore
                  message.display?.name === 'showSellStock' ? (

                    // < SpinnerMessage />
                    <BotCard>
                      {/* @ts-ignore */}
                      <SellStock props={message.display?.props?.args} />
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
