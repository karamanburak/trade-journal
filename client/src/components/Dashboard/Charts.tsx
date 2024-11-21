import React from "react";
import { AreaChart } from "@tremor/react";

interface ChartProps {
    account?: IAccount;
}
const generateDateRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

export const Charts = ({ account }: ChartProps) => {
    if (!account) {
        return <div>No account data available</div>;
    }

    const { createdAt, updatedAt, totalValue, avarageProfit, avarageLoss } = account;

    const dateRange = generateDateRange(new Date(createdAt ?? Date.now()), new Date(updatedAt ?? Date.now()));

    const chartData = dateRange.map((date, index) => ({
        date,
        totalValue: totalValue || 0,
        averageProfit: avarageProfit || 0,
        averageLoss: avarageLoss || 0,
    }));

    return (
        <div className="flex flex-col lg:flex-row gap-10 mt-10 px-12 dark:bg-dark-background3 p-2 rounded-lg">
            <div className="flex-1">
                <AreaChart
                    className="h-80"
                    data={chartData}
                    index="date"
                    categories={["totalValue"]}
                    valueFormatter={(number) =>
                        `${Intl.NumberFormat("us").format(number)}€`
                    }
                />
            </div>

            <div className="flex-1">
                <AreaChart
                    className="h-80"
                    data={chartData}
                    index="date"
                    categories={["averageLoss", "averageProfit"]}
                // valueFormatter={(number) =>
                //     `${Intl.NumberFormat("us").format(number)}€`
                // }
                />
            </div>
        </div>
    );
};

export default Charts;
