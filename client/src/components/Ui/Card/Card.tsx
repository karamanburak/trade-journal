import React, { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
    return <div className="w-full h-full rounded-md relative p-8 border-2">{children}</div>;
};

export default Card;