import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import { useEffect, useRef, useState } from "react";
import type { RootState } from "../app/store";
import Header from "../components/Header/Header";
import useAccountCall from "../hooks/useAccountCall";
import TradeHistory from "../components/Profile/TradeHistory";
import toastNotify from "../utils/toastNotify";

const Profile = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount, updateAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount>();
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

    const fetchAccountData = async () => {
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

    useEffect(() => {
        fetchAccountData();
    }, [currentUser]);

    const handleDeposit = async () => {
        if (currentUser?._id && account?._id) {
            if (depositAmount <= 0) {
                toastNotify("error", "Deposit amount must be greater than zero.");
                return;
            }
            try {
                const accountData = {
                    accountId: account._id,
                    userId: currentUser._id,
                    totalValue: depositAmount,
                    transactionType: "deposit",
                };

                const response = await updateAccount(accountData);

                if (response?.data) {
                    await fetchAccountData();
                    setIsDepositModalOpen(false);
                    setDepositAmount(0);
                }
            } catch (error) {
                console.error("Error depositing money:", error);
                toastNotify("error", "Failed to deposit money.");
            }
        } else {
            console.error("Invalid deposit amount");
        }
    };

    const handleWithdraw = async () => {
        if (currentUser?._id && account?._id) {
            if (withdrawAmount <= 0) {
                toastNotify("error", "Withdrawal amount must be greater than zero.");
                return;
            }
            if (withdrawAmount > account.totalValue) {
                toastNotify("warn", "Insufficient funds!");
                return;
            }
            try {
                const accountData = {
                    accountId: account._id,
                    userId: currentUser._id,
                    totalValue: withdrawAmount,
                    transactionType: "withdrawal",
                };

                const response = await updateAccount(accountData);

                if (response?.data) {
                    await fetchAccountData();
                    setIsWithdrawModalOpen(false);
                    setWithdrawAmount(0);
                }
            } catch (error) {
                console.error("Error withdrawing money:", error);
                toastNotify("error", "Failed to withdraw money.");
            }
        } else {
            console.error("Invalid withdraw amount");
        }
    };
    return (
        <>
            <Header />
            <div className="w-full h-[calc(100vh-90px)] shadow-lg bg-white dark:bg-dark-background flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 lg:w-1/4 bg-light-secondary dark:bg-dark-background2 p-6 space-y-6 ">
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
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-3 py-1 bg-light-primary hover:bg-light-primary/70 rounded text-white"
                                        onClick={() => setIsDepositModalOpen(true)}
                                    >
                                        Deposit
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-dark-danger hover:bg-dark-danger/70 rounded text-white"
                                        onClick={() => setIsWithdrawModalOpen(true)}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Total Value:</strong></p>
                                    <p className="">{account.totalValue.toFixed(2)} €</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Closed Transactions:</strong></p>
                                    <p className="">{account.completedTransactions}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Win Rate:</strong></p>
                                    <p className="">{account.winRate.toFixed(2)}%</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Average Profit:</strong></p>
                                    <p className="">{account.avarageProfit.toFixed(2)} €</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Average Loss:</strong></p>
                                    <p className="">{account.avarageLoss.toFixed(2)} €</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className=" font-medium"><strong>Average Hold Duration:</strong></p>
                                    <p className="">{account.avarageHoldDuration.toFixed(5)} days</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-dark-secondary">Account data is loading...</p>
                        )}
                    </div>
                </div>
                <TradeHistory />

                {/* Deposit Modal */}
                {isDepositModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-dark-background3">
                            <h2 className="text-lg font-medium mb-4">Deposit Money</h2>
                            <input
                                type="number"
                                className="w-full p-2 border rounded mb-4 text-dark-secondary"
                                placeholder="Enter amount"
                                defaultValue=""
                                onChange={(e) => setDepositAmount(Number(e.target.value))}
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-dark-danger rounded text-white"
                                    onClick={() => {
                                        setIsDepositModalOpen(false);
                                        setDepositAmount(0);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-dark-primary hover:bg-dark-primary/70 rounded text-white"
                                    onClick={handleDeposit}
                                >
                                    Deposit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdraw Modal */}
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-dark-background3">
                            <h2 className="text-lg font-medium mb-4">Withdraw Money</h2>
                            <input
                                type="number"
                                className="w-full p-2 border rounded mb-4 text-dark-secondary"
                                placeholder="Enter amount"
                                defaultValue=""
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-dark-danger rounded text-white"
                                    onClick={() => {
                                        setIsWithdrawModalOpen(false);
                                        setWithdrawAmount(0);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-dark-primary hover:bg-dark-primary/70 rounded text-white"
                                    onClick={handleWithdraw}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile; 