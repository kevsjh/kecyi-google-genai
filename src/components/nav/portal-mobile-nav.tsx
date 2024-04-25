'use client'

import { Button } from '@/components/ui/button'
import { Sidebar } from './sidebar'
import { SidebarSimple, Smiley } from '@phosphor-icons/react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import SideNavItem from './side-nav-item'
import Link from 'next/link'
import SwitchPortalIcon from './switch-portal-icon'

interface SidebarMobileProps {
    children: React.ReactNode
}

export function PortalMobileNav({ items }: {
    items?: {
        title: string;
        path: string;
        icon: JSX.Element;
    }[]
}) {


    if (items === undefined) {
        return <Link
            href='/'
            className="flex bg-primary p-1 items-center justify-center gap-2 rounded-full">
            <Smiley size={25} color='white' className="transition-all group-hover:scale-110" />
        </Link>
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="-ml-2 flex size-9 p-0 sm:hidden">
                    <div className="flex bg-primary p-1 items-center justify-center gap-2 rounded-full">
                        <Smiley size={25} color='white' className="transition-all group-hover:scale-110" />
                    </div>
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="inset-y-0 flex  h-auto w-[300px] flex-col p-0"
            >
                <div className='pt-14 flex flex-col gap-6 px-4'>
                    {
                        items.map((item, index) => {
                            return <Link href={item.path} key={index}
                                // icon={item.icon}
                                // path={item.path}
                                // title={item.title}
                                className='flex items-center text-sm gap-1'
                            >
                                {item.icon} <p>{item.title}</p>

                            </Link>
                        })
                    }
                    <SwitchPortalIcon />
                </div>
            </SheetContent>
        </Sheet>
    )
}
