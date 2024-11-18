import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const NotFound = () => {
    const [count, setCount] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => (prev === 0 ? prev : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (count === 0) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full">
                <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">404 Error</h5>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</h3>
                <p className="text-md text-gray-600 dark:text-gray-400">
                    Sorry, the page you are looking for could not be found or has been removed.
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400">
                    Within <strong className="text-red-500">{count}</strong> seconds, you will be redirected to the home page!
                </p>
            </div>
        </div>
    );
};

export default NotFound;
