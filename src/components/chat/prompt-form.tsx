'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useAIState, useActions, useUIState } from 'ai/rsc'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { UserMessage } from '../stocks/message'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useEnterSubmit } from '@/hooks/use-enter-submit'

import AudioRecorder from '../audio-recorder'
import { ArrowElbowDownLeft } from '@phosphor-icons/react'


export function PromptForm({
  input,
  setInput,

}: {

  input: string
  setInput: (value: string) => void
}) {

  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage, describeImage } = useActions()
  const [_, setMessages] = useUIState<any>()
  const [aiState] = useAIState()
  const [audioLoading, setAudioLoading] = React.useState(false)
  const pathname = usePathname()
  const [messageCompleted, setMessageCompleted] = React.useState(false)
  const router = useRouter()


  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])



  const fileRef = React.useRef<HTMLInputElement>(null)


  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages((currentMessages: any) => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        try {
          setMessageCompleted(false)
          // Submit and get response message
          const responseMessage = await submitUserMessage(value)

          setMessages((currentMessages: any) => [...currentMessages, responseMessage])

          setMessageCompleted(true)
          // if new messages, we navigate


        } catch {
          toast(
            <div className="text-red-600">
              Something went wrong. Please try again later{' '}
            </div>
          )
        }
      }}
    >
      <input
        type="file"
        className="hidden"
        id="file"
        ref={fileRef}
        onChange={async event => {
          if (!event.target.files) {
            toast.error('No file selected')
            return
          }

          const file = event.target.files[0]

          if (file.type.startsWith('video/')) {
            const responseMessage = await describeImage('')
            setMessages((currentMessages: any) => [
              ...currentMessages,
              responseMessage
            ])
          } else {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = async () => {
              const base64String = reader.result
              const responseMessage = await describeImage(base64String)
              setMessages((currentMessages: any) => [
                ...currentMessages,
                responseMessage
              ])
            }
          }
        }}
      />
      <div className="relative flex items-center  max-h-60 w-full grow flex-col  overflow-hidden bg-zinc-100 px-12 sm:rounded-2xl sm:px-12">
        <AudioRecorder
          setLoading={setAudioLoading}
          loading={audioLoading}
          setInput={setInput}
        />
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="h-full  min-h-[40px] max-h-72  text-base focus:outline-none  w-full focus:border-none  outline-none border-transparent ring-0 focus:ring-0 bg-transparent placeholder:text-zinc-900 resize-none px-4 py-4 focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-4 transform -translate-y-1/2 top-1/2 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild className=''>
              <Button
                type="submit"
                size="icon"
                disabled={input === '' || audioLoading}
                className="bg-transparent shadow-none text-zinc-950 rounded-full hover:bg-zinc-200"
              >
                <ArrowElbowDownLeft size={20} />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className='z-30'>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
