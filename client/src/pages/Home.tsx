import React, { useEffect } from "react";
import { TbInfoTriangleFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import type { RootState } from "../app/store";
import KpiCards from "../components/Dashboard/KpiCards";
import { Charts } from "../components/Dashboard/Charts";

const Home = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <div>
                {currentUser ? (
                    <>
                        <KpiCards />
                        <Charts />
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-16 text-2xl">
                        <div className="text-6xl"><TbInfoTriangleFilled /></div>
                        <div> Please login to view dashboard</div>
                    </div>
                )
                }

            </div>
        </>
    )
};

export default Home;
