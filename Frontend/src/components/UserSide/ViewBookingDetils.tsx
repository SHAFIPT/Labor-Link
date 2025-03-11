import React, { useCallback, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Filter, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import Breadcrumb from "../BreadCrumb";
import { IBooking } from "../../@types/IBooking";
import { toast } from "react-toastify";
import { fetchAllBooings } from "../../services/UserSurvice";

const ViewBookingDetils = () => {
  const navigate = useNavigate();
  const theam = useSelector((state: RootState) => state.theme.mode);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);
  const UserId = useSelector((state: RootState) => state.user.user._id);
  const limit = 6
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const currentPages = location.pathname.split("/").pop() || "defaultPage";
  const [stats, setStats] = useState([
    { title: "Total Bookings", value: "0" },
    { title: "Total Work Completed", value: "0" },
    { title: "Total Cancellations", value: "0" },
    { title: "Total Amount Pay", value: "₹0" },
  ]);

const fetchBookings = useCallback(async () => {
    const resoponse = await fetchAllBooings(UserId, currentPage, limit, filter);
    if (resoponse.status === 200) {
      const {
        bookings,
        totalPages,
        total,
        completedBookings,
        canceledBookings,
        totalAmount,
      } = resoponse.data;
      setBookingDetils(bookings);
      setTotalPages(totalPages);
      setStats([
        { title: "Total Bookings", value: total },
        { title: "Total Work Completed", value: completedBookings },
        { title: "Total Cancellations", value: canceledBookings },
        {
          title: "Total Amount Pay",
          value: `₹${totalAmount.toLocaleString()}`,
        },
      ]);
    } else {
      toast.error("Error in booking fetching ...");
    }
}, [UserId, currentPage, limit, filter]);

useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 

  const handleFilterChange = (value  :string) => {
    setFilter(value);
  };
  const bookings = [
    {
      date: "2024-12-25",
      description: "dfsfsdfsdsdfdsf",
      status: "confirmed",
      cost: "5000",
      labor: {
        name: "John Doe",
        place: "Mumbai",
        phone: "+91 9876543210",
        address: "123 Main St, Mumbai",
      },
    },
  ];

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "LaborProfilePage", link: "/userProfilePage" }, // No link for the current page
    { label: "BookingDetils", link: undefined }, // No link for the current page
  ];

  return (
    <>
      {theam === "light" ? (
        <div className="container  mx-auto px-4 py-8">
          {/* Header */}
          <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Your Booking Details
            </h1>
           <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 
            rounded-lg hover:bg-gray-300 transition-colors shadow-md"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span>Filters</span>
            <select
              className="bg-white text-gray-900 border border-gray-400 rounded-md 
              px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="" className="bg-gray-200 text-gray-900">
                Filter by Status
              </option>
              <option value="canceled" className="bg-gray-200 text-gray-900">
                Cancelled
              </option>
              <option value="confirmed" className="bg-gray-200 text-gray-900">
                Confirmed
              </option>
              <option value="completed" className="bg-gray-200 text-gray-900">
                Completed
              </option>
            </select>
          </button>

          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
                 {bookingDetils?.length > 0 ? (
                 bookingDetils.map((booking, index) => (
                  <tr  key={booking?._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking?.quote?.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                              ${
                                booking?.status === "confirmed"
                                  ? "bg-yellow-800 text-yellow-100"
                                  : booking?.status === "canceled"
                                  ? "bg-red-800 text-red-100"
                                  : "bg-green-800 text-green-100"
                              }`}
                        >
                          {booking?.status || "Pending"}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking?.quote?.estimatedCost || "0"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-gray-700 p- rounded-full w-12 h-12 overflow-hidden">
                            <img
                              src={booking?.laborId?.profilePicture}
                              className="object-cover w-full h-full rounded-full"
                              alt="Labor Profile"
                            />
                          </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                           {booking?.laborId?.firstName || "Not Assigned"}
                          </p>
                          <p className="text-sm text-gray-500">
                              {booking?.laborId?.address?.city || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                              {booking?.laborId?.categories?.[0] || "N/A"}
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            {booking.labor.address}
                          </p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-white">
                      No bookings available
                    </td>
                  </tr>
                )}
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
        <div className="container bg-[#101726] min-h-screen px-4 py-8">
          {/* Header */}
          <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Your Booking Details
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md">
              <Filter className="w-5 h-5 text-gray-300" />
              <span className="text-gray-200">Filters</span>
              <select
                className="bg-gray-900 text-gray-300 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="" className="bg-gray-800 text-white">
                  Filter by Status
                </option>
                <option value="canceled" className="bg-gray-800 text-white">
                  Cancelled
                </option>
                <option value="confirmed" className="bg-gray-800 text-white">
                  Confirmed
                </option>
                <option value="completed" className="bg-gray-800 text-white">
                  Completed
                </option>
              </select>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6">
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
                {bookingDetils?.length > 0 ? (
                  bookingDetils.map((booking, index) => (
                    <tr
                      key={booking?._id || index}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                         {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {booking?.quote?.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                              ${
                                booking?.status === "confirmed"
                                  ? "bg-yellow-800 text-yellow-100"
                                  : booking?.status === "canceled"
                                  ? "bg-red-800 text-red-100"
                                  : "bg-green-800 text-green-100"
                              }`}
                        >
                          {booking?.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ₹{booking?.quote?.estimatedCost || "0"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-700 p- rounded-full w-12 h-12 overflow-hidden">
                            <img
                              src={booking?.laborId?.profilePicture}
                              className="object-cover w-full h-full rounded-full"
                              alt="Labor Profile"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {booking?.laborId?.firstName || "Not Assigned"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {booking?.laborId?.address?.city || "N/A"}
                            </p>
                            {/* <p className="text-sm text-gray-400">
                                {booking?.laborId?.phone || "N/A"}
                              </p> */}
                            <p className="text-sm text-gray-400">
                               {booking?.laborId?.categories?.[0] || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-white">
                      No bookings available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-4 mt-6 mb-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 text-white py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookingDetils;
