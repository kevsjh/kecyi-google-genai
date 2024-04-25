'use client'

import { MemoizedReactMarkdown } from "@/components/markdown"
import { buttonVariants } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/codeblock"
import UserAvatar from "@/components/user-avatar"
import { useAuthContext } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { ILiveAgentDoc } from "@/types"
import { User } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

export default function AdminInboxItem({ id, status, summarizeChat }: {

    id: string;
    status: 'pending' | 'ended' | 'active',
    summarizeChat: string


}) {
    const pathname = usePathname()
    const isActive = pathname === `/admin/inbox/${id}`

    const { auth } = useAuthContext()

    return <Link

        href={`/admin/inbox/${id}`}
        className={cn(
            // buttonVariants({ variant: 'ghost' }),
            'group items-center rounded-xl w-full px-3 transition-colors py-2  flex gap-2 overflow-hidden hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
            isActive && 'bg-zinc-200 flex font-semibold dark:bg-zinc-800'
        )}
    >
        <div className="p-1 h-fit w-fit rounded-full bg-primary">
            <User size={20} color="white" />
        </div>

        <div className="flex flex-col overflow-hidden gap-2">
            <p className="text-xs font-medium">{auth.currentUser?.email}</p>
            <p className="font-light text-xs line-clamp-1 text-ellipsis">
                <MemoizedReactMarkdown
                    className="text-xs break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        },
                        code({ node, inline, className, children, ...props }) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                                    )
                                }

                                children[0] = (children[0] as string).replace('`▍`', '▍')
                            }

                            const match = /language-(\w+)/.exec(className || '')

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            )
                        }
                    }}
                >
                    {summarizeChat}
                </MemoizedReactMarkdown>

            </p>
        </div>
        <div>
            {
                status === 'ended' ? <div className=" h-3 w-3 bg-muted rounded-full" /> :
                    status === 'active' ? <div className="h-3 w-3 bg-green-500 rounded-full" /> :
                        <div className="h-3 w-3 bg-amber-500 rounded-full " />
            }

        </div>
    </Link>

}