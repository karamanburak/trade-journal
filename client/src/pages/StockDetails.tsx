import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaInfoCircle } from "react-icons/fa";
import { MdOutlineTrendingUp, MdTrendingDown, } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import useTradeCall from "../hooks/useTradeCall";
import TradeModal from "../components/Ui/Modals/TradeModal";
import Header from "../components/Header/Header";

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
            <div className="flex h-screen justify-center items-center">
                <div className="text-center">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Loading stock details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const { exchange, lastPrice, marketCap, name, symbol, _id } = singleStock;

    const handleOpenModal = (type: "BUY" | "SELL") => {
        setTransactionType(type);
        setModalOpen(true);
    };

    const handleModalSubmit = (tradeDetails: { quantity: number, price: number }) => {
        const transactionTypeToUse = transactionType || "BUY";
        const payload = {
            ...tradeDetails,
            userId: currentUser?._id,
            stockId: _id,
            symbol,
            price: tradeDetails.price,
            transactionType: transactionTypeToUse,
            status: "OPEN",
            profitOrLoss: 0,
            tradeDuration: 0,
            entryPrice: tradeDetails.price,
            exitPrice: 0,
            transactionDate: new Date(),
        };
        postTrade(payload);
        setModalOpen(false);
    };

    return (
        <>
            <Header />
            <div className=" py-8" >
                <div className="container mx-auto px-4">
                    {/* Navigation */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center mb-6"
                    >
                        <FaChevronLeft className="mr-2" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    {/* Stock Header */}
                    <div className=" rounded-2xl bg-light-background2 shadow-md dark:bg-dark-background2 p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">{name}</h1>
                                <p className="text-xl">{symbol}</p>
                            </div>
                            <div className=" rounded-xl px-4 py-2">
                                <p className="text-sm ">{exchange}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Last Price */}
                        <div className=" rounded-2xl bg-light-background2 shadow-md dark:bg-dark-background2 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium">Last Price</h3>
                                {lastPrice > 0 ? <MdOutlineTrendingUp className="text-green-500" /> : <MdTrendingDown className="text-red-500" />}
                            </div>
                            <p className="text-3xl font-bold">{lastPrice.toFixed(2)} €</p>
                        </div>

                        {/* Market Cap */}
                        <div className="bg-light-background2 shadow-md dark:bg-dark-background2 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium">Market Cap</h3>
                                <FaInfoCircle size={20} />
                            </div>
                            <p className="text-2xl font-bold">
                                {(marketCap as number).toLocaleString()} €
                            </p>
                        </div>

                        {/* Additional Placeholder for Future Metric */}
                        <div className="bg-light-background2 shadow-md dark:bg-dark-background2 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium">52-Week Range</h3>
                                <FaInfoCircle size={20} />
                            </div>
                            <p className="text-2xl font-bold">
                                XXX - $XXX €
                            </p>
                        </div>
                    </div>

                    {/* Trade Actions */}
                    <div className="flex justify-center space-x-6">
                        <button
                            onClick={() => handleOpenModal("BUY")}
                            className="w-40 py-4 bg-dark-primary hover:bg-dark-primary/80 text-white font-semibold rounded-xl shadow-lg"
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => handleOpenModal("SELL")}
                            className="w-40 py-4 bg-dark-danger hover:bg-dark-danger/80 text-white font-semibold rounded-xl shadow-lg"
                        >
                            Sell
                        </button>
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
                </div >
            </div >
        </>

    );
};

export default StockDetails;