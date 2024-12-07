import React, { useEffect } from "react"
import { ImSpinner9 } from "react-icons/im"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { useParams, useNavigate } from "react-router-dom"
import useTradeCall from "../hooks/useTradeCall"
import Header from "../components/Header/Header"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts"
import { MdKeyboardArrowLeft, MdEuro, MdTimeline, MdTrendingUp } from "react-icons/md"
import Notes from "../components/Transaction/Notes"

const TransactionDetails = () => {
    const { singleTrade } = useSelector((state: RootState) => state.trade)
    const { getSingleTrade } = useTradeCall()
    const navigate = useNavigate()

    const { tradeId } = useParams<{ tradeId?: string }>()

    useEffect(() => {
        if (tradeId) {
            getSingleTrade(tradeId)
        }
    }, [tradeId])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!singleTrade) {
        return (
            <div className="flex h-screen justify-center items-center text-xl bg-gray-100 dark:bg-gray-900">
                <div className="flex items-center">
                    <span className="mr-4">Loading Trade Details</span>
                    <ImSpinner9 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            </div>
        )
    }

    const {
        symbol,
        transactionType,
        quantity,
        price,
        entryPrice,
        exitPrice,
        profitOrLoss,
        tradeDuration,
        notes = [],
    } = singleTrade

    const tradeDetails = [
        { label: "Transaction Type", value: transactionType, icon: <MdTrendingUp /> },
        { label: "Stock Symbol", value: symbol, icon: <MdEuro /> },
        { label: "Quantity", value: quantity, icon: <MdTimeline /> },
        { label: "Total Cost", value: (quantity * (price || 0)).toFixed(2), icon: <MdEuro /> },
        { label: "Entry Price", value: entryPrice?.toFixed(2), icon: <MdTimeline /> },
        {
            label: "Profit/Loss",
            value: `${profitOrLoss.toFixed(2)} (${profitOrLoss >= 0 ? "Profit" : "Loss"})`,
            icon: <MdEuro />,
            className: profitOrLoss >= 0 ? "text-green-600" : "text-red-600",
        },
        { label: "Exit Price", value: exitPrice?.toFixed(2), icon: <MdTimeline /> },
        { label: "Duration", value: `${tradeDuration.toFixed(2)} minutes`, icon: <MdTimeline /> },
    ]

    // Price comparison data for bar chart
    const priceData = [
        { name: "Entry Price", value: entryPrice },
        { name: "Exit Price", value: exitPrice },
        { name: "Current Price", value: price },
    ]

    // Trade metrics data for line chart
    const tradeMetrics = [
        {
            name: "Trade Details",
            quantity,
            totalValue: quantity * (price || 0),
            profitLoss: profitOrLoss,
        },
    ]

    return (
        <div className="bg-light-background dark:bg-dark-background2">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button onClick={() => navigate("/?tab=transactions")} className="flex items-center mb-6">
                    <MdKeyboardArrowLeft className="text-2xl mr-2" />
                    <span className="font-medium">Back to Transactions</span>
                </button>

                <div className=" bg-light-background dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
                    <div className="grid md:grid-cols-2 gap-6 p-6 border-b">
                        <div className="space-y-4">
                            <h2 className=" text-xl font-semibold mb-4 flex items-center">
                                <MdEuro className="mr-2 text-dark-primary" />
                                Trade Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {tradeDetails.map((item, index) => (
                                    <div key={index} className="p-4 rounded-lg shadow-sm border border-light-border dark:border-dark-border flex items-center">
                                        <div className=" mr-4 text-dark-primary">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-light-text dark:text-light-textSecondary mb-1">
                                                {item.label}
                                            </p>
                                            <p className={`font-semibold  ${item.className || ""}`} >
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className=" max-h-[420px] overflow-y-auto scrollbar border-t md:border-t-0 md:border-l border-light-border dark:border-dark-border pl-0 md:pl-6 pt-6 md:pt-0">
                            <Notes notes={notes} tradeId={tradeId || ""} />
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <MdTimeline className="mr-2 text-dark-primary" />
                                Price Comparison
                            </h2>
                            <div className="rounded-lg shadow-sm border border-light-border dark:border-dark-border p-4">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={priceData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Trade Metrics Chart */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <MdTrendingUp className="mr-2 text-dark-primary" />
                                Trade Metrics
                            </h2>
                            <div className="rounded-lg shadow-sm border-light-border dark:border-dark-border p-4">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={tradeMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="quantity" stroke="#3b82f6" name="Quantity" />
                                        <Line type="monotone" dataKey="totalValue" stroke="#10b981" name="Total Value" />
                                        <Line type="monotone" dataKey="profitLoss" stroke="#f43f5e" name="Profit/Loss" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionDetails
