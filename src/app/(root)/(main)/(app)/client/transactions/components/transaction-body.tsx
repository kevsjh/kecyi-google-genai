import { IUserTransaction } from "@/types";
import ThisMonthTotalUsage from "./this-month-usage";
import TotalBalance from "./total-balance";
import TransactionTable from "./transaction-table";

export default function TransactionBody({
    userTotalBalance,
    totalUsage,
    userTransactions,
}: {
    userTotalBalance: number;
    totalUsage: number;
    userTransactions: IUserTransaction[];
}) {
    return <div
        className="w-full overflow-auto h-full  flex flex-col items-center @container/transaction ">
        <div className="w-full p-4 space-y-5 max-w-screen-2xl" >
            <h1 className="text-3xl font-semibold">Transactions</h1>
            <div className="grid gap-6 sm:grid-cols-2">
                <TotalBalance totalBalance={userTotalBalance} />
                <ThisMonthTotalUsage
                    totalBalance={userTotalBalance}
                    totalUsage={totalUsage}
                />
            </div>
            <TransactionTable userTransactions={userTransactions} />
        </div>
    </div>
}