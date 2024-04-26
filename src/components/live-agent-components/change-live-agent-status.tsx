'use client'

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/auth-context"
import { updateLiveAgentRequest } from "@/lib/live-agent-actions/live-agent-actions"
import { CircleNotch } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"


export default function ChangeLiveAgentStatusButton({ id, currentStatus }: { id: string, currentStatus: 'pending' | 'active' }) {
    const { auth } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const onSubmit = useCallback(async () => {
        if (auth.currentUser === null) {
            toast.error('You are not logged in')
        }
        setLoading(true)
        const { status } = await updateLiveAgentRequest({
            id,
            status: currentStatus === 'pending' ? 'active' : 'ended'

        })

        if (status === false) {
            toast.error('Error updating live agent request')
            setLoading(false)
            return
        }


        router.push(`/admin/inbox/${id}`)
        router.refresh()
        toast.success('Updated live agent request')


        setLoading(false)

    }, [auth.currentUser, currentStatus, id])



    return <Button
        onClick={onSubmit}
    >
        {
            loading ? <CircleNotch className="animate-spin" size={20} /> : <>
                {
                    currentStatus === 'pending' ? 'Activate Live Agent Chat' : 'End Live Agent Chat'
                }</>
        }
    </Button>
}