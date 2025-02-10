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
  const [Labors, setLabors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedLabor, setSelectedLabor] = useState(null);


  console.log("this is the repnse of the users users :", Labors);
  Labors.map((user) => {
    const userName = `${user.firstName} ${user.lastName}`; // Combine first and last name
    const isBlocked = user.isBlocked; // Get the isBlocked status

    console.log("User is name :", userName);
    console.log("isBlocked is this:", isBlocked);
  });

  const fetchUsers = async (query = "", pageNumber = 1) => {
    const resoponse = await fetchLabor(query, pageNumber);

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
      await fetchUsers(debouncedSearchTerm, page);
    };

    fetchData();
  }, [debouncedSearchTerm, page]);

  const handleDeleteLabor = async (labor) => {
  try {
    console.log("This is the deleting labor:", labor.email);

    const response = await deleteLabor({ email: labor.email });

    if (response.status === 200) {
      toast.success("Labor deleted successfully!");
      
      // Call fetchUsers to get the updated data
      await fetchUsers(debouncedSearchTerm, page);
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
    <div className="flex h-screen">
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
          <div className="relative px-4 pt-5">
            {/* List Headings */}
            <div className="grid grid-cols-12 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
              <div className="col-span-1 text-center text-sm font-semibold text-gray-700">
                No
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                Name
              </div>
              <div className="col-span-3 text-center text-sm font-semibold text-gray-700">
                Email
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                Expertise
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
               Approval Status
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                Actions
              </div>
            </div>

            {/* User List Section */}
            <div className="relative grid gap-4 mt-4">
              {Labors.map((labor, index) => (
                <div
                  key={labor.id}
                  className="grid grid-cols-12 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                >
                  {/* Number */}
                  <div className="col-span-1 text-center text-sm font-medium text-white">
                    {index + 1}
                  </div>

                  {/* User Name */}
                  <div className="col-span-2 lg:text-center sm:text-left text-sm font-medium text-white">
                    {labor.firstName ?? "User"}
                  </div>

                  {/* User Email */}
                  <div className="col-span-3 lg:text-center sm:text-left text-sm text-white">
                    {labor.email}
                  </div>

                  {/* User Expertise */}
                  <div className="col-span-2 lg:text-center sm:text-left text-sm text-white">
                    {labor.categories[0] || "N/A"}
                  </div>

                 <div className="col-span-2 lg:text-center">
                  <span
                    className={`px-2 py-1 lg:text-center text-xs rounded-full text-white ${
                      labor.status === 'rejected'
                        ? 'bg-red-500'
                        : labor.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {labor.status === 'rejected'
                      ? 'Rejected'
                      : labor.status === 'pending'
                      ? 'Pending'
                      : 'Approved'}
                  </span>
                </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex lg:justify-center sm:justify-start gap-2">
                    <button
                      onClick={() => handleViewPage(labor)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
                      aria-label="View profile"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">View</span>
                    </button>

                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
                      aria-label="Delete user"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this user?")) {
                          handleDeleteLabor(labor);
                        }
                      }}
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
};

export default LaborMangement;
