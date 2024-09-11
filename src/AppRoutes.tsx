// src/routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import ManageUsersPage from "./pages/admin/Users";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<ManageUsersPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
