


import { ExternalLink } from "@/components/external-link";
import AccessPortalButton from "../_components/access-portal";
import { Badge } from "@/components/ui/badge";


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


          <div className="pt-24 flex flex-col items-center w-full">
            <div className="p-6 rounded-2xl shadow-md bg-black/20">
              <p className="text-3xl font-semibold text-center drop-shadow-xl">
                Elevate beyond traditional chatbot and conversations
              </p>
            </div>


          </div>
        </div>


      </div>


    </main >
  );
}
