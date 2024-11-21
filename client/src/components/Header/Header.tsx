import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import UserMenu from "./UserMenu";

const Header = () => {
    const navigate = useNavigate();
    return (
        <header className="flex justify-between items-center mx-auto h-[90px] p-3 md:px-20 bg-light-blue bg-light-secondary dark:bg-dark-background2 shadow-lg">
            <div className="flex" >
                <img src={logo} alt="Trade Journal Logo" className="h-16 w-16 rounded-md cursor-pointer" onClick={() => navigate("/")} />
                <div className="bg-dark-background1 text-2xl font-semibold mt-4 ml-1">
                    Trade Journal
                </div>
            </div>
            <div>
                <UserMenu />
            </div>
        </header>
    )
};

export default Header;
