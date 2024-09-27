import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../accessors/AscendHealthAccessor";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export function AdminPrivateRoutes() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await getUser(undefined, token);
                const userData = await response.json();
                setIsAdmin(userData?.role === "admin");
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsAdmin(false);
            }
        };

        fetchUser();
    }, []);

    if (isAdmin === null) {
        return <div>Loading...</div>; // Or a loading spinner component
    }

    return token && isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export function SuperAdminPrivateRoutes() {
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setIsSuperAdmin(false);
                return;
            }

            try {
                const response = await getUser(undefined, token);
                const userData = await response.json();
                setIsSuperAdmin(userData?.role === "super_admin");
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsSuperAdmin(false);
            }
        };

        fetchUser();
    }, []);

    if (isSuperAdmin === null) {
        return <div>Loading...</div>; // Or a loading spinner component
    }

    return token && isSuperAdmin ? <Outlet /> : <Navigate to="/" />;
}

export function EmployeePrivateRoutes() {
    const [isEmployee, setIsEmployee] = useState<boolean | null>(null);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setIsEmployee(false);
                return;
            }

            try {
                const response = await getUser(undefined, token);
                const userData = await response.json();
                setIsEmployee(userData?.role === "employee");
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsEmployee(false);
            }
        };

        fetchUser();
    }, []);

    if (isEmployee === null) {
        return <div>Loading...</div>; // Or a loading spinner component
    }

    return token && isEmployee ? <Outlet /> : <Navigate to="/" />;
}
