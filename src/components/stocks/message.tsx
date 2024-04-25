'use client'

/* eslint-disable @next/next/no-img-element */


import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/hooks/use-streamable-text'
import { IconUser } from '../icon'
import UserAvatar from '../user-avatar'
import BotAvatar from '../bot-avatar'
import { Skeleton } from '../ui/skeleton'


// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className=" flex shrink-0 select-none items-center justify-center ">
        {/* <IconUser className='size-10' /> */}
        < UserAvatar />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className,
  attachments
}: {
  content: string | StreamableValue<string>
  className?: string
  attachments?: React.ReactNode
}) {
  const text = useStreamableText(content)

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className=" flex  shrink-0 select-none items-center justify-center ">
        <BotAvatar />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {text}
        </MemoizedReactMarkdown>

      </div>
      {attachments}
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          ' flex  shrink-0 select-none items-center justify-center ',
          !showAvatar && 'invisible'
        )}
      >
        <BotAvatar />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex shrink-0 select-none items-center justify-center ">
        <BotAvatar />
      </div>


      <div className="ml-4  flex flex-col items-start flex-1 space-y-2 overflow-hidden px-1">
        <div className='flex gap-6  w-full items-center max-w-full'>
          <Skeleton className="h-5 max-w-44 w-full" />
          <Skeleton className="h-5 max-w-20 w-full" />
        </div>
        <div className='flex gap-6  w-full items-center max-w-full'>

          <Skeleton className="h-5 max-w-12 w-full" />
          <Skeleton className="h-5 max-w-32 w-full" />
        </div>

      </div>
    </div>
  )
}
