import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { CheckIcon, TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helper";
import Cookies from "js-cookie";
import { getUser } from "../../accessors/AscendHealthAccessor";

enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
}

enum TaskStatus {
    Pending = "Pending",
    InProgress = "InProgress",
    Completed = "Completed",
}

interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: Date;
    priority: TaskPriority;
    creation_timestamp: Date;
    created_by: number;
    status: TaskStatus;
    completed_timestamp?: Date;
    origin: "tasks" | "taskPool";
}

export default function Tasks() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Task 1",
            description:
                "In the realm of software development, the journey from concept to deployment is a multifaceted and intricate process that requires a blend of creativity, technical prowess, and meticulous planning. At the heart of this journey lies the codebase, a living, breathing entity that evolves over time, shaped by the hands of developers who craft its structure and functionality.",
            due_date: new Date("2024-09-30"),
            priority: TaskPriority.High,
            creation_timestamp: new Date("2024-09-01T08:00:00"),
            created_by: 1,
            status: TaskStatus.Pending,
            origin: "tasks",
        },
        {
            id: 2,
            title: "Task 2",
            description: "Description of Task 2",
            due_date: new Date("2024-10-05"),
            priority: TaskPriority.Medium,
            creation_timestamp: new Date("2024-09-02T09:00:00"),
            created_by: 1,
            status: TaskStatus.Pending,
            origin: "tasks",
        },
        {
            id: 3,
            title: "Task 3",
            description: "Description of Task 3",
            due_date: new Date("2024-09-20"),
            priority: TaskPriority.Low,
            creation_timestamp: new Date("2024-09-03T10:00:00"),
            created_by: 1,
            status: TaskStatus.Completed,
            completed_timestamp: new Date("2024-09-07T10:30:00"),
            origin: "tasks",
        },
    ]);

    const [taskPool, setTaskPool] = useState<Task[]>([
        {
            id: 4,
            title: "Task 4 (Pool)",
            description: "Description of Task 4",
            due_date: new Date("2024-10-15"),
            priority: TaskPriority.Low,
            creation_timestamp: new Date("2024-09-04T11:00:00"),
            created_by: 1,
            status: TaskStatus.Pending,
            origin: "taskPool",
        },
        {
            id: 5,
            title: "Task 5 (Pool)",
            description: "Description of Task 5",
            due_date: new Date("2024-11-01"),
            priority: TaskPriority.Medium,
            creation_timestamp: new Date("2024-09-05T12:00:00"),
            created_by: 1,
            status: TaskStatus.Pending,
            origin: "taskPool",
        },
    ]);

    const [currentTab, setCurrentTab] = useState(0);
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Suncoast");

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
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleCompleteTask = (id: number) => {
        const dateTimeNow = new Date();
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          status: TaskStatus.Completed,
                          completed_timestamp: dateTimeNow,
                      }
                    : task
            )
        );
    };

    const handleAddTaskFromPool = (id: number) => {
        const taskToAdd = taskPool.find((task) => task.id === id);
        if (taskToAdd) {
            setTasks([...tasks, taskToAdd]);
            setTaskPool(taskPool.filter((task) => task.id !== id));
        }
    };

    const handleRemoveTask = (id: number) => {
        const taskToRemove = tasks.find((task) => task.id === id);
        if (taskToRemove) {
            if (taskToRemove.origin === "tasks") {
                setTasks(
                    tasks.map((task) =>
                        task.id === id
                            ? {
                                  ...task,
                                  status: TaskStatus.Pending,
                                  completed_timestamp: undefined,
                              }
                            : task
                    )
                );
            } else if (taskToRemove.origin === "taskPool") {
                setTaskPool([...taskPool, taskToRemove]);
                setTasks(tasks.filter((task) => task.id !== id));
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
                                            key={task.id}
                                            className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold">
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-gray-600">
                                                        {expandedTaskIds.includes(
                                                            task.id
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
                                                                        task.id
                                                                    )
                                                                }
                                                                className="text-blue-500 ml-2"
                                                            >
                                                                {expandedTaskIds.includes(
                                                                    task.id
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
                                                            {task.due_date.toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    <p>
                                                        Priority:{" "}
                                                        {task.priority}
                                                    </p>
                                                    <p>
                                                        Created At:{" "}
                                                        {task.creation_timestamp.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCompleteTask(task.id)
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
                                            key={task.id}
                                            className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold">
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-gray-600">
                                                        {expandedTaskIds.includes(
                                                            task.id
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
                                                                        task.id
                                                                    )
                                                                }
                                                                className="text-blue-500 ml-2"
                                                            >
                                                                {expandedTaskIds.includes(
                                                                    task.id
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
                                                            {task.due_date.toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    <p>
                                                        Priority:{" "}
                                                        {task.priority}
                                                    </p>
                                                    <p>
                                                        Created At:{" "}
                                                        {task.creation_timestamp.toLocaleString()}
                                                    </p>
                                                    {task.completed_timestamp && (
                                                        <p>
                                                            Completed At:{" "}
                                                            {task.completed_timestamp.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveTask(task.id)
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
                                        key={task.id}
                                        className="flex flex-col justify-between items-start mb-4 p-4 bg-gray-50 rounded-md"
                                    >
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-gray-600">
                                                    {expandedTaskIds.includes(
                                                        task.id
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
                                                                    task.id
                                                                )
                                                            }
                                                            className="text-blue-500 ml-2"
                                                        >
                                                            {expandedTaskIds.includes(
                                                                task.id
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
                                                        {task.due_date.toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p>Priority: {task.priority}</p>
                                                <p>
                                                    Created At:{" "}
                                                    {task.creation_timestamp.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleAddTaskFromPool(task.id)
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
