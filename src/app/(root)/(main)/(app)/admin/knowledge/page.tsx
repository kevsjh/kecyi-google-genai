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


export default async function Page() {

    const { contents } = await getUseAdminKnowledge()

    return <div className="flex  flex-col h-full p-6  gap-6  w-full">
        <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Knowledge Hub</h1>
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
                                    <Link href={`/admin/knowledge/${content.id}`}>
                                        {content.userFilename}
                                    </Link>
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