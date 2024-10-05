// src/routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeTaskManager from "./pages/employee/EmployeeTaskManager";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompanyRegistration from "./pages/superadmin/CompanyRegistration";
import CompanyDashboard from "./pages/superadmin/CompanyDashboard";
import NewUserLogin from "./pages/NewUserLogin";
import {
    AdminPrivateRoutes,
    SuperAdminPrivateRoutes,
    EmployeePrivateRoutes,
} from "./pages/PrivateRoutes";
import Login from "./pages";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/newuser" element={<NewUserLogin />} />
                <Route element={<AdminPrivateRoutes />}>
                    <Route
                        path="/admin/:companyId/:locationId"
                        element={<AdminDashboard />}
                    />
                </Route>
                <Route element={<SuperAdminPrivateRoutes />}>
                    <Route path="/companies" element={<CompanyDashboard />} />
                    <Route
                        path="/companies/register"
                        element={<CompanyRegistration />}
                    />
                </Route>
                <Route element={<EmployeePrivateRoutes />}>
                    <Route path="/tasks" element={<EmployeeTaskManager />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
