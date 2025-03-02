import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Certificate {
  certificateName: string;
  certificateDocument: string;
}

interface GovernmentProof {
  idType: string;
  idNumber: string;
  idDocument: string;
}

interface Labor {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  categories?: string[];
  personalDetails: {
    gender: string;
    dateOfBirth: string;
  };
  address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  language: string;
  startTime: string;
  endTime: string;
  status: string;
  rating: number;
  availability: string[];
  skill: string[]; // Fixed: Now explicitly declared as an array of strings
  DurationofEmployment: {
    startDate: string;
    currentlyWorking: boolean;
  };
  responsibility: string;
  certificates?: Certificate[]; // Added this
  governmentProof?: GovernmentProof; // Added this
}



const ViewAllDetails = () => {
  const location = useLocation();
  const labor: Labor | null = location.state?.labor || null;
  const navigate = useNavigate();  
  if (!labor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No labor details available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 pt-8">
              <img
                src={labor.profilePicture}
                alt={`${labor.firstName} ${labor.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {labor.firstName} {labor.lastName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  {labor.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500 bg-opacity-40 rounded-full text-sm text-white"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">👤</span>
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{labor.email}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{labor.phone}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-medium">
                      {labor.personalDetails.gender}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Birth Date</span>
                    <span className="font-medium">
                      {new Date(
                        labor.personalDetails.dateOfBirth
                      ).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{labor.language}</span>
                  </p>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">📍</span>
                  Address
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-600">City</span>
                    <span className="font-medium">{labor.address.city}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">State</span>
                    <span className="font-medium">{labor.address.state}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Country</span>
                    <span className="font-medium">{labor.address.country}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Postal Code</span>
                    <span className="font-medium">
                      {labor.address.postalCode}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Work Details Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">💼</span>
                  Work Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Start Time</span>
                      <span className="font-medium">{labor.startTime}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">End Time</span>
                      <span className="font-medium">{labor.endTime}</span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          labor.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : labor.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {labor.status}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <span className="flex items-center">
                        <span className="font-medium mr-1">{labor.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills & Availability Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">🎯</span>
                  Skills & Availability
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Available Days
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {labor.availability.map((day) => (
                        <span
                          key={day}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(labor.skill)
                        ? labor.skill.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment & Responsibilities Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="bg-blue-100 p-2 rounded-lg mr-2">
                        📅
                      </span>
                      Employment Duration
                    </h2>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Start Date</span>
                        <span className="font-medium">
                          {new Date(
                            labor.DurationofEmployment.startDate
                          ).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Current Status</span>
                        <span className="font-medium">
                          {labor.DurationofEmployment.currentlyWorking
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="bg-blue-100 p-2 rounded-lg mr-2">
                        📝
                      </span>
                      Responsibilities
                    </h2>
                    <p className="text-gray-700">{labor.responsibility}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {labor.governmentProof && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-2">🪪</span>
                    Government Aided Proof
                  </h2>
                  <div className="flex justify-center">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-sm">
                      <img
                        src={labor.governmentProof.idDocument || ""}
                        alt="Government ID"
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {labor.governmentProof.idType}
                          </h3>
                          {labor.governmentProof.idDocument && (
                            <a
                              href={labor.governmentProof.idDocument}
                              download
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Download ID"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-gray-50 p-6 lg:p-8 space-y-8">
            {/* Certificates */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-2">🎓</span>
                Certificates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labor.certificates?.map((certificate, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={certificate.certificateDocument}
                      alt={certificate.certificateName}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 text-center">
                        {certificate.certificateName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Government ID */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllDetails;