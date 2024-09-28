import React, { useState, useEffect } from "react";
import { loginUser, getUser } from "../accessors/AscendHealthAccessor";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            redirectBasedOnRole(token);
        }
    }, []);

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
        try {
            const response = await loginUser({
                username: username.toLowerCase(),
                password,
            });
            if (response.ok) {
                const data = await response.json();
                Cookies.set("token", data.access_token);
                setMessage({
                    type: "success",
                    text: "Login successful! Redirecting...",
                });
                redirectBasedOnRole(data.access_token);
            } else {
                setMessage({
                    type: "error",
                    text:
                        response.status === 401
                            ? "Incorrect username or password"
                            : "An error occurred. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error during login:", error);
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
                    Sign in to your account
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : null}
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
