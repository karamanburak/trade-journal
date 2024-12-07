import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    MdAccountBalanceWallet,
    MdOutlineSupervisedUserCircle,
    MdOutlineTrendingUp,
    MdTrendingDown,
} from "react-icons/md";
import {
    PiArrowFatLinesDownDuotone,
    PiArrowFatLinesUpDuotone,
    PiClock,
} from "react-icons/pi";
import useTradeCall from "../hooks/useTradeCall";
import useAccountCall from "../hooks/useAccountCall";
import toastNotify from "../utils/toastNotify";

import type { RootState } from "../app/store";
import Header from "../components/Header/Header";
import { ImSpinner9 } from "react-icons/im";

interface IAccountStatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    trend?: number;
}

interface ITransactionModalProps {
    type: "deposit" | "withdraw";
    onClose: () => void;
    onSubmit: (type: "DEPOSIT" | "WITHDRAWAL") => void;
}

const Profile: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount, updateAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount | undefined>(undefined);
    const [activeModal, setActiveModal] = useState<"deposit" | "withdraw" | null>(null);
    const [transactionAmount, setTransactionAmount] = useState<number>(0);

    const fetchAccountData = async () => {
        try {
            if (currentUser?._id) {
                getTrades(currentUser._id);
                const accountData = await getAccount(currentUser._id);
                setAccount(accountData?.data?.[0]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAccountData();
    }, [currentUser]);

    const handleTransaction = async (type: "DEPOSIT" | "WITHDRAWAL") => {
        if (!currentUser?._id || !account?._id) {
            console.error("Invalid user or account");
            return;
        }

        if (transactionAmount <= 0) {
            toastNotify("error", `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} amount must be greater than zero.`);
            return;
        }

        if (type === "WITHDRAWAL" && transactionAmount > account.totalValue) {
            toastNotify("warn", `Insufficient funds. Available balance: ${account.totalValue.toFixed(2)} €`);
            return;
        }

        try {
            const transactionData = {
                accountId: account._id,
                userId: currentUser._id,
                amount: transactionAmount,
                transactionType: type,
            };

            const response = await updateAccount(transactionData);

            if (response?.data) {
                await fetchAccountData();
                setActiveModal(null);
                setTransactionAmount(0);
                toastNotify("success", `${type} successful.`);
            }
        } catch (error) {
            console.error(`Error with ${type.toLowerCase()}:`, error);
            toastNotify("error", `Failed to process ${type.toLowerCase()}.`);
        }
    };

    const AccountStatCard: React.FC<IAccountStatCardProps> = ({ icon, title, value, trend }) => (
        <div className="bg-light-background dark:bg-dark-background2 rounded-xl p-4 shadow-md flex items-center space-x-4">
            <div className="bg-light-primary/10 dark:bg-dark-primary/10 text-xl p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-xs text-light-textSecondary">{title}</p>
                <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold">{value}</p>
                    {trend !== undefined && (
                        <span className={`flex items-center text-xs ${trend > 0 ? "text-dark-success" : "text-dark-danger"}`}>
                            {trend > 0 ? (
                                <PiArrowFatLinesUpDuotone size={16} />
                            ) : (
                                <PiArrowFatLinesDownDuotone size={16} />
                            )}
                            {Math.abs(trend).toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    const TransactionModal: React.FC<ITransactionModalProps> = ({ type, onClose, onSubmit }) => {
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-light-background dark:bg-dark-background2 rounded-2xl p-6 w-96 shadow-2xl">
                    <h2 className="text-xl font-bold mb-4">
                        {type === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
                    </h2>
                    <input
                        ref={inputRef}
                        type="number"
                        className="w-full p-3 border outline-none rounded-lg mb-4 bg-light-background2 dark:bg-dark-background3 text-dark-background3 dark:text-white"
                        placeholder="Enter amount"
                        value={transactionAmount || ""}
                        onChange={(e) => setTransactionAmount(Number(e.target.value))}
                    />
                    <div className="flex justify-end space-x-3">
                        <button onClick={onClose} className="px-4 py-2 hover:bg-light-background2 dark:hover:bg-dark-background3 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(type === "deposit" ? "DEPOSIT" : "WITHDRAWAL")}
                            className={`px-4 py-2 rounded-lg text-white ${type === "deposit"
                                ? "bg-dark-primary hover:bg-dark-primary/80"
                                : "bg-dark-danger hover:bg-dark-danger/80"}`} >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-light-background dark:bg-dark-background p-6 md:p-10">
                <div className="max-w-6xl mx-auto">
                    {/* User Profile Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-dark-primary text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                                {currentUser?.firstName[0]}
                                {currentUser?.lastName[0]}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold dark:text-white">
                                    {currentUser?.firstName} {currentUser?.lastName}
                                </h1>
                                <p> {currentUser?.email} </p>
                            </div>
                        </div>
                        {/* Transaction Buttons */}
                        <div className="flex justify-center items-center space-x-6 mb-6">
                            <button
                                onClick={() => setActiveModal("deposit")}
                                className="bg-dark-primary text-white px-6 py-3 rounded-lg hover:bg-dark-primary/80 flex items-center space-x-2">
                                <PiArrowFatLinesUpDuotone />
                                <span>Deposit</span>
                            </button>
                            <button
                                onClick={() => setActiveModal("withdraw")}
                                className="bg-dark-danger text-white px-6 py-3 rounded-lg hover:bg-dark-danger/80 flex items-center space-x-2 shadow-md">
                                <PiArrowFatLinesDownDuotone />
                                <span>Withdraw</span>
                            </button>
                        </div>
                    </div>

                    {/* Account Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {account ? (
                            <>
                                <AccountStatCard
                                    icon={<MdAccountBalanceWallet className="text-dark-primary" />}
                                    title="Total Balance"
                                    value={`${account.totalValue.toFixed(2)} €`}
                                />
                                <AccountStatCard
                                    icon={<PiClock className="text-dark-success" />}
                                    title="Avg. Hold Duration"
                                    value={`${account.avarageHoldDuration?.toFixed(2) || "0"} mins`}
                                />
                                <AccountStatCard
                                    icon={<MdOutlineTrendingUp className="text-dark-primary" />}
                                    title="Win Rate"
                                    value={`${account.winRate?.toFixed(2) || "0"}%`}
                                />
                                <AccountStatCard
                                    icon={<MdOutlineTrendingUp className="text-dark-success" />}
                                    title="Avg. Profit"
                                    value={`${account.avarageProfit?.toFixed(2) || "0"} €`}
                                />
                                <AccountStatCard
                                    icon={<MdTrendingDown className="text-dark-danger" />}
                                    title="Avg. Loss"
                                    value={`${account.avarageLoss?.toFixed(2) || "0"} €`}
                                />
                                <AccountStatCard
                                    icon={<MdOutlineSupervisedUserCircle className="text-purple-500" />}
                                    title="Completed Transactions"
                                    value={account.completedTransactions?.toString() || "0"}
                                />
                            </>
                        ) : (
                            <div className="col-span-full flex justify-center items-center">
                                Loading...  <ImSpinner9 className="animate-spin ml-3 h-8 w-8 text-dark-primary" />
                            </div>
                        )}

                    </div>


                </div>

                {/* Transaction Modals */}
                {activeModal === "deposit" && (
                    <TransactionModal
                        type="deposit"
                        onClose={() => {
                            setActiveModal(null);
                            setTransactionAmount(0);
                        }}
                        onSubmit={handleTransaction}
                    />
                )}
                {activeModal === "withdraw" && (
                    <TransactionModal
                        type="withdraw"
                        onClose={() => {
                            setActiveModal(null);
                            setTransactionAmount(0);
                        }}
                        onSubmit={handleTransaction}
                    />
                )}
            </div>
        </>
    );
};

export default Profile;
