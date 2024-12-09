import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiFilter, FiChevronDown, FiExternalLink } from "react-icons/fi";
import { GrDocument } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";

const TransactionsHistory: React.FC = () => {
    const { trades } = useSelector((state: RootState) => state.trade);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const filterRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!trades) {
        return (
            <div className="flex h-screen justify-center items-center">
                <div className="animate-pulse">
                    <div className="w-16 h-16  rounded-full mb-4"></div>
                    <p>Loading trades...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 ">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                {/* Search Input */}
                <div className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search trades"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-light-background dark:bg-dark-background2
                            border border-light-border dark:border-dark-border outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Filter Dropdown */}
                <div className="relative w-full md:max-w-xs" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between  px-4 py-2.5 rounded-xl bg-light-background dark:bg-dark-background2 border border-light-border dark:border-dark-border outline-none hover:bg-light-background2/30 dark:hover:bg-dark-border/30">
                        <span className="flex items-center gap-2">
                            <FiFilter className="text-gray-500" />
                            {selectedType || "Filter Transactions"}
                        </span>
                        <FiChevronDown className={`transform transition-transform duration-300 
                            ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute z-10 mt-2 w-full bg-light-background dark:bg-dark-background2 rounded-xl shadow-lg border border-light-border dark:border-dark-border overflow-hidden animate-dropdown-enter">
                            <div
                                onClick={() => {
                                    setSelectedType("");
                                    setIsFilterOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-light-background2/30 dark:hover:bg-dark-border/30 cursor-pointer">
                                All Transactions
                            </div>
                            {transactionTypes.map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setIsFilterOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-light-background2/30 dark:hover:bg-dark-border/30 cursor-pointer">
                                    {type} Transactions
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Trades Summary */}
            <div className="flex justify-between items-center mb-4 px-2">
                <p>
                    {filteredTrades?.length || 0} trades found
                </p>
            </div>

            {/* Trades List */}
            {filteredTrades && filteredTrades.length > 0 ? (
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar px-4">
                    {filteredTrades.map((trade: ITrade) => (
                        <div key={trade._id} className=" bg-light-background dark:bg-dark-background2 rounded-xl shadow-sm  border border-light-border dark:border-dark-border p-5 flex flex-col md:flex-row justify-between gap-4">
                            {/* Trade Details Column */}
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                                        {trade.symbol}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${trade.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-light-danger dark:bg-red-900/30 dark:text-red-400'
                                        }`}
                                    >
                                        {trade.status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p>
                                        <span className="font-medium">Type:</span> {trade.transactionType}
                                    </p>
                                    <p>
                                        <span className="font-medium">Quantity:</span> {trade.quantity}
                                    </p>
                                </div>
                            </div>

                            {/* Price Details Column */}
                            <div className="flex-1 space-y-2 text-right md:text-left">
                                <div className="space-y-1">
                                    <p>
                                        <span className="font-medium">Price:</span> {trade.price?.toFixed(2)} €
                                    </p>
                                    <p>
                                        <span className="font-medium">Total:</span> {((trade.price ?? 0) * trade.quantity).toFixed(2)} €
                                    </p>
                                    <p>
                                        <span className="font-medium">Date:</span> {new Date(trade.transactionDate).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/trades/${trade._id}`)}
                                    className="mt-2 flex items-center justify-end gap-2 text-light-primary dark:text-dark-primary ml-auto">
                                    More Details
                                    <FiExternalLink />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <GrDocument className="text-6xl mb-4" />
                    <p>No trades available</p>
                </div>
            )}
        </div>
    );
};

export default TransactionsHistory;