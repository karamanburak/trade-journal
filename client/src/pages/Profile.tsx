import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import { useEffect, useRef, useState } from "react";
import type { RootState } from "../app/store";
import Header from "../components/Header/Header";
import useAccountCall from "../hooks/useAccountCall";
import TradeHistory from "../components/Profile/TradeHistory";

const Profile = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount>();

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

    console.log(currentUser);

    return (
        <>
            <Header />
            <div className="w-full h-[calc(100vh-90px)] shadow-lg bg-white dark:bg-dark-background flex flex-col md:flex-row ">
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
                    <div>
                        {account ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Total Value:</strong></p>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">${account.totalValue}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium"><strong>Closed Transactions:</strong></p>
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
                <TradeHistory />
            </div >
        </>
    );
};

export default Profile;
