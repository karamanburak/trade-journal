import { FiExternalLink } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";
import { formatDateWithTime } from "../../helpers/formatDate";
import { GrDocumentMissing } from "react-icons/gr";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

const TradeHistory = () => {
    const { trades, singleStock } = useSelector((state: RootState) => state.trade);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const transactionTypes = ["BUY", "SELL"];

    const filteredTrades = trades?.filter((trade: ITrade) => {
        const matchesType = selectedType ? trade.transactionType.toLowerCase() === selectedType.toLowerCase() : true;
        const matchesSearch = searchTerm
            ? trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trade.status.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesType && matchesSearch;
    });

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (

        <div className="w-full md:w-2/3 lg:w-3/4 p-6 space-y-6 ">
            <h2 className="text-2xl font-semibold mb-4">Trade History</h2>
            <div className="flex flex-row justify-between items-start md:items-center mb-6">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Symbol or status"
                    className="p-2 border rounded-md focus:outline-none dark:bg-dark-background2 ml-auto mr-5 min-w-[150px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Transaction Type Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="p-2 border rounded-md cursor-pointer bg-white dark:bg-dark-background2 min-w-[160px]"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {selectedType || "Transaction Type"}
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white dark:bg-dark-background2 border rounded-md shadow-lg z-10">
                            <div
                                className="p-2 hover:bg-light-green dark:hover:bg-daring-dark-primary cursor-pointer"
                                onClick={() => handleTypeSelect("")}
                            >
                                All Types
                            </div>
                            {transactionTypes.map((type) => (
                                <div
                                    key={type}
                                    className="p-2 hover:bg-light-green dark:hover:bg-daring-dark-primary cursor-pointer"
                                    onClick={() => handleTypeSelect(type)}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-2">
                {filteredTrades?.length || 0} trade(s) found.
            </div>
            {filteredTrades && filteredTrades.length > 0 ? (
                <div className="space-y-4 h-[calc(100vh-285px)] overflow-y-auto scrollbar">
                    {filteredTrades.map((trade: ITrade) => {
                        const { stockId } = trade || {};
                        const stockIdString = typeof stockId === 'string' ? stockId : stockId?._id;
                        return (
                            <div
                                key={trade._id}
                                className="flex justify-between items-center p-4 bg-light-secondary dark:bg-dark-background2 rounded-lg shadow-sm hover:shadow-md"
                            >
                                <div>
                                    <p><strong>Symbol:</strong> {trade.symbol}</p>
                                    <p><strong>Transaction Type:</strong> {trade.transactionType}</p>
                                    <p><strong>Quantity:</strong> {trade.quantity}</p>
                                    <p><strong>Status:</strong> {trade.status}</p>
                                </div>
                                <div className="text-right flex flex-col justify-between">
                                    <p><strong>Price:</strong> {trade.price?.toFixed(2)} €</p>
                                    <p><strong>Total Price:</strong> {((trade.price ?? 0) * trade.quantity).toFixed(2)} €</p>
                                    <p><strong>Date:</strong> {formatDateWithTime(trade.transactionDate)}</p>
                                    <FiExternalLink
                                        className="ml-auto text-xl mt-7 cursor-pointer"
                                        onClick={() => navigate(`/stocks/${stockIdString}`)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="h-[50vh] flex flex-col justify-center items-center text-lg"><GrDocumentMissing className="text-6xl" />  No trades available.</p>
            )}
        </div>
    )
};

export default TradeHistory;
