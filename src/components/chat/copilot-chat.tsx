'use client'

import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'

import { useLocalStorage } from '@/hooks/use-local-storage'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { Message, StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'

import { cn, createUrl, } from '@/lib/utils'
import { useAIState, useStreamableValue, useUIState } from 'ai/rsc'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStreamableState } from '@/hooks/use-streamable-state'
import { AgentChatTypeEnum } from '@/constant/enum'
import { CopilotChatPanel } from './copilot-chat-panel'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string

  chatAgent?: AgentChatTypeEnum
  uiStateType: any
  suggestionMessages?: {
    heading: string
    subheading: string
    message: string
  }[]
  emptyScreen?: React.ReactNode,
  chatListClassname?: string
  allowNavigate?: boolean
}


export function CopilotChat({ id, className, chatAgent, uiStateType, suggestionMessages,
  allowNavigate = true,
  emptyScreen, chatListClassname }: ChatProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [input, setInput] = useState('')
  const [messages,] = useUIState()

  const [aiState] = useAIState()
  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  const searchParams = useSearchParams()

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    // get last Message
    const lastMessage = aiState.messages[messagesLength - 1]

    if (lastMessage?.display?.name === 'reportFraud') {
      router.refresh()
      return
    } else if (lastMessage?.display?.name === 'showSellStock') {
      router.refresh()
      return
    }
    else if (lastMessage?.display?.name === 'showPurchaseInsurance') {
      router.refresh()
      return
    }
    else if (messagesLength === 2 && chatAgent !== undefined) {

      const chatId = aiState.chatId

      if (!pathname.includes(id) && allowNavigate) {
        // sleeps for 1 second
        window.history.replaceState({}, '', `/client/agent/${chatAgent}/chat/${chatId}`)
        return
      }

    }
  }, [aiState.messages, allowNavigate])



  useEffect(() => {

    setNewChatId(id)
  }, [id])



  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group  w-full overflow-auto pl-0 "
      ref={scrollRef}
    >
      <div className={cn('w-full  pb-[200px] pt-4', className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} chatListClassname={chatListClassname} />
        ) : (
          emptyScreen ?? <></>
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <CopilotChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        uiStateType={uiStateType}
        suggestionMessages={suggestionMessages}
      />
    </div>
  )
}
