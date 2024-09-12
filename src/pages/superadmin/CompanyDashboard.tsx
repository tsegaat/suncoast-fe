import { useNavigate } from "react-router-dom";

interface Company {
    id: number;
    name: string;
    logo: string;
}

export default function SuperAdminPage() {
    const navigate = useNavigate();

    // Example companies data
    const companies: Company[] = [
        {
            id: 1,
            name: "Acme Corp",
            logo: "/logos/acme-logo.png", // Example logo paths
        },
        {
            id: 2,
            name: "Globex Corporation",
            logo: "/logos/globex-logo.png",
        },
        {
            id: 3,
            name: "Initech",
            logo: "/logos/initech-logo.png",
        },
        // Add more companies as needed
    ];

    const handleCompanyClick = (companyId: number) => {
        navigate(`/admin`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Page Title */}
            <div className="text-center py-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Super Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Manage your companies
                </p>
            </div>

            {/* Companies Grid */}
            <div className="flex-1 px-4 md:px-8 lg:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => handleCompanyClick(company.id)}
                            className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                        >
                            <img
                                src={company.logo}
                                alt={`${company.name} Logo`}
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-800 text-center">
                                {company.name}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
