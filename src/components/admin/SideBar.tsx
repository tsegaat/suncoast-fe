import React from "react";
import {
    UserCircleIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    UserPlusIcon,
    DocumentTextIcon,
    ArrowLeftOnRectangleIcon,
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
    handleMaintenanceRequest: () => void;
    handleSignOut: () => void;
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: (isOpen: boolean) => void;
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
    handleMaintenanceRequest,
    handleSignOut,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
}) => {
    return (
        <>
            <div
                className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
                    isMobileSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                } md:hidden`}
                onClick={() => setIsMobileSidebarOpen(false)}
            ></div>

            <div
                className={`fixed inset-y-0 left-0 flex flex-col max-w-64 w-full bg-gray-800 transition-transform duration-300 ease-in-out transform z-50 ${
                    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:relative md:translate-x-0`}
            >
                <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 md:hidden">
                    <span className="text-lg font-semibold text-white">
                        {companyName}
                    </span>
                    <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4 py-4">
                        <UserCircleIcon className="h-8 w-8 text-white" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                                {currentUser?.fname} {currentUser?.lname}
                            </p>
                            <p className="text-xs font-medium text-gray-300">
                                {currentUser?.role}
                            </p>
                        </div>
                    </div>

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
                            className="w-full px-3 py-2 text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <nav className="flex-1 px-2 py-4 space-y-1">
                        <button
                            onClick={() => setCurrentView("tasks")}
                            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                currentView === "tasks"
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            <ClipboardDocumentListIcon className="mr-3 h-6 w-6" />
                            Create a Task
                        </button>

                        <button
                            onClick={() => setCurrentView("users")}
                            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                currentView === "users"
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            <UsersIcon className="mr-3 h-6 w-6" />
                            User Management
                        </button>

                        <button
                            onClick={() => setCurrentView("create")}
                            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                currentView === "create"
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            <UserPlusIcon className="mr-3 h-6 w-6" />
                            Create Employee
                        </button>

                        <button
                            onClick={handleMaintenanceRequest}
                            className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            <DocumentTextIcon className="mr-3 h-6 w-6" />
                            Maintenance Request
                        </button>
                    </nav>
                </div>

                <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
