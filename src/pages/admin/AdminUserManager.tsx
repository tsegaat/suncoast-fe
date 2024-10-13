import React, { useState, useEffect } from "react";
import {
    UserIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
    getUserByName,
    getTasksByUserIdAndStatus,
    deleteUser,
    deleteTask,
} from "../../accessors/AscendHealthAccessor";

interface User {
    user_id: number;
    fname: string;
    lname: string;
    email: string;
    role: string;
    company_id: number;
    created_by: number;
    location_ids: number[];
}

interface Task {
    task_id: number;
    task_title: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
}

interface AdminUserManagerProps {
    companyId: number;
    companyName: string;
    locationId: number;
    employees: User[];
    currentUser: any;
    refreshEmployees: () => void;
}

const AdminUserManager: React.FC<AdminUserManagerProps> = ({
    companyName,
    employees,
    refreshEmployees,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEmployees, setFilteredEmployees] =
        useState<User[]>(employees);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    const [sortColumn, setSortColumn] = useState<keyof Task>("due_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [searchMessage, setSearchMessage] = useState("");

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const [firstName, lastName] = searchQuery.split(" ");
            const response = await getUserByName(firstName, lastName || "");
            const data = await response.json();
            if (data.users.length === 0) {
                setSearchMessage("No users found for that name.");
            } else {
                setFilteredEmployees(data.users);
            }
        } catch (error) {
            console.error("Error searching for users:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleUserSelect = async (user: User) => {
        setSelectedUser(user);
        setIsLoadingTasks(true);
        try {
            const pendingResponse = await getTasksByUserIdAndStatus(
                user.user_id,
                "pending"
            );
            const completedResponse = await getTasksByUserIdAndStatus(
                user.user_id,
                "completed"
            );
            const pendingData = await pendingResponse.json();
            const completedData = await completedResponse.json();

            const allTasks = [...pendingData.tasks, ...completedData.tasks];
            setUserTasks(allTasks);
        } catch (error) {
            console.error("Error fetching user tasks:", error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const handleSort = (column: keyof Task) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedTasks = [...userTasks].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
            return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
            return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            setUserTasks(
                userTasks.filter((task: any) => task.task_id !== taskId)
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser.user_id);
            setSelectedUser(null);
            refreshEmployees();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setShowDeleteConfirmation(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
        setUserTasks([]);
    };

    const capitalize = (str: string) => {
        if (str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        return "";
    };

    const pendingTasksCount = userTasks.filter(
        (task) => task.status === "pending"
    ).length;
    const completedTasksCount = userTasks.filter(
        (task) => task.status === "completed"
    ).length;

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    User Management
                </h2>
                <p className="text-lg text-gray-600 mb-6">{companyName}</p>

                {!selectedUser ? (
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching && searchQuery === ""}
                                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200 w-10 h-10 flex items-center justify-center"
                            >
                                {isSearching ? (
                                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                                ) : (
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {searchMessage && (
                            <p className="text-red-500 mb-4">{searchMessage}</p>
                        )}
                        <ul className="divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <li
                                    key={employee.user_id}
                                    className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleUserSelect(employee)}
                                >
                                    <div className="flex items-center">
                                        <UserIcon className="h-10 w-10 text-gray-400 mr-4" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{`${capitalize(
                                                employee.fname
                                            )} ${capitalize(
                                                employee.lname
                                            )}`}</p>
                                            <p className="text-sm text-gray-500">
                                                {employee.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {employee.role}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mt-8">
                        <button
                            onClick={handleBackToList}
                            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Back to user list
                        </button>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">{`${selectedUser.fname} ${selectedUser.lname}'s Tasks`}</h3>
                            <button
                                onClick={handleDeleteClick}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition duration-200"
                                title="Delete User"
                            >
                                <TrashIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-blue-800 mb-2">
                                    Pending Tasks
                                </h4>
                                <p className="text-3xl font-bold text-blue-600">
                                    {pendingTasksCount}
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-green-800 mb-2">
                                    Completed Tasks
                                </h4>
                                <p className="text-3xl font-bold text-green-600">
                                    {completedTasksCount}
                                </p>
                            </div>
                        </div>

                        {isLoadingTasks ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : userTasks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {[
                                                "task_title",
                                                "description",
                                                "due_date",
                                                "priority",
                                                "status",
                                            ].map((column) => (
                                                <th
                                                    key={column}
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort(
                                                            column as keyof Task
                                                        )
                                                    }
                                                >
                                                    {column.replace("_", " ")}
                                                    {sortColumn === column &&
                                                        (sortDirection === "asc"
                                                            ? " ↑"
                                                            : " ↓")}
                                                </th>
                                            ))}
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedTasks.map((task) => (
                                            <tr key={task.task_id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {task.task_title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {task.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(
                                                        task.due_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            task.priority ===
                                                            "high"
                                                                ? "bg-red-100 text-red-800"
                                                                : task.priority ===
                                                                  "medium"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            task.status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                task.task_id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No tasks found for this user.</p>
                        )}
                    </div>
                )}
            </div>
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl max-w-sm w-full">
                        <div className="mb-4 flex items-center justify-center text-red-600">
                            <ExclamationTriangleIcon className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-center">
                            Confirm User Deletion
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 text-center">
                            Are you sure you want to delete{" "}
                            {selectedUser?.fname} {selectedUser?.lname}? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManager;
