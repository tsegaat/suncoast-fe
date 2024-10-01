import React, { useState } from "react";
import {
    UserCircleIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    UserPlusIcon,
    ArrowRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
    currentUser: any;
    companyName: string;
    currentView: string;
    setCurrentView: (view: string) => void;
    isSuper: boolean;
    locations: any[];
    selectedLocationId: number | null;
    handleLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentUser,
    companyName,
    currentView,
    setCurrentView,
    isSuper,
    locations,
    selectedLocationId,
    handleLocationChange,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-20 bg-gray-800 text-white p-2 rounded-md"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <ArrowRightIcon className="h-6 w-6" />
                )}
            </button>
            <div
                className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
            >
                <div className="flex flex-col items-center space-y-2">
                    <UserCircleIcon className="h-16 w-16 text-white" />
                    <h2 className="text-xl font-bold">
                        {currentUser?.first_name || "Admin"}
                    </h2>
                    <p className="text-sm text-gray-400">{companyName}</p>
                </div>

                {isSuper && (
                    <div className="px-4 py-2">
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Select Location
                        </label>
                        <select
                            id="location"
                            name="location"
                            className="w-full px-3 py-2 text-sm bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedLocationId || ""}
                            onChange={handleLocationChange}
                        >
                            {locations.map((location) => (
                                <option
                                    key={location.location_id}
                                    value={location.location_id}
                                >
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <nav>
                    <button
                        onClick={() => {
                            setCurrentView("tasks");
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 rounded transition duration-200 ${
                            currentView === "tasks"
                                ? "bg-blue-600"
                                : "hover:bg-gray-700"
                        }`}
                    >
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                        <span>Task Assignment</span>
                    </button>
                    <button
                        onClick={() => {
                            setCurrentView("users");
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 rounded transition duration-200 ${
                            currentView === "users"
                                ? "bg-blue-600"
                                : "hover:bg-gray-700"
                        }`}
                    >
                        <UsersIcon className="h-5 w-5" />
                        <span>User Management</span>
                    </button>
                    <button
                        onClick={() => {
                            setCurrentView("create");
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 rounded transition duration-200 ${
                            currentView === "create"
                                ? "bg-blue-600"
                                : "hover:bg-gray-700"
                        }`}
                    >
                        <UserPlusIcon className="h-5 w-5" />
                        <span>Create Employee</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
