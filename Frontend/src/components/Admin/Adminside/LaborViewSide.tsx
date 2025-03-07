import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Approve, blockLabor, fetchLaborAllBookings, rejection, UnblockLabor } from "../../../services/AdminAuthServices";
import { ArrowLeft } from 'lucide-react';
import './Labor.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
    setLoading
} from '../../../redux/slice/adminSlice'
import { IBooking } from "../../../@types/IBooking";


interface Labor {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isBlocked?: boolean;
  categories?: string[];
  status?: "pending" | "approved" | "rejected";
  certificates?: Certificate[];
}


interface Certificate {
  certificateName: string;
  certificateDocument: string;
}


const LaborViewSide = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const labor = location.state.labor || {};
  const laborId = labor?._id;
  const [isBlocked, setIsBlocked] = useState(labor.isBlocked);
  const [isApproved, setIsApproved] = useState(labor.isApproved);
  const [rejfectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [updatedLabor, setUpdatedLabor] = useState<Labor | null>(null);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);
  const [currentPage] = useState(1);
  const [limit] = useState(6);
  const [filter] = useState("");
  const loading = useSelector((state: RootState) => state.admin.loading);
  useEffect(() => {
    const fetchLaborBooings = async () => {
      try {
        const response = await fetchLaborAllBookings(
          laborId,
          currentPage,
          limit,
          ""
        ); // Removed incorrect filter syntax
        if (response.status === 200) {
          console.log(response);
          const { bookings } = response.data;

          setBookingDetils(bookings);
        }
      } catch (error) {
        console.error("Error fetching labor bookings:", error);
      }
    };

    fetchLaborBooings();
  }, [currentPage, limit, filter, laborId]);

 const categoryIcons: Record<string, JSX.Element> = {
    plumber: (
      <svg
        id="plumber-icon"
        viewBox="0 0 16 16"
        className="fill-stone-700 group-hover:fill-[#58b0e0]"
        height="15"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 1A1.5 1.5 0 0 0 5 2.5v11A1.5 1.5 0 0 0 6.5 15h3A1.5 1.5 0 0 0 11 13.5V2.5A1.5 1.5 0 0 0 9.5 1h-3zM7 2h2v11H7V2z"
          fill="#444"
        ></path>
      </svg>
    ),
    electrician: (
      <svg
        id="electrician-icon"
        viewBox="0 0 16 16"
        className="fill-stone-700 group-hover:fill-[#58b0e0]"
        height="15"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0L6 3H4v10h8V3h-2L8 0zM6 3h4l2 10H4L6 3z"
          fill="#444"
        ></path>
      </svg>
    ),
    // Add other categories here with their corresponding SVG icons
  };

  const category = labor && labor.categories[0];
  // console.log(certificate)

  const handleApprove = async () => {
    try {
      dispatch(setLoading(true));
      const response = await Approve({ email: labor.email });

      if (response.status === 200) {
        console.log("This is the labor resonse approval", response);
        const { isApproved } = response.data.labor;
        console.log("This is the labor isApproved", isApproved);
        setIsApproved(isApproved);
        dispatch(setLoading(false));
        toast.success(
          `labor Approved succesfully ${
            isApproved ? "Approved" : "rejected the Approval"
          }`
        );
      } else {
        dispatch(setLoading(false));
        toast.error("error occud in approval");
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
      toast.error(`Failed to approve the list...!`);
    }
  };

  const handleBlockTheUser = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      dispatch(setLoading(true));
      // Decide which API to call based on the current block status
      const response = isBlocked
        ? await UnblockLabor({ email: labor.email })
        : await blockLabor({ email: labor.email });

      if (response.status === 200) {
        // Toggle the state on success
        setIsBlocked(!isBlocked);
        dispatch(setLoading(false));
        // toast.success(
        //   `labor blocked  successfully ${isBlocked ? "unblocked" : "blocked"}!`
        // );
      } else {
        dispatch(setLoading(false));
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
      toast.error(`Failed to ${isBlocked ? "unblock" : "block"} user.`);
    }
  };

  const handleSubmitRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const resoponse = await rejection({
      reason: rejectionReason,
      email: labor.email,
    });
    if (resoponse.status === 200) {
      const { updatedLabor } = resoponse.data;
      console.log("Thsi rejectd updated data : ", updatedLabor);
      // console.log('Thsi resoponse : ', resoponse)
      setUpdatedLabor(updatedLabor);
      setRejectModal(false);
      dispatch(setLoading(false));

      // toast.success('you rejection Approval succesfully Done')
    } else {
      dispatch(setLoading(false));
      toast.error("Error in reason submission..!");
    }
  };

  const handleViewAll = (labor : Labor) => {
    navigate("/admin/viewAllDetails", { state: { labor } });
  };

  return (
    <div className="bg-[#D6CCCC] h-screen">
      {loading && <div className="loader"></div>}
      {rejfectModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          {/* Modal */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="max-w-xl w-full mx-auto bg-gray-900 rounded-xl overflow-hidden">
              <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full">
                  <svg
                    viewBox="0 0 48 48"
                    height="100"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="24" cy="24" r="22" fill="#FF4D4D" />
                    <line
                      x1="16"
                      y1="16"
                      x2="32"
                      y2="32"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="16"
                      y1="32"
                      x2="32"
                      y2="16"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h4 className="text-xl text-gray-100 font-semibold mb-5">
                  Rejection Reason Submission
                </h4>
                <p className="text-gray-300 font-medium mb-4">
                  Please provide the reason for rejecting this request:
                </p>

                <textarea
                  className="w-full h-24 p-3 rounded-md bg-gray-800 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter the rejection reason here..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="pt-5 pb-6 px-6 text-right bg-gray-800 -mb-2">
                <button
                  onClick={() => setRejectModal(false)} // Close the modal
                  className="inline-block w-full sm:w-auto py-3 px-5 mb-2 mr-4 text-center font-semibold leading-6 text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRejection} // Function to handle submission
                  className="inline-block w-full sm:w-auto py-3 px-5 mb-2 text-center font-semibold leading-6 text-blue-50 bg-green-500 hover:bg-green-600 rounded-lg transition duration-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-[#D6CCCC] profileCard flex lg:p-16 sm:p-28 p-28 md:p-12 lg:flex-row items-center sm:items-center md:items-center flex-col sm:flex-col lg:justify-evenly ">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 p-2 bg-gray-200 tet-white rounded-full hover:bg-gray-500 transition-colors z-[200]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="profile-card   w-[300px] rounded-md shadow-xl relative  snap-start shrink-0 bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
          <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1">
            <div className="img_container w-full flex items-center justify-center relative z-40 after:absolute after:h-[6px] after:w-full after:bg-[#58b0e0] after:top-4 after:group-hover:size-[1%] after:delay-300 after:group-hover:delay-0 after:group-hover:transition-all after:group-hover:duration-300 after:transition-all after:duration-300 before:absolute before:h-[6px] before:w-full before:bg-[#58b0e0] before:bottom-4 before:group-hover:size-[1%] before:delay-300 before:group-hover:delay-0 before:group-hover:transition-all before:group-hover:duration-300 before:transition-all before:duration-300">
              <svg
                className="size-36 z-40  border-4 border-white rounded-full group-hover:border-8 group-hover:transition-all group-hover:duration-300 transition-all duration-300"
                id="avatar"
                viewBox="0 0 61.8 61.8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30.9" cy="30.9" r="30.9" className="fill-current" />{" "}
                {/* Circle for the border */}
                <foreignObject x="0" y="0" width="100%" height="100%">
                  <img
                    src={labor.profilePicture}
                    alt="Logo"
                    className="object-cover flex items-center w-full h-full rounded-full"
                  />
                </foreignObject>
              </svg>
              <div className="absolute bg-[#58b0e0] z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-300 transition-all duration-300 delay-700 group-hover:delay-0"></div>
            </div>
          </div>
          <div className="headings *:text-center *:leading-4">
            {labor && (
              <p className="text-xl font-serif font-semibold text-[#434955]">
                {labor.firstName ?? "User"} {labor.lastName ?? "User"}
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
                <p>{labor && labor.phone}</p>
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
                <p>{labor && labor.email}</p>
              </li>
              <li>
                <svg
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  id="address-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    data-name="map-marker"
                    d="M12 2C8.1 2 5 5.1 5 8.5c0 4.3 7 11.5 7 11.5s7-7.2 7-11.5C19 5.1 15.9 2 12 2zM12 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
                  ></path>
                </svg>
                <p>{labor && labor.address.city}</p>
              </li>
              <li>
                {categoryIcons[category] || (
                  <svg
                    id="default-icon"
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
                )}
                <p>{category}</p>
              </li>
              <li>
                <svg
                  id="language-icon"
                  viewBox="0 0 16 16"
                  className="fill-stone-700 group-hover:fill-[#58b0e0]"
                  height="15"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM8 14C4.69 14 2 11.31 2 8s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                    fill="#444"
                  ></path>
                </svg>
                <p>{labor && labor.language}</p>
              </li>
            </ul>
          </div>
          {/* button Block unBlock */}
          <div className="flex space-x-7">
            <button
              className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
              onClick={handleBlockTheUser}
            >
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
              <button
                className={`relative text-base font-semibold  ${
                  labor.status === "rejected" ||
                  updatedLabor?.status === "rejected"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } `}
                disabled={
                  labor.status === "rejected" ||
                  updatedLabor?.status === "rejected"
                }
                onClick={handleBlockTheUser}
              >
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </button>

            {/* ViewAll */}

            <button
              className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
              onClick={() => handleViewAll(labor)}
            >
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
              <button
                className={`relative text-base font-semibold  ${
                  labor.status === "rejected" ||
                  updatedLabor?.status === "rejected"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } `}
                onClick={() => handleViewAll(labor)}
              >
                View All
              </button>
            </button>
          </div>

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
              {labor && (
                <div
                  key={labor.id}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                >
                  <div className="text-sm font-medium text-white text-center">
                    {labor.firstName ?? "User"} {labor.lastName ?? "User"}
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isBlocked ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                    >
                      {isBlocked ? "Inactive" : "Active"}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    {labor.role || "N/A"}
                  </div>
                  <div className="text-sm font-medium text-white text-center">
                    {labor.lastLogin
                      ? new Date(labor.lastLogin).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking History Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold px-8 text-gray-700">
                {isApproved ? "Booking History" : "Approving for labor request"}
              </h3>
              {labor.status === "rejected" ||
              updatedLabor?.status === "rejected" ? (
                // Show "Labor Approval Rejected" Button
                <button
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 duration-300"
                  disabled
                >
                  Labor Approval Rejected
                </button>
              ) : (
                <>
                  {isApproved ? // Show "View All" Button
                  // <button
                  //   className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border border-blue-500 border-b-4 font-semibold overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b-2 active:opacity-90 outline-none duration-300 group"
                  //   // onClick={handleViewAll}
                  // >
                  //   <span className="bg-blue-300 shadow-blue-500 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(72,145,255,0.5)]"></span>
                  //   View All
                  // </button>
                  null : (
                    // Show "Approve" and "Reject" Buttons
                    <div className="flex space-x-4">
                      {/* Approve Button */}
                      <button
                        className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white border border-green-500 border-b-4 font-semibold overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b-2 active:opacity-90 outline-none duration-300 group"
                        onClick={handleApprove}
                      >
                        <span className="bg-green-300 shadow-green-500 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(72,191,145,0.5)]"></span>
                        Approve
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => setRejectModal(true)}
                        className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white border border-red-500 border-b-4 font-semibold overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b-2 active:opacity-90 outline-none duration-300 group"
                      >
                        <span className="bg-red-300 shadow-red-500 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(255,72,72,0.5)]"></span>
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Booking Headings */}
            {isApproved && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center bg-gray-200 p-3 rounded-lg shadow">
                <div className="text-sm font-semibold text-gray-700 text-center">
                  Booking ID
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
            )}

            {/* Booking List */}
            {isApproved ? (
              <div className="grid gap-4 mt-4">
                {bookingDetils?.map((booking, index) => (
                  <div
                    key={booking?._id}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 bg-[#ABA0A0] rounded-lg shadow-md p-3 items-center"
                  >
                    <div className="text-sm font-medium text-white text-center">
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium text-white text-center">
                      {booking?.addressDetails?.name}
                    </div>
                    <div className="text-sm font-medium text-white text-center">
                      {new Date(booking?.quote?.arrivalTime).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
            ) : (
              <div className="certificates-container flex flex-col items-center space-y-6">
                <div
                  className={`grid ${
                    labor.certificates.length === 1
                      ? "grid-cols-1 w-[273px]"
                      : "grid-cols-2 w-[673px]"
                  } gap-6`}
                >
                  {labor.certificates.map((certificate: Certificate, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg"
                    >
                      {/* Certificate Image */}
                      <img
                        src={certificate.certificateDocument}
                        alt={certificate.certificateName}
                        className="w-full h-[300px] object-cover rounded-md mb-4"
                      />

                      {/* Certificate Description */}
                      <div className="text-center text-gray-700 font-medium">
                        {certificate.certificateName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Pagination controls */}
          {/* <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 transition hover:bg-gray-300 disabled:hover:bg-gray-200"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm sm:text-base font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 transition hover:bg-gray-300 disabled:hover:bg-gray-200"
            >
              Next
            </button>
          </div> */}
        </div>
        {!isApproved && (
          <div className="certifiacts p-12 space-y-11 sm:p-12 md:p-12 lg:p-0">
            <article className="card">
              {/* Government Aided Proof Text */}
              <div className="card-header text-center font-bold text-lg text-gray-700">
                Government Aided Proof
              </div>

              <div className="card-img">
                <div className="card-imgs pv delete">
                  <img
                    src={labor.governmentProof.idDocument}
                    className="object-cover w-[263px]"
                    alt="Government ID"
                  />
                </div>
              </div>

              <div className="project-info">
                <div className="flexs">
                  <div className="project-title font-serif">
                    {labor.governmentProof.idType}
                  </div>

                  {/* Download Icon */}
                  <a
                    href={labor.governmentProof.idDocument}
                    download
                    className="text-blue-500 hover:text-blue-700"
                    title="Download ID"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mt-9"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};


export default LaborViewSide
