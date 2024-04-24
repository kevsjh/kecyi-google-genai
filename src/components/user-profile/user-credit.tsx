'use client'

import { useAuthContext } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { CoinVertical } from "@phosphor-icons/react"
import humanFormat from "human-format"

export default function UserCreditDisplay({
    size = 30,
    className }: {
        size?: number
        className?: string
    }) {
    const { auth, totalCredits, creditRefreshesAt, userPlan } = useAuthContext()
    if (auth.currentUser === null) return

    return <div className={cn("flex gap-2  items-center", className)}>

        <CoinVertical size={size} />{
            humanFormat(totalCredits, {
                maxDecimals: "auto",
            })
        }
    </div >

}