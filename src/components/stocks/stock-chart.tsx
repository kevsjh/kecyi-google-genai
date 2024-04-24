'use client'

import { StockGraphData } from "@/types";
import { AreaChart, CustomTooltipProps } from "@tremor/react";

export function StockChart({ data,

    index,
    category }: {
        data: StockGraphData[],
        category: string,
        index: string

    }) {


    return (
        <AreaChart
            className="h-80 "
            data={data}
            index={index}
            categories={[category]}

            colors={['green',]}
            // valueFormatter={dataFormatter}
            yAxisWidth={60}
            showLegend={false}
            showGradient={false}
            allowDecimals={true}
            showXAxis={false}
            showYAxis={false}
            showAnimation={false}
            showGridLines={false}
            autoMinValue={true}
            intervalType={'preserveStartEnd'}
        // customTooltip={customTooltip}


        />
    );
}