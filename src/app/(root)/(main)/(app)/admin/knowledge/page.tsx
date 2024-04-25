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


export default async function Page() {

    const { contents } = await getUseAdminKnowledge()
    console.log('content', contents)

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
                                <TableCell>{content.userFilename}</TableCell>
                                <TableCell>
                                    {
                                        content.type &&
                                        <Badge>
                                            {
                                                content?.type?.charAt(0)?.toUpperCase() + content?.type?.slice(1)
                                            }
                                        </Badge>
                                    }
                                </TableCell>
                                {/* <TableCell>{content.uid}</TableCell> */}
                                <TableCell className="text-right">{content.createdAt.toDateString()}</TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>

    </div>
}