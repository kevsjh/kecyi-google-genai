'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuthContext } from "@/context/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useEffect, useState } from "react"
import UserPlanDisplay from "./user-plan-display"
import UserCreditDisplay from "./user-credit"
import Link from "next/link"
import { Button } from "../ui/button"
import UserAvatar from "../user-avatar"

function getUserInitials(name: string) {
    const [firstName, lastName] = name.split(' ')
    return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}


export default function UserDropdown() {
    const { auth, pendingAuthState, invokeUserSignOut, userPlan } = useAuthContext()
    const [displayCharacter, setDisplayCharacter] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()
    async function onUserSignOut() {
        try {
            // await auth.signOut()
            // router.refresh()
            await invokeUserSignOut()
            if (pathname.startsWith("/profile")) {
                router.push('/')
            }
            router.refresh()
            toast.success("Signed out successfully")
        } catch (err) {
            console.log("Failed to sign out", err)
        }
    }


    useEffect(() => {
        if (!pendingAuthState && auth.currentUser) {
            const displayNameCharacter = auth.currentUser.displayName?.charAt(0)
            const displayEmailCharacter = auth.currentUser.email?.charAt(0)
            if (displayNameCharacter && displayNameCharacter.length > 0) {
                setDisplayCharacter(displayNameCharacter)
            } else {
                setDisplayCharacter(displayEmailCharacter ?? '')
            }
        }


    }, [auth.currentUser, pendingAuthState])
    if (auth.currentUser === null) { return null }

    return <>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="pl-0 flex items-center ransform transition duration-200 
                    sm:hover:scale-110 ">


                    <UserAvatar />
                    {/* <div className="flex size-7 shrink-0  select-none items-center justify-center rounded-full bg-muted/50 text-sm font-medium uppercase text-muted-foreground">
                        {getUserInitials(auth.currentUser?.displayName ?? auth.currentUser?.email ?? '')}
                    </div>
                    <span className="md:ml-2 hidden md:block text-sm font-medium">{auth.currentUser?.email}</span> */}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8} align="start" className="w-fit">
                <DropdownMenuItem className="flex-col items-start">
                    <div className="text-xs text-zinc-500">{auth.currentUser?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form
                // action={async () => {
                //   'use server'
                //   // await signOut()
                // }}
                >
                    <button
                        onClick={onUserSignOut}
                        className=" relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-red-500 hover:text-white focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        Sign Out
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu></>

}