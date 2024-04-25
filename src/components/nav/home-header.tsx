'use client'

/* eslint-disable @next/next/no-img-element */
import * as React from 'react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SidebarToggle } from './sidebar-toggle'
import UserProfile from '../user-profile'
import { usePathname } from 'next/navigation'

import { ChatSidebarMobile } from './chat-sidebar-mobile'
import { PortalMobileNav } from './portal-mobile-nav'



function BreadcrumbMenu() {

  const pathname = usePathname()
  const [paths, setPaths] = React.useState<{ title: string, path: string }[]>([])


  React.useEffect(() => {
    // split pathname to list of string
    const paths = pathname.split('/')
    // if paths length is longer than 3, remove the rest
    if (paths.length > 5) {
      paths.splice(5)
    }

    // map it so that we can get the title and path of the breadcrumb
    const pathsMap = paths.map((path, index) => {
      return {
        title: path.charAt(0).toUpperCase() + path.slice(1),
        path: paths.slice(0, index + 1).join('/')
      }
    })
    setPaths(pathsMap)


  }, [pathname])



  return <Breadcrumb className="hidden md:flex">
    <BreadcrumbList>
      {
        paths.map((path, index) => {
          return <div className='flex gap-1 items-center' key={index}>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link href={`${path.path}`}>{path.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {
              (index !== 0 && index !== paths.length - 1) && (
                <BreadcrumbSeparator />
              )
            }
          </div>
        })
      }

    </BreadcrumbList>
  </Breadcrumb>
}

export function HomeHeader({ items }: {
  items?: {
    title: string;
    path: string;
    icon: JSX.Element;
  }[]
}) {
  return (
    <header className="fixed border-b top-0 z-50 flex items-center justify-between w-full h-12 px-4 shrink-0 bg-transparent">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <div className='flex gap-2 items-center '>
            <PortalMobileNav items={items} />
            <SidebarToggle />
            {/* <ChatSidebarMobile /> */}
            <BreadcrumbMenu />
          </div>

        </React.Suspense>
      </div>
      <div className="flex items-center justify-end gap-2">

        <React.Suspense  >

          <UserProfile />
        </React.Suspense>


      </div>
    </header>
  )
}
