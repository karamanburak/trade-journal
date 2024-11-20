import React, { useEffect, useRef, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi"
import { FaBars, FaUser } from "react-icons/fa"
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import useAuthCall from "../../hooks/useAuthCall";
import useTheme from "../../hooks/useTheme";
import { useLocation, useNavigate } from "react-router-dom";
import MenuButton from "../Ui/Buttons/MenuButton";

const UserMenu = () => {
    const mode = useSelector((state: RootState) => state.theme.mode)
    const { currentUser } = useSelector((state: RootState) => state.auth)
    const { logout } = useAuthCall()
    const { toggleTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {
        logout()
        toggleMenu()
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [menuRef])

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex items-center justify-center border-2 dark:border-gray-2 border-light-background3 dark:border-dark-background3 rounded-full py-1 px-2 cursor-pointer"
                onClick={toggleMenu}>
                <FaBars className="dark:text-gray-2  h-5 w- mr-2" />
                <FaUser className="text-lg dark:border-gray-2 rounded-lg shadow-lg z-10" />
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-gray-3 dark:text-white dark:bg-dark-background2 border border-dark-green dark:border-dark-background3 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        <div className="mt-2">
                            {currentUser ? (
                                <>
                                    <MenuButton onClick={() => navigate(`/`)}>Home</MenuButton>
                                    <MenuButton onClick={() => navigate(`/profile/${currentUser._id}`)}>
                                        Profile
                                    </MenuButton>
                                    <MenuButton onClick={handleLogout}>Logout</MenuButton>
                                </>
                            ) : (
                                <>
                                    <MenuButton onClick={() => navigate("/login")}>Login</MenuButton>
                                    <MenuButton onClick={() => navigate("/register")}>Register</MenuButton>
                                </>
                            )}
                            <div className="border-b border-light-blue dark:border-gray-2 my-2"></div>

                            <button
                                className="flex items-center w-full text-left p-1 hover:text-dark-primary"
                                onClick={toggleTheme}
                            >
                                {mode === "dark" ? (
                                    <>
                                        <FiSun className="mr-2" /> Light
                                    </>
                                ) : (
                                    <>
                                        <FiMoon className="mr-2" /> Dark
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    )
};

export default UserMenu;
