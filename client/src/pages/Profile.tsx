import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import { useEffect, useRef, useState } from "react";
import type { RootState } from "../app/store";
import { formatDateWithTime } from "../helpers/formatDate";
import Header from "../components/Header/Header";
import useAccountCall from "../hooks/useAccountCall";

const Profile = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { trades } = useSelector((state: RootState) => state.trade);
    const { getTrades } = useTradeCall();
    const { getAccount } = useAccountCall();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [account, setAccount] = useState<IAccount>();

    const transactionTypes = ["BUY", "SELL"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser?._id) {
                    getTrades(currentUser._id);
                    const accountData = await getAccount(currentUser._id);
                    setAccount(accountData.data[0]);
                } else {
                    console.log("No user ID found for the current user.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
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
            <div className="w-full h-[calc(100vh-90px)] px-2 shadow-lg bg-white dark:bg-dark-background flex flex-col md:flex-row ">
                <div className="w-full md:w-1/3 lg:w-1/4 bg-light-secondary dark:bg-dark-background2 p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-6">

                        {/* Profile Information */}
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col space-y-2 py-8 items-center">
                                <div className="w-16 h-16 rounded-full bg-light-background2 dark:bg-dark-background3 flex items-center justify-center text-xl font-bold">
                                    {currentUser?.firstName[0]}{currentUser?.lastName[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-medium">
                                        <span>{currentUser?.firstName} {currentUser?.lastName}</span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600 dark:text-gray-400">{currentUser?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Overview */}
                    <div className="mt-6">
                        {account ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Total Value:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">${account.totalValue}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Completed Transactions:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">{account.completedTransactions}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Win Rate:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">{account.winRate}%</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Average Profit:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">${account.avarageProfit}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Average Loss:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">${account.avarageLoss}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Average Hold Duration:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">{account.avarageHoldDuration} days</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">Account data is loading...</p>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 lg:w-3/4 p-6 space-y-6">
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
                        {trades?.length} trade(s) found.
                    </div>
                    {filteredTrades && filteredTrades.length > 0 ? (
                        <div className="space-y-4 h-[calc(100vh-285px)] overflow-y-auto scrollbar">
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
