import * as React from 'react'

import Link from 'next/link'


// import { SidebarList } from '@/components/sidebar-list'
import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import { AgentChatTypeEnum } from '@/constant/enum'
import { SidebarList } from './sidebar-list'


interface ChatHistoryProps {
  userId?: string
  agentChatType: AgentChatTypeEnum
}

export async function ChatHistory({ userId, agentChatType }: ChatHistoryProps) {
  return (
    <div className="flex  flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">Chat History</h4>
      </div>
      <div className="mb-2 px-2">
        <Link
          href={`/client/agent/${agentChatType}/chat`}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40'
          )}
        >
          <PlusCircle size={25} className="-translate-x-2 stroke-2" />
          New Chat
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-lg shrink-0 animate-pulse bg-zinc-200"
              />
            ))}
          </div>
        }
      >
        <SidebarList userId={userId}
          agentChatType={agentChatType}
        />
      </React.Suspense>
    </div>
  )
}
