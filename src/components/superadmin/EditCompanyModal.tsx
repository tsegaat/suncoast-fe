import React, { useState } from "react";
import { PlusIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

interface Location {
    location_id?: number;
    name: string;
    address: string;
}

interface Company {
    company_id: number;
    name: string;
    logo_url: string | null;
    locations: Location[];
}

interface EditCompanyModalProps {
    company: Company;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedCompany: FormData) => Promise<void>;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
    company,
    isOpen,
    onClose,
    onUpdate,
}) => {
    const [name, setName] = useState(company.name);
    const [logo, setLogo] = useState<File | null>(null);
    const [locations, setLocations] = useState<Location[]>(company.locations);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (logo) {
            formData.append("logo", logo);
        }
        formData.append("locations", JSON.stringify(locations));
        formData.append("company_id", company.company_id.toString());

        try {
            await onUpdate(formData);
            onClose();
        } catch (error) {
            console.error("Error updating company:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLocation = () => {
        setLocations([...locations, { name: "", address: "" }]);
    };

    const handleRemoveLocation = (index: number) => {
        setLocations(locations.filter((_, i) => i !== index));
    };

    const handleLocationChange = (
        index: number,
        field: keyof Location,
        value: string
    ) => {
        const updatedLocations = locations.map((location, i) =>
            i === index ? { ...location, [field]: value } : location
        );
        setLocations(updatedLocations);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Locations
                        </label>
                        {locations.map((location, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 mt-2"
                            >
                                <input
                                    type="text"
                                    value={location.name}
                                    onChange={(e) =>
                                        handleLocationChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Location Name"
                                    className="block w-1/3 border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                <input
                                    type="text"
                                    value={location.address}
                                    onChange={(e) =>
                                        handleLocationChange(
                                            index,
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Address"
                                    className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLocation(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <MinusCircleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddLocation}
                            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Add Location
                        </button>
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
