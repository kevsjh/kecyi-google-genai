import { MemoizedReactMarkdown } from "@/components/markdown"

import { CodeBlock } from "@/components/ui/codeblock"

import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"


export default function LiveAgentChatMessage({ message }: { message: string }) {

    return <MemoizedReactMarkdown
        className="prose prose-sm break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
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
}