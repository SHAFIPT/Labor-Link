import React, { useEffect, useState } from 'react';
import { FaHome, FaUsers, FaClipboardList, FaDollarSign, FaHardHat } from 'react-icons/fa'; // React Icons
import logo from '../../../assets/laborLink light.jpg'; // Your logo
import { Link, useNavigate } from "react-router-dom";
import { resetUser, setAccessToken, setFormData, setisUserAthenticated, setUser } from '../../../redux/slice/userSlice';
import { resetLaborer, setIsLaborAuthenticated, setLaborer } from '../../../redux/slice/laborSlice';
import { persistor } from '../../../redux/store/store';
import { toast } from 'react-toastify';
import { logout } from '../../../services/AdminAuthServices';
import { useDispatch } from 'react-redux';
import { resetAdmin, setAdmin, setIsAdminAuthenticated } from '../../../redux/slice/adminSlice';
import { describe } from 'node:test';
import { Clock, IndianRupee } from 'lucide-react';

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
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const handleLogout = async () => {
      console.log('hlooooooooooooooooooooooooooo')
      try {
        const response = await logout();
        
        if (response?.status === 200) {
          // Clear all auth-related data
          localStorage.removeItem('UserAccessToken');
          localStorage.removeItem('LaborAccessToken');
          
          dispatch(setAdmin({}))
          dispatch(resetAdmin())
          dispatch(setIsAdminAuthenticated(false))
          dispatch(setFormData({}))
          

          // Reset User State
          dispatch(setUser({}));
          dispatch(setFormData({}));
          dispatch(resetUser())
          dispatch(setisUserAthenticated(false));
          dispatch(setAccessToken(''));
          
          // Reset Labor State
          dispatch(setLaborer({}));
          dispatch(resetLaborer())
          dispatch(setIsLaborAuthenticated(false));
          
          // Clear persisted state
          await persistor.purge();
          
          toast.success('Logged out successfully');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
      }
  }
  
  // useEffect(() => {
    
  // },[dispatch, navigate])

  return (
    <div className="flex relative ">
      {/* Sidebar with conditional classes for open/close */}
      <div className={`flex flex-col items-center  LaftSideBar ${isOpen ? 'w-[320px]' : 'w-0'} transition-all min-h-screen p-2 bg-white`}>
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
              <Link to="/admin/bookingListing" onClick={() => setCurrentPage("bookingListing")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "bookingListing" ? "bg-green-500 text-white" : "text-black"}`}>
                  <FaClipboardList className="text-[25px]" />
                  <p className="text-[15px]">Booking Management</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center mb-4 space-x-3">
              <Link to="/admin/paymentEarnigs" onClick={() => setCurrentPage("paymentEarnigs")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "paymentEarnigs" ? "bg-green-500 text-white" : "text-black"}`}>
                  <IndianRupee className="text-[25px]" />
                  <p className="text-[15px]">Payment and Earnings</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center mb-4 space-x-3">
              <Link to="/admin/withdrowPendings" onClick={() => setCurrentPage("withdrowPendings")}>
                <div className={`flex items-center space-x-3 p-2 rounded-md ${currentPage === "withdrowPendings" ? "bg-green-500 text-white" : "text-black"}`}>
                  <Clock className="text-[25px]" />
                  <p className="text-[15px]">Widrowall pendings</p>
                </div>
              </Link>
            </div>

             {/* Logout Button at the Bottom */}
      <div className="mt-auto w-full flex justify-center pb-4">
        <button
          onClick={handleLogout}
          className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
        >
          <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Logout
          </div>
        </button>
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
