'use client'

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useCallback } from "react"


export default function AccessPortalButton() {
    const { auth, pendingAuthState } = useAuthContext()
    const router = useRouter()


    const onClick = useCallback(() => {
        if (pendingAuthState) return

        if (auth.currentUser) {
            router.push('/client')
        } else {
            router.push('?signin=true')
        }


    }, [

        auth.currentUser, pendingAuthState
    ])



    const onAdminClick = useCallback(() => {
        if (pendingAuthState) return

        if (auth.currentUser) {
            router.push('/admin')
        } else {
            router.push('?signin=true')
        }


    }, [

        auth.currentUser, pendingAuthState
    ])



    return <div className="flex flex-col gap-8">
        <Button
            size={'sm'}
            variant={'default'}
            disabled={pendingAuthState}
            onClick={onClick}
            className="text-center   rounded-full   text-base transform transition duration-200 
        sm:hover:scale-110">
            Access Client Portal
        </Button>
        <Button
            variant={'outline'}
            size={'sm'}
            disabled={pendingAuthState}
            onClick={onAdminClick}
            className="text-center  text-primary   rounded-full   text-base transform transition duration-200 
            sm:hover:scale-110">
            Access Admin Portal
        </Button>
    </div>
}