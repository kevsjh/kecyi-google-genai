import { getAuthByCookie } from "@/lib/auth/action"
import { redirect } from "next/navigation"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AgentChatTypeEnum } from "@/constant/enum"
import Link from "next/link"


const clientFeatures = [

    {
        src: '/assets/features/edit/navigate-live-agent.png',
        title: 'Navigate from AI agent to live agent',
    },
    {
        src: '/assets/features/edit/live-agent-simulate.png',
        title: 'Simulate real time conversation with live agent',
    },
]



export default async function Page() {
    const session = await getAuthByCookie()
    if (!session?.user) {
        redirect(`/?signin=true`)
    }


    return <div className="flex  flex-col h-full p-6   w-full">

        <h1 className="py-2 text-lg font-medium">Create a simulated live agent chat by telling the AI customer service agent to transfer you to live agent</h1>
        <div className="grid grid-cols-1  sm:grid-cols-1  gap-6">

            <Card className="">
                <CardHeader className="pb-3 ">
                    <CardTitle>Customer Service AI Agent</CardTitle>
                    <CardDescription className="leading-relaxed">
                        This agent is designed to help you with customer service related queries. It has access to knowledge hub and a variety of tools to help you with your queries.
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


        </div>
        <div className="pt-12 text-2xl text-center  font-medium">Check out some of the sample features</div>
        <div className="pb-12 w-full flex justify-center px-6">
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