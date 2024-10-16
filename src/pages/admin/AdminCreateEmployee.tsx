import React, { useState, useEffect } from "react";
import { createEmployee } from "../../accessors/AscendHealthAccessor";
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface AdminCreateEmployeeProps {
    companyId: number;
    locationId: number;
    currentUser: any;
    companyName: string;
    locations: { location_id: number; name: string }[];
}

const AdminCreateEmployee: React.FC<AdminCreateEmployeeProps> = ({
    companyId,
    locationId,
    currentUser,
    companyName,
    locations,
}) => {
    const [email, setEmail] = useState("");
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [role, setRole] = useState("employee");
    const [notification, setNotification] = useState({ type: "", message: "" });
    const [selectedLocations, setSelectedLocations] = useState<
        { location_id: number; name: string }[]
    >([]);
    const [isCreating, setIsCreating] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Set the default location to the currently selected location
        const defaultLocation = locations.find(
            (loc) => loc.location_id === locationId
        );
        if (defaultLocation) {
            setSelectedLocations([defaultLocation]);
        }
    }, [locationId, locations]);

    const filteredLocations =
        query === ""
            ? locations
            : locations.filter((location) => {
                  return location.name
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsCreating(true);

        try {
            const response = await createEmployee({
                email: email.toLowerCase(),
                role: role,
                fname: employeeFirstName,
                lname: employeeLastName,
                company_id: companyId,
                created_by: currentUser.user_id,
                location_ids: selectedLocations.map((loc) => loc.location_id),
            });

            if (response.ok) {
                setNotification({
                    type: "success",
                    message: `${
                        role.charAt(0).toUpperCase() + role.slice(1)
                    } created successfully`,
                });
                setEmail("");
                setEmployeeFirstName("");
                setEmployeeLastName("");
                setRole("employee");
                setSelectedLocations([]);
            } else {
                setNotification({
                    type: "error",
                    message: `Failed to create ${role}`,
                });
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            setNotification({
                type: "error",
                message: "An error occurred while creating the employee",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const roleOptions = () => {
        if (currentUser.role === "super_admin") {
            return ["employee", "admin", "super_admin"];
        } else {
            return ["employee", "admin"];
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Create New Employee</h2>
            <p className="text-lg text-gray-600 mb-6">{companyName}</p>
            {notification.message && (
                <div
                    className={`mb-4 p-4 rounded-md ${
                        notification.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        id="first-name"
                        value={employeeFirstName}
                        onChange={(e) => setEmployeeFirstName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="last-name"
                        value={employeeLastName}
                        onChange={(e) => setEmployeeLastName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {roleOptions().map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="locations"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Locations
                    </label>
                    <Combobox
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                        multiple
                    >
                        <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md sm:text-sm">
                                <ComboboxInput
                                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900"
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    displayValue={(
                                        locations: {
                                            location_id: number;
                                            name: string;
                                        }[]
                                    ) =>
                                        locations
                                            .map((location) => location.name)
                                            .join(", ")
                                    }
                                />
                                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm">
                                {filteredLocations.length === 0 &&
                                query !== "" ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    filteredLocations.map((location) => (
                                        <ComboboxOption
                                            key={location.location_id}
                                            className={({ focus }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    focus
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={location}
                                        >
                                            {({ selected, focus }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {location.name}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                focus
                                                                    ? "text-white"
                                                                    : "text-blue-600"
                                                            }`}
                                                        >
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))
                                )}
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>
                <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isCreating ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            Creating...
                        </>
                    ) : (
                        `Create ${role.charAt(0).toUpperCase() + role.slice(1)}`
                    )}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateEmployee;
