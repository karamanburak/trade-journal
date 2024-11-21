import React from "react";

interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            className={`block p-1 ${className || ""}`} onClick={onClick}
        >
            {children}
        </button>
    );
};

export default MenuButton;
