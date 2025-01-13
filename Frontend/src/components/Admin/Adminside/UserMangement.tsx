import React from 'react'
import AdminSideRow from './AdminSideRow'
import './User.css'
import { UserPlus } from 'lucide-react';
const UserMangement = () => {
  return (
    <div className="flex h-screen">
      <AdminSideRow />
      <div className="div w-full bg-[#D6CCCC]">
        <div className="text md:p-9 lg:p-12 font-serif md:text-[29px] lg:text-[36px]">
          <h1>User Management</h1>
        </div>
        <div className="serchfilters flex flex-row  md:space-x-3 lg:space-x-10  ">
          <div className="searchBox md:w-[200px] lg:w-[450px] ml-2">
            <div className="relative ">
                {/* Search Icon */}
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

                {/* Search Input */}
                <input
                type="search"
                placeholder="Search the users..."
                className="sm:w-[130px] md:w-[320px] lg:w-full pl-10 pr-4 py-2 rounded-full text-white border bg-[#ABA0A0] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-white"
                />
            </div>
          </div>
          <div className="filterBox w-1/4">
            <div className="flex items-center  justify-center border border-gray-300 rounded-full px-4 py-2 shadow-sm bg-[#ABA0A0] hover:bg-[#bab1b1] cursor-pointer">
                {/* Filter Icon */}
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

                {/* Text */}
                <span className=" font-medium text-white">Filter</span>
            </div>
            </div>
        <div className='flex  justify-between md:space-x-14 lg:space-x-60'>
          <div className="allButton ">
            <div className="select flex flex-col ">
            <div
                className="selected h-[37px] flex items-center gap-x-2"
                data-default="All"
                data-one="option-1"
                data-two="option-2"
                data-three="option-3"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="arrow"
                >

                <path
                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                ></path>
                
                </svg>
                <h1 className='mr-9 text-[18px] font-medium text-white'>Status</h1>
            </div>
            <div className="options">
                <div title="all">
                <input id="all" name="option" type="radio" />
                <label className="option" data-txt="All"></label>
                </div>
                <div title="option-1">
                <input id="option-1" name="option" type="radio" />
                <label className="option"  data-txt="option-1"></label>
                </div>
                <div title="option-2">
                <input id="option-2" name="option" type="radio" />
                <label className="option"  data-txt="option-2"></label>
                </div>
                <div title="option-3">
                <input id="option-3" name="option" type="radio" />
                <label className="option"  data-txt="option-3"></label>
                </div>
            </div>
            </div>

          </div>
            
          </div>
          <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-md transition-all duration-200 ease-in-out"
                onClick={() => console.log('Add user clicked')}
                >
                <UserPlus className="w-5 h-5" />
                <span>Add User</span>
            </button>
        </div>
      </div>
    </div>
  );
}

export default UserMangement
