import React, { useState, useEffect } from "react";
import {
    PlusIcon,
    CheckIcon,
    TrashIcon,
    DocumentMinusIcon,
} from "@heroicons/react/24/outline";

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

export default function AdminUserManager({
    companyId,
    companyName,
    locationId,
    employees,
    currentUser,
}: {
    companyId: number;
    companyName: string;
    locationId: number;
    employees: any[];
    currentUser: any;
}) {
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
        setUsers(users.filter((user) => user.name !== name));
        setTasks(tasks.filter((task) => task.user !== name));
        setSelectedUser(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {greeting}, Admin!
                    </h1>
                    <p className="text-xl text-gray-600">{companyName}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            User Management
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Search
                            </button>
                        </div>

                        {selectedUser ? (
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        {selectedUser.name}'s Tasks
                                    </h3>
                                    <button
                                        onClick={() =>
                                            handleRemoveUser(selectedUser.name)
                                        }
                                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                    >
                                        <DocumentMinusIcon className="h-5 w-5 mr-2" />
                                        Remove User
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-green-100 rounded-lg p-6 shadow-md">
                                        <h4 className="text-lg font-semibold mb-2 text-green-800">
                                            Completed Tasks
                                        </h4>
                                        <p className="text-3xl font-bold text-green-600">
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
                                    <div className="bg-yellow-100 rounded-lg p-6 shadow-md">
                                        <h4 className="text-lg font-semibold mb-2 text-yellow-800">
                                            Pending Tasks
                                        </h4>
                                        <p className="text-3xl font-bold text-yellow-600">
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

                                <h4 className="text-xl font-semibold mb-4 text-gray-800">
                                    Task List
                                </h4>
                                <div className="space-y-4">
                                    {tasks
                                        .filter(
                                            (task) =>
                                                task.user === selectedUser.name
                                        )
                                        .map((task) => (
                                            <div
                                                key={task.id}
                                                className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
                                            >
                                                <div>
                                                    <p className="text-lg font-medium text-gray-800">
                                                        {task.title}
                                                    </p>
                                                    {task.completed && (
                                                        <p className="text-sm text-green-600">
                                                            Completed:{" "}
                                                            {task.completedAt}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleTaskCompletion(
                                                                task.id
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-md text-white flex items-center ${
                                                            task.completed
                                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                                : "bg-green-500 hover:bg-green-600"
                                                        } transition duration-300 ease-in-out`}
                                                    >
                                                        <CheckIcon className="h-5 w-5 mr-2" />
                                                        {task.completed
                                                            ? "Mark Incomplete"
                                                            : "Mark Complete"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveTask(
                                                                task.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out flex items-center"
                                                    >
                                                        <TrashIcon className="h-5 w-5 mr-2" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">
                                Search for a user to view their task details.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
