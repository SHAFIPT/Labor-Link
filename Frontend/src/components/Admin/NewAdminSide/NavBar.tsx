// import React, { useState } from 'react';
// import { Bell, MessageSquare, Search, User, Menu, X } from 'lucide-react';

// const Navbar = () => {
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);

//   return (
//     <div className="bg-gray-800 text-white py-2 sm:py-3 px-2 sm:px-4 shadow-md flex items-center justify-between sticky top-0 z-10">
//       {/* Mobile menu button - only visible on small screens
//       <button className="p-2 rounded-md lg:hidden mr-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
//         <Menu className="w-5 h-5" />
//       </button> */}

//       {/* Left side - Search bar */}
//       <div className={`${isSearchExpanded ? 'flex absolute top-full left-0 right-0 p-2 bg-gray-800 sm:relative sm:top-auto sm:p-0' : 'hidden sm:flex'} flex-grow max-w-md sm:max-w-xl relative`}>
//         <div className="relative w-full">
//           <input 
//             type="search" 
//             placeholder="Search here..." 
//             className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
//           />
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//             <Search className="w-4 h-4 sm:w-5 sm:h-5" />
//           </div>
//         </div>
//       </div>
      
//       {/* Mobile search button - only visible on very small screens */}
//       <button 
//         className="p-2 rounded-md sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         onClick={() => setIsSearchExpanded(!isSearchExpanded)}
//       >
//         {isSearchExpanded ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
//       </button>
      
//       {/* Right side - Icons and Profile */}
//       <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 ml-auto">
//         {/* Notification Icon */}
//         <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
//           <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
//           <span className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white text-center">
//             <span className="text-xs hidden sm:inline">3</span>
//           </span>
//         </button>
        
//         {/* Message Icon */}
//         <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
//           <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
//           <span className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white text-center">
//             <span className="text-xs hidden sm:inline">5</span>
//           </span>
//         </button>
        
//         {/* Profile */}
//         <div className="flex items-center space-x-2 border-l border-gray-700 pl-2 sm:pl-4">
//           <div className="hidden sm:block md:block text-right">
//             <p className="text-xs sm:text-sm font-medium truncate">Admin User</p>
//             <p className="text-xs text-gray-400 truncate hidden md:block">Administrator</p>
//           </div>
//           <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
//             {/* Replace with actual profile image if available */}
//             <User className="w-4 h-4 sm:w-6 sm:h-6" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;