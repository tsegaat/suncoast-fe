import React, { useState, useEffect } from "react";
import { createTask } from "../../accessors/AscendHealthAccessor";
import { capitalizeFirstLetter } from "../../utils/helper";

enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
}

interface AdminTaskAssignmentProps {
    companyId: number;
    locationId: number;
    employees: any[];
    currentUser: any;
    companyName: string;
    setIsLoading: (isLoading: boolean) => void;
}

const AdminTaskAssignment: React.FC<AdminTaskAssignmentProps> = ({
    companyId,
    locationId,
    employees,
    currentUser,
    companyName,
    setIsLoading,
}) => {
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [isPooled, setIsPooled] = useState(false);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [notification, setNotification] = useState({ type: "", message: "" });
    const [isAssigning, setIsAssigning] = useState(false);
    const [taskPicture, setTaskPicture] = useState<File | null>(null);

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAssigning(true);

        if (newTask && (isPooled || selectedEmployee)) {
            const formData = new FormData();
            formData.append("task_title", newTask);
            formData.append("description", description);
            formData.append("due_date", dueDate);
            formData.append("is_pooled", String(isPooled));
            formData.append("priority", priority);
            formData.append("location_id", String(locationId));
            if (taskPicture) {
                formData.append("task_picture", taskPicture);
            }
            if (!isPooled && selectedEmployee) {
                formData.append("assigned_to", selectedEmployee);
            }

            try {
                const response = await createTask(formData);

                if (response.ok) {
                    setNotification({
                        type: "success",
                        message: "Task assigned successfully!",
                    });
                    // Reset form fields
                    setNewTask("");
                    setDescription("");
                    setDueDate("");
                    setIsPooled(false);
                    setPriority(TaskPriority.MEDIUM);
                    setSelectedEmployee("");
                    setTaskPicture(null);
                } else {
                    setNotification({
                        type: "error",
                        message: "Failed to assign task. Please try again.",
                    });
                }
            } catch (error) {
                console.error("Error assigning task:", error);
                setNotification({
                    type: "error",
                    message: "An error occurred. Please try again.",
                });
            } finally {
                setIsAssigning(false);
            }
        } else {
            setNotification({
                type: "error",
                message: "Please fill in all required fields",
            });
            setIsAssigning(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Assign New Task</h2>
            <p className="text-lg text-gray-600 mb-6">{companyName}</p>
            {notification.message && (
                <div
                    className={`mb-4 p-4 rounded-md ${
                        notification.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleAssignTask} className="space-y-4">
                <div>
                    <label
                        htmlFor="taskTitle"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Task Title
                    </label>
                    <input
                        type="text"
                        id="taskTitle"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as TaskPriority)
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Object.values(TaskPriority).map((priorityValue) => (
                            <option key={priorityValue} value={priorityValue}>
                                {capitalizeFirstLetter(priorityValue)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isPooled}
                            onChange={(e) => setIsPooled(e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Pool Task
                        </span>
                    </label>
                </div>
                {!isPooled && (
                    <div className="flex flex-col">
                        <label
                            htmlFor="employee"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Assign to Employee
                        </label>
                        <select
                            id="employee"
                            value={selectedEmployee}
                            onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                            }
                            required={!isPooled}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                                <option
                                    key={employee.user_id}
                                    value={employee.user_id}
                                >
                                    {capitalizeFirstLetter(employee.fname)}{" "}
                                    {capitalizeFirstLetter(employee.lname)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label
                        htmlFor="taskPicture"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Task Picture (JPEG/PNG)
                    </label>
                    <input
                        type="file"
                        id="taskPicture"
                        accept="image/jpeg, image/png"
                        onChange={(e) =>
                            setTaskPicture(e.target.files?.[0] || null)
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAssigning}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isAssigning ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
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
                            Assigning...
                        </>
                    ) : (
                        "Assign Task"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AdminTaskAssignment;
