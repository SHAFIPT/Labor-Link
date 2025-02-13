import React, { useState ,useEffect } from "react";
import AdminSideRow from "./AdminSideRow";
import "./User.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, Trash2 } from "lucide-react";
import { deleteLabor, fetchLabor } from "../../../services/AdminAuthServices";
import UseDebounce from "../../../Hooks/useDebounce";

const LaborMangement = () => {
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("");
  const [Labors, setLabors] = useState([]);
  const [page, setPage] = useState(1);
  const filterOptions = [
    { value: "All", label: "All", color: "bg-gray-500" },
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "approved", label: "Approved", color: "bg-green-500" },
    { value: "rejected", label: "Rejected", color: "bg-red-500" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);
  

  console.log("this is the repnse of the users users :", Labors);
  Labors.map((user) => {
    const userName = `${user.firstName} ${user.lastName}`; // Combine first and last name
    const isBlocked = user.isBlocked; // Get the isBlocked status

    console.log("User is name :", userName);
    console.log("isBlocked is this:", isBlocked);
  });

  const fetchUsers = async (query = "", pageNumber = 1 ,selectedFilter) => {
    const resoponse = await fetchLabor(query, pageNumber ,selectedFilter);

    console.log("this is the repnse of the labor fetch :", resoponse);

    if (resoponse.status === 200) {
      const { totalPage, laborFound } = resoponse.data.data;

      console.log("Thsi is the requestBody :", resoponse);
      console.log("Thsi is the totalPages :", totalPage);
      console.log("Thsi is the laborFound :", laborFound);

      setLabors(laborFound);
      setTotalPages(totalPage);
      console.log("thhi is the response :", resoponse);
    } else {
      toast.error("Error occurd during fetchUser....!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(debouncedSearchTerm, page,selectedFilter);
    };

    fetchData();
  }, [debouncedSearchTerm, page,selectedFilter]);

  const handleDeleteLabor = async (labor) => {
  try {
    console.log("This is the deleting labor:", labor.email);

    const response = await deleteLabor({ email: labor.email });

    if (response.status === 200) {
      toast.success("Labor deleted successfully!");
      
      // Call fetchUsers to get the updated data
      await fetchUsers(debouncedSearchTerm, page ,selectedFilter);
    } else {
      toast.error("Error occurred during deletion!");
    }
  } catch (error) {
    console.error("Error during deletion:", error);
    toast.error("Error occurred during deletion!");
  }
};

  const handleViewPage = (labor) => {
    //  console.log('this is passing user :',user)
    navigate("/admin/laborView", { state: { labor } });
  };

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
              Labor Management
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}       
                  placeholder="Search the users..."
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
              {/* List Headings */}
              <div className="grid grid-cols-12 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
                <div className="col-span-1 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  No
                </div>
                <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Name
                </div>
                <div className="col-span-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Email
                </div>
                <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Expertise
                </div>
                <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Approval Status
                </div>
                <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Actions
                </div>
              </div>

              {/* Labor List */}
              <div className="space-y-2 mt-4">
                {Labors.map((labor, index) => (
                  <div
                    key={labor.id}
                    className="grid grid-cols-12 gap-4 items-center bg-[#ABA0A0] rounded-lg shadow-md p-3 hover:bg-[#998F8F] transition-colors"
                  >
                    {/* Number */}
                    <div className="col-span-1 text-center text-xs sm:text-sm text-white font-bold">
                      {index + 1}
                    </div>

                    {/* Name */}
                    <div className="col-span-2 text-center text-xs sm:text-sm  text-white truncate font-bold">
                      {labor.firstName ?? "User"}
                    </div>

                    {/* Email */}
                    <div className="col-span-3 text-center text-xs sm:text-sm text-white truncate font-bold">
                      {labor.email}      
                    </div>

                    {/* Expertise */}
                    <div className="col-span-2 text-center text-xs sm:text-sm text-white truncate font-bold">
                      {labor.categories[0] || "N/A"}
                    </div>

                    {/* Status */}
                    <div className="col-span-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium w-20 ${
                          labor.status === 'rejected'
                            ? 'bg-red-500 text-white'
                            : labor.status === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {labor.status === 'rejected'
                          ? 'Rejected'
                          : labor.status === 'pending'
                          ? 'Pending'
                          : 'Approved'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleViewPage(labor)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
                        aria-label="View profile"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline">View</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this user?")) {
                            handleDeleteLabor(labor);
                          }
                        }}
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
};

export default LaborMangement;
