import React, { useEffect, useState } from 'react';
// import { Users, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import AdminSideRow from './AdminSideRow';
import User from '../../../assets/UserKing.png'
import Labor from '../../../assets/LaborKing.png'
import Booking from '../../../assets/BookingsKing.png'
import Payment from '../../../assets/paymentEarnigsKing.png'
import totialIMaes from '../../../assets/totalImages.jpg'
import laborEarnings from '../../../assets/LaborEranigs.jpg'
import { fetchAllBookings } from '../../../services/AdminAuthServices';

interface BookingStats {
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  paid: number;
  paymentPending: number;
  paymentFailed: number;
  monthlyEarnings: number[];
}


const AdminDashBoard = () => {
 
    const [currentPage] = useState(1);
    const [limit] = useState(200);
    const [filter] = useState("");
    // const [totalPages, setTotalPages] = useState(1);
    // const [bookingDetils , setBookingDetils] = useState<IBooking[]>(null)
    const [totalUsers, setTotalUsers] = useState(0); // Add state for total users
    const [totalLabors, setTotalLabors] = useState(0);
    const [totalBooking, setTotalBookings] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalLaborErnigs, setTotalLaborErnigs] = useState(0);
    const [totalCompnyProfit, setTotalCompnyProfit] = useState(0);
    const [bookingStats, setbookingStats] = useState<BookingStats | null>(null);
    console.log('This si eht bookingStatas',bookingStats)
    
     const statusData = [
    { name: 'Completed', value: bookingStats?.completed || 0, color: '#10B981' },
    { name: 'In Progress', value: bookingStats?.inProgress || 0, color: '#3B82F6' },
    { name: 'Pending', value: bookingStats?.pending || 0, color: '#F59E0B' },
    { name: 'Cancelled', value: bookingStats?.cancelled || 0, color: '#EF4444' }
  ];

  const total = statusData.reduce((acc, item) => acc + item.value, 0);
  const statusDataWithPercentage = statusData.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const paymentData = [
    { name: 'Paid', value: bookingStats?.paid || 0, color: '#059669' },
    { name: 'Pending', value: bookingStats?.paymentPending || 0, color: '#D97706' },
    { name: 'Failed', value: bookingStats?.paymentFailed || 0, color: '#DC2626' }
  ];

  const monthlyData = bookingStats?.monthlyEarnings || [];


  const fetchBooings = async () => {
    try {
      const response = await fetchAllBookings(currentPage, limit, ''); // Removed incorrect filter syntax
      if (response.status === 200) {
        console.log('Thsi si teh preosnf',response);
        const {
          // bookings,
          // totalPages,
          totalAmount,
          totalLabors,
          totalUsers,
          total,
          bookingStats,
          totalLaborErnigs,
          totalCompnyProfit
        } = response.data
  
        // setTotalPages(totalPages)
        // setBookingDetils(bookings)
        setTotalUsers(totalUsers)
        setTotalLabors(totalLabors)
        setTotalBookings(total)
        setTotalAmount(totalAmount)
        setbookingStats(bookingStats)
        setTotalLaborErnigs(totalLaborErnigs)
        setTotalCompnyProfit(totalCompnyProfit)
      }
    } catch (error) {
      console.error("Error fetching labor bookings:", error);
    }
  };
  
  useEffect(() => {
   
    fetchBooings();
  }, [currentPage, limit, filter]);

  return (
    <div className="flex min-h-screen bg-[#D6CCCC]">
      {/* Sidebar - You can replace AdminSideRow with your actual sidebar component */}
      {/* <div className="w-64 bg-white shadow-md">
      </div> */}
      <AdminSideRow />
      

      {/* Main Content */}
      <div className="flex-1 p-6">  
      <div className="text-center lg:p-7 md:p-7 p-6 sm:p-7 sm:text-left mb-4 sm:mb-0">
            <h1 className="font-serif text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
              DashBoard
            </h1>
          </div>
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Box 1: Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={User} alt="Total Users" className="w-[62px] h-[56px] mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl  font-[Rockwell]">{totalUsers}</p>
            </div>
          </div>

          {/* Box 2: Total Labors */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Labor} alt="Total Labors" className="w-[52px] h-[56px]  mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Labors</h2>
              <p className="text-3xl  font-[Rockwell]">{totalLabors}</p>
            </div>
          </div>

          {/* Box 3: Total Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Booking} alt="Total Bookings" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Bookings</h2>
              <p className="text-3xl  font-[Rockwell]">{totalBooking}</p>
            </div>
          </div>

          {/* Box 4: Total Earnings */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={totialIMaes} alt="Total Earnings" className="w-[64px] h-[64px] mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Amount</h2>
              <p className="text-3xl  font-[Rockwell]">
                ₹ {totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={laborEarnings} alt="Total Earnings" className="w-[64px] h-[64px] mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Labors Earnings</h2>
              <p className="text-3xl  font-[Rockwell]">
                ₹ {totalLaborErnigs.toLocaleString('en-IN')}</p>
            </div>
          </div>  

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Payment} alt="Total Earnings" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Company Profit</h2>
              <p className="text-3xl  font-[Rockwell]">
                ₹ {totalCompnyProfit.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDataWithPercentage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">{data.value} bookings ({data.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">{data.value} payments</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload?.length && payload[0]?.value !== undefined) {
                      return (
                        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">₹{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="earnings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;












 {/* <div className="logout">
        <button
        onClick={handleLogout}
          className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
        >
          <div
            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
              <path
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
              ></path>
            </svg>
          </div>
          <div
            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            Logout
          </div>
        </button>

      </div> */}