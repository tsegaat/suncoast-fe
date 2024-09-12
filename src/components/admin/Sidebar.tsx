import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownRightIcon, XMarkIcon } from "@heroicons/react/20/solid"; // For the hamburger and close icons

export default function Sidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Hamburger Icon for Mobile */}
            <div className="md:hidden p-4 bg-indigo-700 text-white">
                <button onClick={toggleMenu}>
                    <ArrowDownRightIcon className="h-8 w-8" />
                </button>
            </div>

            {/* Sidebar for larger screens */}
            <aside className="hidden md:flex md:w-72 bg-indigo-700 text-white flex-col">
                <div className="py-6 px-4 bg-indigo-800">
                    <h1 className="text-center text-xl font-bold">
                        Office Manager
                    </h1>
                </div>
                <nav className="flex-1 px-4 mt-6">
                    <ul>
                        <li className="mb-4">
                            <button
                                onClick={() => navigate("/admin")}
                                className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                            >
                                Task Overview
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                onClick={() => navigate("/admin/users")}
                                className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                            >
                                Manage Employees
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Full-screen Sidebar for mobile when open */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-indigo-700 text-white flex flex-col">
                    <div className="py-6 px-4 bg-indigo-800 flex justify-between items-center">
                        <h1 className="text-center text-xl font-bold">
                            Office Manager
                        </h1>
                        <button onClick={toggleMenu}>
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 mt-6">
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        navigate("/admin");
                                        toggleMenu(); // Close the menu after navigating
                                    }}
                                    className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                                >
                                    Task Overview
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        navigate("/admin/users");
                                        toggleMenu(); // Close the menu after navigating
                                    }}
                                    className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                                >
                                    Manage Employees
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </>
    );
}
