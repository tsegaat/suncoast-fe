import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import Sidebar from "../../components/admin/SideBar";
import Cookies from "js-cookie";
import {
    getUser,
    getUsersByLocation,
    createTask,
} from "../../accessors/AscendHealthAccessor";

// Define TaskPriority and User types
enum TaskPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

interface Task {
    task_title: string;
    description?: string;
    due_date?: string;
    is_pooled: boolean;
    priority: TaskPriority;
    location_id: number;
    assigned_to?: number;
    company_id?: number;
}

const AdminTaskAssignment = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState<string | undefined>();
    const [dueDate, setDueDate] = useState<string | undefined>();
    const [isPooled, setIsPooled] = useState(false);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [locationId, setLocationId] = useState<number>(0);
    const [selectedEmployee, setSelectedEmployee] = useState<any>();
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Suncoast");
    const [employees, setEmployees] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<
        string | null
    >(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    console.log(userData);
                    // Store each user data field in a separate cookie
                    Object.entries(userData).forEach(
                        ([key, value]: [string, any]) => {
                            if (value !== null && value !== undefined) {
                                if (key === "location_ids") {
                                    Cookies.set(
                                        `user_${key}`,
                                        value.join(","),
                                        { expires: 7 }
                                    );
                                } else {
                                    Cookies.set(
                                        `user_${key}`,
                                        typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value),
                                        { expires: 7 }
                                    );
                                }
                            }
                        }
                    );

                    // Fetch employees for the selected location
                    const selectedLocationId = Cookies.get(
                        "selected_location_id"
                    );
                    if (selectedLocationId) {
                        setLocationId(parseInt(selectedLocationId));
                        const employeesResponse = await getUsersByLocation(
                            parseInt(selectedLocationId)
                        );
                        const employeesData = await employeesResponse.json();
                        setEmployees(employeesData);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleAssignTask = async () => {
        if (newTask && locationId && (isPooled || selectedEmployee)) {
            setIsSubmitting(true);
            const newTaskObj: Task = {
                task_title: newTask,
                description: description || undefined,
                due_date: dueDate,
                is_pooled: isPooled,
                priority: priority,
                location_id: locationId,
                assigned_to: isPooled
                    ? undefined
                    : selectedEmployee?.["user_id"],
                company_id: currentUser?.company_id,
            };

            try {
                const response = await createTask(newTaskObj);
                if (response.ok) {
                    const createdTask = await response.json();
                    setTasks([...tasks, createdTask]);
                    // Reset form fields
                    setNewTask("");
                    setDescription(undefined);
                    setDueDate(undefined);
                    setIsPooled(false);
                    setPriority(TaskPriority.MEDIUM);
                    setSelectedEmployee(undefined);
                    setErrorMessage(null);
                    setConfirmationMessage("Task added successfully!");
                    setTimeout(() => setConfirmationMessage(null), 3000);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.detail || "Error creating task");
                }
            } catch (error) {
                console.error("Error creating task:", error);
                setErrorMessage("An unexpected error occurred");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrorMessage("Please fill in all required fields");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, Admin!
                    </h1>
                    <p className="text-lg text-gray-600">{companyName}</p>
                </div>

                <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">
                        Assign New Task
                    </h2>

                    {errorMessage && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}

                    {confirmationMessage && (
                        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                            {confirmationMessage}
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                            minLength={1}
                            maxLength={200}
                        />

                        <textarea
                            placeholder="Task Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value as unknown as TaskPriority
                                )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value={TaskPriority.LOW}>Low</option>
                            <option value={TaskPriority.MEDIUM}>Medium</option>
                            <option value={TaskPriority.HIGH}>High</option>
                        </select>

                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={isPooled}
                                onChange={(e) => {
                                    setIsPooled(e.target.checked);
                                    if (e.target.checked) {
                                        setSelectedEmployee(undefined);
                                    }
                                }}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Pool Task</span>
                        </label>

                        {!isPooled && (
                            <select
                                value={selectedEmployee?.["user_id"] || ""}
                                onChange={(e) => {
                                    const employee = employees.find(
                                        (employee) =>
                                            employee["user_id"] ===
                                            parseInt(e.target.value)
                                    );
                                    setSelectedEmployee(employee);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select an employee</option>
                                {employees.map((employee) => (
                                    <option
                                        key={employee["user_id"]}
                                        value={employee["user_id"]}
                                    >
                                        {employee["first_name"]}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={handleAssignTask}
                            disabled={isSubmitting}
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {isSubmitting ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <PlusIcon className="h-5 w-5 mr-2" />
                            )}
                            {isSubmitting ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskAssignment;
