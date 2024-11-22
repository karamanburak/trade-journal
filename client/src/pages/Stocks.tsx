import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

import useTradeCall from "../hooks/useTradeCall";
import Searchbar from "../components/Ui/Search/Searchbar";
import Table from "../components/Ui/Table/Table";

const Stocks = () => {
    const { stocks } = useSelector((state: RootState) => state.trade);
    const { getStocks } = useTradeCall()
    const [selectedStock, setSelectedStock] = useState<IStock | null>(null);

    const handleStockSelect = (stock: IStock) => {
        setSelectedStock(stock);
    }

    useEffect(() => {
        getStocks()
    }, [])

    // console.log("stocks", stocks);


    return (
        <>
            <Searchbar stocks={stocks} onSelectStock={handleStockSelect} />
            <Table stocks={stocks} />
        </>
    )
};

export default Stocks;
