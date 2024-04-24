'use client'

import * as React from 'react'


import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/use-sidebar'
import { SidebarSimple } from '@phosphor-icons/react'


export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar()
      }}
    >
      <SidebarSimple size={25} className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
