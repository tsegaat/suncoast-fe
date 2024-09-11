import React from "react";
import { useState } from "react";
import { Tabs, Tab, Box, Button, Typography } from "@mui/material";

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

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
                <Typography
                    variant="h4"
                    className="mb-6 text-center text-lg md:text-2xl"
                >
                    Your Tasks
                </Typography>

                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    centered
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Pending Tasks" />
                    <Tab label="Completed Tasks" />
                    <Tab label="Task Pool" />
                </Tabs>

                <Box className="mt-6">
                    {currentTab === 0 && (
                        <Box>
                            <Typography
                                variant="h6"
                                className="mb-4 text-base md:text-lg"
                            >
                                Pending Tasks
                            </Typography>
                            <ul>
                                {tasks
                                    .filter((task) => !task.completed)
                                    .map((task) => (
                                        <li
                                            key={task.id}
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"
                                        >
                                            <span className="mb-2 md:mb-0">
                                                {task.title}
                                            </span>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="w-full md:w-auto"
                                                onClick={() =>
                                                    handleCompleteTask(task.id)
                                                }
                                            >
                                                Mark as Complete
                                            </Button>
                                        </li>
                                    ))}
                            </ul>
                        </Box>
                    )}

                    {currentTab === 1 && (
                        <Box>
                            <Typography
                                variant="h6"
                                className="mb-4 text-base md:text-lg"
                            >
                                Completed Tasks
                            </Typography>
                            <ul>
                                {tasks
                                    .filter((task) => task.completed)
                                    .map((task) => (
                                        <li key={task.id} className="mb-4">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                                <div>
                                                    <span>{task.title}</span>
                                                    <span className="text-sm text-gray-500 ml-4">
                                                        Completed At:{" "}
                                                        {task.completedAt}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemoveTask(
                                                            task.id
                                                        )
                                                    }
                                                    className="mt-2 md:mt-0 w-full md:w-auto"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </Box>
                    )}

                    {currentTab === 2 && (
                        <Box>
                            <Typography
                                variant="h6"
                                className="mb-4 text-base md:text-lg"
                            >
                                Task Pool
                            </Typography>
                            <ul>
                                {taskPool.map((task) => (
                                    <li
                                        key={task.id}
                                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"
                                    >
                                        <span className="mb-2 md:mb-0">
                                            {task.title}
                                        </span>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleAddTaskFromPool(task.id)
                                            }
                                            className="w-full md:w-auto"
                                        >
                                            Append to My Tasks
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </Box>
            </div>
        </div>
    );
}
