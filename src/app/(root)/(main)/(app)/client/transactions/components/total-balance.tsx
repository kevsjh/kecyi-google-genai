import { getUserTotalBalance } from "@/lib/auth/action";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function TotalBalance({ totalBalance }: { totalBalance: number }) {


    return (
        <Card >
            <CardHeader className="">
                <CardTitle>Total Balance</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Your total balance in your bank account
                </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>
                <p className="font-semibold text-3xl">$ {totalBalance} SGD</p>
            </CardFooter>
        </Card>
    )
}



export async function TotalBalancee() {

    const totalBankBalance = await getUserTotalBalance()

    return (
        <div>
            <h2 className="text-lg">Total Balance</h2>
            <p className="font-medium text-2xl">$ {totalBankBalance} SGD</p>
        </div>
    )



}