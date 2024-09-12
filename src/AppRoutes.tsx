// src/routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserTaskManager from "./pages/users/UserTaskManager";
import AdminDashboard from "./pages/admin/AdminTaskAssignment";
import AdminUserManager from "./pages/admin/AdminUserManager";
import CompanyRegistration from "./pages/superadmin/CompanyRegistration";
import CompanyDashboard from "./pages/superadmin/CompanyDashboard";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserTaskManager />} />
                <Route path="/company" element={<CompanyDashboard />} />
                <Route
                    path="/company/register"
                    element={<CompanyRegistration />}
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserManager />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
