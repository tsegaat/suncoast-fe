import { useState, useEffect } from "react";
import {
    PlusIcon,
    CheckIcon,
    TrashIcon,
    DocumentMinusIcon,
} from "@heroicons/react/20/solid";
import Sidebar from "../../components/admin/Sidebar";

interface Task {
    id: number;
    title: string;
    user: string;
    completed: boolean;
    completedAt?: string;
}

interface User {
    name: string;
}

export default function AdminUserManager() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Design the homepage",
            user: "Alice",
            completed: false,
        },
        {
            id: 2,
            title: "Update inventory system",
            user: "Bob",
            completed: true,
            completedAt: "2024-09-07 10:30 AM",
        },
        {
            id: 3,
            title: "Fix bugs on mobile site",
            user: "Charlie",
            completed: false,
        },
        {
            id: 4,
            title: "Write blog post",
            user: "Alice",
            completed: true,
            completedAt: "2024-09-07 11:00 AM",
        },
        {
            id: 5,
            title: "Optimize database queries",
            user: "David",
            completed: false,
        },
    ]);

    const [users, setUsers] = useState<User[]>([
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" },
        { name: "David" },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Suncoast");

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting("Good morning");
        } else if (currentHour < 18) {
            setGreeting("Good afternoon");
        } else {
            setGreeting("Good evening");
        }
    }, []);

    const handleSearch = () => {
        const user = users.find((u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSelectedUser(user || null);
    };

    const handleTaskCompletion = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          completed: !task.completed,
                          completedAt: task.completed
                              ? undefined
                              : new Date().toLocaleString(),
                      }
                    : task
            )
        );
    };

    const handleRemoveTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleRemoveUser = (name: string) => {
        // Remove the user
        setUsers(users.filter((user) => user.name !== name));
        // Remove the tasks associated with the user
        setTasks(tasks.filter((task) => task.user !== name));
        setSelectedUser(null); // Reset selected user after removal
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        {greeting}, Admin!
                    </h1>
                    <p className="text-base md:text-lg text-gray-600">
                        {companyName}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Enter User Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full md:w-auto"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Search
                        </button>
                    </div>
                </div>

                {/* User Details Section */}
                {selectedUser ? (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-700">
                                {selectedUser.name}'s Tasks
                            </h2>
                            <button
                                onClick={() =>
                                    handleRemoveUser(selectedUser.name)
                                }
                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4 md:mt-0"
                            >
                                <DocumentMinusIcon className="h-5 w-5 mr-1" />
                                Remove User
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Completed Tasks */}
                            <div className="p-6 bg-green-100 rounded-lg shadow-lg">
                                <h3 className="text-lg md:text-xl font-semibold mb-2 text-green-700">
                                    Completed Tasks
                                </h3>
                                <p className="text-2xl md:text-3xl font-bold">
                                    {
                                        tasks.filter(
                                            (task) =>
                                                task.user ===
                                                    selectedUser.name &&
                                                task.completed
                                        ).length
                                    }
                                </p>
                            </div>

                            {/* Pending Tasks */}
                            <div className="p-6 bg-yellow-100 rounded-lg shadow-lg">
                                <h3 className="text-lg md:text-xl font-semibold mb-2 text-yellow-700">
                                    Pending Tasks
                                </h3>
                                <p className="text-2xl md:text-3xl font-bold">
                                    {
                                        tasks.filter(
                                            (task) =>
                                                task.user ===
                                                    selectedUser.name &&
                                                !task.completed
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Detailed Task List */}
                        <div className="mt-10">
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">
                                Task List for {selectedUser.name}
                            </h3>
                            <div className="space-y-4">
                                {tasks
                                    .filter(
                                        (task) =>
                                            task.user === selectedUser.name
                                    )
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white shadow-md rounded-lg"
                                        >
                                            <div>
                                                <p className="text-lg">
                                                    {task.title}
                                                </p>
                                                {task.completed && (
                                                    <p className="text-sm text-green-500">
                                                        Completed At:{" "}
                                                        {task.completedAt}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 mt-4 md:mt-0">
                                                <button
                                                    onClick={() =>
                                                        handleTaskCompletion(
                                                            task.id
                                                        )
                                                    }
                                                    className={`px-4 py-2 text-white rounded-md ${
                                                        task.completed
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                    } hover:opacity-90`}
                                                >
                                                    {task.completed ? (
                                                        <>
                                                            <CheckIcon className="h-5 w-5 inline-block mr-1" />
                                                            Mark Incomplete
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckIcon className="h-5 w-5 inline-block mr-1" />
                                                            Mark Complete
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveTask(
                                                            task.id
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:opacity-90"
                                                >
                                                    <TrashIcon className="h-5 w-5 inline-block mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="mt-6 text-gray-500">
                        Search for a user to view their task details.
                    </p>
                )}
            </div>
        </div>
    );
}
