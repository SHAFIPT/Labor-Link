import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {  updateBookingReadStatusAsync } from '../../redux/slice/bookingSlice';
import type { AppDispatch } from "../../redux/store/store";
const NotificationModal = ({ onClose , chats ,bookingDetails}) => {


    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const currentPages = location.pathname.split("/").pop();
    const isUserAthenticated = useSelector((state : RootState) => state.user.isUserAthenticated)

    const handleNavigateChatPage = () => {
        if (currentPages === 'userChatPage') {
            onClose()
        }
        navigate('/userChatPage')
  }

  console.log("Booking ID:", bookingDetails?.[0]?.bookingId);

  
  const handleNavigateToBookings = (bookingId: string) => {
    console.log("Ttttttttttttttt: bookingId", bookingId)
    if (!bookingId) return;
      
    dispatch(updateBookingReadStatusAsync({ bookingId, isUserRead: true }));
    onClose();
    navigate("/userProfilePage");

  }

    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return "Just now";

        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const theme = useSelector((state: RootState) => state.theme.mode);
  const unreadChats = chats.filter((chat) => chat.unreadCount > 0);
  

   const canceledBooking = bookingDetails?.find(
    (booking) => booking.status === "canceled" && booking.cancellation?.canceledBy === "labor"
  );

  console.log("Thsi is the cancelBooking :;;;;;;;;;;",canceledBooking?.cancellation?.isUserRead)

    return (
      <>
        {theme === "light" ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-2/5 lg:w-1/3 p-8">
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
                {/* Booking Cancellation Notification */}
                {canceledBooking && isUserAthenticated && !canceledBooking.cancellation?.isUserRead && (
                  <div
                    className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                    onClick={()=> handleNavigateToBookings(bookingDetails?.[0]?.bookingId)}
                  >
                    <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
                    <div>
                      <p className="text-sm font-semibold text-red-600">
                        Booking Canceled
                      </p>
                   <p className="text-xs text-gray-600">
                      Your booking with the following description:{" "}
                      <strong>{canceledBooking.quote.description}</strong> was canceled by
                          <strong>  {canceledBooking?.cancellation?.canceledBy}</strong>.
                    </p>
                    </div>
                  </div>
                )}

                {/* Unread Chat Messages */}
                {unreadChats.length > 0 && isUserAthenticated
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
                { canceledBooking?.cancellation?.isUserRead && (canceledBooking || unreadChats.length > 0) &&  (
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

              {/* Notifications List */}
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  
              {/* Booking Cancellation Notification */}
                {canceledBooking && isUserAthenticated && !bookingDetails[0].cancellation?.isUserRead && (
                  <div
                    className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg cursor-pointer flex items-start gap-3 hover:bg-red-200"
                    onClick={()=> handleNavigateToBookings(bookingDetails?.[0]?.bookingId)}
                  >
                    <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
                    <div>
                      <p className="text-sm font-semibold text-red-600">
                        Booking Canceled
                      </p>
                      <p className="text-xs text-gray-600">
                        Your booking with the following description:{" "}
                          <strong>{canceledBooking.quote.description}</strong> was canceled by
                          <strong>  {canceledBooking?.cancellation?.canceledBy}</strong>.
                      </p>
                    </div>
                  </div>
                )}


                {/* Unread Chat Messages */}
                {unreadChats.length > 0 && isUserAthenticated
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
                {!(canceledBooking || unreadChats.length > 0) && (
                  <p className="text-center text-gray-500 text-sm">No new notifications</p>
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