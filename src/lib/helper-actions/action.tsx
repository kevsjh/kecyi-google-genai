'use server'


import { Chat, ClientChatSnippet } from '@/types'

import { getAuthByCookie } from '../auth/action'
import { firebaseAdminFirestore, initFirebaseAdminApp } from '@/config/firebase-admin-config'
import { firestoreAutoId } from '../utils'
import { redirect } from 'next/navigation'
import { AgentChatTypeEnum } from '@/constant/enum'
import { firebaseFirestore } from '@/config/firebase-config'

initFirebaseAdminApp()

export async function saveChat(chat: Chat) {
    try {


        const uid = chat.userId

        const chatId = chat.id ?? firestoreAutoId()


        if (uid === undefined || uid?.length === 0) {
            return
        }

        const chatDocRef = firebaseAdminFirestore.collection('chats').doc(chatId)

        await firebaseAdminFirestore.runTransaction(async (transaction) => {
            transaction.set(chatDocRef, {
                ...chat,
                id: chatId,
                uid
            }), { merge: true }
        })
    } catch (err) {
        console.error(`Exception in saveChat: ${err}`)
        return
    }
}


export async function getChat({ uid, chatId }: { uid: string, chatId: string }) {
    try {

        if (uid === undefined || uid?.length === 0) {
            return undefined
        }
        const chatDocRef = firebaseAdminFirestore.collection('chats').doc(chatId)


        const chatDoc = await chatDocRef.get()

        const data = chatDoc.data()

        if (data === undefined) {

            return undefined
        }

        return data as Chat

    } catch (err) {
        console.error(`Exception in getChat: ${err}`)
        return undefined
    }
}



export async function getClientChatsByAgentChatType({ uid, agentChatType }: { uid: string, agentChatType: AgentChatTypeEnum }) {
    try {

        if (uid === undefined || uid?.length === 0) {
            return []
        }
        const chatDocRef = firebaseAdminFirestore.collection('chats')

        const q = chatDocRef.where('uid', '==', uid).where('agentChatType', '==', agentChatType)
            .orderBy('createdAt', 'desc')

        const qRes = await q.get()

        const chatSnippet: ClientChatSnippet[] = []

        qRes.docs.forEach((doc) => {
            const data = doc.data()
            if (data) {
                chatSnippet.push({
                    title: data.title,
                    uid,
                    id: doc.id,
                    agentChatType: data.agentChatType,
                    path: data.path
                })
            }
        })

        return chatSnippet

    } catch (err) {
        console.error(`Exception in getChat: ${err}`)
        return []
    }
}


export async function createChat({ agentChatType }: { agentChatType: AgentChatTypeEnum }) {

    try {
        const session = await getAuthByCookie()

        if (!session || !session.user.id) {
            redirect('/?signin=true')
        }

        const chatDocRef = firebaseAdminFirestore.collection('chats').doc()
        const chatId = chatDocRef.id

        const chat: Chat = {
            id: chatId,
            title: '',
            createdAt: new Date(),
            userId: session.user.id,
            uid: session.user.id,
            path: '',
            messages: [],
            agentChatType
        }
        await chatDocRef.set(chat)
        return chatId
    } catch (err) {
        console.error(`Exception in createChat: ${err}`)
        return undefined

    }
}


export async function clearChats({ agentChatType }: { agentChatType: AgentChatTypeEnum }) {
    const session = await getAuthByCookie()

    if (!session?.user?.id) {
        return {
            error: 'Unauthorized'
        }
    }

    try {

        const q = firebaseAdminFirestore.collection('chats').where('uid', '==', session.user.id)
            .where('agentChatType', '==', agentChatType)
        const qRes = await q.get()

        const batch = firebaseAdminFirestore.batch()

        qRes.docs.forEach((doc) => {
            batch.delete(doc.ref)
        })
        await batch.commit()

    } catch (err) {
        return {
            error: 'Something went wrong. Please try again'
        }
    }



}


export async function removeChat({ id, path }: {
    id: string,
    path: string
}) {

    const session = await getAuthByCookie()

    if (!session?.user?.id) {
        return {
            error: 'Unauthorized'
        }
    }

    try {

        const ref = firebaseAdminFirestore.collection('chats').doc(id)

        const doc = await ref.get()
        const chatUid = doc.data()?.uid

        if (chatUid !== session.user.id) {
            return {
                error: 'Unauthorized'
            }
        }

        await ref.delete()

    } catch (err) {
        return {
            error: 'Something went wrong. Please try again'
        }

    }
}