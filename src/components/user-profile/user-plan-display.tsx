'use client'

import { UserPlanEnum } from "@/constant/enum"
import { useAuthContext } from "@/context/auth-context"
import { Cactus, HouseSimple, Blueprint } from "@phosphor-icons/react"
import { Badge } from "../ui/badge"

export default function UserPlanDisplay() {
    const { auth, totalCredits, creditRefreshesAt, userPlan } = useAuthContext()
    if (auth.currentUser === null) return <div className="hidden"></div>

    if (userPlan === UserPlanEnum.FREE) {
        return <Badge className=" hover:bg-indigo-purple/80  justify-center flex gap-2 text-sm items-center bg-indigo-purple text-primary"><Cactus size={25} />Free</Badge>
    }

    if (userPlan === UserPlanEnum.HOMEOWNER) {
        return <Badge className="flex hover:bg-custom/80 justify-center gap-2 text-sm items-center bg-custom text-primary"><HouseSimple size={25} />Home</Badge>
    }
    if (userPlan === UserPlanEnum.PROFESSIONAL) {
        return <Badge className="flex hover:bg-secondary justify-center  gap-2 text-sm items-center bg-secondary text-primary"><Blueprint size={25} />Pro</Badge>
    }

    return <div className="hidden"></div>

}