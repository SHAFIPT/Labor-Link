import React, { useState } from 'react';
import { FaHome, FaUsers, FaClipboardList, FaDollarSign, FaHardHat } from 'react-icons/fa'; // React Icons
import logo from '../../../assets/laborLink light.jpg'; // Your logo
import { Link } from "react-router-dom";

const AdminSideRow = () => {
  // State to control sidebar visibility
  const currentPages = location.pathname.split("/").pop();
  console.log('curetnPages',currentPages)
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage , setCurrentPage] = useState(currentPages)

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
              <Link to='/admin/adimDashboard' onClick={() => setCurrentPage("adimDashboard")}>
              <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "adimDashboard" ? "bg-green-500 text-white" : "text-black"}`}>
                <FaHome className="text-[25px]" />
                <p className="text-[15px]">Dashboard</p>
              </div>
            </Link>

            <div className="flex items-center mb-4 space-x-3 ">
            <Link to='/admin/userManagemnet' onClick={() => setCurrentPage("userManagemnet")}>
              <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "userManagemnet" ? "bg-green-500 text-white" : "text-black"}`}>
                <FaUsers className="text-[25px]" />
                <p className="text-[15px]">User Management</p>
              </div>
              </Link>
            </div>

            <div className="flex items-center mb-4 space-x-3 ">
              <Link to='/admin/laborManagement' onClick={() => setCurrentPage("laborManagement")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "laborManagement" ? "bg-green-500 text-white" : "text-black"}`}>
                  <FaHardHat className="text-[25px]" />
                  <p className="text-[15px]">Laborer Management</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center mb-4 space-x-3">
              <Link to="/admin/bookingManagement" onClick={() => setCurrentPage("bookingManagement")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "bookingManagement" ? "bg-green-500 text-white" : "text-black"}`}>
                  <FaClipboardList className="text-[25px]" />
                  <p className="text-[15px]">Booking Management</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center mb-4 space-x-3">
              <Link to="/admin/paymentEarnings" onClick={() => setCurrentPage("paymentEarnings")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "paymentEarnings" ? "bg-green-500 text-white" : "text-black"}`}>
                  <FaDollarSign className="text-[25px]" />
                  <p className="text-[15px]">Payment and Earnings</p>
                </div>
              </Link>
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
