import React, { useState } from "react";
import { createUser } from "../../accessors/AscendHealthAccessor";
import Sidebar from "../../components/admin/SideBar";
import Cookies from "js-cookie";

const AdminCreateEmployee = () => {
    const [email, setEmail] = useState("");
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [notification, setNotification] = useState({ type: "", message: "" });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const userCompanyId = Cookies.get("user_company_id");
        const userId = Cookies.get("user_user_id");
        const locationId = Cookies.get("selected_location_id");

        const response = await createUser({
            email: email,
            role: "employee",
            first_name: employeeFirstName,
            last_name: employeeLastName,
            company_id: userCompanyId,
            created_by: userId,
            location_ids: [locationId],
        });

        if (response.ok) {
            setNotification({
                type: "success",
                message: "Employee created successfully",
            });
            // Reset form fields
            setEmail("");
            setEmployeeFirstName("");
            setEmployeeLastName("");
        } else {
            setNotification({
                type: "error",
                message: "Failed to create employee",
            });
        }

        // Clear notification after 3 seconds
        setTimeout(() => {
            setNotification({ type: "", message: "" });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">
                        Create New Employee
                    </h2>
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
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md"
                    >
                        <div className="mb-4">
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
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
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
                                onChange={(e) =>
                                    setEmployeeFirstName(e.target.value)
                                }
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
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
                                onChange={(e) =>
                                    setEmployeeLastName(e.target.value)
                                }
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Create Employee
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateEmployee;
