import { IContentData } from "@/types";
import { getUseAdminKnowledge } from "@/lib/auth/admin-action";
import { AddContentDialog } from "./add-content-dialog";
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




export default function KnowledgeHubBody({ contents }: { contents: IContentData[] }) {
    return <div className="relative flex  flex-col h-full p-6  gap-6  w-full">

        <div className="absolute top-2  w-full flex justify-center items-start">
            <Link className="z-10" href={`/admin/knowledge?copilot=true`}><Badge>
                Access Copilot
            </Badge>
            </Link>
        </div>
        <div className="flex items-center justify-between"><h1 className="text-lg md:text-3xl font-semibold">Knowledge Hub</h1>
            <AddContentDialog />

        </div>
        <Table>

            <TableHeader>
                <TableRow>
                    <TableHead className="">Title</TableHead>
                    <TableHead>File Type</TableHead>
                    {/* <TableHead>Method</TableHead> */}
                    <TableHead className="text-right">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    contents.map(content => {
                        return (
                            <TableRow key={content.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {
                                            content.type === 'web' && <Link
                                                target="_blank"
                                                href={`${content.userFilename}`}
                                            >
                                                <LinkSimple size={20} />
                                            </Link>
                                        }
                                        <Link
                                            href={`/admin/knowledge/${content.id}`}>
                                            {content.userFilename}
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {
                                        content.type &&
                                        <Badge>
                                            <Link href={`/admin/knowledge/${content.id}`}>
                                                {
                                                    content?.type?.charAt(0)?.toUpperCase() + content?.type?.slice(1)
                                                }
                                            </Link>
                                        </Badge>
                                    }
                                </TableCell>
                                {/* <TableCell>{content.uid}</TableCell> */}
                                <TableCell className="text-right">
                                    <Link href={`/admin/knowledge/${content.id}`}>
                                        {content.createdAt.toDateString()}
                                    </Link>

                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>

    </div>
}