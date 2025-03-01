import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { useLocation, useNavigate } from "react-router-dom";
import {  updateBookingReadStatusAsync } from '../../redux/slice/bookingSlice';
import type { AppDispatch } from "../../redux/store/store";

interface ChatNotification {
  id: string;
  message: string;
  unreadCount: number;
  userData: {
    name: string;
  };
  lastMessage: string;
  lastUpdated: string;
}
export interface User {
  ProfilePic: string;
  firstName: string;
  lastName: string;
}

export interface Labor {
  ProfilePic: string;
  firstName: string;
  lastName: string;
  phone : string
}

interface BookingDetails {
  bookingId: string;
  status: string;
  userId: User;
  laborId: Labor;
  cancellation?: {
    canceledBy: string;
    isUserRead?: boolean;
    isLaborRead?: boolean;
  };
   additionalChargeRequest?: {
    amount: number;
    reason?: string;
    status: 'pending' | 'approved' | 'declined';
  };
  reschedule: {
    isReschedule: boolean;
    requestSentBy: 'user' | 'labor';
    acceptedBy: 'user' | 'labor'
    rejectedBy: 'user' | 'labor'
    newDate?: string; // <-- Add this property
    newTime?: string;
    rejectionNewDate: string;
    rejectionNewTime: string;
    rejectionReason: string;
    reasonForReschedule?: string; 
  }
  quote?: {
    description: string;
  };
}

