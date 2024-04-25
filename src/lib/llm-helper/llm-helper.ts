'use server'

import { createGoogleGenerativeAI } from "@/packages/google/google-provider"
import { getGoogleAccessToken } from "../auth/access-token"
import { experimental_generateText, experimental_streamText, streamToResponse } from "ai"
import queryVectorSearch from "../vector-search/query-vector-search"

import { removeDuplicateMessages } from "../utils"


export async function LLMVectorSearchHelper({ query, uid, summarizeContext = true, minScore }: { uid: string, query: string, summarizeContext?: boolean, minScore?: number }) {

    const retrievedContext = await queryVectorSearch({
        query: query,
        uid: uid,
        allowDefaultQuery: true,
        minScore
    })
    try {
        const accessToken = await getGoogleAccessToken()
        if (!accessToken) {

            throw new Error('Failed to get access token')
        }
        const googleVertexAI = createGoogleGenerativeAI({
            baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
            apiKey: '',
            headers: ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            })
        })
        let rephraseContext = retrievedContext.retrievedContext
        if (summarizeContext) {
            const { text, usage, finishReason } = await experimental_generateText({
                model: googleVertexAI.chat('models/gemini-1.0-pro'),
                prompt: `Retrieved Contexts: 
                "${retrievedContext.retrievedContext}"
                -----------------------------------------
                Above is the retrieved context from a vector store. Please remove noise and filter out key content that could helps on the original question ${query}
                The summary should be detailed, clear and concise. Do not make up any information and assumptions.
                Extracted Key Content (Be Detailed):
                `,
            });
            rephraseContext = text
        }
        return rephraseContext
    } catch (err) {
        console.error('Error in LLMVectorSearchHelper', err)
        return retrievedContext.retrievedContext
    }
}


export default async function LLMEntryHelper({ query, chatHistory, uid, rephraseQuestion, summarizeContext = true, minScore }:
    {
        uid: string, query: string, chatHistory: string, rephraseQuestion: boolean, summarizeContext?: boolean,
        minScore?: number
    }) {
    try {

        const accessToken = await getGoogleAccessToken()

        if (!accessToken) {

            throw new Error('Failed to get access token')
        }

        const googleVertexAI = createGoogleGenerativeAI({
            baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
            apiKey: '',
            headers: ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            })
        })



        let revisedQuestion = query

        // rephrase question if rephraseQuestion is true by invoker
        if (rephraseQuestion) {
            const { text, usage, finishReason } = await experimental_generateText({
                model: googleVertexAI.chat('models/gemini-1.0-pro'),
                prompt: `Based on the following conversation if any and a follow up question, rephrase the follow up question as a standalone question.
                Ensure the standalone question should be detailed, clear and concise.
                ----------------
                CHAT HISTORY: ${chatHistory}
                ----------------
                FOLLOWUP QUESTION: ${query}
                ----------------
                STANDALONE QUESTION
                `,
            });


            revisedQuestion = text
        }

        const revisedContext = await LLMVectorSearchHelper({
            query: revisedQuestion,
            uid: uid,
            summarizeContext,
            minScore

        })
        return {
            revisedQuestion,
            revisedContext
        }


    } catch (err) {
        console.error('Error in LLMEntryHelper', err)
        return {
            revisedQuestion: query,
            revisedContext: ''
        }
    }
}

export async function llmSummarizeChatHistory({ chatHistory }: { chatHistory: string }) {


    try {
        const accessToken = await getGoogleAccessToken()
        if (!accessToken) {
            throw new Error('Failed to get access token')
        }

        const googleVertexAI = createGoogleGenerativeAI({
            baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
            apiKey: '',
            headers: ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            })
        })

        const { text, usage, finishReason } = await experimental_generateText({
            model: googleVertexAI.chat('models/gemini-1.0-pro'),
            prompt: `Summarize the following conversation between an AI customer service assistant and a customer for the live-agent to pick up on. 
            The summary should be detailed, clear and concise.
            Use only the information from the conversation and do not make up information. Consider the conversation and check if there's any pending actions needed by the live agent.
            Keep the response professional, detailed and clear.
            -----------------
            ${chatHistory}
            `,
        });

        return text



    } catch (err) {
        console.error('Error in llmSummarizeChatHistory', err)
        return ''

    }






}


/**
 * Used by customer service as a tool for retrieveContext (LLM) to help with the conversation + vector search
 * improves the question to a standalone question and sumarize the retrieve context for better contextual understanding
 */
export async function llmStreamEntryHelper({ messageStreamCallbackFn, assistantChatId, aiState, query, uid, rephraseQuestion, accessToken, summarizeContext = true, minScore, history, }:
    {
        uid: string, query: string, rephraseQuestion?: boolean, summarizeContext?: boolean,
        minScore?: number, history: any[], accessToken: string,
        assistantChatId: string
        aiState: any,
        messageStreamCallbackFn: (content: string) => void
    }) {

    'use server'

    const retrievedContext = await LLMVectorSearchHelper({
        query: query,
        uid: uid,
        summarizeContext,
        minScore

    })

    const googleVertexAI = createGoogleGenerativeAI({
        baseURL: process.env.GOOGLE_CLOUD_GEMINI_BASE_URL,
        apiKey: '',
        headers: ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        })
    })
    try {

        const result = await experimental_streamText({
            model: googleVertexAI.chat('models/gemini-1.5-pro-preview-0409'),
            temperature: 0.2,
            system: ` You are a customer service agent for the company KECYI bank and financial service. Your role is to provide support and information with support from the company retrieve context and data from the user.
            ----------------
            RETRIEVED CONTEXT: ${retrievedContext}
            ----------------
            Think step by step, do not make up any information and assumptions. Respond with a professional answer. If a response to the question cannot be determined from the context, history or the tools available, respond that you do not have enough information to respond to the question.
        `,
            messages: [...history]
        });

        let textContent = ''

        for await (const delta of result.fullStream) {

            const { type } = delta

            if (type === 'text-delta') {
                const { textDelta } = delta

                textContent += textDelta
                // @ts-nocheck
                messageStreamCallbackFn(textContent)
                // messageStream.update(<BotMessage content={ textContent } />)

                aiState.update({
                    ...aiState.get(),
                    final: false,
                    messages: [
                        ...aiState.get().messages,
                        {
                            id: assistantChatId,
                            role: 'assistant',
                            content: textContent,
                            display: {
                                name: 'retrieveContext',
                                props: {
                                    args: {
                                        content: textContent
                                    }
                                }
                            }
                        }
                    ]
                })
            }

        }
        const { chatId, messages, interactions, agentChatType } = aiState.get()
        const uniqueMessages = removeDuplicateMessages(messages)

        aiState.done({
            ...aiState.get(),
            interactions: [],

            messages: uniqueMessages
        })


    } catch (err) {

    }

}