'use client'

import * as React from 'react'


import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/use-sidebar'
import { SidebarSimple } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'


export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (pathname.includes('chat')) {
      setShowSidebar(true)
    } else {
      setShowSidebar(false)
    }
  }, [pathname])

  if (!showSidebar) {
    return
  }
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
