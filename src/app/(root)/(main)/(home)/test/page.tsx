'use client'

import { useAuthContext } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import queryVectorSearch from "@/lib/vector-search/query-vector-search"
import { Textarea } from "@/components/ui/textarea"
import LLMEntryHelper from "@/lib/llm-helper/llm-helper"


export default function Page() {
    const { auth } = useAuthContext()
    const [query, setQuery] = useState('')
    const [chat, setChat] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [chatResponse, setChatResponse] = useState('')

    const onSubmit = useCallback(async () => {

        if (auth.currentUser === null) {
            toast.error('Please sign in to continue')
            return
        }

        if (query.length === 0) {
            toast.error('Please enter a query')
            return
        }

        setLoading(true)

        const res = await queryVectorSearch({
            query,
            uid: auth.currentUser.uid,
            allowDefaultQuery: true
        })
        setLoading(false)
        console.log(res)



    }, [query, auth.currentUser])

    const onSubmitChat = useCallback(async () => {

        if (auth.currentUser === null) {
            toast.error('Please sign in to continue')
            return
        }

        if (chat.length === 0) {
            toast.error('Please enter a query')
            return
        }

        setLoadingChat(true)

        const res = await LLMEntryHelper({
            query: chat,
            chatHistory: '',
            uid: auth.currentUser.uid,
            rephraseQuestion: true,

        })

        setChatResponse(res.revisedQuestion)
        setLoadingChat(false)
        console.log(res)


    }, [chat, auth.currentUser])



    return <div className=" h-full flex flex-col gap-8 items-center justify-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="query">Query</Label>
            <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                type="query" id="query" placeholder="query" />
            <Button

                disabled={loading}
                onClick={onSubmit}
                type="button">
                {
                    loading ? 'Loading...' : 'Submit'
                }

            </Button>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="chat">LLM Generate Text</Label>
            <Input
                value={chat}
                onChange={e => setChat(e.target.value)}
                type="chat" id="chat" placeholder="chat" />
            <Button

                disabled={loadingChat}
                onClick={onSubmitChat}
                type="button">
                {
                    loadingChat ? 'Loading...' : 'Submit'
                }

            </Button>
            <Label htmlFor="chat">LLM Response</Label>
            <Textarea
                readOnly
                value={chatResponse}
            />
        </div>
    </div>

}