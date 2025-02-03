import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import Breadcrumb from '../BreadCrumb';

const ViewBookingDetils = () => {
    const navigate = useNavigate();
    const theam = useSelector((state: RootState) => state.theme.mode);
    const { state: booking } = useLocation();
    const currentPages = location.pathname.split("/").pop();
  const stats = [
    { title: 'Total Bookings', value: '40' },
    { title: 'Total Work Completed', value: '30' },
    { title: 'Total Cancelations', value: '20' },
    { title: 'Total Amount Pay', value: '₹14,000' }
  ];

  const bookings = [
    {
      date: '2024-12-25',
      description: 'dfsfsdfsdsdfdsf',
      status: 'confirmed',
      cost: '5000',
      labor: {
        name: 'John Doe',
        place: 'Mumbai',
        phone: '+91 9876543210',
        address: '123 Main St, Mumbai'
      }
    }
    ];
    
    const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "LaborProfilePage", link: "/userProfilePage" }, // No link for the current page
    { label: "BookingDetils", link: null }, // No link for the current page
  ];


    return (
      <>
        {theam === "light" ? (
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Your Booking Details
              </h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Job Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Estimate Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Labor Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                    ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.cost}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <User className="w-8 h-8 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.labor.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.labor.place}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.labor.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.labor.address}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Similar Labors Section */}
            {bookings[0].status === "canceled" && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Similar Available Labors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate("/laborList")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <User className="w-12 h-12 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Similar Labor Name
                        </h3>
                        <p className="text-sm text-gray-500">Similar Skills</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/laborList")}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View All Available Labors →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                Your Booking Details
              </h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="w-5 h-5 text-white" />
                <span className="text-white">Filters</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <h3 className="text-gray-400 text-sm font-medium mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b">
                      Job Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b">
                      Estimate Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b">
                      Labor Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {bookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {booking.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                ${
                  booking.status === "confirmed"
                    ? "bg-green-800 text-green-100"
                    : booking.status === "canceled"
                    ? "bg-red-800 text-red-100"
                    : "bg-yellow-800 text-yellow-100"
                }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ₹{booking.cost}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-700 p-2 rounded-full">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {booking.labor.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {booking.labor.place}
                            </p>
                            <p className="text-sm text-gray-400">
                              {booking.labor.phone}
                            </p>
                            <p className="text-sm text-gray-400">
                              {booking.labor.address}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Similar Labors Section */}
            {bookings[0].status === "canceled" && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Similar Available Labors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate("/laborList")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-700 p-3 rounded-full">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Similar Labor Name
                        </h3>
                        <p className="text-sm text-gray-400">Similar Skills</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/laborList")}
                  className="mt-4 text-blue-400 hover:text-blue-500 font-medium transition-colors"
                >
                  View All Available Labors →
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
};

export default ViewBookingDetils;

