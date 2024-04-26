
import { ExternalLink } from "@/components/external-link";
import AccessPortalButton from "../_components/access-portal";
import { Badge } from "@/components/ui/badge";
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


export default function Home() {
  return (
    <main className=" flex w-full h-full  bg-black flex-col items-center justify-between ">
      <div className=" bg-cover bg-blend-overlay bg-[url('/assets/hero.png')]   min-h-screen flex w-full h-full  items-center flex-col gap-8 ">
        <div className="pt-36 space-y-4 px-4 sm:px-12 text-white drop-shadow-2xl max-w-screen-xl w-full">

          <Badge className="text-sm">Submission by team kecyi</Badge>
          <h1 className=" bg-black/10 w-fit p-4 rounded-2xl tracking-wide  text-4xl md:text-5xl  lg:text-6xl font-bold text-white drop-shadow-2xl">
            Next Gen AI Customer Service<br /> and Agent Based Assistant for <br />Banking & Financial Services
          </h1>
          <p className="drop-shadow-2xl font-medium">This prototype project is built for Google Cloud GenAI Hackathon | APAC</p>
          <div className="drop-shadow-md" >
            Made with ❤️ by <ExternalLink
              href="https://twitter.com/kevinsmjh"
            ><span className="font-semibold">kevinsmjh</span></ExternalLink>

          </div>
          <div className="drop-shadow-md" >
            Built with {' '}   <ExternalLink
              href="https://cloud.google.com/?hl=en"> <span className="font-medium">
                Google Cloud</span>  </ExternalLink>

          </div>

          <div className="w-fit">
            <AccessPortalButton />
          </div>


          <div className="pb-8 pt-14 flex flex-col items-center w-full">
            <div className="flex items-center flex-col  p-6 rounded-2xl shadow-md bg-black/20">
              <p className="text-xl sm:text-3xl py-2  font-semibold text-center drop-shadow-xl">
                Elevate beyond traditional chatbot and conversations
              </p>

              <Carousel className=" w-full   max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
                <CarouselContent>
                  {
                    features.map((feature, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1 flex  flex-col  gap-2 items-center justify-center">
                          <p className="text-center font-medium text-lg md:text-2xl">  {
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


      </div>


    </main >
  );
}
