import React, { useEffect, useState } from "react";
import { TbInfoTriangleFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import type { RootState } from "../app/store";
import KpiCards from "../components/Dashboard/KpiCards";
import { Charts } from "../components/Dashboard/Charts";
import useAccountCall from "../hooks/useAccountCall";

const Home = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount, updateAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount>();


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

    console.log(account);


    return (
        <>
            <div>
                {currentUser ? (
                    <>
                        <KpiCards account={account} />
                        <Charts account={account} />
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
