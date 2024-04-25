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
import { IUserStockPortfolio, IUserTransaction } from "@/types"
import ToggleCopilot from "./toggle-copilot"
import PortfolioCopilot from "./portfolio-copilot"

export default function PortfolioTable({ userPortfolios, totalPortfolio }: {
    userPortfolios: IUserStockPortfolio[]
    totalPortfolio: number
}) {



    return (
        <Card>
            <CardHeader className="px-7 flex w-full  ">
                <div className="flex justify-between w-full">
                    <div className="">
                        <CardTitle>Total Portfolio</CardTitle>
                        <CardDescription className="text-lg text-primary font-medium">${totalPortfolio} SGD</CardDescription>
                        <CardDescription>Stock portfolio you own</CardDescription>
                    </div>
                    <ToggleCopilot showText={true} />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>

                            <TableHead className="hidden @2xl/transaction:table-cell text-start">Stock Price</TableHead>

                            <TableHead className="hidden @2xl/transaction:table-cell">Total Shares</TableHead>
                            <TableHead className="hidden @4xl/transaction:table-cell">Last Purchase</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            userPortfolios.map((portfolio, index) => {
                                return (
                                    <TableRow key={index} className="">
                                        <TableCell>
                                            <div className="font-medium">{portfolio.symbol}</div>
                                        </TableCell>
                                        <TableCell className="hidden @2xl/transaction:table-cell">${portfolio.price} USD</TableCell>

                                        <TableCell className="hidden @2xl/transaction:table-cell text-start">{portfolio.numberOfShares}</TableCell>
                                        <TableCell className="hidden @4xl/transaction:table-cell text-start">{portfolio.createdAt.toDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-semibold">
                                                ${portfolio.amount} SGD
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        {
                            (userPortfolios === undefined || userPortfolios?.length === 0) &&
                            <TableRow>
                                <TableCell colSpan={5} className="text-center ">
                                    <div className="w-full flex flex-col items-center">
                                        No stocks found.
                                        <div className="flex gap-2 items-center">Start purchasing stocks with copilot <ToggleCopilot /></div>
                                    </div>
                                </TableCell>
                            </TableRow>

                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
