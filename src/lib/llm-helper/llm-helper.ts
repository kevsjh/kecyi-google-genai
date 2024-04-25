'use server'

import { createGoogleGenerativeAI } from "@/packages/google/google-provider"
import { getGoogleAccessToken } from "../auth/access-token"
import { experimental_generateText } from "ai"
import queryVectorSearch from "../vector-search/query-vector-search"


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