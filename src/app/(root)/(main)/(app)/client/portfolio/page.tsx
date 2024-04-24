import { getUserTotalPortfolio, getUserTotalTransaction } from "@/lib/auth/action";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import Portfolio from "./components/portfolio-copilot";
import PortfolioBody from "./components/portfolio-body";
import PortfolioCopilot from "./components/portfolio-copilot";


export default async function Page({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {


    const showCopilot = (searchParams?.copilot as string)?.toLowerCase() === 'true'

    const { userPortfolios, totalPortfolio } = await getUserTotalPortfolio()

    return <div className="relative h-full flex overflow-hidden">

        <div className=" md:hidden w-full h-full">
            <ResizablePanelGroup direction="vertical" >
                <ResizablePanel
                    minSize={30}
                >
                    <PortfolioBody

                        userPortfolios={userPortfolios}
                        totalPortfolio={totalPortfolio}
                    />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={40}
                        >
                            <PortfolioCopilot />
                        </ResizablePanel></>
                }
            </ResizablePanelGroup>

        </div>


        <div className=" hidden md:inline-flex w-full h-full  " >
            <ResizablePanelGroup direction="horizontal" >
                <ResizablePanel
                    minSize={50}
                >
                    <PortfolioBody

                        userPortfolios={userPortfolios}
                        totalPortfolio={totalPortfolio}
                    />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={20}
                        >  <PortfolioCopilot /></ResizablePanel></>
                }
            </ResizablePanelGroup>
        </div>

    </div>

}