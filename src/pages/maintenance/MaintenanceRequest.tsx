import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircleIcon, CameraIcon } from "@heroicons/react/24/outline";
import {
    getUser,
    getCompany,
    listCompanies,
    createMaintenanceRequest,
} from "../../accessors/AscendHealthAccessor";
import Cookies from "js-cookie";

interface Location {
    location_id: number;
    name: string;
}

interface Company {
    company_id: number;
    name: string;
    locations: Location[];
}

const MaintenanceRequestPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(
        null
    );
    const [userLocations, setUserLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const token = Cookies.get("token");
            if (token) {
                try {
                    const userResponse = await getUser(undefined, token);
                    const userData = await userResponse.json();
                    setCurrentUser(userData);

                    if (userData.role === "super_admin") {
                        const companiesResponse = await listCompanies();
                        const companiesData = await companiesResponse.json();
                        setCompanies(companiesData);
                    } else {
                        const companyResponse = await getCompany(
                            userData.company_id
                        );
                        const companyData = await companyResponse.json();
                        setCompanies([companyData]);
                        setSelectedCompany(companyData.company_id);

                        if (userData.role === "admin") {
                            setUserLocations(companyData.locations);
                        } else {
                            setUserLocations(
                                companyData.locations.filter((loc: Location) =>
                                    userData.location_ids.includes(
                                        loc.location_id
                                    )
                                )
                            );
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError("Failed to load user data. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = parseInt(e.target.value);
        setSelectedCompany(companyId);
        setSelectedLocation(null);
        const company = companies.find((c) => c.company_id === companyId);
        setUserLocations(company?.locations || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!selectedLocation) {
            setError("Please select a location");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("priority", priority);
        formData.append("location_id", selectedLocation.toString());
        formData.append("submitted_by_id", currentUser.user_id.toString());
        if (image) {
            formData.append("maintenance_picture", image);
        }

        try {
            const response = await createMaintenanceRequest(formData);

            if (response.ok) {
                navigate(-1);
            } else {
                throw new Error("Failed to submit maintenance request");
            }
        } catch (err) {
            setError(
                "An error occurred while submitting the request. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="p-8 w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Submit Maintenance Request
                            </h2>
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="company"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Company
                                </label>
                                <select
                                    id="company"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedCompany || ""}
                                    onChange={handleCompanyChange}
                                    disabled={
                                        currentUser.role !== "super_admin"
                                    }
                                >
                                    {companies.map((company) => (
                                        <option
                                            key={company.company_id}
                                            value={company.company_id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="location"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Location
                                </label>
                                <select
                                    id="location"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedLocation || ""}
                                    onChange={(e) =>
                                        setSelectedLocation(
                                            parseInt(e.target.value)
                                        )
                                    }
                                >
                                    <option value="">Select a location</option>
                                    {userLocations.map((location) => (
                                        <option
                                            key={location.location_id}
                                            value={location.location_id}
                                        >
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                ></textarea>
                            </div>
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value)
                                    }
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Maintenance Picture
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-md"
                                            />
                                        ) : (
                                            <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        )}
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>
                                                    {image
                                                        ? "Change picture"
                                                        : "Upload a picture"}
                                                </span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
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
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Request"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceRequestPage;
