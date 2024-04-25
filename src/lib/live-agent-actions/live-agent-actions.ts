'use server'

import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { cookies } from "next/headers"
import { llmSummarizeChatHistory } from "../llm-helper/llm-helper"
import { ILiveAgentDoc } from "@/types"


initFirebaseAdminApp()











export async function sendLiveAgentRequest({ chatHistory }: { chatHistory: string }) {
    try {
        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return {
                liveAgentDocId: undefined
            }
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const liveAgentRequestRef = firebaseAdminFirestore.collection('liveagent').doc()
        const liveAgentDocId = liveAgentRequestRef.id

        const summarizeChat = await llmSummarizeChatHistory({
            chatHistory
        })

        await liveAgentRequestRef.set({
            id: liveAgentDocId,
            uid: uid,
            status: 'pending',
            summarizeChat: summarizeChat ?? '',
            createdAt: new Date()
        })
        return {
            liveAgentDocId
        }


    } catch (err) {
        console.error('Error sending live agent request', err)
        return {
            liveAgentDocId: undefined
        }

    }
}


export async function getLiveAgentChats() {
    try {
        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return []
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const liveAgentRef = firebaseAdminFirestore.collection('liveagent')

        const qRef = liveAgentRef.where('uid', '==', uid).orderBy('createdAt')

        const qRes = await qRef.get()


        // map the docs data to ILiveAgentDoc


        const liveAgentDocs = qRes.docs.map(doc => {
            const data = doc.data()

            const liveAgentDoc: ILiveAgentDoc = {
                createdAt: data.createdAt,
                id: data.id,
                status: data.status,
                summarizeChat: data.summarizeChat,
                uid: data.uid
            }

            return liveAgentDoc
        })
        return liveAgentDocs

    } catch (err) {
        console.error('Error getting live agent chats', err)
        return []
    }

}