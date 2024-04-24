'use server'

import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { IContentData } from "@/types"
import { Filter } from "firebase-admin/firestore"
import { where } from "firebase/firestore"
import { cookies } from "next/headers"

initFirebaseAdminApp()

export async function getUseAdminKnowledge() {
    const sessionObj = cookies().get('session')
    const session = sessionObj?.value
    if (session === undefined || session?.length === 0) {
        return {
            contents: []
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

        // map to object IContentData
        const contents = qRes.docs.map(doc => {
            const data = doc.data()

            const contentData: IContentData = {
                id: doc.id,
                uid: data.uid,
                createdAt: data.createdAt?.toDate(),
                objectURL: data.objectURL,
                objectFullPath: data.objectFullPath,
                userFilename: data.userFilename,
                type: data.type
            }
            return contentData
        })

        return {
            contents
        }


    } catch (err) {
        console.error('Error in getUseAdminKnowledge', err)
        return {
            contents: []
        }
    }

}




