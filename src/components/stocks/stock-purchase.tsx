'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'

import type { StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'
import Link from 'next/link'

interface Purchase {
  numberOfShares?: number
  symbol: string
  price: number
  status: 'requires_action' | 'completed' | 'expired' | 'error'
  purchaseError?: string
}

export function Purchase({
  props: { numberOfShares = 10, symbol, price, status = 'requires_action', purchaseError }
}: {
  props: Purchase
}) {
  const [value, setValue] = useState(numberOfShares || 100)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof StockAgentAI>()
  const [, setMessages] = useUIState<typeof StockAgentAI>()
  const { confirmPurchase } = useActions()

  // Unique identifier for this UI component.
  const id = useId()

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value)
    setValue(newValue)

    // Insert a hidden history info to the list.
    const message = {
      role: 'system' as const,
      content: `[User has changed to purchase ${newValue} shares of ${symbol}. Total cost: $${(
        newValue * price
      ).toFixed(2)}]`,

      // Identifier of this UI component, so we don't insert it many times.
      id
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every slider change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message]
      })

      return
    }

    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  return (
    <div className="rounded-xl border bg-white shadow-md p-4 text-green-400">

      <div className="text-lg text-primary">{symbol}</div>
      <div className="text-3xl font-bold">${price}</div>
      {purchasingUI ? (
        <div className="mt-4 text-zinc-200">{purchasingUI}</div>
      ) : status === 'requires_action' ? (
        <>
          <div className="relative mt-6 pb-6">
            <p>Shares to purchase</p>
            <input
              id="labels-range-input"
              type="range"
              value={value}
              onChange={onSliderChange}
              min="1"
              max="100"
              className="h-1 w-full cursor-pointer appearance-none rounded-xl bg-primary/20 accent-green-500 dark:bg-zinc-700"
            />
            <span className="absolute bottom-1 start-0 text-xs text-zinc-400">
              1
            </span>

            {/* <span className="absolute bottom-1 start-10/100 -translate-x-1/2 text-xs text-zinc-400 rtl:translate-x-1/2">
              10
            </span> */}
            <span className="absolute bottom-1 start-10/10 -translate-x-1/2 text-xs text-zinc-400 rtl:translate-x-1/2">
              100
            </span>
          </div>

          <div className="mt-6">
            <p>Total cost</p>
            <div className="flex flex-wrap items-center text-xl font-bold sm:items-end sm:gap-2 sm:text-3xl">
              <div className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                {value}
                <span className="mb-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                  shares
                </span>
              </div>
              <div className="basis-1/3 text-center sm:basis-auto">×</div>
              <span className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                ${price}
                <span className="mb-1 ml-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                  per share
                </span>
              </span>
              <div className="mt-2 basis-full border-t border-t-zinc-700 pt-2 text-center sm:mt-0 sm:basis-auto sm:border-0 sm:pt-0 sm:text-left">
                = <span>{formatNumber(value * price)}</span>
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-green-400 px-4 py-2 font-bold text-white hover:bg-green-500"
            onClick={async () => {
              const response = await confirmPurchase(symbol, price, value, numberOfShares)
              setPurchasingUI(response.purchasingUI)

              // Insert a new system message to the UI.
              setMessages((currentMessages: any) => [
                ...currentMessages,
                response.newMessage
              ])
            }}
          >
            Purchase
          </button>
        </>
      ) : status === 'completed' ? (
        <p className="mb-2 text-primary">
          You have successfully purchased {value} ${symbol}. Total cost:{' '}
          {formatNumber(value * price)}
          <div className='flex gap-4 items-center'>
            <Link
              className='text-sm px-2 py-0.5 font-medium border-2 rounded-2xl'
              href='/client/portfolio'>View Portfolio</Link>
            <Link
              className='text-sm px-2 py-0.5 font-medium border-2 rounded-2xl'
              href='/client/transactions'>View Transactions</Link>
          </div>
        </p>
      )
        : status === 'error' ? (
          <p className="mb-2 text-primary">
            Failed to purchase {symbol}. {purchaseError ?? 'Something went wrong. Please try again later'}
          </p>
        ) : status === 'expired' ? (
          <p className="mb-2 text-primary">Your checkout session has expired!</p>
        ) : null}
    </div>
  )
}
