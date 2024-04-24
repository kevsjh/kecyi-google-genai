

import { SidebarItems } from './sidebar-items'

import { cache } from 'react'
import { ThemeToggle } from '../theme-toggle'
import { ClearHistory } from './clear-history'
import { AgentChatTypeEnum } from '@/constant/enum'
import { clearChats, getClientChatsByAgentChatType } from '@/lib/helper-actions/action'

interface SidebarListProps {
    userId?: string
    children?: React.ReactNode
    agentChatType: AgentChatTypeEnum
}

const loadChats = cache(async (userId: string, agentChatType: AgentChatTypeEnum) => {
    if (userId === undefined || userId?.length === 0) {
        return []
    }

    return await getClientChatsByAgentChatType({
        agentChatType: agentChatType,
        uid: userId
    })
})

export async function SidebarList({ userId, agentChatType }: SidebarListProps) {
    const chats = userId ? await loadChats(userId, agentChatType) : []

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
                {chats?.length ? (
                    <div className="space-y-2 px-2">
                        <SidebarItems chats={chats} />
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">No chat history</p>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between p-4">

                <ClearHistory clearChats={clearChats} agentChatType={agentChatType} isEnabled={chats?.length > 0} />
            </div>
        </div>
    )
}