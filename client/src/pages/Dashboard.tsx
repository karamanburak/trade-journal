import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Ui/Sidebar/Sidebar";
import Companies from "./Companies";
import Investors from "./Investors";
import { useLocation, useNavigate } from "react-router-dom";
import Home from "./Home";

const Dashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<string>("dashboard")
    const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false)

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const tab = queryParams.get("tab")
        if (tab) setActiveTab(tab)
    }, [location.search])

    const handleTabChange = (tab: string) => {
        setIsAddingEvent(false)
        setActiveTab(tab)
        navigate(`?tab=${tab}`)
    }

    return (
        <>
            <Header />
            <div className="flex flex-grow">
                <Sidebar onNavigate={handleTabChange} />

                <div className="flex-grow bg-light-background dark:bg-dark-background p-4">
                    {activeTab === "dashboard" && <Home />}
                    {activeTab === "companies" && <Companies />}
                    {activeTab === "investors" && <Investors />}
                </div>
            </div>
        </>
    )
};

export default Dashboard;
