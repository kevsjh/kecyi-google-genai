'use client'

import { useActions, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/stock-agent-ai-actions'

export interface IStock {
  symbol: string
  price: number
  delta?: number
  moveAmount?: number
  ticker: string,
  financialData?: string
}

export function Stocks({ props: stocks }: { props: IStock[] }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <div>
      <div className="mb-4 flex  flex-col gap-2  pb-4 text-sm sm:flex-row">
        {stocks?.map(stock => (
          <button
            key={stock.ticker}
            className="flex cursor-pointer text-primary  border-primary shadow-md flex-row gap-2 rounded-xl bg-white p-2 text-left hover:bg-white/80 sm:w-52"
            onClick={async () => {
              const response = await submitUserMessage(`Show stock data for ${stock.symbol}`)
              setMessages(currentMessages => [...currentMessages, response])
            }}
          >

            {
              (stock?.delta !== undefined) && <>
                <div
                  className={`text-xl ${stock?.delta >= 0 ? 'text-green-600' : 'text-red-600'
                    } flex w-11 flex-row justify-center rounded-lg bg-primary/10 p-2`}
                >

                  {(stock?.delta >= 0 || stock?.delta === 0) ? '↑' : '↓'}
                </div>

              </>
            }
            <div className="flex flex-col">
              <div className="bold uppercase text-primary">{stock.symbol}</div>
              <div className="text-base text-primary">
                ${stock.price.toFixed(2)}
              </div>
            </div>
            <div className="ml-auto flex flex-col">
              {
                (stock.delta !== undefined) && <div
                  className={`${stock.delta >= 0 ? 'text-green-600' : 'text-red-600'
                    } bold text-right uppercase`}
                >
                  {` ${(stock.delta ?? 0).toFixed(2)}%`}
                </div>
              }
              {
                (stock.moveAmount !== undefined) && <div
                  className={`${stock.moveAmount >= 0 ? 'text-green-700' : 'text-red-700'
                    } text-right text-base`}
                >
                  {stock.moveAmount?.toFixed(2)}
                </div>
              }
            </div>
          </button>
        ))}
      </div>
      {/* <div className="p-4 text-center text-sm text-zinc-500">
        Note: Data may be simulated for illustrative purposes and
        should not be considered as financial advice.
      </div> */}
    </div>
  )
}
