'use client'


import AudioRecorder from "@/components/audio-recorder";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { sendLiveAgentMessage } from "@/lib/live-agent-actions/live-agent-actions";
import { ArrowElbowDownLeft } from "@phosphor-icons/react";
import React from "react";
import Textarea from 'react-textarea-autosize'
import { toast } from "sonner";

export default function AgentLiveChatPrompt({ id }: { id: string }) {
    const [audioLoading, setAudioLoading] = React.useState(false)
    const [input, setInput] = React.useState('')
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const { formRef, onKeyDown } = useEnterSubmit()

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return <form
        ref={formRef}
        onSubmit={async (e: any) => {
            e.preventDefault()
            const value = input.trim()
            setInput('')
            if (!value) return

            try {

                const { status } = await sendLiveAgentMessage({
                    id,
                    message: value,
                    role: 'admin'
                })

                if (!status) {
                    toast.error('Error sending message')
                    return
                }


            } catch (err) {
                toast.error('Error sending message')
            }
        }}
    >
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
}