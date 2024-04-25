import { MemoizedReactMarkdown } from "@/components/markdown"

import { CodeBlock } from "@/components/ui/codeblock"
import { cn } from "@/lib/utils"
import { Headset, User } from "@phosphor-icons/react"

import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"


export default function LiveAgentChatMessage({ message, role, panel }: {

    panel: 'admin' | 'client',
    role: 'client' | 'admin', message: string
}) {

    return <div className={cn("flex w-full  gap-2 items-start ",
        (role === panel) ? 'justify-end  ' : 'justify-start'
    )}>
        {
            (role !== panel) ? role === 'client' ?
                <div className="p-1 border rounded-full"><User size={20} /></div> : <div className="p-1  border rounded-full"><Headset size={20} /></div> : <></>
        }

        <div className={cn("flex w-fit  shadow-sm px-2 py-1 rounded-xl",
            (role === panel) ? ' bg-muted ' : 'bg-primary '

        )}>
            <MemoizedReactMarkdown
                className={cn("prose prose-sm  break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                    (role === panel) ? 'text-primary' : 'text-white'

                )}
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
                {message}
            </MemoizedReactMarkdown>
        </div>
    </div>
}