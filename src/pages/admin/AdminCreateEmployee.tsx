import React, { useState, useEffect } from "react";
import {
    createEmployee,
    getCompany,
} from "../../accessors/AscendHealthAccessor";
import Sidebar from "../../components/admin/SideBar";
import Cookies from "js-cookie";

const AdminCreateEmployee = () => {
    const [email, setEmail] = useState("");
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [notification, setNotification] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {
        const fetchCompanyData = async () => {
            const userCompanyId = Cookies.get("user_company_id");
            if (userCompanyId) {
                try {
                    const companyResponse = await getCompany(
                        parseInt(userCompanyId)
                    );
                    const companyData = await companyResponse.json();
                    setCompanyName(companyData.name);
                } catch (error) {
                    console.error("Error fetching company data:", error);
                }
            }
        };

        fetchCompanyData();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const userCompanyId = Cookies.get("user_company_id");
        const userId = Cookies.get("user_user_id");
        const locationId = Cookies.get("selected_location_id");

        const response = await createEmployee({
            email: email.toLowerCase(),
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
        setIsLoading(false);

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
                    <h2 className="text-2xl font-bold mb-2">
                        Create New Employee
                    </h2>
                    {companyName && (
                        <p className="text-lg text-gray-600 mb-6">
                            {companyName}
                        </p>
                    )}
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
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                            ) : null}
                            Create Employee
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateEmployee;
