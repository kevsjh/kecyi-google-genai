
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"



const features = [
    {
        src: '/assets/features/edit/admin-knowledge-copilot.png',
        title: 'RAG based Copilot Conversation for live agent to improve customer service',
    },
    {
        src: '/assets/features/edit/admin-liveagent-copilot.png',
        title: 'AI Copilot to assist live agent in real time conversation',
    },
    {
        src: '/assets/features/edit/admin-summarize.png',
        title: 'Provide live agent with more context when switching from AI agent',
    },

]


export default function Page() {
    return <div className="flex   items-center flex-col h-full p-6 gap-4   w-full">

        <div className="flex flex-col items-center gap-4 justify-center w-full">
            <h1 className="text-2xl font-medium">Try out some of the Gen AI features built on top of Google Cloud</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs">

                <Link href="/admin/inbox" className="bg-primary text-white rounded-md px-4 py-1">
                    Live Agent Inbox
                </Link>
                <Link href="/admin/knowledge" className="bg-primary text-white rounded-md px-4 py-1">
                    View Knowledge Hub
                </Link>

            </div>
        </div>
        <div className="pt-4 text-2xl font-medium">Check out some of the sample features</div>
        <div className="w-full flex justify-center px-6">
            <Carousel className=" w-full  max-w-xs sm:max-w-2xl md:max-w-5xl">
                <CarouselContent>
                    {
                        features.map((feature, index) => (
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