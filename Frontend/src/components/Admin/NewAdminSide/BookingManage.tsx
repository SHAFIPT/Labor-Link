// import React, { useState } from 'react'
// import AdminTable from '../../ui/table'

// const BookingManage = () => {


//     const [bookings, setBookings] = useState([
//   {
//     id: 1,
//     userName: "John Doe",
//     laborName: "Samuel Green",
//     jobDescription: "Plumbing Work",
//     status: "Completed",
//     dateTime: "2025-03-14 10:30 AM",
//     amount: "$150",
//     paymentStatus: "Paid",
//   },
//   {
//     id: 2,
//     userName: "Jane Smith",
//     laborName: "Michael Brown",
//     jobDescription: "Electrical Repair",
//     status: "Pending",
//     dateTime: "2025-03-15 02:00 PM",
//     amount: "$200",
//     paymentStatus: "Unpaid",
//   },
//   {
//     id: 3,
//     userName: "Samuel Green",
//     laborName: "John Doe",
//     jobDescription: "Carpentry Work",
//     status: "In Progress",
//     dateTime: "2025-03-16 11:45 AM",
//     amount: "$180",
//     paymentStatus: "Paid",
//   },
//   {
//     id: 4,
//     userName: "Emily Johnson",
//     laborName: "Robert White",
//     jobDescription: "House Cleaning",
//     status: "Completed",
//     dateTime: "2025-03-12 09:00 AM",
//     amount: "$100",
//     paymentStatus: "Paid",
//   },
//   {
//     id: 5,
//     userName: "David Lee",
//     laborName: "Sophia Wilson",
//     jobDescription: "Gardening",
//     status: "Cancelled",
//     dateTime: "2025-03-17 03:30 PM",
//     amount: "$120",
//     paymentStatus: "Refunded",
//   },
//     ]);
  
//   const columns = [
//   { key: "id", label: "ID" },
//   { key: "userName", label: "UserName" },
//   { key: "laborName", label: "LaborName" },
//   { key: "jobDescription", label: "JobDescription" },
//   { key: "status", label: "Status" },
//   { key: "dateTime", label: "DateTime" },
//   { key: "amount", label: "Amount" },
//   { key: "paymentStatus", label: "PaymentStatus" }
// ];


//   return (
//     <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
//       <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
//         Booking Management
//       </h1>
//       <AdminTable title='' columns={columns} data={bookings} tableType='labors' />
//     </div>
//   )
// }

// export default BookingManage
