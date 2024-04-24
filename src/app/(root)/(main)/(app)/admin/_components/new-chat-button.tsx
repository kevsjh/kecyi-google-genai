'use client'

import { Button } from "@/components/ui/button"
import { AgentChatTypeEnum } from "@/constant/enum"
import { createChat } from "@/lib/helper-actions/action"
import { firestoreAutoId } from "@/lib/utils"
import { CircleNotch } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewChatButton() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {

        setLoading(true)




        router.push(`/client/agent/${AgentChatTypeEnum.STOCKAGENT?.toLowerCase()}/chat`)
        setLoading(false)
    }
    return <Button
        onClick={handleClick}
        disabled={loading}
    >
        {
            loading ? <CircleNotch size={25} className="animate-spin" /> : 'New Chat'
        }
    </Button>
}