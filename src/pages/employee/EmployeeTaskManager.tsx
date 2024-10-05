import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { classNames } from "../../utils/helper";
import Cookies from "js-cookie";
import {
    getUser,
    getTasksByUserToken,
    updateTaskStatus,
    getCompany,
    // getPooledTasksWithCompanyIdAndLocationId,
} from "../../accessors/AscendHealthAccessor";
import TaskList from "../../components/employee/TaskList";

enum TaskPriority {
    Low = 1,
    Medium = 2,
    High = 3,
}

enum TaskStatus {
    Pending = "pending",
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

interface Location {
    location_id: number;
    name: string;
}

export default function EmployeeTaskManager() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [taskPool, setTaskPool] = useState<Task[]>([]);
    const [greeting, setGreeting] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completingTaskId, setCompletingTaskId] = useState<number | null>(
        null
    );
    const [relistingTaskId, setRelistingTaskId] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );
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

                        // Filter locations based on user's location_ids
                        const userLocations = companyData.locations.filter(
                            (loc: Location) =>
                                userData.location_ids.includes(loc.location_id)
                        );
                        setLocations(userLocations);

                        // Set default selected location
                        if (userLocations.length > 0) {
                            setSelectedLocationId(userLocations[0].location_id);
                        }
                    }

                    await fetchTasks();
                    if (selectedLocationId) {
                        await fetchPooledTasks(
                            userData.company_id,
                            selectedLocationId
                        );
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedLocationId) {
            const filtered = tasks.filter(
                (task) => task.location_id === selectedLocationId
            );
            setFilteredTasks(filtered);
            fetchPooledTasks(currentUser.company_id, selectedLocationId);
        }
    }, [selectedLocationId, tasks, currentUser]);

    const fetchTasks = async () => {
        try {
            const response = await getTasksByUserToken();
            let tasksData = await response.json();
            tasksData = tasksData.tasks;
            setTasks(tasksData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchPooledTasks = async (companyId: number, locationId: number) => {
        try {
            // const response = await getPooledTasksWithCompanyIdAndLocationId(
            //     companyId,
            //     locationId
            // );
            // const pooledTasksData = await response.json();
            setTaskPool([]);
        } catch (error) {
            console.error("Error fetching pooled tasks:", error);
        }
    };

    const handleLocationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedLocationId(Number(event.target.value));
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

    const handleRelistTask = async (id: number) => {
        setRelistingTaskId(id);
        try {
            const response = await updateTaskStatus(id, TaskStatus.Pending);
            if (response.ok) {
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
                console.error("Failed to update task status");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setRelistingTaskId(null);
        }
    };

    const handleAddTaskFromPool = async (id: number) => {
        setCompletingTaskId(id);
        try {
            const response = await updateTaskStatus(id, TaskStatus.InProgress);
            if (response.ok) {
                const addedTask = taskPool.find((task) => task.task_id === id);
                if (addedTask) {
                    setTasks([
                        ...tasks,
                        { ...addedTask, status: TaskStatus.InProgress },
                    ]);
                    setTaskPool(taskPool.filter((task) => task.task_id !== id));
                }
            } else {
                console.error("Failed to update task status");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setCompletingTaskId(null);
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

                <div className="p-6">
                    <div className="mb-6">
                        <label
                            htmlFor="location-select"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Select Location
                        </label>
                        <select
                            id="location-select"
                            value={selectedLocationId || ""}
                            onChange={handleLocationChange}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

                    <Tab.Group
                        selectedIndex={selectedIndex}
                        onChange={setSelectedIndex}
                    >
                        <Tab.List className="flex bg-blue-50 p-1 space-x-1 rounded-lg">
                            {[
                                "Pending Tasks",
                                "Completed Tasks",
                                "Task Pool",
                            ].map((category) => (
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
                            ))}
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <Tab.Panel>
                                <TaskList
                                    tasks={filteredTasks.filter(
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
                            </Tab.Panel>
                            <Tab.Panel>
                                <TaskList
                                    tasks={filteredTasks.filter(
                                        (task) =>
                                            task.status === TaskStatus.Completed
                                    )}
                                    handleRelistTask={handleRelistTask}
                                    expandedTaskIds={expandedTaskIds}
                                    toggleDescription={toggleDescription}
                                    relistingTaskId={relistingTaskId}
                                    buttonText="Relist"
                                    buttonAction={handleRelistTask}
                                />
                            </Tab.Panel>
                            <Tab.Panel>
                                <TaskList
                                    tasks={taskPool}
                                    handleAddTaskFromPool={
                                        handleAddTaskFromPool
                                    }
                                    expandedTaskIds={expandedTaskIds}
                                    toggleDescription={toggleDescription}
                                    completingTaskId={completingTaskId}
                                    buttonText="Add to My Tasks"
                                    buttonAction={handleAddTaskFromPool}
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    );
}
