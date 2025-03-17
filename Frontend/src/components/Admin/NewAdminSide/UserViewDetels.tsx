import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  Clock,
  User,
  Award,
  AlertCircle,
} from "lucide-react";
import { blockUser, UnblockUser } from "../../../services/AdminAuthServices";
import { toast } from "react-toastify";
import { IBooking } from "../../../@types/IBooking";
import { fetchAllBooings } from "../../../services/UserSurvice";
import Pagination from "../../ui/pegination";

const UserViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;
  const [isBlocked, setIsBlocked] = useState(user?.isBlocked || false);
  const [totalPages, setTotalPages] = useState(1);
  const userId = user?._id;
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [filter] = useState("");

  const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const resoponse = await fetchAllBooings(
          userId,
          currentPage,
          limit,
          filter
        );

        if (resoponse.status === 200) {
          const { bookings, totalPages } = resoponse.data;
          console.log("This is the booking", bookings);
          setBookingDetils(bookings);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error("Error in About me :", error);
        throw error;
      }
    };

    fetchBookings();
  }, [currentPage, limit, filter, userId]);

  const handleBlockToggle = async () => {
    try {
      // Decide which API to call based on the current block status
      const response = isBlocked
        ? await UnblockUser({ email: user.email })
        : await blockUser({ email: user.email });

      if (response.status === 200) {
        // Toggle the state on success
        setIsBlocked(!isBlocked);
        toast.success(
          `User successfully ${isBlocked ? "unblocked" : "blocked"}!`
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isBlocked ? "unblock" : "block"} user.`);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold ml-4">User Profile</h1>
        </div>

        {/* User Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-700">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          <div className="p-6 relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6 ring-4 ring-gray-800 rounded-full">
              <img
                src={
                  user?.ProfilePic ||
                  "https://www.svgrepo.com/show/192247/man-user.svg"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full bg-gray-700 object-cover border-4 border-gray-800"
              />
            </div>

            {/* Status Badge */}
            <div className="flex justify-end">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isBlocked
                    ? "bg-red-900 text-red-300"
                    : "bg-green-900 text-green-300"
                }`}
              >
                {isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            {/* User Info */}
            <div className="mt-14 md:mt-6">
              <h1 className="text-3xl font-bold mb-2">
                {`${user?.firstName || "John"} ${user?.lastName || "Doe"}`}
              </h1>
              <p className="text-blue-400 mb-6">{user?.role || "User"}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email Address</p>
                    <p className="font-medium">
                      {user?.email || "john.doe@example.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Shield size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="font-medium">{user?.status || "Active"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Clock size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Last Login</p>
                    <p className="font-medium">
                      {user?.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Calendar size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Created</p>
                    <p className="font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <User size={20} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Updated At</p>
                    <p className="font-medium">
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Award size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="font-medium truncate">
                      {user?._id || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Block/Unblock Button */}
              <button
                onClick={handleBlockToggle}
                className={`mt-2 flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                  isBlocked
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                } transition-all duration-300 shadow-lg`}
              >
                <AlertCircle size={18} />
                {isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={24} className="text-blue-400" />
              Booking History
            </h2>

            <div className="overflow-x-auto">
              {bookingDetils.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200">
                      <th className="px-6 py-4 text-left rounded-l-lg">No</th>
                      <th className="px-6 py-4 text-left">Laborer</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Cost</th>
                      <th className="px-6 py-4 text-left rounded-r-lg">
                        Payment Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetils.map((booking, index) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium">
                          {booking?.laborId?.firstName}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(
                            booking?.quote?.arrivalTime
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "completed"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } text-white`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ₹{booking?.quote?.estimatedCost}/-
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking?.paymentStatus === "paid"
                                ? "bg-green-500 text-white"
                                : booking?.paymentStatus === "pending"
                                ? "bg-yellow-500 text-black"
                                : booking?.paymentStatus === "failed"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>

            {bookingDetils.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="flex flex-col items-center gap-4">
                  <Calendar size={48} className="text-gray-600" />
                  <p className="text-lg">No bookings found for this user.</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewDetails;
