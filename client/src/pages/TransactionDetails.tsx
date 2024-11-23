import React, { useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useParams, useNavigate } from "react-router-dom";
import useTradeCall from "../hooks/useTradeCall";
import Header from "../components/Header/Header";
import MenuButton from "../components/Ui/Buttons/MenuButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const TransactionDetails = () => {
    const { singleTrade } = useSelector((state: RootState) => state.trade);
    const { getSingleTrade } = useTradeCall();
    const navigate = useNavigate();

    const { tradeId } = useParams<{ tradeId?: string }>();

    useEffect(() => {
        if (tradeId) {
            getSingleTrade(tradeId);
        }
    }, [tradeId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!singleTrade) {
        return (
            <div className="flex h-screen justify-center items-center text-xl">
                Loading... <ImSpinner9 className="animate-spin ml-3 h-8 w-8 text-dark-primary" />
            </div>
        );
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
    } = singleTrade;

    const items = [
        { label: "Transaction Type", value: transactionType },
        { label: "Symbol", value: symbol },
        { label: "Price", value: price?.toFixed(2) },
        { label: "Quantity", value: quantity },
        { label: "Total Price", value: (quantity * (price || 0)).toFixed(2) },
        { label: "Profit/Loss", value: profitOrLoss.toFixed(2) },
        { label: "Duration", value: `${tradeDuration.toFixed(2)} / in minutes` },
    ];

    // Price comparison data for bar chart
    const priceData = [
        { name: 'Entry Price', value: entryPrice },
        { name: 'Exit Price', value: exitPrice },
        { name: 'Current Price', value: price },
    ];

    // Trade metrics data for line chart
    const tradeMetrics = [
        { name: 'Trade Details', quantity, totalValue: quantity * (price || 0), profitLoss: profitOrLoss }
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen py-8 px-4 bg-light-background dark:bg-dark-background">
                <div className="w-full mx-auto bg-white dark:bg-dark-background rounded-lg p-8">
                    <div className=" w-[50vw] p-6 shadow-lg dark:bg-dark-background2 rounded-md">
                        <div>
                            <MenuButton
                                onClick={() => navigate(-1)}
                                className="bg-dark-danger text-white px-6 py-2 ml-auto rounded hover:bg-dark-danger/70 transition-colors"
                            >
                                Back to Trades
                            </MenuButton>
                        </div>

                        {/* Trade Information Table */}
                        <div className="mt-6">
                            <div className="grid grid-cols-2 gap-6">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="font-medium text-lg">{item.label}:</span>
                                        <span className="ml-3 text-lg ">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        {/* Price Comparison Chart */}
                        <div className="mt-8 w-1/2">
                            <h2 className="text-xl font-semibold text-dark-primary dark:text-white mb-4">Price Comparison</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>


                        {/* Trade Metrics Chart */}
                        <div className="mt-8 w-1/2">
                            <h2 className="text-xl font-semibold text-dark-primary dark:text-white mb-4">Trade Metrics</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={tradeMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Quantity" />
                                        <Line type="monotone" dataKey="totalValue" stroke="#82ca9d" name="Total Value" />
                                        <Line type="monotone" dataKey="profitLoss" stroke="#ffc658" name="Profit/Loss" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>


                </div>
            </div>

        </>
    );
};

export default TransactionDetails;