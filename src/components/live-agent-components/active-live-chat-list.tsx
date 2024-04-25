'use client'

import { firebaseFirestore } from "@/config/firebase-config";
import { useAuthContext } from "@/context/auth-context";
import { ILiveAgentMessage } from "@/types";
import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import LiveAgentChatMessage from "./live-agent-chat-messages";

export default function ActiveLiveChatList({ panel, currentMessages, id }: {
    panel: 'admin' | 'client',
    id: string, currentMessages: ILiveAgentMessage[]
}) {
    const { auth, pendingAuthState } = useAuthContext()

    const [messagesList, setMessagesList] = useState<ILiveAgentMessage[]>(currentMessages)
    const messagesListRef = useRef(messagesList);


    useEffect(() => {
        messagesListRef.current = messagesList;
    }, [messagesList]);

    useEffect(() => {


        if (!pendingAuthState && auth.currentUser) {

            const q = query(
                collection(
                    firebaseFirestore,
                    `liveagent/${id}/messages`
                ),
                orderBy("createdAt", "desc"),
                limit(2)
            );

            const unSub = onSnapshot(
                q, (docs) => {
                    const currentMessagesList = [...messagesListRef.current];
                    // const docsToUpdate = []
                    docs.docChanges().forEach(change => {


                        if (change.type === 'added') {
                            const data = change.doc.data()

                            const liveAgentMessage: ILiveAgentMessage = {
                                createdAt: data.createdAt?.toDate(),
                                id: data.id,
                                message: data.message,
                                role: data.role,
                            }
                            // add to the beginning of the array
                            currentMessagesList.unshift(liveAgentMessage)



                        } else if (change.type === 'modified') {
                            const data = change.doc.data()

                            const liveAgentMessage: ILiveAgentMessage = {
                                createdAt: data.createdAt?.toDate(),
                                id: data.id,
                                message: data.message,
                                role: data.role,
                            }
                            const index = currentMessagesList.findIndex(msg => msg.id === liveAgentMessage.id)
                            currentMessagesList[index] = liveAgentMessage
                        }
                    })


                    // sort so that the latest message is at the begging of the array
                    currentMessagesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

                    // ensure no duplicates with same id
                    const uniqueMessages = currentMessagesList.filter((msg, i, self) => self.findIndex(m => m.id === msg.id) === i)

                    setMessagesList(uniqueMessages)
                });
            return () => {
                unSub();
            };
        }
        return () => { };
    }, [pendingAuthState, auth.currentUser])






    return <div className=" flex flex-col  items-center overflow-auto h-full w-full ">
        <div className="w-full flex gap-4  max-w-4xl flex-col-reverse">{messagesList.map((msg, i) =>

            <LiveAgentChatMessage key={i}
                role={msg.role}
                panel={panel}
                message={msg.message} />
        )

        }</div>


    </div>

}