import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { IUserTransaction } from "@/types"
import ToggleCopilot from "./toggle-copilot"

export default function TransactionTable({ userTransactions }: {
    userTransactions: IUserTransaction[]
}) {
    return (
        <Card>
            <CardHeader className="px-7 flex w-full  ">
                <div className="flex justify-between w-full">
                    <div className="">
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Recent transactions from your account</CardDescription>
                    </div>
                    <ToggleCopilot showText={true} />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Merchant</TableHead>
                            <TableHead className="hidden @4xl/transaction:table-cell">Type</TableHead>
                            <TableHead className="hidden @2xl/transaction:table-cell text-start">Status</TableHead>
                            <TableHead className="hidden @4xl/transaction:table-cell text-start">Card</TableHead>
                            <TableHead className="hidden @4xl/transaction:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            userTransactions.map((transaction, index) => {
                                return (
                                    <TableRow key={index} className="">
                                        <TableCell>
                                            <div className="font-medium">{transaction.merchant}</div>
                                        </TableCell>
                                        <TableCell className="hidden @4xl/transaction:table-cell">{transaction.type}</TableCell>
                                        <TableCell className="hidden @2xl/transaction:table-cell">
                                            <div className="flex justify-start items-center gap-1">
                                                <div className={cn('px-2 py-1 rounded-2xl text-xs text-center bg-accent w-fit ',
                                                    transaction.status === 'paid' && 'bg-green-500 text-white hover:bg-green-500/80',
                                                    transaction.status === 'credit' && 'bg-blue-500 text-white hover:bg-blue-500/80',
                                                    transaction.status === 'possible-fraud' && 'bg-red-500 text-xs  w-fit text-white hover:bg-red-500/80',
                                                )}
                                                >
                                                    {transaction.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </div>
                                                {
                                                    transaction.status === 'possible-fraud' && (
                                                        <ToggleCopilot />
                                                    )
                                                }

                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden @4xl/transaction:table-cell text-start">{transaction.cardLast4}</TableCell>
                                        <TableCell className="hidden @4xl/transaction:table-cell">
                                            <div>
                                                {transaction.when?.toDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-semibold">
                                                {transaction.amount} {transaction.currency}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
