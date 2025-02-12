import React, { useState } from 'react'
import AdminSideRow from './AdminSideRow';

const PaymentsEarnigs = () => {
    const [page, setPage] = useState(1);
  const totalPages = 2; // Replace with dynamic value

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

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
      <div className="flex min-h-screen">
          <AdminSideRow/>
      <div className="w-full bg-[#D6CCCC]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4">
          <h1 className="font-serif p- text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
            Payment Listing
          </h1>
        </div>

        {/* Summary Section */}
        <div className="w-full p-4">
          <div className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Total Pending Amount to be Credited: ₹{totalPendingAmount}
            </h2>
          </div>
        </div>

        {/* Payment List Section */}
        <div className="relative px-4 pt-5">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* List Headings */}
              <div className="grid grid-cols-6 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  No
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Labor Name
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Amount Credited
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Commission Amount
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Remaining Amount
                </div>
                <div className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Date & Time
                </div>
              </div>

              {/* Payment Data */}
              <div className="space-y-2 mt-4">
                {payments.map((payment, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 items-center bg-[#ABA0A0] rounded-lg shadow-md p-3 hover:bg-[#998F8F] transition-colors"
                  >
                    <div className="text-center text-xs sm:text-sm font-medium text-white">
                      {index + 1}
                    </div>
                    <div className="text-center text-xs sm:text-sm font-medium text-white truncate">
                      {payment.laborName}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate">
                      ₹{payment.creditedAmount}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate">
                      ₹{payment.commission}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate">
                      ₹{payment.remainingAmount}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white truncate">
                      {payment.dateTime}
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
