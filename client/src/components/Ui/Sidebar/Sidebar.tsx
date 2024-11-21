import { MdDashboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import { PiHandDepositFill } from "react-icons/pi";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useNavigate } from "react-router-dom";

const links = [
    {
        title: "Dashboard",
        key: "dashboard",
        icon: <MdDashboard />,
    },
    {
        title: "Stocks",
        key: "stocks",
        icon: <AiOutlineStock />,
    },
    {
        title: "Transactions",
        key: "transactions",
        icon: <GrTransaction />,
    },
];

const Sidebar = ({ onNavigate }: { onNavigate: (key: string) => void }) => {
    const [activeKey, setActiveKey] = useState("dashboard");
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const isActive = (key: string) =>
        activeKey === key ? "bg-[#E5E8EB] dark:bg-[#1d2a44]" : "hover:bg-[#E5E8EB] dark:hover:bg-[#1d2a44]";

    return (
        <div className="relative w-[90px] sm:w-[240px] h-[calc(100vh-108px)] px-2 shadow-lg bg-light-secondary dark:bg-dark-background2">

            <button onClick={() => navigate(`/profile/${currentUser?._id}`)} className="hidden sm:block bg-light-background2 hover:bg-light-background2/80 font-semibold dark:bg-dark-background3 py-1.5 px-8 rounded-full">Deposit or Withdraw</button >

            <button onClick={() => navigate(`/profile/${currentUser?._id}`)} className="sm:hidden">
                <PiHandDepositFill className="text-3xl ml-5 mt-3" />
            </button>

            <div className="flex items-center justify-center sm:w-40 m-auto relative py-4">
                <div className="absolute inset-0 flex items-center py-4">
                    <div className="w-full border-t border-light-border dark:border-dark-border"></div>
                </div>
                <div className="relative bg-light-secondary dark:bg-dark-background2 px-2">
                    <span className="text-dark-secondary dark:text-dark-text text-sm">&#9733;</span>
                </div>
            </div>

            <ul className="space-y-1 flex flex-col">
                {links.map((item) => (
                    <li key={item.key}>
                        <button
                            onClick={() => {
                                setActiveKey(item.key);
                                onNavigate(item.key);
                            }}
                            className={`flex items-center justify-start py-3 px-6 rounded-lg w-full space-x-4 ${isActive(
                                item.key
                            )} dark:hover:bg-dark-background3`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="hidden sm:block font-medium">{item.title}</span>
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Sidebar;
