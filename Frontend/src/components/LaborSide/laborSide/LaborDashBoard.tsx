import LaborDashBoardNav from "./LaborDashBoardNav"

import React, { useEffect, useState } from 'react';
import { HomeIcon, MessageSquare, Receipt, Briefcase, User, LogOut, DollarSign } from 'lucide-react';
import { FaCalendarCheck } from "react-icons/fa"; 
import { Phone, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { auth, db } from "../../../utils/firbase";
import {  collection, getDocs, query, where, getDoc, doc, getCountFromServer, onSnapshot, Timestamp, serverTimestamp, updateDoc } from 'firebase/firestore';
import { resetLaborer, setIsLaborAuthenticated, setLaborer, setLoading } from "../../../redux/slice/laborSlice";
import '../../Auth/LoadingBody.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { fetchLaborBookings, laborFetch } from "../../../services/LaborServices";
import { resetUser, setAccessToken, setisUserAthenticated, setUser } from "../../../redux/slice/userSlice";
import { setBookingDetails } from "../../../redux/slice/bookingSlice";
import { ClockIcon } from "@heroicons/react/24/solid";
import ResheduleRequstModal from "./resheduleRequstModal";
import RescheduleRequestModal from "./resheduleRequstModal";

interface ChatDocument {
  laborId: string;
  userId: string;
  lastMessage: string;
  lastUpdated: Timestamp;  // Change to Timestamp, not string
  quoteSent: boolean;
  messagesCount: number;
  lastReadTimestamp: Timestamp;
  lastMessageSender : string
}

interface Message {
  message: string;
  timestamp: Timestamp;
  sender: 'user' | 'labor';
}

interface UserData {
  // Add user fields based on your Users collection structure
  name?: string;
  email?: string;
  profilePicture? : string
  // ... other user fields
}


interface Chat extends ChatDocument {
  id: string;
  userData?: UserData | null;
  unreadCount: number;
}


interface NavItem {
  name: string;
  icon: any; // Or use the correct Lucide icon type
  stage: string;
}


const LaborDashBoard = () => {
  //  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const theme = useSelector((state: RootState) => state.theme.mode);
  const email = useSelector((state: RootState) => state.labor.laborer.email);
  const loading = useSelector((state: RootState) => state.labor.loading);
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
  const [currentStage, setCurrentStage] = useState("Dashboard");
  const [resheduleModal, setResheduleModal] = useState(null);
  const [unreadChats, setUnreadChats] = useState({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Gthis si the chats :::::", chats);

  console.log("thsis eth labo data :A", email);

  const bookingDetails = useSelector(
    (state: RootState) => state.booking.bookingDetails
  );

  console.log("Thiis is the BoookingDETAilssssssssssssss :", bookingDetails);

  const totalUnreadCount = chats.reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0
  );

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: HomeIcon, stage: "Dashboard" },
    { name: "Bookings", icon: FaCalendarCheck, stage: "Bookings" },
    { name: "Chats", icon: MessageSquare, stage: "Chats" },
    { name: "Total Works ", icon: Briefcase, stage: "Works" },
    { name: "Billing History", icon: Receipt, stage: "Billing" },
    { name: "View Profile", icon: User, stage: "Profile" },
  ];

  const stats = [
    { title: "Total Work Taken", value: "24", icon: Briefcase },
    { title: "Work Completed", value: "18", icon: Receipt },
    { title: "Total Earnings", value: "$2,450", icon: DollarSign },
    { title: "Pending Tasks", value: "6", icon: MessageSquare },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await laborFetch();
        // console.log("This is the Data LLLLLLLLLLLLLLLLLLLLLLLLLL", data);

        const { fetchUserResponse } = data;

        //  console.log("This is the laborData LLLLLLLLLLLLLLLLlaborData", fetchUserResponse);

        dispatch(setLaborer(fetchUserResponse));
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data?.message || "Your account has been blocked.";
          toast.error(errorMessage); // Show dynamic error message

          localStorage.removeItem("LaborAccessToken");

          // Reset User State
          dispatch(setUser({}));
          dispatch(resetUser());
          dispatch(setisUserAthenticated(false));
          dispatch(setAccessToken(""));

          // Reset Labor State
          dispatch(setLaborer({}));
          dispatch(resetLaborer());
          dispatch(setIsLaborAuthenticated(false));

          navigate("/"); // Redirect to login page
        }
      }
    };

    fetchUser();
  }, [navigate, dispatch]);

  useEffect(() => {
    // Get the saved stage from localStorage or default to "Dashboard"
    const savedStage = localStorage.getItem("currentStage") || "Dashboard";
    setCurrentStage(savedStage);
  }, []);

  useEffect(() => {
    // Save the current stage to localStorage whenever it changes
    localStorage.setItem("currentStage", currentStage);
  }, [currentStage]);

  const fetchChats = (userUid) => {
    if (!userUid) {
      throw new Error("Missing user credentials");
    }

    const auth = getAuth();
    const currentLabor = auth.currentUser;

    if (!currentLabor || !currentLabor.uid) {
      throw new Error("User is not authenticated");
    }

    const laborUid = currentLabor.uid;

    const chatCollection = collection(db, "Chats");
    const chatQuery = query(chatCollection, where("laborId", "==", laborUid));

    const unsubscribe = onSnapshot(chatQuery, async (chatSnapshot) => {
      const chatData = await Promise.all(
        chatSnapshot.docs.map(async (doc) => {
          const chatData = doc.data() as ChatDocument;

          let unreadCount = 0;
          if (chatData.lastMessageSender === "user") {
            const messagesCollection = collection(
              db,
              "Chats",
              doc.id,
              "messages"
            );
            const unreadQuery = query(
              messagesCollection,
              where(
                "timestamp",
                ">",
                chatData.lastReadTimestamp || new Timestamp(0, 0)
              )
            );

            const unreadSnapshot = await getCountFromServer(unreadQuery);
            unreadCount = unreadSnapshot.data().count;
          }

          return {
            id: doc.id,
            ...chatData,
            unreadCount,
          };
        })
      );

      const userPromises = chatData.map(async (chat) => {
        try {
          const userDocRef = doc(db, "Users", chat.userId);
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.exists() ? userSnapshot.data() : null;

          return {
            ...chat,
            userData,
          };
        } catch (error) {
          console.error(`Error fetching user data for chat ${chat.id}:`, error);
          return { ...chat, userData: null };
        }
      });

      const chatsWithUserData = await Promise.all(userPromises);
      setChats(chatsWithUserData);
    });

    return unsubscribe;
  };
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const chatListenerUnsubscribe = fetchChats(user.uid); // Start real-time listener
        return () => chatListenerUnsubscribe && chatListenerUnsubscribe(); // Cleanup listener
      } else {
        setChats([]); // Clear chats if no user is authenticated
        toast.error("Please sign in to view chats");
      }
    });

    return () => unsubscribe(); // Cleanup auth listener on unmount
  }, []);

  // Add a function to update the last read timestamp
  const markChatAsRead = async (chatId) => {
    const chatRef = doc(db, "Chats", chatId);

    // ✅ Set lastReadTimestamp before querying messages
    await updateDoc(chatRef, {
      lastReadTimestamp: serverTimestamp(),
    });

    // ✅ Optionally, update local state to reflect immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  // Modify the navigation handler to mark messages as read
  const handleNavigateChatpage = async (chatId) => {
    await markChatAsRead(chatId);
    navigate(`/chatingPage/${chatId}`);
  };

  console.log("this is the chat coutn :;;;;;;;;;;;;", unreadChats);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const responseInBacked = await fetchLaborBookings(currentPage, limit);

        if (responseInBacked.status == 200) {
          const { bookings, totalPages } =
            responseInBacked.data;
          setTotalPages(totalPages);
          dispatch(setBookingDetails(bookings));
          // toast.success("Booking fetched succesfully")
        }
      } catch (error) {
        console.error(error);
        toast.error("Error to fetch booking....!");
      }
    };
     if (currentStage === "Bookings") {
        fetchBookings();
      }
  }, [currentStage,currentPage, limit, dispatch]);

  // const sortedBookings = [...bookingDetails].sort(
  //   (a, b) =>
  //     new Date(b.quote.arrivalTime).getTime() -
  //     new Date(a.quote.arrivalTime).getTime()
  // );

  const handelViewDetails = (booking) => {
    navigate('/labor/viewBookingDetials' ,{state : {booking}})
  }

 

  return (
    <div>
      <RescheduleRequestModal
        isOpen={resheduleModal !== null}
        onClose={() => setResheduleModal(null)}
        bookingDetails={resheduleModal ? [resheduleModal] : []}
      />
      {loading && <div className="loader"></div>}
      <LaborDashBoardNav setCurrentStage={setCurrentStage} />
      <div className="flex  ">
        {/* Desktop Sidebar */}
        {theme == "light" ? (
          <>
            <div className="hidden lg:block lg:ml-9 w-64 lg:mt-10 bg-white h-[460px] shadow-lg">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Labor Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      onClick={() => setCurrentStage(item.stage)}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors relative
                          ${
                            currentStage === item.stage
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-3 ${
                          currentStage === item.stage
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      />
                      <span>{item.name}</span>

                      {/* Notification Badge for Chats */}
                      {item.name === "Chats" && totalUnreadCount > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className="bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                            {totalUnreadCount}
                          </span>
                        </div>
                      )}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            {currentStage === "Dashboard" && (
              <>
                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                  <div className="p-6">
                    <div className="flex justify-center mb-8">
                      <h1 className="text-3xl md:text-[35px] font-bold font-[Rockwell]">
                        Welcome to Labor Dashboard
                      </h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat) => (
                        <div
                          key={stat.title}
                          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <stat.icon className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-bold">
                              {stat.value}
                            </span>
                          </div>
                          <h3 className="text-gray-600 font-medium">
                            {stat.title}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Sidebar and other content */}
            {currentStage === "Chats" ? (
              <div className="p-4 w-full max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                  Chats
                </h1>

                <div className="bodyPart space-y-2">
                  {chats.length > 0 ? (
                    chats
                      .slice()
                      .sort(
                        (a, b) =>
                          b.lastUpdated.toMillis() - a.lastUpdated.toMillis()
                      )
                      .map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => {
                            handleNavigateChatpage(chat.id);
                            markChatAsRead(chat.id);
                          }}
                          className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                        >
                          {/* First Row: User Image, Name, Time, Status */}
                          <div className="flex justify-between items-center">
                            {/* Left Section: User Image + Name */}
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  chat.userData?.profilePicture ||
                                  "default-profile-picture.jpg"
                                }
                                alt="User Profile"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />

                              <span className="font-semibold text-gray-800">
                                {chat.userData?.name || "Unknown User"}
                              </span>
                            </div>
                            <div className="mt-1 text-gray-700 text-sm truncate">
                              {chat.lastMessage || "No message"}
                            </div>

                            {/* Right Section: Time + Read Status */}
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span>
                                {chat.lastUpdated &&
                                  format(chat.lastUpdated.toDate(), "h:mm a")}
                              </span>
                              {chat.lastMessageSender === "user" &&
                              chat.unreadCount > 0 ? (
                                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                                  {chat.unreadCount}
                                </span>
                              ) : (
                                <span className="text-green-500 font-medium">
                                  Read
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Second Row: Last Message */}
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-lg">
                        No chats available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {currentStage === "Bookings" && (
              <div className="bookingDetails p-4 w-full max-w-5xl mx-auto ">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                  Current Bookings
                </h1>

                <div className="bodyPart space-y-6">
                  {bookingDetails && bookingDetails.length > 0 ? (
                    bookingDetails.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-col md:flex-row border border-gray-200 rounded-lg p-6 shadow-xl hover:shadow-md transition-shadow bg-white "
                      >
                        {/* Left Section: User Details */}
                        <div className="flex  flex-col items-center md:w-1/3 bor der-r   border-gray-200 pr-6">
                          <img
                            src={
                              booking?.userId?.ProfilePic ||
                              "https://via.placeholder.com/80"
                            }
                            alt="User"
                            className="w-[165px] h-[165px] rounded-full object-cover"
                          />
                          <div className="ml-4 space-y-2">
                            <p className="font-semibold text-lg text-gray-800">
                              {booking?.userId?.firstName}{" "}
                              {booking?.userId?.lastName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone size={16} className="text-gray-500" />
                              {booking?.addressDetails?.phone}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin size={16} className="text-gray-500" />{" "}
                              {booking?.addressDetails?.place}
                            </p>
                          </div>
                        </div>

                        {/* Right Section: Job Details */}
                        <div className="md:w-2/3 mt-6 md:mt-0 md:pl-6 space-y-3">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-700">
                              Job Description
                            </p>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                              {booking.quote.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-700">
                                Estimated Cost
                              </p>
                              <p className="text-lg font-semibold text-green-600">
                                ${booking.quote.estimatedCost}
                              </p>
                            </div>

                            <div className="space-y-1 relative">
                              <p className="font-medium text-gray-700">
                                Scheduled Time
                              </p>
                              <p className="text-gray-800">
                                {new Date(
                                  booking.quote.arrivalTime
                                ).toLocaleString()}
                              </p>


                              {bookingDetails?.length > 0 &&
                                bookingDetails[0].reschedule &&
                                bookingDetails[0].reschedule.isReschedule === false && // Request is still pending
                                bookingDetails[0].reschedule.rejectedBy === "user" && // Rejected by labor
                                bookingDetails[0].reschedule.rejectionNewDate && // Has a rejection date
                                bookingDetails[0].reschedule.rejectionNewTime && // Has a rejection time
                                bookingDetails[0].reschedule.rejectionReason && // Has a rejection reason
                                isLaborAuthenticated && (
                                  <button
                                    className={`relative flex items-center justify-center text-white 
                              bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 
                              font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                              text-xs sm:text-sm md:text-base lg:text-sm
                              ${
                                booking ? "animate-bounce shadow-blue-500" : ""
                              }`}
                                    onClick={() => setResheduleModal(booking)}
                                  >
                                    <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-white" />
                                    <span className="hidden sm:inline">
                                      Reschedule Request
                                    </span>
                                    <span className="sm:hidden">
                                      Reschedule Request
                                    </span>
                                  </button>
                                )}


                              {/* Reschedule Icon/Button */}

                              {bookingDetails?.length > 0 &&
                                bookingDetails[0].reschedule &&
                                bookingDetails[0].reschedule.isReschedule ===
                                  false && // Request is still pending
                                bookingDetails[0].reschedule.requestSentBy ===
                                  "user" && // Request sent by the user
                                bookingDetails[0].reschedule.acceptedBy ===
                                  null && // Not yet accepted
                                bookingDetails[0].reschedule.rejectedBy ===
                                  null && ( // Not yet rejected
                                  <button
                                    className={`relative flex items-center justify-center text-white 
                              bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 
                              font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                              text-xs sm:text-sm md:text-base lg:text-sm
                              ${
                                booking ? "animate-bounce shadow-blue-500" : ""
                              }`}
                                    onClick={() => setResheduleModal(booking)}
                                  >
                                    <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-white" />
                                    <span className="hidden sm:inline">
                                      Reschedule Request
                                    </span>
                                    <span className="sm:hidden">
                                      Reschedule Request
                                    </span>
                                  </button>
                                )}
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium text-gray-700">
                                Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === "canceled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium text-gray-700">
                                Payment Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                                ${
                                  booking.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4 pt-4 border-t">
                            <button
                              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                              onClick={() => handelViewDetails(booking)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-lg">
                        No bookings available
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-5 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors hover:bg-[#2a8f97]"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded-md font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages}
                    className="px-5 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors hover:bg-[#2a8f97]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="hidden bg-gray-800 lg:ml-9 lg:mt-8 lg:block w-64 h-[460px] border border-gray-700 rounded-md shadow-lg">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Labor Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      onClick={() => setCurrentStage(item.stage)}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors relative
                        ${
                          currentStage === item.stage
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-[#a4d2eb] hover:bg-blue-50 hover:text-blue-600"
                        }
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-3 ${
                          currentStage === item.stage
                            ? "text-white"
                            : "text-[#a4d2eb]"
                        }`}
                      />
                      <span>{item.name}</span>

                      {/* Notification Badge for Chats */}
                      {item.name === "Chats" && totalUnreadCount > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className="bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                            {totalUnreadCount}
                          </span>
                        </div>
                      )}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {currentStage === "Dashboard" && (
              <div className="flex-1 overflow-auto">
                <div className="p-6">
                  <div className="flex justify-center mb-8">
                    <h1 className="text-3xl md:text-[35px] font-bold font-[Rockwell]">
                      Welcome to Labor Dashboard
                    </h1>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                      <div
                        key={stat.title}
                        className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon className="w-8 h-8 " />
                          <span className="text-2xl font-bold">
                            {stat.value}
                          </span>
                        </div>
                        <h3 className=" font-medium">{stat.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStage === "Chats" ? (
              <div className="p-4 w-full max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 border-b pb-3">Chats</h1>

                <div className="bodyPart space-y-2">
                  {chats.length > 0 ? (
                    chats
                      .slice()
                      .sort(
                        (a, b) =>
                          b.lastUpdated.toMillis() - a.lastUpdated.toMillis()
                      )
                      .map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => {
                            handleNavigateChatpage(chat.id);
                            markChatAsRead(chat.id);
                          }}
                          className="border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-800 cursor-pointer"
                        >
                          {/* First Row: User Image, Name, Time, Status */}
                          <div className="flex justify-between items-center">
                            {/* Left Section: User Image + Name */}
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  chat.userData?.profilePicture ||
                                  "default-profile-picture.jpg"
                                }
                                alt="User Profile"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />

                              <span className="font-semibold ">
                                {chat.userData?.name || "Unknown User"}
                              </span>
                            </div>
                            <div className="mt-1  text-sm truncate">
                              {chat.lastMessage || "No message"}
                            </div>

                            {/* Right Section: Time + Read Status */}
                            <div className="flex items-center space-x-3 text-sm ">
                              <span>
                                {chat.lastUpdated &&
                                  format(chat.lastUpdated.toDate(), "h:mm a")}
                              </span>
                              {chat.lastMessageSender === "user" &&
                              chat.unreadCount > 0 ? (
                                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                                  {chat.unreadCount}
                                </span>
                              ) : (
                                <span className="text-green-500 font-medium">
                                  Read
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Second Row: Last Message */}
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-lg">
                        No chats available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {currentStage === "Bookings" && (
              <div className="bookingDetails p-4 w-full max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6  border-b pb-3">
                  Current Bookings
                </h1>

                <div className="bodyPart space-y-6">
                  {bookingDetails && bookingDetails.length > 0 ? (
                    bookingDetails.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-col md:flex-row border border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-800"
                      >
                        {/* Left Section: User Details */}
                        <div className="flex flex-col items-center md:w-1/3 border-r   border-gray-700 pr-6">
                          <img
                            src={
                              booking?.userId?.ProfilePic ||
                              "https://via.placeholder.com/80"
                            }
                            alt="User"
                            className="w-[165px] h-[165px] rounded-full object-cover"
                          />
                          <div className="ml-4 space-y-2">
                            <p className="font-semibold text-lg ">
                              {booking?.userId?.firstName}{" "}
                              {booking?.userId?.lastName}
                            </p>
                            <p className="text-sm  flex items-center">
                              <Phone size={16} className="" />
                              {booking?.addressDetails?.phone}
                            </p>
                            <p className="text-sm  flex items-center">
                              <MapPin size={16} className="" />{" "}
                              {booking?.addressDetails?.place}
                            </p>
                          </div>
                        </div>

                        {/* Right Section: Job Details */}
                        <div className="md:w-2/3 mt-6 md:mt-0 md:pl-6 space-y-3">
                          <div className="space-y-1">
                            <p className="font-medium ">Job Description</p>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                              {booking?.quote?.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                              <p className="font-medium ">Estimated Cost</p>
                              <p className="text-lg font-semibold text-green-600">
                                ${booking?.quote?.estimatedCost}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium ">Scheduled Time</p>
                              <p className="">
                                {new Date(
                                  booking?.quote?.arrivalTime
                                ).toLocaleString()}
                              </p>

                              {bookingDetails?.length > 0 &&
                                bookingDetails[0]?.reschedule &&
                                bookingDetails[0]?.reschedule?.isReschedule === false && // Request is still pending
                                bookingDetails[0]?.reschedule?.rejectedBy === "user" && // Rejected by labor
                                bookingDetails[0]?.reschedule?.rejectionNewDate && // Has a rejection date
                                bookingDetails[0]?.reschedule?.rejectionNewTime && // Has a rejection time
                                bookingDetails[0]?.reschedule?.rejectionReason && // Has a rejection reason
                                isLaborAuthenticated && (
                                  <button
                                    className={`relative flex items-center justify-center text-white 
                              bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 
                              font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                              text-xs sm:text-sm md:text-base lg:text-sm
                              ${
                                booking ? "animate-bounce shadow-blue-500" : ""
                              }`}
                                    onClick={() => setResheduleModal(booking)}
                                  >
                                    <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-white" />
                                    <span className="hidden sm:inline">
                                      Reschedule Request
                                    </span>
                                    <span className="sm:hidden">
                                      Reschedule Request
                                    </span>
                                  </button>
                                )}

                              {bookingDetails?.length > 0 &&
                                bookingDetails[0]?.reschedule &&
                                bookingDetails[0]?.reschedule?.isReschedule ===
                                  false && // Request is still pending
                                bookingDetails[0]?.reschedule?.requestSentBy ===
                                  "user" && // Request sent by the user
                                bookingDetails[0]?.reschedule?.acceptedBy ===
                                  null && // Not yet accepted
                                bookingDetails[0]?.reschedule?.rejectedBy ===
                                  null && ( // Not yet rejected
                                  <button
                                    className={`relative flex items-center justify-center 
                                  font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                                  text-xs sm:text-sm md:text-base lg:text-sm
                                  ${
                                    booking
                                      ? "animate-bounce shadow-blue-500"
                                      : ""
                                  }
                                  ${
                                    theme === "dark"
                                      ? "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-gray-200 shadow-blue-700"
                                      : "bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 text-white shadow-blue-500"
                                  }`}
                                    onClick={() => setResheduleModal(booking)}
                                  >
                                    <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                    <span className="hidden sm:inline">
                                      Reschedule Request
                                    </span>
                                    <span className="sm:hidden">
                                      Reschedule
                                    </span>
                                  </button>
                                )}
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium text-gray-200">
                                Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === "canceled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium ">Payment Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                      ${
                        booking.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                              >
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4 pt-4 border-t">
                            <button
                              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                              onClick={() => handelViewDetails(booking)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-lg">
                        No bookings available
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-5 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors hover:bg-[#2a8f97]"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded-md font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages}
                    className="px-5 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors hover:bg-[#2a8f97]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LaborDashBoard;
