import React, { useState } from "react";
import { createEmployee } from "../../accessors/AscendHealthAccessor";

interface AdminCreateEmployeeProps {
    companyId: number;
    locationId: number;
    currentUser: any;
    companyName: string;
    setIsLoading: (isLoading: boolean) => void;
}

const AdminCreateEmployee: React.FC<AdminCreateEmployeeProps> = ({
    companyId,
    locationId,
    currentUser,
    companyName,
    setIsLoading,
}) => {
    const [email, setEmail] = useState("");
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [role, setRole] = useState("employee");
    const [notification, setNotification] = useState({ type: "", message: "" });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await createEmployee({
                email: email.toLowerCase(),
                role: role,
                first_name: employeeFirstName,
                last_name: employeeLastName,
                company_id: companyId,
                created_by: currentUser.user_id,
                location_ids: [locationId],
            });

            if (response.ok) {
                setNotification({
                    type: "success",
                    message: `${
                        role.charAt(0).toUpperCase() + role.slice(1)
                    } created successfully`,
                });
                setEmail("");
                setEmployeeFirstName("");
                setEmployeeLastName("");
                setRole("employee");
            } else {
                setNotification({
                    type: "error",
                    message: `Failed to create ${role}`,
                });
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            setNotification({
                type: "error",
                message: "An error occurred while creating the employee",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = () => {
        if (currentUser.role === "super_admin") {
            return ["employee", "admin", "super_admin"];
        } else {
            return ["employee", "admin"];
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Create New Employee</h2>
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        id="first-name"
                        value={employeeFirstName}
                        onChange={(e) => setEmployeeFirstName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="last-name"
                        value={employeeLastName}
                        onChange={(e) => setEmployeeLastName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {roleOptions().map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Create {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateEmployee;
