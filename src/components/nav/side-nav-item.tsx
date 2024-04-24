'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { is } from "date-fns/locale";
import Link from "next/link"
import { usePathname } from "next/navigation";
import React from "react";
import { useEffect } from "react";


export default function SideNavItem({ title, path, icon }: {
    title: string;
    path: string;
    icon: JSX.Element;
}) {
    const pathname = usePathname()
    const [isActive, setIsActive] = React.useState(false)


    useEffect(() => {

        if (path === '/client') {

            if (path === pathname) {
                setIsActive(true)
                return
            }
        } else {
            if (pathname.includes(path)) {

                setIsActive(true)
                return
            }
        }
        setIsActive(false)
    }, [pathname])


    return < Tooltip >
        <TooltipTrigger asChild>
            <Link
                href={path}
                className={cn('flex h-9 w-9 items-center justify-center rounded-lg  text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive ? 'bg-accent' : 'bg-transparent '
                )}
            >
                {icon}
                <span className="sr-only">{title}</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip >

}
