/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import Sidebar from "../../components/admin/Sidebar";

interface Task {
    id: number;
    title: string;
    user: string;
    completed: boolean;
    completedAt?: string;
}

interface User {
    name: string;
}

const ManageUsersPage = () => {
    // Pre-populated demo users and tasks
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Design the homepage",
            user: "Alice",
            completed: false,
        },
        {
            id: 2,
            title: "Update inventory system",
            user: "Bob",
            completed: true,
            completedAt: "2024-09-07 10:30 AM",
        },
        {
            id: 3,
            title: "Fix bugs on mobile site",
            user: "Charlie",
            completed: false,
        },
        {
            id: 4,
            title: "Write blog post",
            user: "Alice",
            completed: true,
            completedAt: "2024-09-07 11:00 AM",
        },
        {
            id: 5,
            title: "Optimize database queries",
            user: "David",
            completed: false,
        },
    ]);

    const [users] = useState<User[]>([
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" },
        { name: "David" },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSearch = () => {
        const user = users.find((u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSelectedUser(user || null);
    };

    const handleTaskCompletion = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          completed: !task.completed,
                          completedAt: task.completed
                              ? undefined
                              : new Date().toLocaleString(),
                      }
                    : task
            )
        );
    };

    const handleRemoveTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <Typography variant="h4" className="mb-6 text-gray-700">
                    Manage Users
                </Typography>

                {/* Search Bar */}
                <Box className="mb-6">
                    <Typography variant="h6" className="mb-4 text-gray-600">
                        Search for a User
                    </Typography>
                    <Box className="flex gap-4">
                        <TextField
                            label="Enter User Name"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>

                {/* User Details Section */}
                {selectedUser ? (
                    <div>
                        <Typography variant="h5" className="mb-4 text-gray-700">
                            {selectedUser.name}'s Tasks
                        </Typography>

                        <Grid container spacing={4}>
                            {/* Completed Tasks */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg bg-green-100">
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            className="mb-4 text-green-700"
                                        >
                                            Completed Tasks
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            className="font-bold"
                                        >
                                            {
                                                tasks.filter(
                                                    (task) =>
                                                        task.user ===
                                                            selectedUser.name &&
                                                        task.completed
                                                ).length
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Pending Tasks */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg bg-yellow-100">
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            className="mb-4 text-yellow-700"
                                        >
                                            Pending Tasks
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            className="font-bold"
                                        >
                                            {
                                                tasks.filter(
                                                    (task) =>
                                                        task.user ===
                                                            selectedUser.name &&
                                                        !task.completed
                                                ).length
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Detailed Task List */}
                        <Box className="mt-10">
                            <Typography
                                variant="h5"
                                className="mb-4 text-gray-700"
                            >
                                Task List for {selectedUser.name}
                            </Typography>
                            <Grid container spacing={2}>
                                {tasks
                                    .filter(
                                        (task) =>
                                            task.user === selectedUser.name
                                    )
                                    .map((task) => (
                                        <Grid item xs={12} key={task.id}>
                                            <Card className="shadow-md">
                                                <CardContent>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <Typography variant="body1">
                                                                {task.title}
                                                            </Typography>
                                                            {task.completed && (
                                                                <Typography
                                                                    variant="body2"
                                                                    className="text-green-500"
                                                                >
                                                                    Completed
                                                                    At:{" "}
                                                                    {
                                                                        task.completedAt
                                                                    }
                                                                </Typography>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outlined"
                                                                color={
                                                                    task.completed
                                                                        ? "secondary"
                                                                        : "primary"
                                                                }
                                                                onClick={() =>
                                                                    handleTaskCompletion(
                                                                        task.id
                                                                    )
                                                                }
                                                            >
                                                                {task.completed
                                                                    ? "Mark Incomplete"
                                                                    : "Mark Complete"}
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() =>
                                                                    handleRemoveTask(
                                                                        task.id
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    </div>
                ) : (
                    <Typography variant="body1" className="mt-6 text-gray-500">
                        Search for a user to view their task details.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
