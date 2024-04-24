'use client'

import * as React from 'react'
// import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'


import { SidebarProvider } from '@/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </SidebarProvider>
  )
}
