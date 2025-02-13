import React, { useEffect, useState } from 'react'
import AdminSideRow from './AdminSideRow';
import { IBooking } from '../../../@types/IBooking';
import { fetchAllBookings } from '../../../services/AdminAuthServices';

const PaymentsEarnigs = () => {
    const [page, setPage] = useState(1);
  // const totalPages = 2; // Replace with dynamic value

  const payments = [
    {
      laborName: "John Doe",
      creditedAmount: 5000,
      commission: 500,
      remainingAmount: 4500,
      dateTime: "2024-02-10 10:30 AM",
    },
    {
      laborName: "Jane Smith",
      creditedAmount: 7000,
      commission: 700,
      remainingAmount: 6300,
      dateTime: "2024-02-10 12:00 PM",
    },
  ];

  const totalPendingAmount = payments.reduce(
    (acc, payment) => acc + payment.remainingAmount,
    0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [limit, setLimit] = useState(70);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>(null)  
  console.log('this is eth bookingDetils ::',bookingDetils)
  const filterOptions = [
    { value: "All", label: "All", color: "bg-gray-500" },
    { value: "confirmed", label: "confirmed", color: "bg-yellow-500" },
    { value: "completed", label: "completed", color: "bg-green-500" },
    { value: "canceled", label: "canceled", color: "bg-red-500" },
  ];

  const paymnetCompleted = bookingDetils?.filter((booking) => {
    return booking.paymentStatus === 'paid'
  })



  const fetchBooings = async () => {
          try {
            const response = await fetchAllBookings(page, limit, selectedFilter); // Removed incorrect filter syntax
            if (response.status === 200) {
              console.log('Thsi si teh preosnf',response);
              const {
                bookings,
                totalPages,
                totalCompnyProfit
              } = response.data
        
              setTotalPages(totalPages)
              setBookingDetils(bookings)
              setTotalAmount(totalCompnyProfit)
            }
          } catch (error) {
            console.error("Error fetching labor bookings:", error);
          }
        };
        
        useEffect(() => {
          fetchBooings();
        }, [page, limit,selectedFilter]);
  

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
      <div className="flex min-h-screen">
          <AdminSideRow/>
      <div className="w-full bg-[#D6CCCC]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4 ">
          <h1 className="font-serif p-12 text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
            Payment Listing
          </h1>
        </div>

        {/* Summary Section */}
        <div className="w-full p-1">
        <div className="bg-gradient-to-r from-green-400 to-green-800 p-6 rounded-lg shadow-lg text-center text-white">
          <h2 className="text-2xl font-bold">
            Total Amount Credited: ₹ {totalAmount}
          </h2>
          <p className="mt-2 text-lg opacity-90">Your total earnings so far</p>
        </div>
      </div>

        {/* Payment List Section */}
        <div className="relative px-4 pt-5">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* List Headings */}
              <div className="grid grid-cols-7 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  No
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Labor Name
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                Total Amount 
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Commission Amount
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Labor Earnings
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Date & Time
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Paymnet Status
                </div>
              </div>

              {/* Payment Data */}
              <div className="space-y-2 mt-4">
                {paymnetCompleted?.map((payment, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 gap-4 items-center bg-[#ABA0A0] rounded-lg shadow-md p-3 hover:bg-[#998F8F] transition-colors"
                  >
                    <div className="text-center text-xs sm:text-sm font-medium text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="text-center text-xs sm:text-sm font-medium text-white truncate font-bold">
                      {payment?.laborId?.firstName}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                      ₹{payment?.paymentDetails?.totalAmount}
                    </div>
                    <div className="text-center text-xs sm:text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    + ₹{payment?.paymentDetails?.commissionAmount}
                  </div>

                    <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                      ₹{payment?.paymentDetails?.laborEarnings}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate font-bold">
                  {new Date(payment.updatedAt).toLocaleString()}
                </div>
                    <div
                      className={`text-center text-xs sm:text-sm font-bold px-2 py-1 rounded-lg ${
                        payment?.paymentStatus === "paid"
                          ? "text-green-100 bg-green-700"
                          : "text-white"
                      }`}
                    >
                      {payment?.paymentStatus}
                    </div>
                  </div>
                ))} 
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
  );
}

export default PaymentsEarnigs
