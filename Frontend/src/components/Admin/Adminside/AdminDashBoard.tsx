import React from 'react';
// import { Users, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import AdminSideRow from './AdminSideRow';
import User from '../../../assets/UserKing.png'
import Labor from '../../../assets/LaborKing.png'
import Booking from '../../../assets/BookingsKing.png'
import Payment from '../../../assets/paymentEarnigsKing.png'

const AdminDashBoard = () => {
  // Sample data for charts and stats
  // const statsData = [
  //   { icon: User, title: 'Total Users', value: '12,000', color: 'text-blue-600' },
  //   { icon: Briefcase, title: 'Total Labors', value: '1,600', color: 'text-green-600' },
  //   { icon: Calendar, title: 'Total Bookings', value: '300', color: 'text-purple-600' },
  //   { icon: DollarSign, title: 'Total Earnings', value: '$45,000', color: 'text-red-600' }
  // ];

  const pieData1 = [
    { name: 'Active', value: 400 },
    { name: 'Inactive', value: 200 }
  ];

  const pieData2 = [
    { name: 'Pending', value: 300 },
    { name: 'Completed', value: 500 }
  ];

  const barData = [
    { month: 'Jan', earnings: 4000 },
    { month: 'Feb', earnings: 3000 },
    { month: 'Mar', earnings: 5000 },
    { month: 'Apr', earnings: 4500 },
    { month: 'May', earnings: 6000 }
  ];

  const COLORS1 = ['#0088FE', '#FF8042'];
  const COLORS2 = ['#00C49F', '#FFBB28'];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Box 1: Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={User} alt="Total Users" className="w-[62px] h-[56px] mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl  font-[benne]">600</p>
            </div>
          </div>

          {/* Box 2: Total Labors */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Labor} alt="Total Labors" className="w-[52px] h-[56px]  mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Labors</h2>
              <p className="text-3xl  font-[benne]">1,600</p>
            </div>
          </div>

          {/* Box 3: Total Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Booking} alt="Total Bookings" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Bookings</h2>
              <p className="text-3xl  font-[benne]">300</p>
            </div>
          </div>

          {/* Box 4: Total Earnings */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <img src={Payment} alt="Total Earnings" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Earnings</h2>
              <p className="text-3xl  font-[benne]">₹ 12,000</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Charts */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-center">Labor Status</h3>
            <div className="flex justify-between">
              <ResponsiveContainer width="48%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData1}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="48%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData2}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                <span>Inactive</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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