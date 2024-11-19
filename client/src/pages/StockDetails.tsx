import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import useTradeCall from "../hooks/useTradeCall";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const StockDetails: React.FC = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const { singleStock } = useSelector((state: RootState) => state.trade);
    const { getSingleStock } = useTradeCall();

    useEffect(() => {
        if (stockId) {
            getSingleStock(stockId);
        }
    }, [stockId]);

    if (!singleStock) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading stock details...
            </div>
        );
    }
    const { exchange, lastPrice, marketCap, name, symbol } = singleStock;

    return (
        <>
            <Header />
            <div className="p-6 max-w-5xl mx-auto rounded-xl mt-8 bg-light-background3 dark:bg-dark-background3">
                <h1 className="text-4xl font-extrabold mb-6 text-center">{name} ({symbol})</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <p className="text-sm">Last Price</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            {lastPrice}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <p className="text-sm">Exchange</p>
                        <p className="text-xl font-medium text-gray-800 dark:text-gray-100">
                            {exchange}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <p className="text-sm">Market Cap</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        ${(marketCap as number).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        // onClick={handleBuy}
                        className="bg-dark-success/80 hover:bg-dark-success/90 text-white font-semibold py-3 px-8 rounded-xl"
                    >
                        Buy
                    </button>
                    <button
                        // onClick={handleSell}
                        className="bg-dark-danger/80 hover:bg-dark-danger/90 text-white  font-semibold py-3 px-8 rounded-xl"
                    >
                        Sell
                    </button>
                </div>
            </div>
        </>
    );
};

export default StockDetails;
