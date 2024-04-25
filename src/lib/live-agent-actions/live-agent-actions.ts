'use server'

import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { cookies } from "next/headers"


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

        await liveAgentRequestRef.set({
            id: liveAgentDocId,
            uid: uid,
            status: 'pending',
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