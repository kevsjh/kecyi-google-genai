import { getUseAdminKnowledge } from "@/lib/auth/admin-action";
import { AddContentDialog } from "./components/add-content-dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilePdf, LinkSimple } from "@phosphor-icons/react/dist/ssr";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import KnowledgeHubBody from "./components/knowledge-hub-body";
import LiveAgentCopilotUI from "../inbox/components/live-agent-copilot";


export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const showCopilot = (searchParams?.copilot as string)?.toLowerCase() === 'true'
    const { contents } = await getUseAdminKnowledge()

    return <div className="relative h-full flex overflow-hidden">



        <div className=" md:hidden w-full h-full">
            <ResizablePanelGroup direction="vertical" >
                <ResizablePanel
                    minSize={30}
                >
                    <KnowledgeHubBody contents={contents} />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={40}
                        >
                            <LiveAgentCopilotUI />
                        </ResizablePanel></>
                }
            </ResizablePanelGroup>

        </div>
        <div className=" hidden absolute md:inline-flex w-full h-full  " >
            <ResizablePanelGroup direction="horizontal" >
                <ResizablePanel
                    minSize={35}
                >
                    <KnowledgeHubBody contents={contents} />
                </ResizablePanel>
                {
                    showCopilot && <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={20}
                        >  <LiveAgentCopilotUI />
                        </ResizablePanel></>
                }
            </ResizablePanelGroup>
        </div>



    </div>
}