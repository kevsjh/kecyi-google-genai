'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { useAuthContext } from "@/context/auth-context"
import { getUserInitials } from "@/lib/utils"
import { User } from "@phosphor-icons/react"



export default function UserAvatar() {
    const { auth, pendingAuthState } = useAuthContext()

    if (pendingAuthState || auth.currentUser === null) {
        return <Avatar className="h-8 w-8 rounded-full  bg-muted/80 flex items-center justify-center">
            <User size={20} />
        </Avatar>
    }
    return <Avatar className="h-8 w-8 rounded-full flex items-center justify-center">
        {
            (auth.currentUser?.photoURL && auth.currentUser?.photoURL?.length > 0) &&
            <AvatarImage src={auth.currentUser?.photoURL!} />
        }
        <AvatarFallback>
            {getUserInitials(auth.currentUser?.email ?? '')}
        </AvatarFallback>
    </Avatar>
}