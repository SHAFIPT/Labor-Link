import React, { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import AdminSideRow from './AdminSideRow';
import { IBooking } from '../../../@types/IBooking';
import { fetchAllBookings } from '../../../services/AdminAuthServices';

const BookingsListing = () => {
//   const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(7);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [bookingDetils , setBookingDetils] =    useState<IBooking[]>(null)  
 

//   const [selectedFilter, setSelectedFilter] = useState('all');
  const [page, setPage] = useState(1);
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);

  
  const filterOptions = [
      { value: "All", label: "All", color: "bg-gray-500" },
        { value: "confirmed", label: "confirmed", color: "bg-yellow-500" },
        { value: "completed", label: "completed", color: "bg-green-500" },
        { value: "canceled", label: "canceled", color: "bg-red-500" },
    ];
      const [isOpen, setIsOpen] = useState(false);
      const [selectedFilter, setSelectedFilter] = useState("Filter");
      
    console.log('Thsi ie th selectedFilter : ',selectedFilter)
    //   const filteredBookings = bookingDetils?.filter(booking => 
    //     selectedFilter === 'all' ? true : booking.status === selectedFilter
    // );
    
    const fetchBooings = async () => {
        try {
          const response = await fetchAllBookings(page, limit, selectedFilter); // Removed incorrect filter syntax
          if (response.status === 200) {
            console.log('Thsi si teh preosnf',response);
            const {
              bookings,
              totalPages,
            } = response.data
      
            setTotalPages(totalPages)
            setBookingDetils(bookings)
          }
        } catch (error) {
          console.error("Error fetching labor bookings:", error);
        }
      };
      
      useEffect(() => {
        fetchBooings();
      }, [page, limit,selectedFilter]);
    
    console.log('Thsi is the bookigndetials ;;', bookingDetils)
    
    const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <AdminSideRow />
        <div className="div w-full bg-[#D6CCCC]">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4">
            {/* Title section with responsive text sizes */}
            <div className="text-center lg:p-7 md:p-7 p-6 sm:p-7 sm:text-left mb-4 sm:mb-0">
              <h1 className="font-serif text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
                Booking Management
              </h1>
            </div>
          </div>

          <div className="w-full">
            {/* Search Filters Section */}
            <div className="serchfilters flex flex-col sm:flex-row gap-4 w-full p-4 pb-2">
              {/* Filter Box */}
              <div className="relative min-w-[120px] sm:min-w-[150px]">
                <div className="relative">
                  <div
                    className="flex items-center justify-center border border-gray-300 
                  rounded-full px-4 py-2 shadow-sm bg-[#ABA0A0] 
                  hover:bg-[#bab1b1] cursor-pointer w-full"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="text-gray-600 mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.447.894l-4 2A1 1 0 017 21v-6.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                      </svg>
                    </span>
                    <span className="font-medium text-white">
                      {selectedFilter}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-10">
                      {filterOptions.map((filter) => (
                        <div
                          key={filter.value}
                          className={`px-4 py-2 text-white cursor-pointer first:rounded-t-lg last:rounded-b-lg ${filter.color} hover:opacity-80`}
                          onClick={() => {
                            setSelectedFilter(filter.value);
                            setIsOpen(false);
                          }}
                        >
                          {filter.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative px-4 pt-5">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* List Headings */}
                  <div className="grid grid-cols-8 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      No
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      User Name
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Labor Name
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Job Description
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Status
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Date & Time
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Amount
                    </div>
                    <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Payment Status
                    </div>
                  </div>

                  {/* Labor List */}
                  <div className="space-y-2 mt-4">
                    {bookingDetils?.map((booking, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-8 gap-4 items-center bg-[#ABA0A0] rounded-lg shadow-md p-3 hover:bg-[#998F8F] transition-colors"
                      >
                        {/* Number */}
                        <div className="text-center text-xs sm:text-sm font-medium text-white font-bold">
                          {index + 1}
                        </div>

                        {/* User Name */}
                        <div className="text-center text-xs sm:text-sm font-medium text-white truncate font-bold">
                          {booking?.addressDetails?.name}
                        </div>

                        {/* Labor Name */}
                        <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                          {booking?.laborId?.firstName}
                        </div>

                        {/* Job Description */}
                        <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                          {booking?.quote?.description}
                        </div>

                        {/* Status */}
                        <div className="text-center">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium w-20 ${
                              booking.status === "canceled"
                                ? "bg-red-500 text-white"
                                : booking.status === "confirmed"
                                ? "bg-yellow-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {booking.status === "canceled"
                              ? "cancelled"
                              : booking.status === "confirmed"
                              ? "Pending"
                              : "Completed"}
                          </span>
                        </div>

                        <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                        {booking.quote.arrivalTime 
                            ? new Date(booking.quote.arrivalTime).toLocaleString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: true 
                            }) 
                            : "N/A"}
                        </div>

                        {/* Amount */}
                        <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                          ₹{booking.quote.estimatedCost}
                        </div>

                        {/* Payment Status */}
                        <div className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium w-20 ${
                              booking.paymentStatus === "failed"
                                ? "bg-red-500 text-white"
                                : booking.paymentStatus === "paid"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}>
                          {booking.paymentStatus === "paid"
                              ? "Paid"
                              : booking.paymentStatus === "failed"
                              ? "Failed"
                              : "pending"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center gap-4 p-4">
            <button
                onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
                onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingsListing;







