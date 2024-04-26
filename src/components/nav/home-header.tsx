'use client'

/* eslint-disable @next/next/no-img-element */
import * as React from 'react'


import { SidebarToggle } from './sidebar-toggle'
import UserProfile from '../user-profile'



import { PortalMobileNav } from './portal-mobile-nav'


export function HomeHeader({ items }: {
  items?: {
    title: string;
    path: string;
    icon: JSX.Element;
  }[]
}) {
  return (
    <header className="fixed  top-0 z-50 flex items-center justify-between w-full h-12 px-4 shrink-0 bg-transparent">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <div className='flex gap-2 items-center '>
            <PortalMobileNav items={items} />
            <SidebarToggle />
            {/* <ChatSidebarMobile /> */}

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
