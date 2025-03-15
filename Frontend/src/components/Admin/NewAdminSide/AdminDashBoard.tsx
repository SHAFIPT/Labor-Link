// import React, { useState } from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Users, HardHat, Calendar, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

// const AdminDashBoard = () => {
//   // Sample data for statistics
//   const stats = [
//     { 
//       title: 'Total Users', 
//       value: 5432, 
//       icon: <Users size={24} />, 
//       increase: 12.5, 
//       bgColor: 'bg-blue-500' 
//     },
//     { 
//       title: 'Total Labors', 
//       value: 1280, 
//       icon: <HardHat size={24} />, 
//       increase: 8.2, 
//       bgColor: 'bg-green-500' 
//     },
//     { 
//       title: 'Total Bookings', 
//       value: 3875, 
//       icon: <Calendar size={24} />, 
//       increase: -3.8, 
//       bgColor: 'bg-purple-500' 
//     },
//     { 
//       title: 'Total Earnings', 
//       value: 98650, 
//       icon: <DollarSign size={24} />, 
//       increase: 15.3, 
//       bgColor: 'bg-amber-500' 
//     }
//   ];

//   // Sample data for line chart
//   const [chartData] = useState([
//     { name: 'Jan', earnings: 15000 },
//     { name: 'Feb', earnings: 18000 },
//     { name: 'Mar', earnings: 16500 },
//     { name: 'Apr', earnings: 21000 },
//     { name: 'May', earnings: 19500 },
//     { name: 'Jun', earnings: 23000 },
//     { name: 'Jul', earnings: 25000 },
//     { name: 'Aug', earnings: 28000 },
//     { name: 'Sep', earnings: 30000 },
//     { name: 'Oct', earnings: 32000 },
//     { name: 'Nov', earnings: 35000 },
//     { name: 'Dec', earnings: 40000 }
//   ]);

//   // Sample data for booking status bar chart
//   const [bookingData] = useState([
//     { name: 'Monday', completed: 45, cancelled: 12, pending: 8 },
//     { name: 'Tuesday', completed: 52, cancelled: 15, pending: 10 },
//     { name: 'Wednesday', completed: 58, cancelled: 18, pending: 12 },
//     { name: 'Thursday', completed: 63, cancelled: 20, pending: 15 },
//     { name: 'Friday', completed: 72, cancelled: 25, pending: 18 },
//     { name: 'Saturday', completed: 85, cancelled: 30, pending: 22 },
//     { name: 'Sunday', completed: 65, cancelled: 22, pending: 17 }
//   ]);

//   // Sample data for payment status pie chart
//   const [paymentData] = useState([
//     { name: 'Completed', value: 85000, color: '#4ADE80' },  // Green
//     { name: 'Cancelled', value: 15000, color: '#F87171' },  // Red
//     { name: 'Pending', value: 25000, color: '#FBBF24' }     // Amber
//   ]);

//   // Toggle between daily, monthly, yearly views
//   const [timeFrame, setTimeFrame] = useState('monthly');

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0
//     }).format(value);
//   };

//   const RADIAN = Math.PI / 180;
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//             <div className="p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
//                   <div className="flex items-center space-x-1 mt-1">
//                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {stat.title === 'Total Earnings' ? formatCurrency(stat.value) : stat.value.toLocaleString()}
//                     </h3>
//                     <span className={`text-xs font-medium flex items-center ${stat.increase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                       {stat.increase >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
//                       {Math.abs(stat.increase)}%
//                     </span>
//                   </div>
//                 </div>
//                 <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                   <div className="text-white">
//                     {stat.icon}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={`h-1 ${stat.bgColor}`}></div>
//           </div>
//         ))}
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Overview</h2>
//           <div className="flex mt-4 sm:mt-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
//             <button 
//               onClick={() => setTimeFrame('daily')}
//               className={`px-4 py-2 text-sm font-medium ${timeFrame === 'daily' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
//             >
//               Daily
//             </button>
//             <button 
//               onClick={() => setTimeFrame('monthly')}
//               className={`px-4 py-2 text-sm font-medium ${timeFrame === 'monthly' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
//             >
//               Monthly
//             </button>
//             <button 
//               onClick={() => setTimeFrame('yearly')}
//               className={`px-4 py-2 text-sm font-medium ${timeFrame === 'yearly' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
//             >
//               Yearly
//             </button>
//           </div>
//         </div>
        
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={chartData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis 
//                 dataKey="name" 
//                 stroke="#6B7280"
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis 
//                 stroke="#6B7280"
//                 tickFormatter={(value) => `$${value}`}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <Tooltip
//                 formatter={(value) => [`${formatCurrency(value)}`, 'Earnings']}
//                 contentStyle={{ 
//                   backgroundColor: '#1F2937', 
//                   border: 'none', 
//                   borderRadius: '8px',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                 }}
//                 itemStyle={{ color: '#E5E7EB' }}
//                 labelStyle={{ color: '#E5E7EB', fontWeight: 'bold', marginBottom: '5px' }}
//               />
//               <Legend />
//               <defs>
//                 <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
//                   <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <Line 
//                 type="monotone" 
//                 dataKey="earnings" 
//                 stroke="#3B82F6" 
//                 strokeWidth={3}
//                 dot={{ r: 6, strokeWidth: 2 }}
//                 activeDot={{ r: 8, strokeWidth: 2 }}
//                 fillOpacity={1}
//                 fill="url(#colorEarnings)" 
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Booking & Payment Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Booking Status Bar Chart */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Booking Statistics</h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={bookingData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis 
//                   dataKey="name" 
//                   stroke="#6B7280"
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <YAxis 
//                   stroke="#6B7280"
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <Tooltip
//                   contentStyle={{ 
//                     backgroundColor: '#1F2937', 
//                     border: 'none', 
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                   itemStyle={{ color: '#E5E7EB' }}
//                   labelStyle={{ color: '#E5E7EB', fontWeight: 'bold', marginBottom: '5px' }}
//                 />
//                 <Legend />
//                 <Bar dataKey="completed" name="Completed" fill="#4ADE80" radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="cancelled" name="Cancelled" fill="#F87171" radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="pending" name="Pending" fill="#FBBF24" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <div className="flex items-center space-x-2">
//               <div className="h-3 w-3 bg-green-400 rounded-full"></div>
//               <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="h-3 w-3 bg-red-400 rounded-full"></div>
//               <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="h-3 w-3 bg-amber-400 rounded-full"></div>
//               <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
//             </div>
//           </div>
//         </div>

//         {/* Payment Status Pie Chart */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Status</h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={paymentData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={renderCustomizedLabel}
//                   outerRadius={90}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {paymentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value) => [`${formatCurrency(value)}`, 'Amount']}
//                   contentStyle={{ 
//                     backgroundColor: '#1F2937', 
//                     border: 'none', 
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                   itemStyle={{ color: '#E5E7EB' }}
//                   labelStyle={{ color: '#E5E7EB', fontWeight: 'bold', marginBottom: '5px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="grid grid-cols-3 gap-2 mt-4">
//             {paymentData.map((entry, index) => (
//               <div key={index} className="flex items-center justify-center space-x-2">
//                 <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   <span>{entry.name}</span>
//                   <span className="block font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(entry.value)}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="div">
        
//       </div>
//     </div>
//   );
// };

// export default AdminDashBoard;