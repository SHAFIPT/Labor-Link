import React, { useEffect, useState } from 'react'
import AdminTable from '../../ui/table'
import { fetchAllBookings } from '../../../services/AdminAuthServices';
import { IBooking } from '../../../@types/IBooking';
import Pagination from '../../ui/pegination';
interface ItemType {
    userId?: { name?: string };
    laborId?: { firstName?: string; lastName?: string };
    quote?: { description?: string };
    status?: string;
    createdAt: string;
    paymentDetails?: { totalAmount?: number };
    paymentStatus?: string;
    addressDetails?: { name?: string };
}
const BookingManage = () => {
    const [limit] = useState(7);
    const [totalPages, setTotalPages] = useState(1);
    const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);
    const [page, setPage] = useState(1);
    const [selectedFilter] = useState("Filter");
    
    useEffect(() => {
        const fetchBooings = async () => {
            try {
                const response = await fetchAllBookings(page, limit, selectedFilter);
                if (response.status === 200) {
                    console.log("Thsi si teh preosnf", response);
                    const { bookings, totalPages } = response.data;
                    
                    setTotalPages(totalPages);
                    setBookingDetils(bookings);
                }
            } catch (error) {
                console.error("Error fetching labor bookings:", error);
            }
        };
        
        fetchBooings();
    }, [page, limit, selectedFilter]);
   
    const columns = [
      { key: "index", label: "ID" },
      {
        key: "userId",
        label: "User Name",
        render: (item: ItemType) => (
          <span className="text-white">
            {item.addressDetails?.name || "N/A"}
          </span>
        ),
      },
      {
        key: "laborId",
        label: "Labor Name",
        render: (item: ItemType) => (
          <span className="text-white">{`${item.laborId?.firstName || ""} ${
            item.laborId?.lastName || ""
          }`}</span>
        ),
      },
      {
        key: "quote",
        label: "Job Description",
        render: (item: ItemType) => (
          <span className="text-white text-xs truncate max-w-[150px] block">
            {item.quote?.description || "N/A"}
          </span>
        ),
      },
      { key: "status", label: "Status" },
      {
        key: "createdAt",
        label: "Date Time",
        render: (item: ItemType) => (
          <span className="text-white">
            {new Date(item.createdAt).toLocaleString() || "N/A"}
          </span>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        render: (item: ItemType) => (
          <span className="text-white font-medium">
            ₹
            {item.paymentDetails?.totalAmount
              ? item.paymentDetails.totalAmount.toLocaleString()
              : "0"}
          </span>
        ),
      },
      { key: "paymentStatus", label: "Payment Status" },
    ];
    
    const tableData = bookingDetils.map((user, index) => ({
        ...user,
        index: index + 1,
    }));

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
                Booking Management
            </h1>
            <AdminTable 
                title='' 
                columns={columns} 
                data={tableData} 
                tableType='labors' 
                itemsPerPage={tableData.length} // Make sure table shows all items to avoid pagination
            />
            <div className="mt-4">
                <Pagination 
                    totalPages={totalPages} 
                    currentPage={page} 
                    onPageChange={handlePageChange} 
                />
            </div>
        </div>
    )
}

export default BookingManage