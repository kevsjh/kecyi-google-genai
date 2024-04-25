import { ExternalLink } from '@/components/external-link'
import { AgentChatTypeEnum } from '@/constant/enum'
import Link from 'next/link'

export function CustomerServiceAgentEmptyScreen() {
    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
                <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
                    Customer Service Agent
                </h1>
                <p className="leading-normal text-zinc-900">
                    This is an AI customer service agent from the bank of Kecyi that is designed to help you with your queries.
                    <br /> It contains information from the knowledge hub uploaded on admin portal to support you.
                    {' '} <Link
                        target='_blank'
                        className='font-medium text-sm'
                        href='/admin/knowledge'>Access Admin Portal</Link>
                    <br />
                    This AI Agent is powered by <ExternalLink href="https://cloud.google.com/vertex-ai?hl=en">
                        Google Cloud AI Gemini Pro 1.5
                    </ExternalLink>

                    <br />
                    <ExternalLink href="https://twitter.com/kevinsmjh">
                        Built 💻 kevinsmjh
                    </ExternalLink>
                </p>

            </div>
        </div>
    )
}
