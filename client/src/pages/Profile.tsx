import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import { useEffect, useRef, useState } from "react";
import type { RootState } from "../app/store";
import { formatDateWithTime } from "../helpers/formatDate";
import Header from "../components/Header/Header";

const Profile = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { trades } = useSelector((state: RootState) => state.trade);
    const { getTrades } = useTradeCall();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const transactionTypes = ["BUY", "SELL"];

    console.log(trades);


    useEffect(() => {
        if (currentUser?._id) {
            getTrades(currentUser._id);
        } else {
            console.warn("No user ID found for the current user.");
        }
    }, [currentUser]);

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

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setIsDropdownOpen(false);
    };

    const filteredTrades = trades?.filter((trade: ITrade) => {
        const matchesType = selectedType ? trade.transactionType.toLowerCase() === selectedType.toLowerCase() : true;
        const matchesSearch = searchTerm
            ? trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trade.status.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesType && matchesSearch;
    });

    return (
        <>
            <Header />
            <div className="min-h-screen bg-light-background dark:bg-dark-background flex flex-col items-center">
                {/* User Info Section */}
                <div className="w-full max-w-4xl mt-6 p-8 bg-white dark:bg-dark-background3 shadow-xl rounded-3xl">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Header */}
                        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>

                        <div className="flex flex-col w-full space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-light-secondary dark:bg-dark-background2 flex items-center justify-center text-xl font-bold">
                                    {currentUser?.firstName[0]}{currentUser?.lastName[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-medium">
                                        <strong>Username:</strong> <span className="text-gray-600 dark:text-gray-400">{currentUser?.username}</span>
                                    </p>
                                    <p className="text-lg font-medium">
                                        <strong>Full Name:</strong> <span className="text-gray-600 dark:text-gray-400">{currentUser?.firstName} {currentUser?.lastName}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-auto">
                                <span className="text-lg font-medium"><strong>Email:</strong></span>
                                <span className="text-gray-600 dark:text-gray-400">{currentUser?.email}</span>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Trades Section */}
                <div className="w-full max-w-4xl mt-6 p-6 bg-white dark:bg-dark-background3 shadow-md rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Trade History</h2>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search by symbol or status..."
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green dark:bg-dark-background2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Transaction Type Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="p-2 border rounded-md cursor-pointer bg-white dark:bg-dark-background2 min-w-[150px]"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {selectedType || "Select Transaction Type"}
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-1 w-full bg-white dark:bg-dark-background2 border rounded-md shadow-lg z-10">
                                        <div
                                            className="p-2 hover:bg-light-green dark:hover:bg-primary-green cursor-pointer"
                                            onClick={() => handleTypeSelect("")}
                                        >
                                            All Types
                                        </div>
                                        {transactionTypes.map((type) => (
                                            <div
                                                key={type}
                                                className="p-2 hover:bg-light-green dark:hover:bg-primary-green cursor-pointer"
                                                onClick={() => handleTypeSelect(type)}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {filteredTrades && filteredTrades.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTrades.map((trade: ITrade) => (
                                <div key={trade._id} className="flex justify-between items-center p-4 bg-light-secondary dark:bg-dark-background2 rounded-lg shadow-sm hover:shadow-md">
                                    <div>
                                        <p><strong>Symbol:</strong> {trade.symbol}</p>
                                        <p><strong>Transaction Type:</strong> {trade.transactionType}</p>
                                        <p><strong>Quantity:</strong> {trade.quantity}</p>
                                        <p><strong>Status:</strong> {trade.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <p><strong>Price:</strong> ${trade.price}</p>
                                        <p><strong>Date:</strong> {formatDateWithTime(trade.transactionDate)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No trades available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile; 