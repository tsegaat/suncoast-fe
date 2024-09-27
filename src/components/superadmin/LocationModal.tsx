import React, { useState } from "react";

interface Location {
    name: string;
    address: string;
    location_id: number;
    company_id: number;
    created_at: string;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    locations: Location[];
    onLocationSelect: (location: Location) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    locations,
    onLocationSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    if (!isOpen) return null;

    const filteredLocations = locations.filter(
        (location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Select a Location
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <input
                            type="text"
                            placeholder="Search locations..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="mt-4 max-h-60 overflow-y-auto">
                            {filteredLocations.map((location, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer p-2 hover:bg-gray-100 text-left"
                                    onClick={() => onLocationSelect(location)}
                                >
                                    <p className="font-semibold">
                                        {location.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {location.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
