import React, { useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useParams, useNavigate } from "react-router-dom";
import useTradeCall from "../hooks/useTradeCall";
import Header from "../components/Header/Header";
import MenuButton from "../components/Ui/Buttons/MenuButton";
import Charts from "../components/Dashboard/Charts";

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
        profitOrLoss,
        tradeDuration,
    } = singleTrade;

    const items = [
        { label: "Transaction Type", value: transactionType },
        { label: "Symbol", value: symbol },
        { label: "Quantity", value: quantity },
        { label: "Price", value: price },
        { label: "Profit/Loss", value: profitOrLoss.toFixed(2) },
        { label: "Duration", value: tradeDuration },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto bg-light-background2 dark:bg-dark-background2 rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold mx-auto">Trade Details</h1>
                    </div>
                    <MenuButton
                        onClick={() => navigate(-1)}
                        className="bg-dark-danger text-white px-6 py-2 ml-auto rounded hover:bg-dark-danger/70"
                    >
                        Back to Trades
                    </MenuButton>

                    <div>
                        {items.map((item, index) => (
                            <p key={index} className="text-lg mb-2">
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        ))}
                    </div>

                    <Charts account={singleTrade} />

                    <div className="mt-8 text-center">

                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionDetails;
