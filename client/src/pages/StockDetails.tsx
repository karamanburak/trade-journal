import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import useTradeCall from "../hooks/useTradeCall";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import TradeModal from "../components/Ui/Modals/TradeModal";
import toastNotify from "../utils/toastNotify";

const StockDetails: React.FC = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const { singleStock } = useSelector((state: RootState) => state.trade);
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const { getSingleStock, postTrade } = useTradeCall();
    const [modalOpen, setModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<"BUY" | "SELL" | null>(null);

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

    const { exchange, lastPrice, marketCap, name, symbol, _id } = singleStock;

    const handleOpenModal = (type: "BUY" | "SELL") => {
        setTransactionType(type);
        setModalOpen(true);
    };

    const handleModalSubmit = (tradeDetails: { quantity: number }) => {
        const transactionTypeToUse = transactionType || "BUY";
        const payload = {
            ...tradeDetails,
            userId: currentUser?._id,
            stockId: _id,
            symbol,
            price: lastPrice,
            transactionType: transactionTypeToUse,
            status: "OPEN",
            profitOrLoss: 0,
            tradeDuration: 0,
            entryPrice: lastPrice,
            exitPrice: 0,
            transactionDate: new Date(),
        };
        console.log("Trade Payload:", payload);
        postTrade(payload);
        setModalOpen(false);
    };

    return (
        <>
            <Header />
            <div className="ml-4 text-lg font-semibold flex mt-4">
                <MdKeyboardArrowLeft className="text-3xl -mt-0.5 cursor-pointer" onClick={() => navigate(-1)} />    Back
            </div>
            <div className="p-6 max-w-5xl mx-auto rounded-xl bg-light-background3 dark:bg-dark-background3">
                <h1 className="text-4xl font-extrabold mb-6 text-center">
                    {name} ({symbol})
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-light-secondary dark:bg-dark-background2 p-6 rounded-lg shadow-lg">
                        <p className="text-sm">Last Price</p>
                        <p className="text-3xl font-bold">
                            {lastPrice}
                        </p>
                    </div>
                    <div className="bg-light-secondary dark:bg-dark-background2 p-6 rounded-lg shadow-lg">
                        <p className="text-sm">Exchange</p>
                        <p className="text-xl font-medium ">
                            {exchange}
                        </p>
                    </div>
                </div>

                <div className="bg-light-secondary dark:bg-dark-background2 p-6 rounded-lg shadow-lg mb-6">
                    <p className="text-sm">Market Cap</p>
                    <p className="text-2xl font-semibold ">
                        ${(marketCap as number).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => handleOpenModal("BUY")}
                        className="bg-dark-primary hover:bg-dark-primary/70 text-white font-semibold py-3 px-8 rounded-xl"
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => handleOpenModal("SELL")}
                        className="bg-dark-danger hover:bg-dark-danger/70 text-white  font-semibold py-3 px-8 rounded-xl"
                    >
                        Sell
                    </button>
                </div>
            </div>

            {/* Trade Modal */}
            {modalOpen && transactionType && (
                <TradeModal
                    show={modalOpen}
                    onHide={() => setModalOpen(false)}
                    tradeData={{
                        symbol,
                        price: lastPrice,
                        transactionType,
                    }}
                    onSubmit={handleModalSubmit}
                />
            )}
        </>
    );
};

export default StockDetails;
