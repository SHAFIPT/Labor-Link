import React, { useState } from 'react';
import { FaHome, FaUsers, FaClipboardList, FaDollarSign } from 'react-icons/fa'; // React Icons
import logo from '../../../assets/laborLink light.jpg'; // Your logo
import { Link } from "react-router-dom";

const AdminSideRow = () => {
  // State to control sidebar visibility
  const [isOpen, setIsOpen] = useState(true);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex relative">
      {/* Sidebar with conditional classes for open/close */}
      <div className={`flex flex-col items-center  LaftSideBar ${isOpen ? 'w-[320px]' : 'w-0'} transition-all h-full p-2 bg-white`}>
        {/* Logo at the top */}
        <div className=" logo mb-4">
          <img src={logo} className={`w-32 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-all`} alt="Logo" />
        </div>

        {/* Additional content below the logo */}
        {isOpen && (
          <div className="leftDrawerContent p-3 mt-12 space-y-14 ">
            <div className="flex items-center mb-4 space-x-3 ">
               <FaHome className="text-black mr-3" />
              <p className="text-black">Dashboard</p>
            </div>
            <div className="flex items-center mb-4 space-x-3 ">
              <FaUsers className="text-black mr-3 " />
              <Link to='/admin/userManagemnet'>
                <p className="text-black">User Management</p>
              </Link>
            </div>
            <div className="flex items-center mb-4 space-x-3 ">
              <FaClipboardList className="text-black mr-3" />
              <Link to='/admin/laborManagement'>
                <p className="text-black">Laborer Management</p>
              </Link>
            </div>
            <div className="flex items-center mb-4 space-x-3 ">
              <FaClipboardList className="text-black mr-3" />
              <p className="text-black">Booking Management</p>
            </div>
            <div className="flex items-center mb-4 space-x-3 ">
              <FaDollarSign className="text-black mr-3" />
              <p className="text-black">Payment and Earnings</p>
            </div>
          </div>
        )}
      </div>

      {/* Button to toggle sidebar */}
          <div>
              <button
        onClick={toggleSidebar}
        className="absolute bg-[#6c2d2d]  text-white top-7  transform -translate-y-1/2 z-10"
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
      </div>
    </div>
  );
};

export default AdminSideRow;
