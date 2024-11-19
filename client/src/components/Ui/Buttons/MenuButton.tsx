import React from "react";

interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children }) => {
    return (
        <button
            className="block w-full text-left p-1 hover:text-dark-primary"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default MenuButton;
