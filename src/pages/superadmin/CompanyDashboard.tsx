import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationModal from "../../components/superadmin/LocationModal";
import {
    listCompanies,
    deleteCompany,
} from "../../accessors/AscendHealthAccessor";
import { TrashIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { PlusIcon } from "@heroicons/react/24/outline";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        null
    );
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(
        null
    );

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await listCompanies();
            const data = await response.json();
            setCompanies(data);
            setFilteredCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
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
        setIsModalOpen(true);
    };

    const handleLocationSelect = (location: Location) => {
        if (selectedCompany) {
            navigate("/admin");
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (event: React.MouseEvent, company: Company) => {
        event.stopPropagation();
        setCompanyToDelete(company);
    };

    const confirmDelete = async () => {
        if (companyToDelete) {
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
            }
        }
    };

    const cancelDelete = () => {
        setCompanyToDelete(null);
    };

    const handleSignOut = () => {
        // Get all cookie names
        const cookies = Cookies.get();

        // Remove all cookies
        Object.keys(cookies).forEach((cookieName) => {
            Cookies.remove(cookieName, { path: "/" });
        });

        // Navigate to the root page
        navigate("/");
    };

    const handleCreateCompany = () => {
        navigate("/companies/register");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Page Title */}
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
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
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

                {/* Companies Grid */}
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
                            <button
                                onClick={(e) => handleDeleteClick(e, company)}
                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                title="Delete company"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {selectedCompany && (
                <LocationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    locations={selectedCompany.locations}
                    onLocationSelect={handleLocationSelect}
                />
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
