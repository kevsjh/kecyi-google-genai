'use client'

import { firebaseFirestore } from "@/config/firebase-config";
import { useAuthContext } from "@/context/auth-context"
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientListenLiveAgentState({ id }: { id: string }) {
    const { auth, pendingAuthState } = useAuthContext()

    const router = useRouter()

    useEffect(() => {


        if (!pendingAuthState && auth.currentUser) {

            const q = doc(
                firebaseFirestore, 'liveagent', id,
            )

            const unSub = onSnapshot(
                q, (docs) => {
                    const data = docs.data()

                    if (data?.status === 'active') {
                        router.refresh()
                    }
                });
            return () => {
                unSub();
            };
        }
        return () => { };
    }, [pendingAuthState, auth.currentUser, id])



    return <></>

}