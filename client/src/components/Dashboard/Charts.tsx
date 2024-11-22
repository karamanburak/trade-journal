import React, { useState, useEffect } from "react";
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
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (account) {
            const { createdAt, updatedAt, totalValue, avarageProfit, avarageLoss } = account;
            const dateRange = generateDateRange(new Date(createdAt ?? Date.now()), new Date(updatedAt ?? Date.now()));

            const newChartData = dateRange.map((date) => ({
                date,
                totalValue: totalValue || 0,
                averageProfit: avarageProfit || 0,
                averageLoss: avarageLoss || 0,
            }));

            setChartData(newChartData);
        }
    }, [account]);

    if (!account) {
        return <div>No account data available</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10 mt-10 px-12 dark:bg-dark-background3 p-2 rounded-lg">
            <div className="flex-1">
                <AreaChart
                    className="h-80 max-w-[700px]"
                    data={chartData}
                    index="date"
                    categories={["Total Value"]}
                    valueFormatter={(number) =>
                        `${Intl.NumberFormat("us").format(number)}€`
                    }
                />
            </div>
            <div className="border"></div>

            <div className="flex-1">
                <AreaChart
                    className="h-80 max-w-[700px]"
                    data={chartData}
                    index="date"
                    categories={["Average Loss", "Average Profit"]}
                    valueFormatter={(number) =>
                        `${Intl.NumberFormat("us").format(number)}€`
                    }
                />
            </div>
        </div>
    );
};

export default Charts;
