import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import Sidebar from "../../components/admin/SideBar";
import Cookies from "js-cookie";
import { getUser } from "../../accessors/AscendHealthAccessor";

// Define TaskPriority and User types
enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

interface User {
    id: number;
    name: string;
    // ... other user properties
}

interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: Date;
    is_pooled: boolean;
    priority: TaskPriority;
    location_id: number;
    assigned_to?: number;
}

const AdminTaskAssignment = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState<string | undefined>();
    const [dueDate, setDueDate] = useState<string | undefined>(); // Store as string for input compatibility
    const [isPooled, setIsPooled] = useState(false);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [locationId, setLocationId] = useState<number>(0); // Replace 0 with your default location ID or logic
    const [assignedTo, setAssignedTo] = useState<number | undefined>();
    const [selectedEmployee, setSelectedEmployee] = useState<
        User | undefined
    >();
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Suncoast");
    const [users, setUsers] = useState<User[]>([
        // Populate with actual user data
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        // ... other users
    ]);

    // Set greeting based on time of day
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

    const handleAssignTask = () => {
        if (newTask && (isPooled || selectedEmployee)) {
            const newTaskObj: Task = {
                id: tasks.length + 1,
                title: newTask,
                description: description,
                due_date: dueDate ? new Date(dueDate) : undefined,
                is_pooled: isPooled,
                priority: priority,
                location_id: locationId,
                assigned_to: isPooled ? undefined : selectedEmployee?.id,
            };
            setTasks([...tasks, newTaskObj]);
            // Reset form fields
            setNewTask("");
            setDescription(undefined);
            setDueDate(undefined);
            setIsPooled(false);
            setPriority(TaskPriority.MEDIUM);
            setLocationId(0); // Reset to default location ID
            setAssignedTo(undefined);
            setSelectedEmployee(undefined);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                {/* Greeting and Company Name */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, Admin!
                    </h1>
                    <p className="text-lg text-gray-600">{companyName}</p>
                </div>

                {/* Assign Task Section */}
                <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">
                        Assign New Task
                    </h2>

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
                                setPriority(e.target.value as TaskPriority)
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
                                        setSelectedEmployee(undefined); // Clear employee selection if task is pooled
                                    }
                                }}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Pool Task</span>
                        </label>

                        {!isPooled && (
                            // Change from <select> to <input> and adjust the properties accordingly
                            <input
                                type="text"
                                placeholder="Employee ID"
                                value={selectedEmployee?.id.toString() || ""}
                                onChange={(e) => {
                                    const user = users.find(
                                        (user) =>
                                            user.id.toString() ===
                                            e.target.value
                                    );
                                    setSelectedEmployee(user || undefined);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        )}

                        <button
                            onClick={handleAssignTask}
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Assign Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskAssignment;
