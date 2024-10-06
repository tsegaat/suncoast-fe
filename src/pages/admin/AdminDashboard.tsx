import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/SideBar";
import AdminTaskAssignment from "./AdminTaskAssignment";
import AdminUserManager from "./AdminUserManager";
import AdminCreateEmployee from "./AdminCreateEmployee";
import {
    getUser,
    getCompany,
    getUsersByLocation,
} from "../../accessors/AscendHealthAccessor";
import Cookies from "js-cookie";

const AdminDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );
    const [currentView, setCurrentView] = useState("tasks");
    const { companyId, locationId } = useParams<{
        companyId: string;
        locationId: string;
    }>();
    const navigate = useNavigate();

    // New state to store available locations
    const [availableLocations, setAvailableLocations] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = Cookies.get("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                // Fetch user data
                const userResponse = await getUser(undefined, token);
                const userData = await userResponse.json();
                setCurrentUser(userData);

                // Fetch company data (including locations)
                if (companyId) {
                    const companyResponse = await getCompany(
                        parseInt(companyId)
                    );
                    const companyData = await companyResponse.json();
                    setCompanyData(companyData);

                    // Set available locations based on user role
                    if (userData.role === "super_admin") {
                        setAvailableLocations(companyData.locations);
                    } else {
                        // For regular admin, filter locations based on their assigned locations
                        const userLocations = companyData.locations.filter(
                            (loc: any) =>
                                userData.location_ids.includes(loc.location_id)
                        );
                        setAvailableLocations(userLocations);
                    }

                    // Set initial selected location
                    if (userData.role === "super_admin") {
                        setSelectedLocationId(
                            parseInt(locationId!) ||
                                companyData.locations[0].location_id
                        );
                    } else {
                        // For regular admin, ensure they have access to the location
                        const userLocationIds = userData.location_ids || [];
                        const validLocationId = userLocationIds.includes(
                            parseInt(locationId!)
                        )
                            ? parseInt(locationId!)
                            : userLocationIds[0];
                        setSelectedLocationId(validLocationId);
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
                navigate("/");
            }
        };

        fetchData();
    }, [companyId, locationId, navigate]);

    useEffect(() => {
        // Fetch employees when selectedLocationId changes
        const fetchEmployees = async () => {
            if (selectedLocationId) {
                try {
                    const employeesResponse = await getUsersByLocation(
                        selectedLocationId
                    );
                    const employeesData = await employeesResponse.json();
                    setEmployees(employeesData);
                } catch (error) {
                    console.error("Error fetching employees:", error);
                }
            }
        };

        fetchEmployees();
    }, [selectedLocationId]);

    const handleLocationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newLocationId = parseInt(event.target.value);
        setSelectedLocationId(newLocationId);
        navigate(`/admin/${companyId}/${newLocationId}`);
    };

    const renderCurrentView = () => {
        const props = {
            companyId: parseInt(companyId!),
            locationId: selectedLocationId!,
            employees: employees,
            currentUser: currentUser,
            companyName: companyData?.name || "",
            setIsLoading: setIsLoading,
            locations: availableLocations, // Add this line to pass locations
            refreshEmployees: async () => {
                if (selectedLocationId) {
                    const employeesResponse = await getUsersByLocation(
                        selectedLocationId
                    );
                    const employeesData = await employeesResponse.json();
                    setEmployees(employeesData);
                }
            },
        };

        switch (currentView) {
            case "tasks":
                return <AdminTaskAssignment {...props} />;
            case "users":
                return <AdminUserManager {...props} />;
            case "create":
                return <AdminCreateEmployee {...props} />;
            default:
                return <AdminTaskAssignment {...props} />;
        }
    };

    const handleSignOut = () => {
        // Clear all cookies
        Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
        // Redirect to login page
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate("/maintenance")}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Maintenance Request
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    currentUser={currentUser}
                    companyName={companyData?.name || ""}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    isSuper={currentUser.role === "super_admin"}
                    locations={availableLocations}
                    selectedLocationId={selectedLocationId}
                    handleLocationChange={handleLocationChange}
                />
                <div className="flex-1 overflow-auto p-8">
                    {renderCurrentView()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
