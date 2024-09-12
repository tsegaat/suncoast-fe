import React, { useState, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { CheckIcon, TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helper";

interface Task {
    id: number;
    title: string;
    completed: boolean;
    completedAt?: string;
    origin: "tasks" | "taskPool";
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: "Task 1", completed: false, origin: "tasks" },
        { id: 2, title: "Task 2", completed: false, origin: "tasks" },
        {
            id: 3,
            title: "Task 3",
            completed: true,
            completedAt: "2024-09-07 10:30 AM",
            origin: "tasks",
        },
    ]);

    const [taskPool, setTaskPool] = useState<Task[]>([
        { id: 4, title: "Task 4 (Pool)", completed: false, origin: "taskPool" },
        { id: 5, title: "Task 5 (Pool)", completed: false, origin: "taskPool" },
    ]);

    const [currentTab, setCurrentTab] = useState(0);
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Acme Corp");

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

    const handleCompleteTask = (id: number) => {
        const dateTimeNow = new Date().toLocaleString();
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? { ...task, completed: true, completedAt: dateTimeNow }
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
                                  completed: false,
                                  completedAt: undefined,
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

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-full md:max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, User!
                    </h1>
                    <p className="text-lg text-gray-600">{companyName}</p>
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
                                    .filter((task) => !task.completed)
                                    .map((task) => (
                                        <li
                                            key={task.id}
                                            className="flex justify-between items-center mb-4"
                                        >
                                            <span>{task.title}</span>
                                            <button
                                                onClick={() =>
                                                    handleCompleteTask(task.id)
                                                }
                                                className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md"
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
                                    .filter((task) => task.completed)
                                    .map((task) => (
                                        <li
                                            key={task.id}
                                            className="flex justify-between items-center mb-4"
                                        >
                                            <div>
                                                <span>{task.title}</span>
                                                <span className="text-sm text-gray-500 ml-4">
                                                    Completed At:{" "}
                                                    {task.completedAt}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveTask(task.id)
                                                }
                                                className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md"
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
                                        className="flex justify-between items-center mb-4"
                                    >
                                        <span>{task.title}</span>
                                        <button
                                            onClick={() =>
                                                handleAddTaskFromPool(task.id)
                                            }
                                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md"
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
