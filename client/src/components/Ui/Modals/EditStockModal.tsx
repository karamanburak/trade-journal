// EditStockModal.tsx

import React from 'react';
import MenuButton from '../Buttons/MenuButton';

interface EditStockModalProps {
    stock: IStock;
    onClose: () => void;
    onUpdate: (updatedStock: IStock) => void;
}

const EditStockModal: React.FC<EditStockModalProps> = ({ stock, onClose, onUpdate }) => {
    const [updatedStock, setUpdatedStock] = React.useState<IStock>(stock);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedStock({
            ...updatedStock,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        onUpdate(updatedStock);
    };

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 text-dark-secondary"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl mb-4">Edit Stock</h2>
                <div>
                    <label>Symbol</label>
                    <input
                        type="text"
                        name="symbol"
                        value={updatedStock.symbol}
                        onChange={handleChange}
                        className="border p-2 mb-4 w-full"
                        disabled
                    />
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updatedStock.name}
                        onChange={handleChange}
                        className="border p-2 mb-4 w-full"
                        disabled

                    />
                    <label>Price</label>
                    <input
                        type="number"
                        name="lastPrice"
                        value={updatedStock.lastPrice}
                        onChange={handleChange}
                        className="border p-2 mb-4 w-full"
                    />
                    <label>Market Cap</label>
                    <input
                        type="number"
                        name="marketCap"
                        value={updatedStock.marketCap}
                        onChange={handleChange}
                        className="border p-2 mb-4 w-full"
                        disabled

                    />
                </div>
                <div className="flex justify-between mt-4">
                    <MenuButton
                        onClick={onClose}
                        className="bg-dark-danger hover:bg-dark-danger/70 py-2 px-4 rounded text-white"
                    >
                        Close
                    </MenuButton>
                    <MenuButton
                        onClick={handleSave}
                        className="bg-dark-primary hover:bg-dark-primary/70 py-2 px-4 rounded text-white"
                    >
                        Save
                    </MenuButton>
                </div>
            </div>
        </div>
    );
};

export default EditStockModal;
