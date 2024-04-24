import { UIState } from '@/lib/chat/stock-agent-ai-actions'
import { cn } from '@/lib/utils'
import { Session } from '@/types'



export interface ChatList {
  messages: UIState
  chatListClassname?: string

}

export function ChatList({ messages, chatListClassname }: ChatList) {
  return messages.length ? (
    <div className={cn("relative mx-auto max-w-2xl w-full grid auto-rows-max gap-8 px-4", chatListClassname)}>


      {messages.map(message => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}

        </div>
      ))}
    </div>
  ) : null
}
