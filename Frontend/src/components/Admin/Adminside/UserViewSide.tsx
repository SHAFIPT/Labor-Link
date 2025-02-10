import { toast } from "react-toastify";
import { ArrowLeft } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { blockUser, UnblockUser } from "../../../services/AdminAuthServices";
import { useEffect, useState } from "react";
import { fetchAllBooings } from "../../../services/UserSurvice";
import { IBooking } from "../../../@types/IBooking";


const UserViewSide = () => {



  const location = useLocation()
  const user = location.state?.user

  const [isBlocked, setIsBlocked] = useState(user?.isBlocked);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>(null) 
  const [currentPage, setCurrnetPage] = useState(6)
  const [limit, setLimit] = useState(1)
  const [filter, setFilter] = useState('')

  console.log("this is the user :", user?._id)
  const userId = user?._id


  const fetchBookings = async () => {
    try {
      const resoponse = await fetchAllBooings(
        userId,
        currentPage,
        limit,
        filter
      );

      if (resoponse.status === 200) {
        const {bookings} = resoponse.data
        console.log(bookings);
        setBookingDetils(bookings)
      }
    } catch (error) {
      console.error("Error in About me :", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchBookings()
  },[])
  
  const bookings = [
    {
      id: 101,
      laborer: "Ram Kumar",
      date: "2025-01-05",
      status: "completed",
      cost: 1400,
      payment: "success",
    },
    {
      id: 102,
      laborer: "Shyam Verma",
      date: "2025-01-07",
      status: "pending",
      cost: 2000,
      payment: "pending",
    },
    {
      id: 103,
      laborer: "Amit Singh",
      date: "2025-01-09",
      status: "completed",
      cost: 1200,
      payment: "success",
    },
    {
      id: 104,
      laborer: "Rajesh Mehra",
      date: "2025-01-11",
      status: "cancelled",
      cost: 0,
      payment: "failed",
    },
  ];

  const handleBlockTheUser = async () => {
    try {
      // Decide which API to call based on the current block status
      const response = isBlocked
        ? await UnblockUser({ email: user.email })
        : await blockUser({ email: user.email });

      if (response.status === 200) {
        // Toggle the state on success
        setIsBlocked(!isBlocked);
        toast.success(`User successfully ${isBlocked ? "unblocked" : "blocked"}!`);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error in block/unblock operation:", error.response?.data || error.message);
      toast.error(`Failed to ${isBlocked ? "unblock" : "block"} user.`);
    }
  };

  return (
    <div className="bg-[#D6CCCC] h-screen">
      <div className="bg-[#D6CCCC] profileCard flex lg:p-16 sm:p-28 p-28 md:p-12 lg:flex-row items-center sm:items-center md:items-center flex-col sm:flex-col lg:justify-evenly ">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 p-2 bg-gray-500 tet-white rounded-full hover:bg-gray-800 transition-colors z-[200]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="profile-card   w-[300px] rounded-md shadow-xl overflow-hidden z-[100] relative  snap-start shrink-0 bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
          <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1">
            <div className="img_container w-full flex items-center justify-center relative z-40 after:absolute after:h-[6px] after:w-full after:bg-[#58b0e0] after:top-4 after:group-hover:size-[1%] after:delay-300 after:group-hover:delay-0 after:group-hover:transition-all after:group-hover:duration-300 after:transition-all after:duration-300 before:absolute before:h-[6px] before:w-full before:bg-[#58b0e0] before:bottom-4 before:group-hover:size-[1%] before:delay-300 before:group-hover:delay-0 before:group-hover:transition-all before:group-hover:duration-300 before:transition-all before:duration-300">
              <svg
                className="size-36 z-40 border-4 border-white rounded-full group-hover:border-8 group-hover:transition-all group-hover:duration-300 transition-all duration-300"
                id="avatar"
                viewBox="0 0 61.8 61.8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g data-name="Layer 2">
                  <g data-name="—ÎÓÈ 1">
                    <path
                      d="M31.129 8.432c21.281 0 12.987 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z"
                      fill-rule="evenodd"
                      fill="#ffe8be"
                    ></path>
                    <circle
                      fill="#58b0e0"
                      r="30.9"
                      cy="30.9"
                      cx="30.9"
                    ></circle>
                    <path
                      d="M45.487 19.987l-29.173.175s1.048 16.148-2.619 21.21h35.701c-.92-1.35-3.353-1.785-3.909-21.385z"
                      fill-rule="evenodd"
                      fill="#60350a"
                    ></path>
                    <path
                      d="M18.135 45.599l7.206-3.187 11.55-.3 7.42 3.897-5.357 11.215-7.613 4.088-7.875-4.35-5.331-11.363z"
                      fill-rule="evenodd"
                      fill="#d5e1ed"
                    ></path>
                    <path
                      d="M24.744 38.68l12.931.084v8.949l-12.931-.085V38.68z"
                      fill-rule="evenodd"
                      fill="#f9dca4"
                    ></path>
                    <path
                      opacity=".11"
                      d="M37.677 38.778v3.58a9.168 9.168 0 0 1-.04 1.226 6.898 6.898 0 0 1-.313 1.327c-4.37 4.165-11.379.78-12.49-6.333z"
                      fill-rule="evenodd"
                    ></path>
                    <path
                      d="M52.797 52.701a30.896 30.896 0 0 1-44.08-.293l1.221-3.098 9.103-4.122c3.262 5.98 6.81 11.524 12.317 15.455A45.397 45.397 0 0 0 43.2 45.483l8.144 3.853z"
                      fill-rule="evenodd"
                      fill="#434955"
                    ></path>
                    <path
                      d="M19.11 24.183c-2.958 1.29-.442 7.41 1.42 7.383a30.842 30.842 0 01-1.42-7.383zM43.507 24.182c2.96 1.292.443 7.411-1.419 7.384a30.832 30.832 0 001.419-7.384z"
                      fill-rule="evenodd"
                      fill="#f9dca4"
                    ></path>
                    <path
                      d="M31.114 8.666c8.722 0 12.377 6.2 12.601 13.367.307 9.81-5.675 21.43-12.6 21.43-6.56 0-12.706-12.018-12.333-21.928.26-6.953 3.814-12.869 12.332-12.869z"
                      fill-rule="evenodd"
                      fill="#ffe8be"
                    ></path>
                    <path
                      d="M33.399 24.983a7.536 7.536 0 0 1 5.223-.993h.005c5.154.63 5.234 2.232 4.733 2.601a2.885 2.885 0 0 0-.785 1.022 6.566 6.566 0 0 1-1.052 2.922 5.175 5.175 0 0 1-3.464 2.312c-.168.027-.34.048-.516.058a4.345 4.345 0 0 1-3.65-1.554 8.33 8.33 0 0 1-1.478-2.53v.003s-.797-1.636-2.072-.114a8.446 8.446 0 0 1-1.52 2.64 4.347 4.347 0 0 1-3.651 1.555 5.242 5.242 0 0 1-.516-.058 5.176 5.176 0 0 1-3.464-2.312 6.568 6.568 0 0 1-1.052-2.921 2.75 2.75 0 0 0-.77-1.023c-.5-.37-.425-1.973 4.729-2.603h.002a7.545 7.545 0 0 1 5.24 1.01l-.001-.001.003.002.215.131a3.93 3.93 0 0 0 3.842-.148l-.001.001zm-4.672.638a6.638 6.638 0 0 0-6.157-.253c-1.511.686-1.972 1.17-1.386 3.163a5.617 5.617 0 0 0 .712 1.532 4.204 4.204 0 0 0 3.326 1.995 3.536 3.536 0 0 0 2.966-1.272 7.597 7.597 0 0 0 1.36-2.37c.679-1.78.862-1.863-.82-2.795zm10.947-.45a6.727 6.727 0 0 0-5.886.565c-1.538.911-1.258 1.063-.578 2.79a7.476 7.476 0 0 0 1.316 2.26 3.536 3.536 0 0 0 2.967 1.272 4.228 4.228 0 0 0 .43-.048 4.34 4.34 0 0 0 2.896-1.947 5.593 5.593 0 0 0 .684-1.44c.702-2.25.076-2.751-1.828-3.451z"
                      fill-rule="evenodd"
                      fill="#464449"
                    ></path>
                    <path
                      d="M17.89 25.608c0-.638.984-.886 1.598 2.943a22.164 22.164 0 0 0 .956-4.813c1.162.225 2.278 2.848 1.927 5.148 3.166-.777 11.303-5.687 13.949-12.324 6.772 3.901 6.735 12.094 6.735 12.094s.358-1.9.558-3.516c.066-.538.293-.733.798-.213C48.073 17.343 42.3 5.75 31.297 5.57c-15.108-.246-17.03 16.114-13.406 20.039z"
                      fill-rule="evenodd"
                      fill="#8a5c42"
                    ></path>
                    <path
                      d="M24.765 42.431a14.125 14.125 0 0 0 6.463 5.236l-4.208 6.144-5.917-9.78z"
                      fill-rule="evenodd"
                      fill="#fff"
                    ></path>
                    <path
                      d="M37.682 42.431a14.126 14.126 0 0 1-6.463 5.236l4.209 6.144 5.953-9.668z"
                      fill-rule="evenodd"
                      fill="#fff"
                    ></path>
                    <circle
                      fill="#434955"
                      r=".839"
                      cy="52.562"
                      cx="31.223"
                    ></circle>
                    <circle
                      fill="#434955"
                      r=".839"
                      cy="56.291"
                      cx="31.223"
                    ></circle>
                    <path
                      d="M41.997 24.737c1.784.712 1.719 1.581 1.367 1.841a2.886 2.886 0 0 0-.785 1.022 6.618 6.618 0 0 1-.582 2.086v-4.949zm-21.469 4.479a6.619 6.619 0 0 1-.384-1.615 2.748 2.748 0 0 0-.77-1.023c-.337-.249-.413-1.06 1.154-1.754z"
                      fill-rule="evenodd"
                      fill="#464449"
                    ></path>
                  </g>
                </g>
              </svg>
              <div className="absolute bg-[#58b0e0] z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-300 transition-all duration-300 delay-700 group-hover:delay-0"></div>
            </div>
          </div>
          <div className="headings *:text-center *:leading-4">
            {user && (
              <p className="text-xl font-serif font-semibold text-[#434955]">
                {user.firstName ?? "User"}  {user.lastName ?? "User"}
              </p>
            )}
            {/* <p className="text-sm font-semibold text-[#434955]">DEVELOPER</p> */}
          </div>
          <div className="w-full items-center justify-center flex">
            <ul className="flex flex-col items-start gap-2 has-[:last]:border-b-0 *:inline-flex *:gap-2 *:items-center *:justify-center *:border-b-[1.5px] *:border-b-stone-700 *:border-dotted *:text-xs *:font-semibold *:text-[#434955] pb-3">
              <li>
                <svg
                  id="phone"
                  viewBox="0 0 24 24"
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0V0z" fill="none"></path>
                  <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"></path>
                </svg>
                <p>+123-458-784</p>
              </li>
              <li>
                <svg
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  id="mail"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16,14.81,28.78,6.6A3,3,0,0,0,27,6H5a3,3,0,0,0-1.78.6Z"
                    fill="#231f20"
                  ></path>
                  <path
                    d="M16.54,16.84h0l-.17.08-.08,0A1,1,0,0,1,16,17h0a1,1,0,0,1-.25,0l-.08,0-.17-.08h0L2.1,8.26A3,3,0,0,0,2,9V23a3,3,0,0,0,3,3H27a3,3,0,0,0,3-3V9a3,3,0,0,0-.1-.74Z"
                    fill="#231f20"
                  ></path>
                </svg>
                <p>smkys@gmail.com</p>
              </li>
              <li>
                <svg
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  id="globe"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g data-name="Layer 2">
                    <path
                      data-name="globe"
                      d="M22 12A10 10 0 0 0 12 2a10 10 0 0 0 0 20 10 10 0 0 0 10-10zm-2.07-1H17a12.91 12.91 0 0 0-2.33-6.54A8 8 0 0 1 19.93 11zM9.08 13H15a11.44 11.44 0 0 1-3 6.61A11 11 0 0 1 9.08 13zm0-2A11.4 11.4 0 0 1 12 4.4a11.19 11.19 0 0 1 3 6.6zm.36-6.57A13.18 13.18 0 0 0 7.07 11h-3a8 8 0 0 1 5.37-6.57zM4.07 13h3a12.86 12.86 0 0 0 2.35 6.56A8 8 0 0 1 4.07 13zm10.55 6.55A13.14 13.14 0 0 0 17 13h2.95a8 8 0 0 1-5.33 6.55z"
                    ></path>
                  </g>
                </svg>
                <p>smkydevelopr.com</p>
              </li>
              <li>
                <svg
                  id="map"
                  viewBox="0 0 16 16"
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C5.2 0 3 2.2 3 5s4 11 5 11 5-8.2 5-11-2.2-5-5-5zm0 8C6.3 8 5 6.7 5 5s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
                    fill="#444"
                  ></path>
                </svg>
                <p>456 Anytown, Near Anywhere, ST 47523</p>
              </li>
            </ul>
          </div>
          {/* button Block unBlock */}

          <button className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#D6CCCC] rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute bottom-0 left-0 h-full -ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-auto h-full opacity-100 object-stretch"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="absolute top-0 right-0 w-12 h-full -mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="object-cover w-full h-full"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
            <span onClick={handleBlockTheUser} className="relative text-base font-semibold">{isBlocked ? "Unblock" : "Block"}</span>
          </button>

          <hr className="w-full group-hover:h-5 h-3 bg-[#58b0e0] group-hover:transition-all group-hover:duration-300 transition-all duration-300" />
        </div>

        <div className="relative px-4 lg:mt-0 sm:mt-14 mt-14 md:mt-9 pt-5 bg-gray-100 rounded-lg shadow-lg">
          {/* User Info Section */}
          <div className="mb-6">
            {/* User Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
              <div className="text-sm font-semibold text-gray-700 text-center">
                User Name
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Status
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Role
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Last Login
              </div>
            </div>

            {/* User List */}
            <div className="grid gap-4 mt-4">
              {user && (
                <div
                  key={user.id}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                >
                  <div className="text-sm font-medium text-white text-center">
                    {user.firstName ?? "User"} {user.lastName ?? "User"}
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                      <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isBlocked ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                >
                  {isBlocked ? "Blocked" : "Active"}
                </span>
                      </div>
                  <div className="text-sm font-medium text-white text-center">
                    {user.role || "N/A"}
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking History Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Booking History
              </h3>
              <button className="text-blue-500 text-sm hover:underline">
                View All
              </button>
            </div>

            {/* Booking Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
              <div className="text-sm font-semibold text-gray-700 text-center">
                No
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Laborer
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Date
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Status
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Cost
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center">
                Payment
              </div>
            </div>

            {/* Booking List */}
            <div className="grid gap-4 mt-4">
              {bookingDetils?.map((booking,index) => (
                <div
                  key={booking._id}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                >
                  <div className="text-sm font-medium text-white text-center">
                   {index + 1} 
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    {booking?.laborId?.firstName}
                  </div>
                <div className="text-sm font-medium text-white text-center">
                      {new Date(booking?.quote?.arrivalTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  <div className="text-sm font-medium text-white text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === "completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    ₹{booking?.quote?.estimatedCost}/-
                  </div>
                  <div
                  className={`px-2 py-1 text-xs font-medium rounded-full text-center ${
                    booking?.paymentStatus === "paid"
                      ? "bg-green-500 text-white"
                      : booking?.paymentStatus === "pending"
                      ? "bg-yellow-500 text-black"
                      : booking?.paymentStatus === "failed"
                      ? "bg-red-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {booking?.paymentStatus}
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewSide;
