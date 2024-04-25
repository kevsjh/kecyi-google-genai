'use client'

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import Link from "next/link"
import { Briefcase, Person } from "@phosphor-icons/react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function SwitchPortalIcon() {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const pathname = usePathname()

    const [isClient, setIsClient] = useState(false)


    useEffect(() => {
        setIsClient(pathname.includes('client'))
    }, [pathname])




    if (!isDesktop) {
        return <Link
            href={isClient ? '/admin' : '/client'}
            className="flex items-center text-sm gap-1"
        >
            {!isClient ? <Person size={20} /> : <Briefcase size={20} />}
            <p className="">{
                isClient ? 'Admin Portal' : 'Client Portal'

            }</p>
        </Link>
    }


    return <Tooltip>
        <TooltipTrigger asChild>
            <Link
                href={isClient ? '/admin' : '/client'}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
                {!isClient ? <Person size={20} /> : <Briefcase size={20} />}
                <span className="sr-only">{
                    isClient ? 'Admin Portal' : 'Client Portal'

                }</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{
            isClient ? 'Admin Portal' : 'Client Portal'

        }</TooltipContent>
    </Tooltip>


}