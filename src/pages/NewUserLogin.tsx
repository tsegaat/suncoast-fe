import React, { useState, useEffect } from "react";
import { loginUser, getUser } from "../accessors/AscendHealthAccessor";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const NewUserLogin: React.FC = () => {
    const [username, setUsername] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            redirectBasedOnRole(token);
        }
    }, []);

    const toggleTempPasswordVisibility = () => {
        setShowTempPassword(!showTempPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const redirectBasedOnRole = async (access_token: string) => {
        let role = "";
        const userResponse = await getUser(undefined, access_token);

        if (userResponse.ok) {
            const userData = await userResponse.json();
            role = userData.role;
        } else {
            console.error("Failed to get user details");
        }

        switch (role) {
            case "admin":
                navigate("/admin");
                break;
            case "super_admin":
                navigate("/companies");
                break;
            case "employee":
                navigate("/tasks");
                break;
            default:
                Cookies.remove("token");
                Cookies.remove("userRole");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            setIsLoading(false);
            return;
        }

        try {
            const loginResponse = await loginUser({
                username: username.toLowerCase(),
                password: tempPassword,
                new_password: newPassword,
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                Cookies.set("token", loginData.access_token);
                setMessage({
                    type: "success",
                    text: "Account setup successful! Redirecting...",
                });
                redirectBasedOnRole(loginData.access_token);
            } else {
                let errorMessage = "An error occurred. Please try again.";
                if (loginResponse.status === 401) {
                    errorMessage = "Incorrect username or temporary password.";
                } else if (loginResponse.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }
                setMessage({
                    type: "error",
                    text: errorMessage,
                });
            }
        } catch (error) {
            console.error("Error during new user login:", error);
            setMessage({
                type: "error",
                text: "An error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Set up your new account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {message.text && (
                        <div
                            className={`mb-4 p-4 rounded-md ${
                                message.type === "error"
                                    ? "bg-red-50 text-red-800"
                                    : "bg-green-50 text-green-800"
                            }`}
                        >
                            <p className="text-sm font-medium">
                                {message.text}
                            </p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tempPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Temporary Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="tempPassword"
                                    name="tempPassword"
                                    type={
                                        showTempPassword ? "text" : "password"
                                    }
                                    required
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={tempPassword}
                                    onChange={(e) =>
                                        setTempPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={toggleTempPasswordVisibility}
                                >
                                    {showTempPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={toggleNewPasswordVisibility}
                                >
                                    {showNewPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    required
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
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
                                            d="M4 12a8 8 0 018-8V0C5.373 0 05.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : null}
                                {isLoading ? "Setting up..." : "Set up account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUserLogin;
