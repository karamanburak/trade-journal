import { MdDashboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import { useState } from "react";

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

    const isActive = (key: string) =>
        activeKey === key ? "bg-[#E5E8EB] dark:bg-[#1d2a44]" : "hover:bg-[#E5E8EB] dark:hover:bg-[#1d2a44]";

    return (
        <div className="relative w-[90px] sm:w-[240px] h-[calc(100vh-90px)] px-2 shadow-lg bg-light-secondary dark:bg-dark-background2">
            <div className="hidden sm:flex items-center justify-center pt-6 bg-dark-background1 text-2xl font-semibold ">
                Trade Journal
            </div>

            <div className="hidden sm:flex items-center justify-center w-40 m-auto relative pt-4">
                <div className="absolute inset-0 flex items-center pt-4">
                    <div className="w-full border-t border-light-border dark:border-dark-border"></div>
                </div>
                <div className="relative bg-light-secondary dark:bg-dark-background2 px-2">
                    <span className="text-dark-secondary dark:text-dark-text text-sm">&#9733;</span>
                </div>
            </div>

            <ul className="space-y-1 flex flex-col pt-14 sm:pt-0">
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
