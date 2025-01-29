import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ViewAllDetails = () => {
  const location = useLocation();
  const labor = location.state?.labor;
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        {/* Header with Profile Picture */}
        <div className="p-6 border-b border-gray-200">
              <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4">
            <img 
              src={labor.profilePicture} 
              alt={`${labor.firstName} ${labor.lastName}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {labor.firstName} {labor.lastName}
              </h1>
              <p className="text-gray-600">{labor.categories.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {labor.email}</p>
              <p><span className="font-medium">Phone:</span> {labor.phone}</p>
              <p><span className="font-medium">Gender:</span> {labor.personalDetails.gender}</p>
              <p><span className="font-medium">Date of Birth:</span> {new Date(labor.personalDetails.dateOfBirth).toLocaleDateString()}</p>
              <p><span className="font-medium">Language:</span> {labor.language}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Address</h2>
            <div className="space-y-2">
              <p><span className="font-medium">City:</span> {labor.address.city}</p>
              <p><span className="font-medium">State:</span> {labor.address.state}</p>
              <p><span className="font-medium">Country:</span> {labor.address.country}</p>
              <p><span className="font-medium">Postal Code:</span> {labor.address.postalCode}</p>
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Work Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Start Time:</span> {labor.startTime}</p>
              <p><span className="font-medium">End Time:</span> {labor.endTime}</p>
              <p><span className="font-medium">Approval:</span> 
                <span className={`ml-2 inline-block px-2 py-1 rounded-full text-sm ${
                  labor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  labor.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {labor.status}
                </span>
              </p>
              <p><span className="font-medium">Rating:</span> {labor.rating}/5</p>
            </div>
          </div>

          {/* Availability & Skills */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Availability & Skills</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Available Days:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {labor.availability.map(day => (
                    <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {JSON.parse(labor.skill[0]).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Employment Duration */}
          <div className="col-span-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Employment Duration</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Start Date:</span> {new Date(labor.DurationofEmployment.startDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Currently Working:</span> {labor.DurationofEmployment.currentlyWorking ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="col-span-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Responsibilities</h2>
            <p className="text-gray-700">{labor.responsibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllDetails;