import React from "react";
import MenuButton from "../Ui/Buttons/MenuButton";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
    type: "deposit" | "withdraw";
    amount: number;
    setAmount: (amount: number) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    type,
    amount,
    setAmount,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-dark-background3">
                <h2 className="text-lg font-medium mb-4">{type === "deposit" ? "Deposit Money" : "Withdraw Money"}</h2>
                <input
                    type="number"
                    className="w-full p-2 border rounded mb-4 text-dark-secondary"
                    placeholder={`Enter amount to ${type === "deposit" ? "deposit" : "withdraw"}`}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <div className="flex justify-end space-x-4">
                    <MenuButton
                        onClick={() => {
                            setAmount(0);
                            onClose();
                        }}
                    >
                        Cancel
                    </MenuButton>
                    <MenuButton
                        onClick={() => {
                            onSubmit(amount);
                            setAmount(0);
                        }}
                    >
                        {type === "deposit" ? "Deposit" : "Withdraw"}
                    </MenuButton>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
