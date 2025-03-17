import React, { useState } from "react";
import { Search, User, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="bg-gray-800 text-white py-2 sm:py-3 px-2 sm:px-4 shadow-md flex items-center justify-between sticky top-0 z-10">
      {/* Left side - Search bar */}
      <div
        className={`${
          isSearchExpanded
            ? "flex absolute top-full left-0 right-0 p-2 bg-gray-800 sm:relative sm:top-auto sm:p-0"
            : "hidden sm:flex"
        } flex-grow max-w-md sm:max-w-xl relative`}
      >
      </div>

      {/* Mobile search button - only visible on very small screens */}
      <button
        className="p-2 rounded-md sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
      >
        {isSearchExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </button>

      {/* Right side - Icons and Profile */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 ml-auto">
    
        {/* Profile */}
        <div className="flex items-center space-x-2 border-l border-gray-700 pl-2 sm:pl-4">
          <div className="hidden sm:block md:block text-right">
            <p className="text-xs sm:text-sm font-medium truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-400 truncate hidden md:block">
              Administrator
            </p>
          </div>
          <Link to='/admin/profile' className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
            {/* Replace with actual profile image if available */}
            <User className="w-4 h-4 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
