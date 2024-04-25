import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { AgentChatTypeEnum } from "@/constant/enum";




export default function Page() {
    return <div className="flex  flex-col h-full p-6   w-full">
        <div className="grid grid-cols-1  sm:grid-cols-2  gap-6">
            <div className="col-span-1">
                <Card className="">
                    <CardHeader className="pb-3 ">
                        <CardTitle>Customer Service AI Agent</CardTitle>
                        <CardDescription className="leading-relaxed">
                            Stock agent is an AI financial agent that is designed to help you discover latest stock prices and trends. You can also create new stock purchase orders.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link
                            className="bg-primary text-white rounded-md px-4 py-1"
                            href={`/client/agent/${AgentChatTypeEnum.CUSTOMERSERVICE.toLowerCase()}/chat`}>
                            Chat
                        </Link>
                    </CardFooter>
                </Card>


                <Card className="">
                    <CardHeader className="pb-3 ">
                        <CardTitle>AI Stock Agent</CardTitle>
                        <CardDescription className="leading-relaxed">
                            Stock agent is an AI financial agent that is designed to help you discover latest stock prices and trends. You can also create new stock purchase orders.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link
                            className="bg-primary text-white rounded-md px-4 py-1"
                            href={`/client/agent/${AgentChatTypeEnum.STOCKAGENT.toLowerCase()}/chat`}>
                            Chat
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
}