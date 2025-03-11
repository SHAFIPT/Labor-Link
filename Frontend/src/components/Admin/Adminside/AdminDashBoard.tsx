import React, { useEffect, useState } from 'react';
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
    const [totalUsers, setTotalUsers] = useState(0); 
    const [totalLabors, setTotalLabors] = useState(0);
    const [totalBooking, setTotalBookings] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalLaborErnigs, setTotalLaborErnigs] = useState(0);
    const [totalCompnyProfit, setTotalCompnyProfit] = useState(0);
    const [bookingStats, setbookingStats] = useState<BookingStats | null>(null);
    
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
      const response = await fetchAllBookings(currentPage, limit, '');
      if (response.status === 200) {
        console.log('Thsi si teh preosnf',response);
        const {
          totalAmount,
          totalLabors,
          totalUsers,
          total,
          bookingStats,
          totalLaborErnigs,
          totalCompnyProfit
        } = response.data
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