import { useState } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";
import { classNames } from "../../utils/helper";

export default function CompanyDetailsForm() {
    const [agreed, setAgreed] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [locations, setLocations] = useState([
        { street: "", city: "", state: "", zipcode: "" },
    ]);

    const handleAddLocation = () => {
        setLocations([
            ...locations,
            { street: "", city: "", state: "", zipcode: "" },
        ]);
    };

    const handleRemoveLocation = (index: number) => {
        if (index !== 0) {
            setLocations(locations.filter((_, locIndex) => locIndex !== index));
        }
    };

    const handleLocationChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const newLocations: any = [...locations];
        newLocations[index][field] = value;
        setLocations(newLocations);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            companyName,
            industry,
            companySize,
            description,
            logo,
            locations,
            agreed,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLogo(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Register Your Company
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Provide the details below to get started with your company
                    profile.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
                {/* Company Name */}
                <div className="sm:col-span-2 mb-6">
                    <label
                        htmlFor="company-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Name
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="company-name"
                            id="company-name"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        />
                    </div>
                </div>

                {/* Industry */}
                <div className="sm:col-span-2 mb-6">
                    <label
                        htmlFor="industry"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Industry
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="industry"
                            id="industry"
                            required
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        />
                    </div>
                </div>

                {/* Company Size */}
                <div className="sm:col-span-2 mb-6">
                    <label
                        htmlFor="company-size"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Size
                    </label>
                    <div className="mt-1">
                        <select
                            name="company-size"
                            id="company-size"
                            required
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                        </select>
                    </div>
                </div>

                {/* Company Description */}
                <div className="sm:col-span-2 mb-6">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Description
                    </label>
                    <div className="mt-1">
                        <textarea
                            name="description"
                            id="description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        />
                    </div>
                </div>

                {/* Locations */}
                {locations.map((location, index) => (
                    <div key={index} className="sm:col-span-2 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Location {index + 1}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <label
                                    htmlFor={`street-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Street Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id={`street-${index}`}
                                        required
                                        value={location.street}
                                        onChange={(e) =>
                                            handleLocationChange(
                                                index,
                                                "street",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`city-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    City
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id={`city-${index}`}
                                        required
                                        value={location.city}
                                        onChange={(e) =>
                                            handleLocationChange(
                                                index,
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`state-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    State
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id={`state-${index}`}
                                        required
                                        value={location.state}
                                        onChange={(e) =>
                                            handleLocationChange(
                                                index,
                                                "state",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`zipcode-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Zipcode
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id={`zipcode-${index}`}
                                        required
                                        value={location.zipcode}
                                        onChange={(e) =>
                                            handleLocationChange(
                                                index,
                                                "zipcode",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full p-2 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hide remove button for the first location */}
                        {index !== 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveLocation(index)}
                                className="inline-flex items-center text-red-600 hover:text-red-500 mt-4"
                            >
                                <MinusCircleIcon
                                    className="h-5 w-5 mr-2"
                                    aria-hidden="true"
                                />
                                Remove location
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddLocation}
                    className="inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                    <PlusCircleIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                    />
                    Add another location
                </button>

                {/* Company Logo */}
                <div className="sm:col-span-2 mt-6">
                    <label
                        htmlFor="logo"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Logo
                    </label>
                    <div className="mt-1">
                        <input
                            type="file"
                            name="logo"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    {logo && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected file: {logo.name}
                        </p>
                    )}
                </div>

                {/* Agree to Terms */}
                <div className="sm:col-span-2 mt-6">
                    <div className="flex items-center">
                        <Switch
                            checked={agreed}
                            onChange={setAgreed}
                            className={classNames(
                                agreed ? "bg-blue-600" : "bg-gray-200",
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                className={classNames(
                                    agreed ? "translate-x-6" : "translate-x-1",
                                    "inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                        <label className="ml-3 text-sm text-gray-900">
                            I agree to the terms and conditions
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
