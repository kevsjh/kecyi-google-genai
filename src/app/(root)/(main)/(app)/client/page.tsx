/* eslint-disable @next/next/no-img-element */
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { AgentChatTypeEnum } from "@/constant/enum";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"



const clientFeatures = [
    {
        src: '/assets/features/edit/customer-service.png',
        title: 'LLM Based AI Customer Service Support',
    },
    {
        src: '/assets/features/edit/routable-agent.png',
        title: 'Routable LLM Agent',
    },
    {
        src: '/assets/features/edit/agent-stock.png',
        title: 'LLM function calling for current stock data',
    },
    {
        src: '/assets/features/edit/purchase-stock.png',
        title: 'Stock purchase without leaving the chat',
    },
    {
        src: '/assets/features/edit/manage-portfolio.png',
        title: 'Copilot to manage portfolio including buying and selling stocks',
    },
    {
        src: '/assets/features/edit/manage-transaction.png',
        title: 'Copilot to manage transactions and upsell products offering',
    },

    {
        src: '/assets/features/edit/navigate-live-agent.png',
        title: 'Navigate from AI agent to live agent',
    },
    {
        src: '/assets/features/edit/live-agent-simulate.png',
        title: 'Simulate real time conversation with live agent',
    },


]


export default function Page() {
    return <div className="flex   items-center flex-col h-full p-6 gap-4   w-full">

        <div className="flex flex-col items-center gap-4 justify-center w-full">
            <h1 className="text-2xl font-medium">Try out some of the Gen AI features built on top of Google Cloud</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs">

                <Link href="/client/agent" className="bg-primary text-white rounded-md px-4 py-1">
                    Chat with AI Agents
                </Link>
                <Link href="/client/portfolio" className="bg-primary text-white rounded-md px-4 py-1">
                    Manage Portfolio with copilot
                </Link>
                <Link href="/client/transactions" className="bg-primary text-white rounded-md px-4 py-1">
                    Manage transaction with copilot
                </Link>
                <Link href="/admin" className="bg-primary text-white rounded-md px-4 py-1">
                    Switch to admin
                </Link>
            </div>
        </div>
        <div className="pt-12 text-2xl font-medium">Check out some of the sample features</div>
        <div className="w-full flex justify-center px-6">
            <Carousel className=" w-full  max-w-xs sm:max-w-2xl md:max-w-5xl">
                <CarouselContent>
                    {
                        clientFeatures.map((feature, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 flex  flex-col  gap-2 items-center justify-center">
                                    <p className="text-center font-medium text-2xl">  {
                                        feature.title
                                    }</p>

                                    <Card className="">
                                        <CardContent className=" flex    aspect-video items-center justify-center ">

                                            <img src={feature.src} className="   object-cover" />

                                            {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    </div>
}