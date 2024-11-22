import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaRegEdit } from "react-icons/fa"
import useTradeCall from "../../../hooks/useTradeCall"
import EditStockModal from "../Modals/EditStockModal"
import { useSelector } from "react-redux"
import type { RootState } from "../../../app/store"
import MenuButton from "../Buttons/MenuButton"

interface TableProps {
    stocks: IStock[]
}

const Table: React.FC<TableProps> = ({ stocks }) => {
    const { currentUser } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const { editStock } = useTradeCall()
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStock, setSelectedStock] = useState<IStock | null>(null)

    if (!stocks || stocks.length === 0) {
        return (
            <div className="flex justify-center items-center p-10 text-lg">No stock data available.</div>
        )
    }

    const handleEditClick = (stock: IStock) => {
        setSelectedStock(stock)
        setModalOpen(true)
    }
    return (
        <div className="h-[calc(100vh-250px)] overflow-y-auto scrollbar">
            <div className="mb-2">
                {stocks.length} stocks found. Click on the BUY/SELL button to view more details.
            </div>
            <table className="w-full mx-auto table-auto text-sm sm:text-base">
                <thead className="bg-light-secondary dark:bg-dark-background3 w-full">
                    <tr className="text-left">
                        <th className="py-3 px-4 font-semibold">Symbol</th>
                        <th className="py-3 px-4 hidden md:table-cell font-semibold">Name</th>
                        <th className="py-3 px-4 font-semibold">Price</th>
                        <th className="py-3 px-4 hidden lg:table-cell font-semibold">Market Cap</th>
                        <th className="py-3 px-4 font-semibold">BUY/SELL</th>
                        {currentUser && currentUser?.userType === "admin" && (
                            <th className="py-3 px-4">Edit</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {stocks?.map(({ symbol, name, lastPrice, marketCap, _id }) => (
                        <tr
                            key={_id}
                            className="hover:bg-light-secondary dark:hover:bg-dark-background2 border-b border-light-border dark:border-dark-border"
                        >
                            <td className="py-3 px-4">{symbol}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{name}</td>
                            <td className="py-3 px-4">${lastPrice.toFixed(2)}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">${marketCap?.toLocaleString()}</td>

                            <td className="py-3 px-4">
                                <MenuButton
                                    onClick={() => navigate(`stocks/${_id}`)}
                                    className="bg-light-background3 hover:bg-dark-textSecondary text-dark-background3 text-xs sm:text-sm font-medium py-2 px-4 rounded dark:text-light-secondary dark:bg-dark-background3 hover:dark:bg-dark-background"
                                >
                                    BUY/SELL
                                </MenuButton>
                            </td>
                            {currentUser && currentUser?.userType === "admin" && (
                                <td className="py-3 px-4">
                                    <FaRegEdit
                                        className="text-xl cursor-pointer"
                                        onClick={() => handleEditClick({ symbol, name, lastPrice, marketCap, _id })}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && selectedStock && (
                <EditStockModal
                    stock={selectedStock}
                    onClose={() => setModalOpen(false)}
                    onUpdate={(updatedStock) => {
                        if (selectedStock) {
                            editStock(selectedStock._id, updatedStock)
                        }
                        setModalOpen(false)
                    }}
                />
            )}
        </div>
    )
}

export default Table
