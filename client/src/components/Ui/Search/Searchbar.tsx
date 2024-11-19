import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
    stocks: IStock[];
    onSelectStock: (stock: IStock) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ stocks, onSelectStock }) => {
    const [input, setInput] = useState<string>("");
    const [filteredStocks, setFilteredStocks] = useState<IStock[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const updateBestMatches = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = stocks.filter((stock) =>
            stock.symbol.toLowerCase().startsWith(searchTerm)
        );

        setFilteredStocks(filtered);
        setInput(searchTerm);
        setIsDropdownOpen(true);
    };

    const handleStockSelect = (stock: IStock) => {
        onSelectStock(stock);
        setInput(stock.name);
        setFilteredStocks([]);
        setIsDropdownOpen(false);

        navigate(`stocks/${stock._id}`);
    };

    return (
        <div className="relative w-full md:w-80 pt-5 ml-auto">
            <input
                type="text"
                value={input}
                placeholder="Search stock..."
                onChange={updateBestMatches}
                className="mb-10 p-2 w-full border rounded-md focus:outline-none  dark:bg-dark-background2"
            />
            {input && (
                <button
                    onClick={() => setInput("")}
                    className="absolute top-11 right-10 transform -translate-y-1/2 text-sm "
                >
                    Clear
                </button>
            )}

            {input && filteredStocks.length > 0 && (
                <div className="absolute top-16 w-full bg-white dark:bg-dark-background2 border rounded-md shadow-lg z-10">
                    {filteredStocks.map((stock) => (
                        <div
                            key={stock._id}
                            className="p-2 hover:bg-light-green dark:hover:bg-dark-background3 cursor-pointer"
                            onClick={() => handleStockSelect(stock)}
                        >
                            {stock.name} ({stock.symbol})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Searchbar;