const NotificationModal = ({ 
  onClose, 
  chats, 
  bookingDetails, 
  setCurrentStage 
}: { 
  onClose: () => void; 
  chats: ChatNotification[]; // Specify Chat[] instead of []
  bookingDetails: BookingDetails[]; 
  setCurrentStage?: (stage: string) => void;
}) => {


    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const currentPages = location.pathname.split("/").pop();
    const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
    const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
    console.log('Ths is the curent page ::',currentPages)
  const handleNavigateChatPage = () => {
      console.log('Ths is t clickced........')
        if (currentPages === 'userChatPage') {
            onClose()
        }
      if (isUserAthenticated) {  
          navigate('/userChatPage')
      }
      if (isLaborAuthenticated && setCurrentStage) {
        setCurrentStage("Chats");
        setCurrentStage?.("Chats");// Only update stage if labor is authenticated
        onClose()
      }
  }

  console.log("Booking ID:", bookingDetails?.[0]?.bookingId);

  
  const handleNavigateToBookings = useCallback((bookingId: string) => {
     console.log('Ths is t clicked........')
    if (!bookingId) return;
     
    dispatch(updateBookingReadStatusAsync({ bookingId, isUserRead: true }));
    onClose();

    if (isUserAthenticated) {
      navigate("/userProfilePage");
    }

     if (isLaborAuthenticated) {
      console.log('Thsi is t bookingDetails')
      setCurrentStage?.("Bookings");
      // navigate("/labor/bookings");
    }
  }, [dispatch, isLaborAuthenticated, isUserAthenticated, navigate, onClose, setCurrentStage]);


    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return "Just now";

        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const theme = useSelector((state: RootState) => state.theme.mode);
  const unreadChats = chats.filter((chat) => chat.unreadCount > 0);
  

  const canceledBooking = bookingDetails?.find((booking) =>
    isUserAthenticated
      ? booking?.status === "canceled" &&
        booking?.cancellation?.canceledBy === "labor"
      : isLaborAuthenticated
      ? booking?.status === "canceled" &&
        booking?.cancellation?.canceledBy === "user"
      : false
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Unknown Time";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  console.log(
    "Thsi is the cancelBooking :;;;;;;;;;;",
    canceledBooking?.cancellation?.isUserRead
  );


  const hasRejectionDetails = (reschedule) => {
    const hasRejection = 
      reschedule?.rejectedBy === "labor" &&
      reschedule?.rejectionNewDate &&
      reschedule?.rejectionNewTime &&
      reschedule?.rejectionReason;

    const hasRequest = 
      reschedule?.requestSentBy === "labor" &&
      reschedule?.newDate &&
      reschedule?.newTime &&
      reschedule?.reasonForReschedule;

    return hasRejection || hasRequest;
  };


  return (
    <>
      {theme === "light" ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-2/5 lg:w-1/3 p-8 ">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Notifications
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Mark all as read */}
            {/* <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">All</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Mark all as read
                </button>
              </div> */}
      


            {/* Notifications List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">


                 
             {/* User Cases */}
      {!isLaborAuthenticated && (
        <>
        
        {bookingDetails?.length > 0 &&
          bookingDetails[0].additionalChargeRequest?.status === "pending" &&
          bookingDetails[0].additionalChargeRequest?.amount > 0 &&
          bookingDetails[0].additionalChargeRequest?.reason && (
            <div
              className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex flex-col gap-3 hover:bg-yellow-200"
              onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
            >
              <i className="fas fa-clock text-yellow-600 text-lg"></i>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Pending Additional Charge Request
                </p>
                <p className="text-xs text-gray-600">
                  You have received an additional charge request from the labor. Please check it.
                </p>
                {/* Additional Charge Details */}
                <div className="mt-2 bg-blue-100 border-l-4 border-blue-500 p-2 rounded-lg">
                  <p className="text-xs font-medium text-gray-800">Additional Charge Details</p>
                  <p className="text-xs text-gray-600">
                    <strong>Amount:</strong> ₹{bookingDetails[0].additionalChargeRequest.amount}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Reason:</strong> {bookingDetails[0].additionalChargeRequest.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
                


          {/* Case 1: User's pending reschedule request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "user" &&
            bookingDetails[0].reschedule?.acceptedBy === null &&
            bookingDetails[0].reschedule?.rejectedBy === null && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Reschedule Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule request is pending. Please wait for labor approval.
                  </p>
                </div>
              </div>
          )}

          {/* Case 2: User's pending rejection request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "user" &&
            bookingDetails[0].reschedule?.rejectedBy === "user" && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Rejection Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule rejection request is pending. Please wait for labor approval.
                  </p>
                </div>
              </div>
          )}

          {/* Case 3: Labor's rejection or new request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule &&
            hasRejectionDetails(bookingDetails[0].reschedule) && (
              <div
                className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {bookingDetails[0].reschedule.rejectedBy === "labor" 
                      ? `Reschedule Request Rejected by ${bookingDetails[0]?.laborId?.firstName || 'Labor'}`
                      : "New Reschedule Request from Labor"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {bookingDetails[0].reschedule.rejectedBy === "labor" ? (
                      <>
                        The reschedule request was rejected. <br />
                        <strong>New Date:</strong>{" "}
                        {formatDate(bookingDetails[0].reschedule.rejectionNewDate)} <br />
                        <strong>New Time:</strong>{" "}
                        {formatTime(bookingDetails[0].reschedule.rejectionNewTime)} <br />
                        <strong>Reason:</strong>{" "}
                        {bookingDetails[0].reschedule.rejectionReason}
                      </>
                    ) : (
                      <>
                        Labor has sent a new reschedule request. <br />
                        <strong>New Date:</strong>{" "}
                        {formatDate(bookingDetails[0].reschedule.newDate)} <br />
                        <strong>New Time:</strong>{" "}
                        {formatTime(bookingDetails[0].reschedule.newTime)} <br />
                        <strong>Reason:</strong>{" "}
                        {bookingDetails[0].reschedule.reasonForReschedule}
                      </>
                    )}
                  </p>
                </div>
              </div>
          )}
        </>
      )}
              

      {isLaborAuthenticated && (
        <>
          {/* Case 1: User's reschedule request pending labor approval */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "user" &&
            bookingDetails[0].reschedule?.acceptedBy === null &&
            bookingDetails[0].reschedule?.rejectedBy === "user" && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-calendar-alt text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Reschedule Request from {bookingDetails[0]?.userId?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-600">
                    The user has requested to reschedule the booking. Please review the request.
                  </p>
                </div>
              </div>
          )}

          {/* Case 2: Labor's sent request pending user approval */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "labor" &&
            bookingDetails[0].reschedule?.acceptedBy === null &&
            bookingDetails[0].reschedule?.rejectedBy === null && (
              <div
                className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-blue-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-blue-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Reschedule Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule request is pending user approval.
                  </p>
                </div>
              </div>
          )}
        </>
      )}


              {/* Booking Cancellation Notification */}
              {(isUserAthenticated &&
                canceledBooking &&
                !canceledBooking.cancellation?.isUserRead) ||
              (isLaborAuthenticated &&
                canceledBooking &&
                !canceledBooking.cancellation?.isUserRead) ? (
                <div
                  className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                  onClick={() =>
                    handleNavigateToBookings(bookingDetails?.[0]?.bookingId)
                  }
                >
                  <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      Booking Canceled
                    </p>
                    <p className="text-xs text-gray-600">
                      Your booking with the following description:{" "}
                      <strong>{canceledBooking.quote.description}</strong> was
                      canceled by
                      <strong>
                        {" "}
                        {canceledBooking?.cancellation?.canceledBy}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Unread Chat Messages */}
              {unreadChats.length > 0 &&
              (isUserAthenticated || isLaborAuthenticated)
                ? unreadChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-blue-200"
                      onClick={handleNavigateChatPage}
                    >
                      <i className="fas fa-comment text-blue-600 text-lg"></i>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          New message from{" "}
                          {chat.userData?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {chat.lastMessage} •{" "}
                          {formatTimestamp(chat.lastUpdated)}
                        </p>
                      </div>
                    </div>
                  ))
                : null}

              {/* No Messages */}
              {!(
                canceledBooking ||
                unreadChats.length > 0 ||
                bookingDetails?.[0]?.reschedule?.requestSentBy == "user"
              ) && (
                <p className="text-center text-gray-500 text-sm">
                  No new notifications
                </p>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#21A391] text-white px-5 py-2 rounded-lg hover:bg-[#229182] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1f2a30] rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-600 my-4"></div>

            {/* Mark all as read */}
            {/* <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-300">All</span>
                <button className="text-[#fff] hover:text-[#87c0d5] font-medium">
                  Mark all as read
                </button>
              </div> */}




              
             {/* User Cases */}
      {!isLaborAuthenticated && (
        <>
        
        {bookingDetails?.length > 0 &&
          bookingDetails[0]?.additionalChargeRequest?.status === "pending" &&
          bookingDetails[0]?.additionalChargeRequest?.amount > 0 &&
          bookingDetails[0]?.additionalChargeRequest?.reason && (
            <div
              className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex flex-col gap-3 hover:bg-yellow-200"
              onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
            >
              <i className="fas fa-clock text-yellow-600 text-lg"></i>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Pending Additional Charge Request
                </p>
                <p className="text-xs text-gray-600">
                  You have received an additional charge request from the labor. Please check it.
                </p>
                {/* Additional Charge Details */}
                <div className="mt-2 bg-blue-100 border-l-4 border-blue-500 p-2 rounded-lg">
                  <p className="text-xs font-medium text-gray-800">Additional Charge Details</p>
                  <p className="text-xs text-gray-600">
                    <strong>Amount:</strong> ₹{bookingDetails[0]?.additionalChargeRequest.amount}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Reason:</strong> {bookingDetails[0]?.additionalChargeRequest.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
      
         



          {/* Case 1: User's pending reschedule request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
            bookingDetails[0]?.reschedule?.acceptedBy === null &&
            bookingDetails[0]?.reschedule?.rejectedBy === null && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Reschedule Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule request is pending. Please wait for labor approval.
                  </p>
                </div>
              </div>
          )}

          {/* Case 2: User's pending rejection request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
            bookingDetails[0]?.reschedule?.rejectedBy === "user" && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Rejection Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule rejection request is pending. Please wait for labor approval.
                  </p>
                </div>
              </div>
          )}

          {/* Case 3: Labor's rejection or new request */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0]?.reschedule &&
            hasRejectionDetails(bookingDetails[0]?.reschedule) && (
              <div
                className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-exc  lamation-triangle text-red-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {bookingDetails[0].reschedule.rejectedBy === "labor" 
                      ? `Reschedule Request Rejected by ${bookingDetails[0]?.laborId?.firstName || 'Labor'}`
                      : "New Reschedule Request from Labor"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {bookingDetails[0].reschedule.rejectedBy === "labor" ? (
                      <>
                        The reschedule request was rejected. <br />
                        <strong>New Date:</strong>{" "}
                        {formatDate(bookingDetails[0].reschedule.rejectionNewDate)} <br />
                        <strong>New Time:</strong>{" "}
                        {formatTime(bookingDetails[0].reschedule.rejectionNewTime)} <br />
                        <strong>Reason:</strong>{" "}
                        {bookingDetails[0].reschedule.rejectionReason}
                      </>
                    ) : (
                      <>
                        Labor has sent a new reschedule request. <br />
                        <strong>New Date:</strong>{" "}
                        {formatDate(bookingDetails[0].reschedule.newDate)} <br />
                        <strong>New Time:</strong>{" "}
                        {formatTime(bookingDetails[0].reschedule.newTime)} <br />
                        <strong>Reason:</strong>{" "}
                        {bookingDetails[0].reschedule.reasonForReschedule}
                      </>
                    )}
                  </p>
                </div>
              </div>
          )}
        </>
      )}
              

      {isLaborAuthenticated && (
        <>
          {/* Case 1: User's reschedule request pending labor approval */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "user" &&
            bookingDetails[0].reschedule?.acceptedBy === null &&
            bookingDetails[0].reschedule?.rejectedBy === "user" && (
              <div
                className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-calendar-alt text-yellow-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Reschedule Request from {bookingDetails[0]?.userId?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-600">
                    The user has requested to reschedule the booking. Please review the request.
                  </p>
                </div>
              </div>
          )}

          {/* Case 2: Labor's sent request pending user approval */}
          {bookingDetails?.length > 0 &&
            bookingDetails[0].reschedule?.requestSentBy === "labor" &&
            bookingDetails[0].reschedule?.acceptedBy === null &&
            bookingDetails[0].reschedule?.rejectedBy === null && (
              <div
                className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-blue-200"
                onClick={() => handleNavigateToBookings(bookingDetails[0]?.bookingId)}
              >
                <i className="fas fa-clock text-blue-600 text-lg"></i>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending Reschedule Request
                  </p>
                  <p className="text-xs text-gray-600">
                    Your reschedule request is pending user approval.
                  </p>
                </div>
              </div>
          )}
        </>
      )}




            {/* Notifications List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* {bookingDetails?.length > 0 &&
                bookingDetails[0].reschedule &&
                bookingDetails[0].reschedule.isReschedule === false && // Request is still pending
                bookingDetails[0].reschedule.requestSentBy === "user" && // Request sent by the user
                bookingDetails[0].reschedule.acceptedBy === null && // Not yet accepted
                bookingDetails[0].reschedule.rejectedBy === null && ( // Not yet rejected
                  <div
                    className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-yellow-200"
                    onClick={() =>
                      handleNavigateToBookings(bookingDetails?.[0]?.bookingId)
                    }
                  >
                    <i className="fas fa-calendar-alt text-yellow-600 text-lg"></i>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Reschedule Request from{" "}
                        {bookingDetails[0]?.userId?.firstName || "User"}
                      </p>
                      <p className="text-xs text-gray-600">
                        The user has requested to reschedule the booking. Please
                        review the request.
                      </p>
                    </div>
                  </div>
                )} */}

               
               {/* {bookingDetails?.length > 0 &&
                bookingDetails[0].reschedule &&
                bookingDetails[0].reschedule.isReschedule === false && // Request is still pending
                bookingDetails[0].reschedule.rejectedBy === "user" && // Rejected by labor
                bookingDetails[0].reschedule.rejectionNewDate && // Has a rejection date
                bookingDetails[0].reschedule.rejectionNewTime && // Has a rejection time
                bookingDetails[0].reschedule.rejectionReason && // Has a rejection reason
                isLaborAuthenticated && (
                  <div
                    className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                    onClick={() =>
                      handleNavigateToBookings(bookingDetails?.[0]?.bookingId)
                    }
                  >
                    <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Reschedule Request Rejected by{" "}
                        {bookingDetails[0]?.userId?.firstName || "Labor"}
                      </p>
                      <p className="text-xs text-gray-600">
                        The reschedule request was rejected. <br />
                        <strong>New Date:</strong>{" "}
                        {formatDate(
                          bookingDetails[0].reschedule.rejectionNewDate
                        )}{" "}
                        <br />
                        <strong>New Time:</strong>{" "}
                        {formatTime(
                          bookingDetails[0].reschedule.rejectionNewTime
                        )}{" "}
                        <br />
                        <strong>Reason:</strong>{" "}
                        {bookingDetails[0].reschedule.rejectionReason}
                      </p>
                    </div>
                  </div>
                )} */}

              {/* Booking Cancellation Notification */}
              {(isUserAthenticated &&
                canceledBooking &&
                !canceledBooking.cancellation?.isUserRead) ||
              (isLaborAuthenticated &&
                canceledBooking &&
                !canceledBooking.cancellation?.isLaborRead) ? (
                <div
                  className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                  onClick={() =>
                    handleNavigateToBookings(bookingDetails?.[0]?.bookingId)
                  }
                >
                  <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      Booking Canceled
                    </p>
                    <p className="text-xs text-gray-600">
                      Your booking with the following description:{" "}
                      <strong>{canceledBooking.quote.description}</strong> was
                      canceled by
                      <strong>
                        {" "}
                        {canceledBooking?.cancellation?.canceledBy}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Unread Chat Messages */}
              {unreadChats.length > 0 &&
              (isUserAthenticated || isLaborAuthenticated)
                ? unreadChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-4 bg-[#2c3e50] border-l-4 border-[#3498db] rounded-lg cursor-pointer flex items-start gap-3 hover:bg-[#34495e]"
                      onClick={handleNavigateChatPage}
                    >
                      <i className="fas fa-comment text-[#3498db] text-lg"></i>
                      <div>
                        <p className="text-sm font-medium text-white">
                          New message from{" "}
                          {chat.userData?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {chat.lastMessage} •{" "}
                          {formatTimestamp(chat.lastUpdated)}
                        </p>
                      </div>
                    </div>
                  ))
                : null}

              {/* No Messages */}
              {!(
                  canceledBooking ||
                  unreadChats.length > 0 ||
                  bookingDetails?.[0]?.reschedule?.requestSentBy === "user" ||
                  hasRejectionDetails(bookingDetails?.[0]?.reschedule) ||
                  (bookingDetails[0]?.additionalChargeRequest?.amount > 0) // Fixed parentheses
                ) && (
                  <p className="text-center text-gray-500 text-sm">
                    No new notifications
                  </p>
                )}

            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#32eae0] text-black px-5 py-2 rounded-lg hover:bg-[#2bb5ae] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationModal;