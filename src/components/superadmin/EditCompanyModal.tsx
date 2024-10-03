import React, { useState } from "react";

interface Company {
    company_id: number;
    name: string;
    logo_url: string | null;
}

interface EditCompanyModalProps {
    company: Company;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedCompany: Partial<Company>) => Promise<void>;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
    company,
    isOpen,
    onClose,
    onUpdate,
}) => {
    const [name, setName] = useState(company.name);
    const [logo, setLogo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (logo) {
            formData.append("logo", logo);
        }

        try {
            // await onUpdate(formData);
            onClose();
        } catch (error) {
            console.error("Error updating company:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Edit Company
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="logo"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Company Logo
                        </label>
                        <input
                            type="file"
                            id="logo"
                            onChange={(e) =>
                                setLogo(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                            className="mt-1 block w-full"
                            accept="image/*"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyModal;
