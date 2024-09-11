"use client";

import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import Sidebar from "../../components/admin/Sidebar";

interface Task {
    id: number;
    title: string;
    user: string;
    completed: boolean;
    completedAt?: string;
}

const AdminPage = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Design the homepage",
            user: "Alice",
            completed: false,
        },
        {
            id: 2,
            title: "Update the inventory system",
            user: "Bob",
            completed: true,
            completedAt: "2024-09-07 10:30 AM",
        },
    ]);

    const [newTask, setNewTask] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [users] = useState([
        "Assign to Pool",
        "Alice",
        "Bob",
        "Charlie",
        "David",
    ]);

    const handleAssignTask = () => {
        if (newTask && selectedUser) {
            const newTaskObj = {
                id: tasks.length + 1,
                title: newTask,
                user: selectedUser,
                completed: false,
            };
            setTasks([...tasks, newTaskObj]);
            setNewTask("");
            setSelectedUser("");
        }
    };

    const handleRemoveTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
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

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <Typography
                    variant="h4"
                    className="mb-6 text-gray-700 font-semibold"
                >
                    Admin Dashboard
                </Typography>

                <Grid container spacing={4}>
                    {/* Assign Task Section */}
                    <Grid item xs={12} md={6}>
                        <Card className="shadow-lg">
                            <CardContent>
                                <Typography variant="h6" className="mb-4">
                                    Assign New Task
                                </Typography>
                                <Box className="flex flex-col gap-4">
                                    <TextField
                                        label="Task Title"
                                        variant="outlined"
                                        value={newTask}
                                        onChange={(e) =>
                                            setNewTask(e.target.value)
                                        }
                                        fullWidth
                                    />
                                    <Select
                                        value={selectedUser}
                                        onChange={(e) =>
                                            setSelectedUser(e.target.value)
                                        }
                                        displayEmpty
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select User</em>
                                        </MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user} value={user}>
                                                {user}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAssignTask}
                                    >
                                        Assign Task
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Task Summary Cards */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
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
                                                    (task) => task.completed
                                                ).length
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
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
                                                    (task) => !task.completed
                                                ).length
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Task Management Section */}
                <Box className="mt-10">
                    <Typography
                        variant="h5"
                        className="mb-4 text-gray-700 font-semibold"
                    >
                        Manage Tasks
                    </Typography>
                    <Grid container spacing={2}>
                        {tasks.map((task) => (
                            <Grid item xs={12} md={6} key={task.id}>
                                <Card className="shadow-md">
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <Typography variant="body1">
                                                    {task.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    className="text-gray-500"
                                                >
                                                    Assigned to: {task.user}
                                                </Typography>
                                                {task.completed && (
                                                    <Typography
                                                        variant="body2"
                                                        className="text-green-500"
                                                    >
                                                        Completed At:{" "}
                                                        {task.completedAt}
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
        </div>
    );
};

export default AdminPage;
