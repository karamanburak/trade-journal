import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"
import UserMenu from "./UserMenu";
const Header = () => {
    return (
        <header className="flex justify-between items-center mx-auto h-[80px] px-20 py-3 bg-light-blue bg-light-secondary dark:bg-dark-background2 shadow-sm ">
            <div className="container py-4">
                <Link to="/" className="flex items-center gap-4">
                    <img src={logo} alt="Trade Journal Logo" className="h-16 w-16 rounded-md" />
                </Link>
            </div>
            <div>
                <UserMenu />
            </div>
        </header>
    )
};

export default Header;
