import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationModal from "../../components/superadmin/LocationModal";
import EditCompanyModal from "../../components/superadmin/EditCompanyModal";
import {
    listCompanies,
    deleteCompany,
    updateCompany,
} from "../../accessors/AscendHealthAccessor";
import { TrashIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

interface Location {
    name: string;
    address: string;
    location_id: number;
    company_id: number;
    created_at: string;
}

interface Company {
    name: string;
    company_id: number;
    logo_url: string | null;
    created_at: string;
    locations: Location[];
}

export default function SuperAdminPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        null
    );
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await listCompanies();
            const data = await response.json();
            setCompanies(data);
            setFilteredCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = companies.filter((company) =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompanies(filtered);
    };

    const handleCompanyClick = (company: Company) => {
        setSelectedCompany(company);
        setIsLocationModalOpen(true);
    };

    const handleEditClick = (event: React.MouseEvent, company: Company) => {
        event.stopPropagation();
        setSelectedCompany(company);
        setIsEditModalOpen(true);
    };

    const handleLocationSelect = (location: Location) => {
        if (selectedCompany) {
            navigate(
                `/admin/${selectedCompany.company_id}/${location.location_id}`
            );
        }
        setIsLocationModalOpen(false);
    };

    const handleDeleteClick = (event: React.MouseEvent, company: Company) => {
        event.stopPropagation();
        setCompanyToDelete(company);
    };

    const confirmDelete = async () => {
        if (companyToDelete) {
            setIsLoading(true);
            try {
                await deleteCompany(companyToDelete.company_id);
                setCompanies(
                    companies.filter(
                        (c) => c.company_id !== companyToDelete.company_id
                    )
                );
                setFilteredCompanies(
                    filteredCompanies.filter(
                        (c) => c.company_id !== companyToDelete.company_id
                    )
                );
                setCompanyToDelete(null);
            } catch (error) {
                console.error("Error deleting company:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateCompany = async (updatedCompanyData: FormData) => {
        if (selectedCompany) {
            try {
                await updateCompany(
                    selectedCompany.company_id,
                    updatedCompanyData
                );
                const updatedCompanies = companies.map((company) =>
                    company.company_id === selectedCompany.company_id
                        ? { ...company, ...updatedCompanyData }
                        : company
                );
                setCompanies(updatedCompanies);
                setFilteredCompanies(updatedCompanies);
                setIsEditModalOpen(false);
            } catch (error) {
                console.error("Error updating company:", error);
            }
        }
    };

    const cancelDelete = () => {
        setCompanyToDelete(null);
    };

    const handleSignOut = () => {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach((cookieName) => {
            Cookies.remove(cookieName, { path: "/" });
        });
        navigate("/");
    };

    const handleCreateCompany = () => {
        navigate("/companies/register");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Super Admin Dashboard
                    </h1>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Manage Companies
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleCreateCompany}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create Company
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCompanies.map((company) => (
                        <div
                            key={company.company_id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer relative group"
                            onClick={() => handleCompanyClick(company)}
                        >
                            <img
                                src={company.logo_url || "/default-logo.png"}
                                alt={`${company.name} Logo`}
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-800 text-center">
                                {company.name}
                            </h2>
                            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={(e) => handleEditClick(e, company)}
                                    className="p-2 text-blue-500 hover:text-blue-700"
                                    title="Edit company"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleDeleteClick(e, company)
                                    }
                                    className="p-2 text-red-500 hover:text-red-700"
                                    title="Delete company"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedCompany && (
                <>
                    <LocationModal
                        isOpen={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        locations={selectedCompany.locations}
                        onLocationSelect={handleLocationSelect}
                    />
                    <EditCompanyModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        company={selectedCompany}
                        onUpdate={handleUpdateCompany}
                    />
                </>
            )}

            {companyToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">
                            Confirm Deletion
                        </h2>
                        <p>
                            Are you sure you want to delete{" "}
                            {companyToDelete.name}?
                        </p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
