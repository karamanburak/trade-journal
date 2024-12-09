import { useSelector } from "react-redux";
import useTradeCall from "../hooks/useTradeCall";
import type { RootState } from "../app/store";
import KpiCards from "../components/Dashboard/KpiCards";
import useAccountCall from "../hooks/useAccountCall";
import { useEffect, useState } from "react";

const Home = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount, updateAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount>();
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAccountData = async () => {
        try {
            if (currentUser?._id) {
                setLoading(true);
                getTrades(currentUser._id);
                const accountData = await getAccount(currentUser._id);
                setAccount(accountData.data[0]);
            } else {
                console.log("No user ID found for the current user.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountData();
    }, [currentUser]);


    return (
        <>
            <KpiCards account={account} />

        </>
    )
};

export default Home;
