import * as React from 'react'

// import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { IconShare } from '@/components/icon'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from './chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'

import { nanoid } from 'nanoid'
import { UserMessage } from '../stocks/message'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'
import { AIProvider } from '@/types'

export interface ChatPanelProps {
  id: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  uiStateType: any;
  suggestionMessages?: {
    heading: string;
    subheading: string;
    message: string;
  }[]

}

export function CopilotChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  uiStateType,
  suggestionMessages


}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof uiStateType>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)



  return (
    <div className="absolute inset-x-0 bg-white/90 bottom-0 w-full duration-300 ease-in-out dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0">
          {messages.length === 0 &&
            suggestionMessages?.map((example, index) => (
              <div
                key={example.heading}
                className={cn(
                  'cursor-pointer bg-zinc-50 text-zinc-950 rounded-2xl p-4 sm:p-6 hover:bg-zinc-100 transition-colors',
                  index > 1 && 'hidden md:block'
                )}
                onClick={async () => {
                  // @ts-ignore
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  try {

                    const responseMessage = await submitUserMessage(
                      example.message
                    )

                    // @ts-ignore
                    setMessages(currentMessages => [
                      ...currentMessages,
                      responseMessage
                    ])
                  } catch {
                    toast(
                      <div className="text-red-600">
                        Something went wrong. Please try again later.

                      </div>
                    )
                  }
                }}
              >
                <div className="font-medium">{example.heading}</div>
                <div className="text-sm text-zinc-800">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-fit items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={(i) => { return }}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:pb-4">
          <PromptForm input={input} setInput={setInput}

          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
