

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Smiley, User } from "@phosphor-icons/react"



export default function BotAvatar() {
    return <Avatar className="h-8 w-8 rounded-full  bg-primary flex items-center justify-center">
        <Smiley size={20} color='white' />
    </Avatar>
}