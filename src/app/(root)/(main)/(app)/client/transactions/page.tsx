import { getUserTotalTransaction } from "@/lib/auth/action";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import TransactionBody from "./components/transaction-body";
import TransactionCopilot from "./components/transaction-copilot";


export default async function Page({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {


    const showCopilot = (searchParams?.copilot as string)?.toLowerCase() === 'true'


    const { userTotalBalance,
        userTransactions,
        totalUsage
    } = await getUserTotalTransaction()

    return <div className="relative h-full flex overflow-hidden">

        <div className=" md:hidden w-full h-full">
            <ResizablePanelGroup direction="vertical" >
                <ResizablePanel
                    minSize={30}
                >
                    <TransactionBody
                        totalUsage={totalUsage}
                        userTotalBalance={userTotalBalance}
                        userTransactions={userTransactions}
                    />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={40}
                        >
                            <TransactionCopilot />
                        </ResizablePanel></>
                }
            </ResizablePanelGroup>

        </div>


        <div className=" hidden md:inline-flex w-full h-full  " >
            <ResizablePanelGroup direction="horizontal" >
                <ResizablePanel
                    minSize={50}
                >
                    <TransactionBody
                        totalUsage={totalUsage}
                        userTotalBalance={userTotalBalance}
                        userTransactions={userTransactions}
                    />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={20}
                        >  <TransactionCopilot /></ResizablePanel></>
                }
            </ResizablePanelGroup>
        </div>

    </div>

}