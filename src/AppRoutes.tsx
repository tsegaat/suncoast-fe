// src/routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyRegistration from "./pages/superadmin/CompanyRegistration";
import CompanyDashboard from "./pages/superadmin/CompanyDashboard";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/company" element={<CompanyDashboard />} />
                <Route
                    path="/company/register"
                    element={<CompanyRegistration />}
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
