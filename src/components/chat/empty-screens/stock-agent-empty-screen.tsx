import { ExternalLink } from '@/components/external-link'
import { AgentChatTypeEnum } from '@/constant/enum'

export function StockAgentEmptyScreen() {
    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
                <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
                    Financial Stock Agent
                </h1>
                <p className="leading-normal text-zinc-900">
                    This is an AI financial stock agent that is designed to help you
                    discover the latest stock prices and trends. You can also create new
                    stock purchase orders.
                    <br />
                    This AI Agent is powered by <ExternalLink href="https://cloud.google.com/vertex-ai?hl=en">
                        Google Cloud Gemini AI
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
