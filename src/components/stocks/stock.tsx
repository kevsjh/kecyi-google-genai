'use client'

import { useState, useRef, useEffect, useId } from 'react'

import { useResizeObserver } from 'usehooks-ts'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { cn } from '@/lib/utils'
import { StockGraphData, StockNews } from '@/types'

import { StockChart } from './stock-chart'
import Link from 'next/link'
import { Sparkle } from '@phosphor-icons/react'

interface IStock {
  symbol: string
  price: number
  delta: number
  date?: string
  graph: StockGraphData[]
  news?: StockNews[]
}





export const stockSuggestions = [
  {
    title: 'Purchase Stock',
    prompt: (stockSymbol: string, price: string) => `Purchase ${stockSymbol} stock, stock price is currently at $${price}.`,
  },

  {
    title: 'Market Assessment',
    prompt: (stockSymbol: string) => `Based on the financial data for ${stockSymbol}, explain briefly the trend with supporting value in tabular format, and provide your market assesment and recommendations with reasoning.`,
  }


]


export function Stock({ props: { symbol, price, delta, date, graph, news } }: {
  props: IStock
}) {
  const [_, setMessages] = useUIState()
  const [aiState, setAIState] = useAIState()
  const id = useId()
  const { submitUserMessage } = useActions()


  return (
    <div className='flex flex-col gap-4'>
      <div className={cn("rounded-xl border bg-white shadow-lg  text-primary p-4  text-green-600")}>
        <div className={cn("float-right inline-block rounded-full bg-white/10 px-2 py-1 text-xs",
          delta >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {`${delta >= 0 ? '+' : ''}${delta.toFixed(2)}% ${delta > 0 ? '↑' : '↓'
            }`}
        </div>
        <div className="text-lg text-primary">{symbol}</div>
        <div className="text-3xl font-bold">${price}</div>
        {
          (date !== undefined) && <div className="text mt-1 text-xs text-zinc-500">
            {date}
          </div>
        }

        <StockChart
          data={graph}
          category='price'
          index='date'
        />
      </div>

      {
        (news && news?.length > 0) && <div className='flex  flex-col gap-2 justify-start items-start'>

          {/* Render only the first news item */}
          <span className='text-primary text-sm font-medium'> {
            news[0].title}</span>

          <div className='flex flex-wrap items-start gap-4 md:gap-8'>
            {
              news[0].articles.slice(0, 3).map((article, index) => {
                return <Link
                  target='_blank'
                  href={article.link}
                  key={index}
                  className='relative group   rounded-2xl border shadow-md overflow-clip w-full sm:max-w-44 '>
                  <img src={article.thumbnail}
                    alt={article.link} className=' object-cover  h-32  w-full' />
                  <span className='p-1  overflow-hidden break-words text-xs line-clamp-2'>{article.snippet}</span>
                  <div className='group-hover:flex text-white absolute  left-0 top-0   hidden   p-1 break-words text-sm line-clamp-1'>{article.source}</div>
                </Link>
              })
            }
          </div>
        </div>
      }

      <div className="flex flex-col sm:flex-row items-start gap-2">

        {
          stockSuggestions.map((suggestion, index) => {
            return <button
              key={index}
              className="flex items-center shadow-md gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
              onClick={async () => {
                const response = await submitUserMessage(suggestion.prompt(symbol, price?.toString()), [])
                setMessages((currentMessages: any[]) => [
                  ...currentMessages,
                  response
                ])
              }}
            >
              <Sparkle size={20} />
              {suggestion.title}
            </button>


          })
        }
      </div>


    </div>
  )
}
