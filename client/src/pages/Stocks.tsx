import React, { useEffect } from "react";
import Card from "../components/Ui/Card/Card";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import useTradeCall from "../hooks/useTradeCall";
import Searchbar from "../components/Ui/Search/Searchbar";

const Stocks = () => {
    const { trades } = useSelector((state: RootState) => state.trade);
    const { stocks } = useSelector((state: RootState) => state.trade);
    const { getTrades, getStocks } = useTradeCall()


    useEffect(() => {
        // getTrades()
        getStocks()
    }, [])

    console.log("trades", trades);
    console.log("stocks", stocks);


    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10">
            <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1">
                <h1 className="text-5xl">APPL Inc</h1>
                <Searchbar />
            </div>
            <div className="md:col-span-2 row-span-4">
                <Card>Chart</Card>
            </div>
            <div>
                <Card>Overview</Card>
            </div>
            <div className="row-span-2 xl-row-span-3">
                <Card>Details</Card>
            </div>
        </div>
    )
};

export default Stocks;
