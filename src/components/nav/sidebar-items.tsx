'use client'


import { AnimatePresence, motion } from 'framer-motion'

// import { removeChat, } from '@/app/actions'

import { SidebarActions } from './sidebar-actions'
import { SidebarItem } from './sidebar-item'
import { Chat, ClientChatSnippet } from '@/types'
import { removeChat } from '@/lib/helper-actions/action'

interface SidebarItemsProps {
    chats?: ClientChatSnippet[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
    if (!chats?.length) return null

    return (
        <AnimatePresence>
            {chats.map(
                (chat, index) =>
                    chat && (
                        <motion.div
                            key={chat?.id}
                            exit={{
                                opacity: 0,
                                height: 0
                            }}
                        >
                            <SidebarItem index={index} chat={chat}>

                                <SidebarActions
                                    chat={chat}
                                    removeChat={removeChat}

                                />
                            </SidebarItem>
                        </motion.div>
                    )
            )}
        </AnimatePresence>
    )
}