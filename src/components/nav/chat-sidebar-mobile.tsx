'use client'

import * as React from 'react'


import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/use-sidebar'
import { SidebarSimple } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'
import { AgentChatTypeEnum } from '@/constant/enum'
import { set } from 'date-fns'
import { useAuthContext } from '@/context/auth-context'
import { SidebarMobile } from './sidebar-mobile'
import { ChatHistory } from './chat-history'


export function ChatSidebarMobile() {
    const { toggleSidebar } = useSidebar()
    const pathname = usePathname()
    const [showSidebar, setShowSidebar] = React.useState<boolean>(false)
    const [agentType, setAgentType] = React.useState<AgentChatTypeEnum | undefined>(undefined)
    const { auth } = useAuthContext()
    React.useEffect(() => {
        console.log('pathnnw', pathname)
        if (pathname?.toLowerCase().includes('chat')) {
            console.log('chat')
            if (pathname?.toLowerCase().includes('customerservice')) {
                console.log('customer service')
                setAgentType(AgentChatTypeEnum.CUSTOMERSERVICE)
            } else if (pathname?.toLowerCase().includes('stockagent')) {
                console.log('stock agent')
                setAgentType(AgentChatTypeEnum.STOCKAGENT)
            }

            setShowSidebar(true)
        } else {
            setShowSidebar(false)
        }
    }, [pathname])

    if (!showSidebar || agentType === undefined || auth.currentUser === null) {
        return
    }

    return <SidebarMobile>
        <ChatHistory userId={auth.currentUser.uid} agentChatType={agentType}
        />
    </SidebarMobile>

}
