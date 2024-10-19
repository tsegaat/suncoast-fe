import React, { useState, useEffect, useRef } from "react";
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
import { Bars3Icon } from "@heroicons/react/24/outline";

const AdminDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );
    const [currentView, setCurrentView] = useState("tasks");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { companyId, locationId } = useParams<{
        companyId: string;
        locationId: string;
    }>();
    const navigate = useNavigate();

    const [availableLocations, setAvailableLocations] = useState<any[]>([]);

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //         if (
    //             sidebarRef.current &&
    //             !sidebarRef.current.contains(event.target as Node)
    //         ) {
    //             setIsMobileSidebarOpen(false);
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

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
            locations: availableLocations,
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

    const handleMaintenanceRequest = () => {
        navigate("/maintenance");
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
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center justify-start">
                                <img
                                    src={
                                        companyData.logo_url ||
                                        "/default-logo.png"
                                    }
                                    alt={`${companyData.name} Logo`}
                                    className="w-24 h-24 object-contain mx-auto mb-4 mr-2"
                                />
                                <span className="text-xl font-semibold text-gray-800">
                                    {companyData?.name || "Admin Dashboard"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-600 mr-4">
                                {currentUser?.first_name}{" "}
                                {currentUser?.last_name}
                            </span>
                            <button
                                onClick={() =>
                                    setIsMobileSidebarOpen(!isMobileSidebarOpen)
                                }
                                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
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
                    handleMaintenanceRequest={handleMaintenanceRequest}
                    handleSignOut={handleSignOut}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                />
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="py-4">{renderCurrentView()}</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
