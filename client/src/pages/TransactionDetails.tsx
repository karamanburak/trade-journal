import React, { useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useParams, useNavigate } from "react-router-dom";
import useTradeCall from "../hooks/useTradeCall";
import Header from "../components/Header/Header";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { MdKeyboardArrowLeft } from "react-icons/md";
import Notes from "../components/Transaction/Notes";

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

    // console.log(singleTrade);

    const {
        symbol,
        transactionType,
        quantity,
        price,
        entryPrice,
        exitPrice,
        profitOrLoss,
        tradeDuration,
        notes = []
    } = singleTrade;

    const tradeDetails = [
        { label: "Transaction Type", value: transactionType },
        { label: "Stock Symbol", value: symbol },
        { label: "Quantity", value: quantity },
        { label: "Total Cost", value: (quantity * (price || 0)).toFixed(2) },
        { label: "Entry Price", value: entryPrice?.toFixed(2) },
        { label: "Profit/Loss", value: `${profitOrLoss.toFixed(2)} (${profitOrLoss >= 0 ? 'Profit' : 'Loss'})` },
        { label: "Exit Price", value: exitPrice?.toFixed(2) },
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

                <div className="w-[80px] text-lg font-semibold flex cursor-pointer mb-4" onClick={() => navigate("/")} >
                    <MdKeyboardArrowLeft className="text-3xl -mt-0.5" />  Back
                </div>
                <div className="w-full mx-auto dark:bg-dark-background rounded-lg p-8">
                    <div className="w-full md:max-h-[220px] md:flex p-6  bg-light-background2/20 dark:bg-dark-background2 rounded-md mb-4">
                        <div className="md:w-1/2">

                            {/* Trade Information Table */}
                            <div className="mt-6">
                                <div className="md:grid grid-cols-2 gap-2">
                                    {tradeDetails.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <span className="font-medium text-lg">{item.label}:</span>
                                            <span className="ml-3 text-lg ">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 overflow-y-auto scrollbar h-[190px] my-6 md:m-0">
                            <Notes notes={notes} tradeId={tradeId || ""} />
                        </div>

                    </div>
                    <div className="sm:flex justify-center items-center w-full">
                        {/* Price Comparison Chart */}
                        <div className="mt-8 md:w-1/2">
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
                        <div className="mt-8 md:w-1/2">
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