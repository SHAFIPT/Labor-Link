import React, { useEffect, useState } from 'react'
import AdminSideRow from './AdminSideRow'
import './User.css'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { UserPlus , Eye, Trash2} from 'lucide-react';
import { fetchUser } from '../../../services/AdminAuthServices'
import UseDebounce from '../../../Hooks/useDebounce'
const UserMangement = () => {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);


 const fetchUsers = async (query = "", pageNumber = 1) => {
    try {
      const response = await fetchUser(query, pageNumber);

      if (response.status === 200) {
        const { totalPage, usersFound } = response.data.data;
        setUsers(usersFound);
        setTotalPages(totalPage);
      } else {
        toast.error("Error occurred during fetchUser!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error occurred while fetching users!");
    }
  };

    useEffect(() => {
    fetchUsers(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page]);


  const handleViewPage = (user) => {
    navigate('/admin/userView',{state : {user}})
  }


  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSideRow />
      <div className="div w-full bg-[#D6CCCC]">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4">
          {/* Title section with responsive text sizes */}
          <div className="text-center lg:p-7 md:p-7 p-6 sm:p-7 sm:text-left mb-4 sm:mb-0">
            <h1 className="font-serif text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
              User Management
            </h1>
          </div>

          {/* Button section */}
          {/* <div className="flex justify-center sm:justify-end">
            <button className="group relative w-32 bg-gradient-to-b from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 shadow-md px-4 py-2 rounded-xl border border-gray-400 text-white font-medium transition-all duration-300">
              <div className="relative overflow-hidden h-6">
                <span className="block group-hover:-translate-y-full transition-transform duration-300 ease-in-out">
                  Add User
                </span>
                <span className="absolute inset-x-0 top-full group-hover:-translate-y-full transition-transform duration-300 ease-in-out flex justify-center">
                  <UserPlus className="w-5 h-5" />
                </span>
              </div>
            </button>
          </div> */}
        </div>

        <div className="w-full">
          {/* Search Filters Section */}
          <div className="serchfilters flex flex-col sm:flex-row gap-4 w-full p-4 pb-2">
            {/* Search Box */}
            <div className="search-container flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 17a6 6 0 100-12 6 6 0 000 12zm0 0l4 4"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search the users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full text-white border 
                  bg-[#ABA0A0] border-gray-300 shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 placeholder-white"
                />
              </div>
            </div>

            {/* Filter Box */}
            <div className="filter-container min-w-[120px] sm:min-w-[150px]">
              <div
                className="flex items-center justify-center border border-gray-300 
                          rounded-full px-4 py-2 shadow-sm bg-[#ABA0A0] 
                          hover:bg-[#bab1b1] cursor-pointer w-full"
              >
                <span className="text-gray-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.447.894l-4 2A1 1 0 017 21v-6.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                </span>
                <span className="font-medium text-white">Filter</span>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="status-container relative min-w-[120px] sm:min-w-[150px]">
              <div className="select">
                <div
                  className="selected h-[37px] flex items-center gap-x-2 px-4 
                    bg-[#ABA0A0] rounded-full border border-gray-300 
                    cursor-pointer"
                >
                  <h1 className="text-[16px] sm:text-[18px] font-medium text-white flex-1">
                    Status
                  </h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                    className="arrow"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>
                <div className="options">
                  {["Option 1", "Option 2", "Option 3"].map((option) => (
                    <div key={option} className="option cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        id={option}
                        className="hidden"
                      />
                      <label
                        htmlFor={option}
                        className="cursor-pointer w-full block"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative px-4 pt-5 ">
            {/* List Headings */}
            <div className="grid grid-cols-12 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
              <div className="col-span-1 text-center text-sm font-semibold text-gray-700">
                No
              </div>
              <div className="col-span-3 text-center text-sm font-semibold text-gray-700">
                Name
              </div>
              <div className="col-span-4 text-center text-sm font-semibold text-gray-700">
                Email
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                Status
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                Actions
              </div>
            </div>

            {/* User List Section */}
            <div className="relative grid gap-4 mt-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                >
                  {/* Number */}
                  <div className="col-span-1 text-center text-sm font-medium text-white">
                    {index + 1}
                  </div>

                  {/* User Name */}
                  <div className="col-span-3  lg:text-center sm:text-left text-sm font-medium text-white">
                     {user.firstName ?? "User"}
                  </div>

                  {/* User Email */}
                  <div className="col-span-4 lg:text-center sm:text-left text-sm text-white">
                    {user.email}
                  </div>

                  {/* User Status */}
                  <div className="col-span-2 lg:text-center">
                    <span
                      className={`px-2 py-1 lg:text-center text-xs rounded-full text-white ${
                        user.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex  lg:justify-center sm:justify-start gap-2">
                    <button
                      onClick={() => handleViewPage(user) }
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
                      aria-label="View profile"
                    >
                      <Eye className="w-4 h-4" />
                    <span className="hidden md:inline">View</span>
                      
                    </button>

                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
                      aria-label="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          {/* Pagination controls */}
          <div className="flex justify-center gap-4 p-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
}

export default UserMangement
