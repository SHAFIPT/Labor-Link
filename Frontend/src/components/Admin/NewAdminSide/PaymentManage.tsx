import React, { useEffect, useState } from "react";
import AdminTable from "../../ui/table";
import { IBooking } from "../../../@types/IBooking";
import { fetchAllBookings } from "../../../services/AdminAuthServices";

const PaymentManage = () => {
  const [bookingDetails, setBookingDetails] = useState<IBooking[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page] = useState(1);
  const [selectedFilter] = useState("Filter");
  const [limit] = useState(70);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetchAllBookings(page, limit, selectedFilter);
        if (response.status === 200) {
          const { bookings, totalCompnyProfit } = response.data;
          setBookingDetails(bookings);
          setTotalAmount(totalCompnyProfit); // Set total amount dynamically
        }
      } catch (error) {
        console.error("Error fetching labor bookings:", error);
      }
    };

    fetchBookings();
  }, [page, limit, selectedFilter]);

  // Filter paid bookings
  const paymentCompleted = bookingDetails?.filter(
    (booking) => booking.paymentStatus === "paid"
  );

  const columns = [
    { key: "index", label: "ID" },
    { key: "laborName", label: "Labor Name" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "commissionAmount", label: "Commission Amount" },
    { key: "laborEarnings", label: "Labor Earnings" },
    { key: "dateTime", label: "Date & Time" },
    { key: "paymentStatus", label: "Payment Status" },
  ];

  // Transform booking data to match table columns
  const tableData = paymentCompleted.map((booking, index) => {
    const laborName = booking.laborId
      ? `${booking.laborId.firstName || ""} ${
          booking.laborId.lastName || ""
        }`.trim()
      : "N/A";

    const totalAmount = booking.paymentDetails?.totalAmount || 0;
    const commissionAmount = booking.paymentDetails?.commissionAmount || 0;
    const laborEarnings = booking.paymentDetails?.laborEarnings || 0;

    const dateTime = booking.createdAt
      ? new Date(booking.createdAt).toLocaleString()
      : "N/A";

    return {
      index: index + 1,
      laborName,
      totalAmount,
      commissionAmount,
      laborEarnings,
      dateTime,
      ...booking,
      paymentStatus: booking.paymentStatus,
    };
  });

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
        Payment Management
      </h1>

      {/* Display Total Amount Clearly */}
      <div className="mb-4 flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl text-white font-semibold">
          Total Amount:
        </h2>
        <span className="text-2xl md:text-3xl text-green-400 font-bold">
          ₹{totalAmount.toLocaleString()}
        </span>
      </div>

      <AdminTable
        title=""
        columns={columns}
        data={tableData}
        tableType="payments"
        itemsPerPage={5}
      />
    </div>
  );
};

export default PaymentManage;
