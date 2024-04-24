'use server'

import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { Filter } from "firebase-admin/firestore"
import { where } from "firebase/firestore"
import { cookies } from "next/headers"

initFirebaseAdminApp()

export async function getUseAdminKnowledge() {
    const sessionObj = cookies().get('session')
    const session = sessionObj?.value
    if (session === undefined || session?.length === 0) {
        return {
        }
    }
    try {
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid

        const colRef = firebaseAdminFirestore.collection('contents')


        const q = colRef
            .where(
                Filter.or(
                    Filter.where('uid', '==', uid),
                    // show prefilled content
                    Filter.where('uid', '==', 'all')
                )
            )
            .orderBy('createdAt', 'desc')
        const qRes = await q.get()


        console.log('length', qRes.docs.length)

        qRes.docs.forEach((doc) => {
            const data = doc.data()
            console.log('data', data)
        })
        return


    } catch (err) {
        console.error('Error in getUseAdminKnowledge', err)
    }

}




