'use server'

import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { cookies } from "next/headers"
import { llmSummarizeChatHistory } from "../llm-helper/llm-helper"
import { ILiveAgentDoc, ILiveAgentMessage } from "@/types"


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




export async function sendLiveAgentMessage({ id, message, role }: { id: string, message: string, role: 'client' | 'admin' }) {
    const sessionObj = cookies().get('session')
    const session = sessionObj?.value
    if (session === undefined || session?.length === 0) {
        return {
            status: false
        }
    }

    try {
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const liveAgentMessageRef = firebaseAdminFirestore.collection('liveagent').doc(id).collection('messages').doc()
        const liveAgentMessageId = liveAgentMessageRef.id


        await liveAgentMessageRef.set({
            createdAt: new Date(),
            id: liveAgentMessageId,
            message: message,
            role: role,
            uid,
        })

        return {
            status: true
        }


    } catch (err) {
        console.error('Error sending message', err)
        return {
            status: false
        }
    }



}





export async function updateLiveAgentRequest({ id, status }: { id: string, status: 'active' | 'ended' }) {
    try {
        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return {
                status: false
            }
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const liveAgentRequesDocRef = firebaseAdminFirestore.collection('liveagent').doc(id)


        await firebaseAdminFirestore.runTransaction(async (transaction) => {
            transaction.update(liveAgentRequesDocRef, {
                status: status,
                createdAt: new Date()
            })
        })


        return {
            status: true
        }


    } catch (err) {
        console.error('Error sending live agent request', err)
        return {
            status: false
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
                createdAt: data.createdAt?.toDate(),
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




export async function getLiveAgentChatsById(id: string) {
    let currentMessages: ILiveAgentMessage[] = []

    try {



        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return {
                liveAgentDoc: undefined,
                currentMessages
            }
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const liveAgentDocRef = firebaseAdminFirestore.collection('liveagent').doc(id)

        const liveAgentMessageColRef = liveAgentDocRef.collection('messages')


        const liveAgentDoc = await liveAgentDocRef.get()

        const data = liveAgentDoc.data()
        if (data === undefined) {
            return {
                liveAgentDoc: undefined,
                currentMessages
            }
        }

        if (data?.uid !== uid) {
            return {
                liveAgentDoc: undefined,
                currentMessages
            }
        }


        const liveAgentDocData: ILiveAgentDoc = {
            createdAt: data.createdAt?.toDate(),
            id: data.id,
            status: data.status,
            summarizeChat: data.summarizeChat,
            uid: data.uid
        }



        if (liveAgentDocData.status === 'ended' || liveAgentDocData.status === 'active') {
            const liveMessageQ = liveAgentMessageColRef.orderBy('createdAt', 'desc')
            const qRes = await liveMessageQ.get()

            qRes.docs.forEach(doc => {
                const data = doc.data()
                const liveAgentMessage: ILiveAgentMessage = {
                    createdAt: data.createdAt?.toDate(),
                    id: data.id,
                    message: data.message,
                    role: data.role,
                }
                currentMessages.push(liveAgentMessage)
            })
        }

        return {
            liveAgentDoc: liveAgentDocData,
            currentMessages
        }

    } catch (err) {
        console.error('Error getting live agent chats', err)
        return {
            liveAgentDoc: undefined,
            currentMessages
        }
    }

}