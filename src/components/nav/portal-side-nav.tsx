import { ChartLineUp, Chat, Gear, HouseSimple, File, PiggyBank, SidebarSimple, User, Smiley, Headset } from "@phosphor-icons/react/dist/ssr"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import SideNavItem from "./side-nav-item"
import React from "react"
import SwitchPortalIcon from "./switch-portal-icon"




export default function PortalSideNav({ items }: {
    items: {
        title: string;
        path: string;
        icon: JSX.Element;
    }[]
}) {




    return <aside className="fixed inset-y-0 left-0 z-30 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
            <Link
                href="/"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
                <Smiley size={20} color='white' className="transition-all group-hover:scale-110" />


                <span className="sr-only">Kecyi</span>
            </Link>

            {
                items.map((item, index) => {
                    return <SideNavItem key={index}
                        icon={item.icon}
                        path={item.path}
                        title={item.title}
                    />
                })
            }
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
            <React.Suspense>
                <SwitchPortalIcon />
            </React.Suspense>
        </nav>
    </aside>
}