import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

export default function Sidebar() {
    const navigate = useNavigate();
    return (
        <aside className="w-72 bg-indigo-700 text-white flex flex-col">
            <div className="py-6 px-4 bg-indigo-800">
                <Typography variant="h5" className="text-center font-bold">
                    Office Manager
                </Typography>
            </div>
            <nav className="flex-1 px-4 mt-6">
                <ul>
                    <li className="mb-4">
                        <Button
                            fullWidth
                            className="text-white flex items-center gap-2"
                            variant="text"
                            onClick={() => navigate("/admin")}
                        >
                            Task Overview
                        </Button>
                    </li>
                    <li className="mb-4">
                        <Button
                            fullWidth
                            className="text-white flex items-center gap-2"
                            variant="text"
                            onClick={() => navigate("/admin/users")}
                        >
                            Manage Employees
                        </Button>
                    </li>
                    <li>
                        <Button
                            fullWidth
                            className="text-white flex items-center gap-2"
                            variant="text"
                        >
                            Settings
                        </Button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
