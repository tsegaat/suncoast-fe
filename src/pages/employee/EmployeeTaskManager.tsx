import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { CheckIcon, TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helper";
import Cookies from "js-cookie";
import {
    getUser,
    getTasksByUserToken,
    updateTaskStatus,
    getCompany,
} from "../../accessors/AscendHealthAccessor";

enum TaskPriority {
    Low = 1,
    Medium = 2,
    High = 3,
}

enum TaskStatus {
    Pending = "open",
    InProgress = "in progress",
    Completed = "completed",
}

interface Task {
    task_id: number;
    task_title: string;
    description?: string;
    due_date?: string;
    is_pooled: boolean;
    priority: TaskPriority;
    location_id: number;
    creation_timestamp: string;
    creation_date_by_user: string;
    source: number;
    status: string;
    assigned_to: number;
    completed_timestamp?: string;
    edit_timestamp?: string;
}

export default function Tasks() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskPool, setTaskPool] = useState<Task[]>([]);

    const [currentTab, setCurrentTab] = useState(0);
    const [greeting, setGreeting] = useState("");
    const [companyName, setCompanyName] = useState("");

    const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);

    const toggleDescription = (id: number) => {
        setExpandedTaskIds((prev) =>
            prev.includes(id)
                ? prev.filter((taskId) => taskId !== id)
                : [...prev, id]
        );
    };

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting("Good morning");
        } else if (currentHour < 18) {
            setGreeting("Good afternoon");
        } else {
            setGreeting("Good evening");
        }

        const fetchUserData = async () => {
            const token = Cookies.get("token");
            if (token) {
                try {
                    const response = await getUser(undefined, token);
                    const userData = await response.json();
                    setCurrentUser(userData);
                    // Store each user data field in a separate cookie
                    Object.entries(userData).forEach(([key, value]) => {
                        Cookies.set(`user_${key}`, value as string, {
                            expires: 7,
                        });
                    });

                    if (userData.company_id) {
                        const companyResponse = await getCompany(
                            userData.company_id
                        );
                        const companyData = await companyResponse.json();
                        setCompanyName(companyData.name);
                    }

                    // Fetch tasks after getting user data
                    fetchTasks();
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getTasksByUserToken();
            let tasksData = await response.json();
            tasksData = tasksData.tasks;
            const pendingTasks = tasksData.filter(
                (task: Task) =>
                    task.status === TaskStatus.Pending ||
                    task.status === TaskStatus.InProgress
            );
            const completedTasks = tasksData.filter(
                (task: Task) => task.status === TaskStatus.Completed
            );
            const pooledTasks = tasksData.filter(
                (task: Task) => task.is_pooled
            );

            setTasks([...pendingTasks, ...completedTasks]);
            setTaskPool(pooledTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleCompleteTask = async (id: number) => {
        const token = Cookies.get("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await updateTaskStatus(id, TaskStatus.Completed);
            if (response.ok) {
                const dateTimeNow = new Date().toISOString();
                setTasks(
                    tasks.map((task) =>
                        task.task_id === id
                            ? {
                                  ...task,
                                  status: TaskStatus.Completed,
                                  completed_timestamp: dateTimeNow,
                              }
                            : task
                    )
                );
            } else {
                console.error("Failed to update task status");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const handleAddTaskFromPool = (id: number) => {
        const taskToAdd = taskPool.find((task) => task.task_id === id);
        if (taskToAdd) {
            setTasks([...tasks, { ...taskToAdd, is_pooled: false }]);
            setTaskPool(taskPool.filter((task) => task.task_id !== id));
        }
    };

    const handleRemoveTask = async (id: number) => {
        const taskToRemove = tasks.find((task) => task.task_id === id);
        if (taskToRemove) {
            const token = Cookies.get("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const response = await updateTaskStatus(id, TaskStatus.Pending);
                if (response.ok) {
                    if (!taskToRemove.is_pooled) {
                        setTasks(
                            tasks.map((task) =>
                                task.task_id === id
                                    ? {
                                          ...task,
                                          status: TaskStatus.Pending,
                                          completed_timestamp: undefined,
                                      }
                                    : task
                            )
                        );
                    } else {
                        setTaskPool([
                            ...taskPool,
                            { ...taskToRemove, is_pooled: true },
                        ]);
                        setTasks(tasks.filter((task) => task.task_id !== id));
                    }
                } else {
                    console.error("Failed to update task status");
                }
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
    };

    const handleSignOut = () => {
        // Get all cookie names
        const cookies = Cookies.get();

        // Remove all cookies
        Object.keys(cookies).forEach((cookieName) => {
            Cookies.remove(cookieName, { path: "/" });
        });

        // Navigate to the root page
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-full md:max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting},{" "}
                        {(currentUser && currentUser["first_name"]) || ""}!
                    </h1>
                    <p className="text-lg text-gray-600">{companyName}</p>
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
                    <TabList className="flex justify-center space-x-1 bg-indigo-100 p-2 rounded-xl mb-6">
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "px-4 py-2 rounded-lg",
                                    selected
                                        ? "bg-indigo-500 text-white"
                                        : "bg-indigo-100 text-indigo-700"
                                )
                            }
                        >
                            Pending Tasks
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "px-4 py-2 rounded-lg",
                                    selected
                                        ? "bg-indigo-500 text-white"
                                        : "bg-indigo-100 text-indigo-700"
                                )
                            }
                        >
                            Completed Tasks
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "px-4 py-2 rounded-lg",
                                    selected
                                        ? "bg-indigo-500 text-white"
                                        : "bg-indigo-100 text-indigo-700"
                                )
                            }
                        >
                            Task Pool
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <h2 className="text-lg font-semibold mb-4">
                                Pending Tasks
                            </h2>
                            <ul>
                                {tasks
                                    .filter(
                                        (task) =>
                                            task.status !== TaskStatus.Completed
                                    )
                                    .map((task) => (
                                        <li
                                            key={task.task_id}
                                            className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold">
                                                    {task.task_title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-gray-600">
                                                        {expandedTaskIds.includes(
                                                            task.task_id
                                                        )
                                                            ? task.description
                                                            : `${task.description.substring(
                                                                  0,
                                                                  100
                                                              )}...`}
                                                        {task.description
                                                            .length > 100 && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleDescription(
                                                                        task.task_id
                                                                    )
                                                                }
                                                                className="text-blue-500 ml-2"
                                                            >
                                                                {expandedTaskIds.includes(
                                                                    task.task_id
                                                                )
                                                                    ? "Less"
                                                                    : "More"}
                                                            </button>
                                                        )}
                                                    </p>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {task.due_date && (
                                                        <p>
                                                            Due Date:{" "}
                                                            {new Date(
                                                                task.due_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    <p>
                                                        Priority:{" "}
                                                        {task.priority}
                                                    </p>
                                                    <p>
                                                        Created At:{" "}
                                                        {new Date(
                                                            task.creation_timestamp
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCompleteTask(
                                                        task.task_id
                                                    )
                                                }
                                                className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md self-end"
                                            >
                                                <CheckIcon className="h-5 w-5 mr-1" />
                                                Mark as Complete
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </TabPanel>

                        <TabPanel>
                            <h2 className="text-lg font-semibold mb-4">
                                Completed Tasks
                            </h2>
                            <ul>
                                {tasks
                                    .filter(
                                        (task) =>
                                            task.status === TaskStatus.Completed
                                    )
                                    .map((task) => (
                                        <li
                                            key={task.task_id}
                                            className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold">
                                                    {task.task_title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-gray-600">
                                                        {expandedTaskIds.includes(
                                                            task.task_id
                                                        )
                                                            ? task.description
                                                            : `${task.description.substring(
                                                                  0,
                                                                  100
                                                              )}...`}
                                                        {task.description
                                                            .length > 100 && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleDescription(
                                                                        task.task_id
                                                                    )
                                                                }
                                                                className="text-blue-500 ml-2"
                                                            >
                                                                {expandedTaskIds.includes(
                                                                    task.task_id
                                                                )
                                                                    ? "Less"
                                                                    : "More"}
                                                            </button>
                                                        )}
                                                    </p>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {task.due_date && (
                                                        <p>
                                                            Due Date:{" "}
                                                            {new Date(
                                                                task.due_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    <p>
                                                        Priority:{" "}
                                                        {task.priority}
                                                    </p>
                                                    <p>
                                                        Created At:{" "}
                                                        {new Date(
                                                            task.creation_timestamp
                                                        ).toLocaleString()}
                                                    </p>
                                                    {task.completed_timestamp && (
                                                        <p>
                                                            Completed At:{" "}
                                                            {new Date(
                                                                task.completed_timestamp
                                                            ).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveTask(
                                                        task.task_id
                                                    )
                                                }
                                                className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md self-end"
                                            >
                                                <TrashIcon className="h-5 w-5 mr-1" />
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </TabPanel>

                        <TabPanel>
                            <h2 className="text-lg font-semibold mb-4">
                                Task Pool
                            </h2>
                            <ul>
                                {taskPool.map((task) => (
                                    <li
                                        key={task.task_id}
                                        className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                    >
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold">
                                                {task.task_title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-gray-600">
                                                    {expandedTaskIds.includes(
                                                        task.task_id
                                                    )
                                                        ? task.description
                                                        : `${task.description.substring(
                                                              0,
                                                              100
                                                          )}...`}
                                                    {task.description.length >
                                                        100 && (
                                                        <button
                                                            onClick={() =>
                                                                toggleDescription(
                                                                    task.task_id
                                                                )
                                                            }
                                                            className="text-blue-500 ml-2"
                                                        >
                                                            {expandedTaskIds.includes(
                                                                task.task_id
                                                            )
                                                                ? "Less"
                                                                : "More"}
                                                        </button>
                                                    )}
                                                </p>
                                            )}
                                            <div className="text-sm text-gray-500 mt-1">
                                                {task.due_date && (
                                                    <p>
                                                        Due Date:{" "}
                                                        {new Date(
                                                            task.due_date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p>Priority: {task.priority}</p>
                                                <p>
                                                    Created At:{" "}
                                                    {new Date(
                                                        task.creation_timestamp
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleAddTaskFromPool(
                                                    task.task_id
                                                )
                                            }
                                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md self-end"
                                        >
                                            <PlusIcon className="h-5 w-5 mr-1" />
                                            Add to My Tasks
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
}
