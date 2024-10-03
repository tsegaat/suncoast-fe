import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { classNames } from "../../utils/helper";
import Cookies from "js-cookie";
import {
    getUser,
    getTasksByUserToken,
    updateTaskStatus,
    getCompany,
    // getPooledTasksWithCompanyIdAndLocationId
} from "../../accessors/AscendHealthAccessor";
import TaskList from "../../components/employee/TaskList";
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

export default function EmployeeTaskManager() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskPool, setTaskPool] = useState<Task[]>([]);
    const [greeting, setGreeting] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completingTaskId, setCompletingTaskId] = useState<number | null>(
        null
    );
    const [removingTaskId, setRemovingTaskId] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = Cookies.get("token");
            if (token) {
                try {
                    const userResponse = await getUser(undefined, token);
                    const userData = await userResponse.json();
                    setCurrentUser(userData);

                    const currentHour = new Date().getHours();
                    if (currentHour < 12) setGreeting("Good morning");
                    else if (currentHour < 18) setGreeting("Good afternoon");
                    else setGreeting("Good evening");

                    if (userData.company_id) {
                        const companyResponse = await getCompany(
                            userData.company_id
                        );
                        const companyData = await companyResponse.json();
                        setCompanyName(companyData.name);
                    }

                    await fetchTasks();
                    await fetchPooledTasks(
                        userData.company_id,
                        userData.location_ids[0]
                    );
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
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
            setTasks([...pendingTasks, ...completedTasks]);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchPooledTasks = async (companyId: number, locationId: number) => {
        try {
            // const response = await getPooledTasksWithCompanyIdAndLocationId(companyId, locationId);
            // const pooledTasksData = await response.json();
            const pooledTasksData: Task[] = [];
            setTaskPool(pooledTasksData);
        } catch (error) {
            console.error("Error fetching pooled tasks:", error);
        }
    };

    const toggleDescription = (id: number) => {
        setExpandedTaskIds((prev) =>
            prev.includes(id)
                ? prev.filter((taskId) => taskId !== id)
                : [...prev, id]
        );
    };

    const handleCompleteTask = async (id: number) => {
        setCompletingTaskId(id);
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
        } finally {
            setCompletingTaskId(null);
        }
    };

    const handleAddTaskFromPool = async (id: number) => {
        const taskToAdd = taskPool.find((task) => task.task_id === id);
        if (taskToAdd) {
            setCompletingTaskId(id);
            try {
                const response = await updateTaskStatus(
                    id,
                    TaskStatus.InProgress
                );
                if (response.ok) {
                    setTasks([
                        ...tasks,
                        {
                            ...taskToAdd,
                            is_pooled: false,
                            status: TaskStatus.InProgress,
                        },
                    ]);
                    setTaskPool(taskPool.filter((task) => task.task_id !== id));
                } else {
                    console.error("Failed to update task status");
                }
            } catch (error) {
                console.error("Error updating task status:", error);
            } finally {
                setCompletingTaskId(null);
            }
        }
    };

    const handleRemoveTask = async (id: number) => {
        setRemovingTaskId(id);
        try {
            const response = await updateTaskStatus(id, TaskStatus.Pending);
            if (response.ok) {
                setTasks(tasks.filter((task) => task.task_id !== id));
            } else {
                console.error("Failed to update task status");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setRemovingTaskId(null);
        }
    };

    const handleSignOut = () => {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach((cookieName) => {
            Cookies.remove(cookieName, { path: "/" });
        });
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-8 bg-blue-600 text-white">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">
                            {greeting}, {currentUser?.first_name || ""}!
                        </h1>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                    <p className="text-lg mt-2">{companyName}</p>
                </div>

                <TabGroup
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                >
                    <TabList className="flex bg-blue-50 p-8 space-x-1 rounded-t-lg">
                        {["Pending Tasks", "Completed Tasks", "Task Pool"].map(
                            (category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        classNames(
                                            "w-full py-2.5 text-sm font-medium leading-5 rounded-lg",
                                            "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                                            selected
                                                ? "bg-white shadow text-blue-700"
                                                : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-700"
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            )
                        )}
                    </TabList>
                    <TabPanels className="mt-2">
                        <TabPanel>
                            <TaskList
                                tasks={tasks.filter(
                                    (task) =>
                                        task.status !== TaskStatus.Completed
                                )}
                                handleCompleteTask={handleCompleteTask}
                                expandedTaskIds={expandedTaskIds}
                                toggleDescription={toggleDescription}
                                completingTaskId={completingTaskId}
                                buttonText="Mark as Complete"
                                buttonAction={handleCompleteTask}
                            />
                        </TabPanel>
                        <TabPanel>
                            <TaskList
                                tasks={tasks.filter(
                                    (task) =>
                                        task.status === TaskStatus.Completed
                                )}
                                handleRemoveTask={handleRemoveTask}
                                expandedTaskIds={expandedTaskIds}
                                toggleDescription={toggleDescription}
                                removingTaskId={removingTaskId}
                                buttonText="Remove"
                                buttonAction={handleRemoveTask}
                            />
                        </TabPanel>
                        <TabPanel>
                            <TaskList
                                tasks={taskPool}
                                handleAddTaskFromPool={handleAddTaskFromPool}
                                expandedTaskIds={expandedTaskIds}
                                toggleDescription={toggleDescription}
                                completingTaskId={completingTaskId}
                                buttonText="Add to My Tasks"
                                buttonAction={handleAddTaskFromPool}
                            />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
}
