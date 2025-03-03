import React, { useEffect, useState } from 'react'
import AdminSideRow from './AdminSideRow'
import './User.css'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import {  Eye, Trash2} from 'lucide-react';
import { fetchUser } from '../../../services/AdminAuthServices'
import UseDebounce from '../../../Hooks/useDebounce'

interface User {
  _id: string;
  firstName?: string;
  email: string;
  isBlocked: boolean;
}


const UserMangement = () => {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);
  const filterOptions = [
    { value: "All", label: "All", color: "bg-gray-500" },
    { value: "Active", label: "Active", color: "bg-green-500" },
    { value: "InActive", label: "InActive", color: "bg-red-500" },
  ];
  const [selectedFilter, setSelectedFilter] = useState("Filter"); // Default label
  console.log('hhhhhh',selectedFilter)
  const [isOpen, setIsOpen] = useState(false);

 const fetchUsers = async (query = "", pageNumber = 1, selectedFilter : string) => {
    try {
      const response = await fetchUser({query, pageNumber,selectedFilter});

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
    fetchUsers(debouncedSearchTerm, page,selectedFilter);
  }, [debouncedSearchTerm, page,selectedFilter]);


  const handleViewPage = (user : User) => {
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
    <div className="flex min-h-screen">
      <AdminSideRow />
      <div className="div w-full bg-[#D6CCCC]">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4">
          {/* Title section with responsive text sizes */}
          <div className="text-center lg:p-7 md:p-7 p-6 sm:p-7 sm:text-left mb-4 sm:mb-0">
            <h1 className="font-serif text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
              User Management
            </h1>
          </div>
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
            <div className="relative min-w-[120px] sm:min-w-[150px]">
              <div className="relative">
                <div
                  className="flex items-center justify-center border border-gray-300 
                  rounded-full px-4 py-2 shadow-sm bg-[#ABA0A0] 
                  hover:bg-[#bab1b1] cursor-pointer w-full"
                  onClick={() => setIsOpen(!isOpen)}
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
                  <span className="font-medium text-white">
                    {selectedFilter}
                  </span>
                </div>

                {isOpen && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-10">
                    {filterOptions.map((filter) => (
                      <div
                        key={filter.value}
                        className={`px-4 py-2 text-white cursor-pointer first:rounded-t-lg last:rounded-b-lg ${filter.color} hover:opacity-80`}
                        onClick={() => {
                          setSelectedFilter(filter.value);
                          setIsOpen(false);
                        }}
                      >
                        {filter.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative px-4 pt-5">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {" "}
                {/* Minimum width container for horizontal scroll */}
                {/* List Headings */}
                <div className="grid grid-cols-11 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow mb-4">
                  <div className="col-span-1 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    No
                  </div>
                  <div className="col-span-3 text-center sm:text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Name
                  </div>
                  <div className="col-span-4 text-center sm:text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Email
                  </div>
                  <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    Status
                  </div>
                  <div className="col-span-1 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    Actions
                  </div>
                </div>
                {/* User List */}
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <div
                      key={user._id}
                      className="grid grid-cols-11 gap-4 items-center bg-[#ABA0A0] rounded-lg shadow-md p-3 hover:bg-[#998F8F] transition-colors"
                    >
                      {/* Number */}
                      <div className="col-span-1 text-center text-xs sm:text-sm  text-white font-bold">
                        {index + 1}
                      </div>

                      {/* Name */}
                      <div className="col-span-3 text-center sm:text-left text-xs sm:text-sm font-bold text-white truncate">
                        {user.firstName ?? "User"}
                      </div>

                      {/* Email */}
                      <div className="col-span-4 text-center sm:text-left text-xs sm:text-sm text-white truncate font-bold">
                        {user.email}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            user.isBlocked
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-center gap-2">
                        <button
                          onClick={() => handleViewPage(user)}
                          className="inline-flex items-center p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                          aria-label="View profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              // handleDeleteUser(user);
                            }
                          }}
                          className="inline-flex items-center p-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                          aria-label="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
