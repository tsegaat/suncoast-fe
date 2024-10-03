import React from "react";
import { CheckIcon, ArrowPathIcon, PlusIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helper";

enum TaskPriority {
    Low = 1,
    Medium = 2,
    High = 3,
}

enum TaskStatus {
    Pending = "open",
    InProgress = "in progress",
    Completed = "completed",
}

interface Task {
    task_id: number;
    task_title: string;
    description?: string;
    due_date?: string;
    is_pooled: boolean;
    priority: TaskPriority;
    location_id: number;
    creation_timestamp: string;
    creation_date_by_user: string;
    source: number;
    status: string;
    assigned_to: number;
    completed_timestamp?: string;
    edit_timestamp?: string;
}

interface TaskListProps {
    tasks: Task[];
    handleCompleteTask?: (id: number) => Promise<void>;
    handleRelistTask?: (id: number) => Promise<void>;
    handleAddTaskFromPool?: (id: number) => Promise<void>;
    expandedTaskIds: number[];
    toggleDescription: (id: number) => void;
    completingTaskId?: number | null;
    relistingTaskId?: number | null;
    buttonText: string;
    buttonAction: (id: number) => Promise<void>;
}

const getPriorityText = (priority: number) => {
    switch (priority) {
        case 1:
            return { text: "Low", color: "text-green-600" };
        case 2:
            return { text: "Medium", color: "text-yellow-600" };
        case 3:
            return { text: "High", color: "text-orange-600" };
        case 4:
            return { text: "Urgent", color: "text-red-600" };
        default:
            return { text: "Unknown", color: "text-gray-600" };
    }
};

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    expandedTaskIds,
    toggleDescription,
    completingTaskId,
    relistingTaskId,
    buttonText,
    buttonAction,
}) => {
    const getButtonIcon = (text: string) => {
        switch (text) {
            case "Mark as Complete":
                return <CheckIcon className="h-5 w-5 mr-1" />;
            case "Relist":
                return <ArrowPathIcon className="h-5 w-5 mr-1" />;
            case "Add to My Tasks":
                return <PlusIcon className="h-5 w-5 mr-1" />;
            default:
                return null;
        }
    };

    const getButtonColor = (text: string) => {
        switch (text) {
            case "Mark as Complete":
                return "bg-green-600 hover:bg-green-700";
            case "Relist":
                return "bg-yellow-600 hover:bg-yellow-700";
            case "Add to My Tasks":
                return "bg-blue-600 hover:bg-blue-700";
            default:
                return "bg-gray-600 hover:bg-gray-700";
        }
    };

    return (
        <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
                <li
                    key={task.task_id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                {task.task_title}
                            </h3>
                            {task.description && (
                                <p className="mt-1 text-sm text-gray-600">
                                    {expandedTaskIds.includes(task.task_id)
                                        ? task.description
                                        : `${task.description.substring(
                                              0,
                                              100
                                          )}...`}
                                    {task.description.length > 100 && (
                                        <button
                                            onClick={() =>
                                                toggleDescription(task.task_id)
                                            }
                                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                                        >
                                            {expandedTaskIds.includes(
                                                task.task_id
                                            )
                                                ? "Less"
                                                : "More"}
                                        </button>
                                    )}
                                </p>
                            )}
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                {task.due_date && (
                                    <p className="mr-4">
                                        Due Date:{" "}
                                        {new Date(
                                            task.due_date
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                                <p className="mr-4">
                                    Priority:{" "}
                                    <span
                                        className={classNames(
                                            "font-medium",
                                            getPriorityText(task.priority).color
                                        )}
                                    >
                                        {getPriorityText(task.priority).text}
                                    </span>
                                </p>
                                <p>
                                    Created:{" "}
                                    {new Date(
                                        task.creation_timestamp
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm sm:mt-0">
                            <button
                                onClick={() => buttonAction(task.task_id)}
                                className={`flex items-center px-3 py-1 rounded-md text-white ${getButtonColor(
                                    buttonText
                                )} transition-colors`}
                                disabled={
                                    completingTaskId === task.task_id ||
                                    relistingTaskId === task.task_id
                                }
                            >
                                {completingTaskId === task.task_id ||
                                relistingTaskId === task.task_id ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2"
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
                                ) : (
                                    getButtonIcon(buttonText)
                                )}
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
