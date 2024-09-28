import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { getLocation } from "../../accessors/AscendHealthAccessor";
import Cookies from "js-cookie";

interface Location {
    id: number;
    name: string;
}

export default function Sidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchLocations = async () => {
            const locationIdsString = Cookies.get("user_location_ids");
            if (locationIdsString) {
                const ids = locationIdsString
                    .split(",")
                    .map((id) => parseInt(id, 10));
                try {
                    const fetchedLocations = await Promise.all(
                        ids.map(async (id: number) => {
                            const response = await getLocation(id);
                            const locationName = await response.text(); // Assuming the response is plain text
                            // Remove quotes from the location name
                            const cleanedName = locationName.replace(
                                /^"|"$/g,
                                ""
                            );
                            return { id, name: cleanedName };
                        })
                    );
                    setLocations(fetchedLocations);

                    // Set the first location as default if not already set
                    const storedLocationId = Cookies.get(
                        "selected_location_id"
                    );
                    if (storedLocationId) {
                        setSelectedLocationId(parseInt(storedLocationId, 10));
                    } else if (fetchedLocations.length > 0) {
                        setSelectedLocationId(fetchedLocations[0].id);
                        Cookies.set(
                            "selected_location_id",
                            fetchedLocations[0].id.toString()
                        );
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }
            }
        };

        fetchLocations();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLocationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const locationId = parseInt(event.target.value);
        setSelectedLocationId(locationId);
        Cookies.set("selected_location_id", locationId.toString());
    };

    const handleSignOut = () => {
        // Remove all cookies
        Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });

        // Redirect to home page
        navigate("/");
    };

    const renderNavItems = () => (
        <ul>
            <li className="mb-4">
                <select
                    value={selectedLocationId || ""}
                    onChange={handleLocationChange}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    ))}
                </select>
            </li>
            <li className="mb-4">
                <button
                    onClick={() => navigate("/admin")}
                    className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                    Task Management
                </button>
            </li>
            <li className="mb-4">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                    Employee Management
                </button>
            </li>
            <li className="mb-4">
                <button
                    onClick={() => navigate("/admin/create")}
                    className="w-full text-left text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                    Create Employee
                </button>
            </li>
            <li className="mt-auto">
                <button
                    onClick={handleSignOut}
                    className="w-full text-left text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                    Sign Out
                </button>
            </li>
        </ul>
    );

    return (
        <>
            {/* Hamburger Icon for Mobile */}
            <div className="md:hidden p-4 bg-indigo-700 text-white">
                <button onClick={toggleMenu}>
                    <ArrowDownRightIcon className="h-8 w-8" />
                </button>
            </div>

            {/* Sidebar for larger screens */}
            <aside className="hidden md:flex md:w-72 bg-indigo-700 text-white flex-col">
                <div className="py-6 px-4 bg-indigo-800">
                    <h1 className="text-center text-xl font-bold">
                        Office Manager
                    </h1>
                </div>
                <nav className="flex-1 px-4 mt-6 flex flex-col">
                    {renderNavItems()}
                </nav>
            </aside>

            {/* Full-screen Sidebar for mobile when open */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-indigo-700 text-white flex flex-col">
                    <div className="py-6 px-4 bg-indigo-800 flex justify-between items-center">
                        <h1 className="text-center text-xl font-bold">
                            Office Manager
                        </h1>
                        <button onClick={toggleMenu}>
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 mt-6 flex flex-col">
                        {renderNavItems()}
                    </nav>
                </div>
            )}
        </>
    );
}
