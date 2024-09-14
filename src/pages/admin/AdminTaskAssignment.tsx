import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import Sidebar from "../../components/admin/Sidebar";

interface Task {
    id: number;
    title: string;
    user: string;
    completed: boolean;
}

const AdminTaskAssignment = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [greeting, setGreeting] = useState("");
    const [companyName] = useState("Suncoast");
    const [users] = useState([
        "Assign to Pool",
        "Alice",
        "Bob",
        "Charlie",
        "David",
    ]);

    // Set greeting based on time of day
    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting("Good morning");
        } else if (currentHour < 18) {
            setGreeting("Good afternoon");
        } else {
            setGreeting("Good evening");
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                {/* Greeting and Company Name */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, Admin!
                    </h1>
                    <p className="text-lg text-gray-600">{companyName}</p>
                </div>

                {/* Assign Task Section */}
                <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">
                        Assign New Task
                    </h2>

                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />

                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="" disabled>
                                Select User
                            </option>
                            {users.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleAssignTask}
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Assign Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskAssignment;
