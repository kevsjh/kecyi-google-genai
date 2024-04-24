import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ThisMonthTotalUsage({ totalBalance, totalUsage }: { totalUsage: number, totalBalance: number }) {


    return (
        <Card>
            <CardHeader className="">
                <CardTitle>Transaction Usage</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Your total transaction usage
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-base text-muted-foreground">
                    {Math.ceil((totalUsage / totalBalance) * 100)}% used from total balance
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={Math.ceil((totalUsage / totalBalance) * 100)} aria-label={`${Math.ceil((totalUsage / totalBalance) * 100)} used`} />
            </CardFooter>
        </Card>
    )

    return (
        <Card className="h-full">
            <CardHeader className="">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    +10% from last month
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={12} aria-label="12% increase" />
            </CardFooter>
        </Card>
    )
}
