import React, { useEffect } from "react";
import Table from "../components/Ui/Table/Table";
import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import type { RootState } from "../app/store";

const Home = () => {
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
        <>
            <div className="flex justify-between md:px-12">
                <div className="w-[80%] h-full flex flex-col m-auto mt-16 mb-24 relative">
                    {/* <Table /> */}
                </div>

            </div>
        </>
    )
};

export default Home;
