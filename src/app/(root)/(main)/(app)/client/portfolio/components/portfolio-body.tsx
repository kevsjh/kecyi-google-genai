import { IUserStockPortfolio, } from "@/types";

import PortfolioTable from "./portfolio-table";

export default function PortfolioBody({

    userPortfolios,
    totalPortfolio
}: {
    userPortfolios: IUserStockPortfolio[];
    totalPortfolio: number
}) {
    return <div
        className="w-full overflow-auto h-full  flex flex-col items-center @container/transaction ">
        <div className="w-full p-4 space-y-5 max-w-screen-2xl" >
            <h1 className="text-3xl font-semibold">Portfolio</h1>

            <PortfolioTable userPortfolios={userPortfolios} totalPortfolio={totalPortfolio} />
        </div>
    </div>
}