import { getLiveAgentChats } from "@/lib/live-agent-actions/live-agent-actions";
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
import Link from "next/link";



const features = [

    {
        src: '/assets/features/edit/admin-liveagent-copilot.png',
        title: 'AI Copilot to assist live agent in real time conversation',
    },
    {
        src: '/assets/features/edit/admin-summarize.png',
        title: 'Provide live agent with more context when switching from AI agent',
    },

]


export default async function InboxPage() {
    const liveAgentDocs = await getLiveAgentChats()

    return <div className="group  w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[200px] ">


        <div className="flex   items-center flex-col h-full p-6 gap-4   w-full">
            <h1 className="pt-4 py-2 text-lg text-center font-medium">Create a simulated live agent chat. <br />
                Request for live agent conversation from client&apos;s AI customer service agent </h1>

            <div className="pt-4 text-2xl font-medium">Check out some of the sample features</div>
            <div className="w-full flex justify-center px-6">
                <Carousel className=" w-full  max-w-xs sm:max-w-2xl md:max-w-4xl">
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

    </div>

}