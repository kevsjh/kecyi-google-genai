import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-zinc-500',
        className
      )}
      {...props}
    >
      Google Cloud GenAI 2024 APAC {' '}
      ❤️ by{' '} <strong>kevinsmjh</strong> {' '}
      <ExternalLink href="https://twitter.com/kevinsmjh">
        Twitter
      </ExternalLink>
      , {' '}
      <ExternalLink href="https://www.linkedin.com/in/kevin-sham88/">
        Linkedin
      </ExternalLink>
      .
    </p>
  )
}
