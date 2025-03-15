// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   ChevronLeft,
//   ChevronRight,
//   LayoutDashboard,
//   Users,
//   Hammer,
//   Calendar,
//   CreditCard,
//   Wallet,
// } from "lucide-react";

// const SideDrower = ({ isCollapsed, toggleSidebar }) => {
//   const location = useLocation(); // Get current route
//   const [hoveredItem, setHoveredItem] = useState(null);

//   const menuItems = [
//     { name: "Dashboard", icon: <LayoutDashboard size={20} />, route: "/admin/adminDashBoard" },
//     { name: "User Management", icon: <Users size={20} />, route: "/admin/userManagentPage" },
//     { name: "Laborer Management", icon: <Hammer size={20} />, route: "/admin/laborManagentPage" },
//     { name: "Booking Management", icon: <Calendar size={20} />, route: "/admin/bookingsManagementPage" },
//     { name: "Payment and Earnings", icon: <CreditCard size={20} />, route: "/payments" },
//     { name: "Withdrawal Pendings", icon: <Wallet size={20} />, route: "/withdrawals" },
//   ];

//   return (
//     <div
//       className={`bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out ${
//         isCollapsed ? "w-20" : "w-64"
//       } fixed left-0 top-0 shadow-lg z-10`}
//     >
//       {/* Logo Section */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-700">
//         <div className="flex items-center">
//           <div className="bg-blue-500 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold">
//             LL
//           </div>
//           {!isCollapsed && (
//             <span className="ml-3 font-semibold text-lg transition-opacity duration-300">
//               Labour Link
//             </span>
//           )}
//         </div>
//         <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
//           {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//         </button>
//       </div>

//       {/* Menu Items */}
//       <div className="mt-6">
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.route; // Check if the route matches

//           return (
//             <Link to={item.route} key={item.name} className="block">
//               <div
//                 className={`relative flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out ${
//                   isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
//                 }`}
//                 onMouseEnter={() => setHoveredItem(item.name)}
//                 onMouseLeave={() => setHoveredItem(null)}
//               >
//                 <div className="flex items-center justify-center w-8">{item.icon}</div>
//                 {!isCollapsed && (
//                   <span className="ml-3 transition-opacity duration-300">{item.name}</span>
//                 )}
//                 {isCollapsed && hoveredItem === item.name && (
//                   <div className="absolute left-20 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg whitespace-nowrap z-20">
//                     {item.name}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SideDrower;
