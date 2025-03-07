import LaborDashBoardNav from "./LaborDashBoardNav"

import React, { useEffect, useState } from 'react';
import { HomeIcon, MessageSquare, Receipt, Briefcase, MessageCircle, MenuIcon, Filter, Clock, XCircle, CheckCircle, IndianRupee, LucideIcon } from 'lucide-react';
import { FaCalendarCheck } from "react-icons/fa"; 
import { Phone, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { db } from "../../../utils/firbase";
import {  collection, getDocs, query, where, getDoc, doc, getCountFromServer, onSnapshot, Timestamp, serverTimestamp, updateDoc, orderBy, limitToLast } from 'firebase/firestore';
import { resetLaborer, setIsLaborAuthenticated, setLaborer, toggleMobileChatList } from "../../../redux/slice/laborSlice";
import '../../Auth/LoadingBody.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchLaborBookings, fetchWithdrowalRequests, handlewithdrowAmount, laborFetch } from "../../../services/LaborServices";
import { resetUser, setAccessToken, setisUserAthenticated, setUser } from "../../../redux/slice/userSlice";
import { BookingDetails, setBookingDetails } from "../../../redux/slice/bookingSlice";
import { ClockIcon } from "@heroicons/react/24/solid";
import RescheduleRequestModal from "./resheduleRequstModal";
import ChatComponents from "../../ChatPage/ChatComponets";
import { IBooking } from "../../../@types/IBooking";
import { IconType } from "react-icons/lib";

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

interface UserData {
  // Add user fields based on your Users collection structure
  name?: string;
  email?: string;
  profilePicture? : string
  // ... other user fields
  online?: boolean;
}

export interface IWithrowalBooking {
  _id: string;
  status: "pending" | "approved" | "rejected";
  amount?: number;  // Add this field
  createdAt: string;
  paymentMethod: string;
  paymentDetails: string;
  processedAt?: string;
}



interface Chat extends ChatDocument {
  id: string;
  userData?: UserData | null;
  unreadCount: number;

}


interface NavItem {
  name: string;
  icon: LucideIcon | IconType; // Or use the correct Lucide icon type
  stage: string;
}


const LaborDashBoard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const laborer = useSelector((state: RootState) => state.labor.laborer);
  const loading = useSelector((state: RootState) => state.labor.loading);
  const isLaborAuthenticated = useSelector(
    (state: RootState) => state.labor.isLaborAuthenticated
  );
  const isMobileChatListOpen = useSelector(
    (state: RootState) => state.labor.isMobileChatListOpen
  );

  const [currentStage, setCurrentStage] = useState("Dashboard");
  const [resheduleModal, setResheduleModal] = useState<BookingDetails | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [limit, setLimit] = useState(2);
  const [filter, setFilter] = useState("");
  const currentPages = location.pathname.split("/").pop() || "";
  const [totalPages, setTotalPages] = useState(1);
  const transactionsPerPage = 5;
  const [stats, setStats] = useState([
    { title: "Total Bookings", value: "0", icon: Briefcase },
    { title: "Total Work Completed", value: "0", icon: CheckCircle },
    { title: "Total Cancellations", value: "0", icon: XCircle },
    { title: "Total Amount Pay", value: "₹0", icon: IndianRupee },
    { title: "Pending Tasks", value: "0", icon: Clock },
  ]);
  const theam = useSelector((state: RootState) => state.theme.mode)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatedBooking, setUpdatedBooking] = useState<BookingDetails | null>(null);
  
  console.log('Thsis is the updatedBooking::',updatedBooking)

  const sortedTransactions = laborer?.wallet?.transactions 
    ? [...laborer.wallet.transactions].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  
    // Pagination calculations
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = sortedTransactions.slice(
      indexOfFirstTransaction, 
      indexOfLastTransaction
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPagess = Math.ceil(
      (laborer?.wallet?.transactions?.length || 0) / transactionsPerPage
    );
    
    const handleRescheduleUpdate =  (newBooking: BookingDetails) => {
      setUpdatedBooking(newBooking);
    };

  const bookingDetails = useSelector((state: RootState) => state.booking?.bookingDetails || []);


  const totalUnreadCount = chats.reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0
  );

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: HomeIcon, stage: "Dashboard" },
    { name: "Bookings", icon: FaCalendarCheck, stage: "Bookings" },
    { name: "Chats", icon: MessageSquare, stage: "Chats" },
    { name: "  Bookings & History ", icon: Briefcase, stage: "Works" },
    { name: "My Wallet", icon: Receipt, stage: "Wallet" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await laborFetch();
        const { fetchUserResponse } = data;

        dispatch(setLaborer(fetchUserResponse));
      } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message); // Show dynamic error message

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
  const fetchChats = (userUid : string) => {
    
    if (!userUid) {
      throw new Error("Missing user credentials");
    }

    const auth = getAuth();
    const currentLabor = auth.currentUser;

    console.log('111111111111111111',currentLabor)

    if (!currentLabor || !currentLabor.uid) {
      throw new Error("User is not authenticated");
    }

    const laborUid = currentLabor.uid;
    console.log('this it s the laborUIddddddddddddddd',laborUid)

    const chatCollection = collection(db, "Chats");
    const chatQuery = query(chatCollection, where("laborId", "==", laborUid));
    console.log('77777777777777777',chatQuery)

    const unsubscribe = onSnapshot(chatQuery, async (chatSnapshot) => {
      const chatData = await Promise.all(
        chatSnapshot.docs.map(async (doc) => {
          const chatData = doc.data() as ChatDocument;

          // Get the latest message for sorting
          const messagesCollection = collection(
            db,
            "Chats",
            doc.id,
            "messages"
          );
          const latestMessageQuery = query(
            messagesCollection,
            orderBy("timestamp", "desc"),
            limitToLast(1)
          );
          const latestMessageSnapshot = await getDocs(latestMessageQuery);
          const latestMessage = latestMessageSnapshot.docs[0]?.data();
          const latestMessageTime =
            latestMessage?.timestamp || new Timestamp(0, 0);

          // Calculate unread count
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
            latestMessageTime,
            unreadCount,
          };
        })
      );

      // Fetch user data and sort by latest message
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

      // Sort chats by latest message timestamp
      const sortedChats = chatsWithUserData.sort((a, b) => {
        // First, sort by lastMessageSender (user messages first)
        if (a.lastMessageSender === 'user' && b.lastMessageSender !== 'user') return -1;
        if (a.lastMessageSender !== 'user' && b.lastMessageSender === 'user') return 1;
        
        // Then sort by timestamp for messages from the same sender type
        const aTime = a.latestMessageTime?.seconds || 0;
        const bTime = b.latestMessageTime?.seconds || 0;
        return bTime - aTime;
      });
      setChats(sortedChats);
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
  const markChatAsRead = async (chatId : string) => {
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

  useEffect(() => {
  const stageLimits: Record<string, number> = {
    Bookings: 2,
    Works: 7,
  };

  setLimit(stageLimits[currentStage] || 2);
}, [currentStage]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("this si the filter.....", filter);
        // dispatch(resetLaborer())
        const responseInBacked = await fetchLaborBookings(
          currentPage,
          limit,
          filter
        );

        if (responseInBacked.status == 200) {
          const {
            bookings,
            totalPages,
            totalAmount,
            completedBookings,
            canceledBookings,
            total,
            pendingBookings,
          } = responseInBacked.data;

          // console.log("brrrrrrrrrronoddddddddddddn", responseInBacked);
          setTotalPages(totalPages);
          dispatch(setBookingDetails(bookings));
          setBookingDetils(bookings);
          setStats([
            { title: "Total Bookings", value: total, icon: Briefcase },
            {
              title: "Total Work Completed",
              value: completedBookings,
              icon: CheckCircle,
            },
            {
              title: "Total Cancellations",
              value: canceledBookings,
              icon: XCircle,
            },
            {
              title: "Total Amount Pay",
              value: `₹${totalAmount.toLocaleString()}`,
              icon: IndianRupee,
            },
            { title: "Pending Tasks", value: pendingBookings, icon: Clock },
          ]);
          // toast.success("Booking fetched succesfully")
        }
      } catch (error) {
        console.error(error);
        // toast.error("Error to fetch booking....!");
      }
    };

    fetchBookings();
  }, [currentStage, currentPage, limit, dispatch, filter]);

  const handleFilterChange = (value : string) => {
    setFilter(value);
  };

  const handelViewDetails = (booking : BookingDetails) => {
    navigate("/labor/viewBookingDetials", { state: { booking } });
  };

  const handleChatSelect = (chatId  :string) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
  };
useEffect(() => {
    const fetchLabors = async () => {
      try {
        const fetchLabor = await laborFetch();
        const { fetchUserResponse } = fetchLabor
        console.log("Fetched Labors:", fetchUserResponse);
      } catch (error) {
        console.error(error);
        toast.error("Error in fetching labor");
      }
    };

    fetchLabors();
  }, []); 

  // useEffect(() => {
  //   dispatch(resetLaborer())
  //     dispatch(setUser({}));
  //         dispatch(resetUser());
  //         dispatch(setisUserAthenticated(false));
  //         dispatch(setAccessToken(""));

  //         // Reset Labor State
  //         dispatch(setLaborer({}));
  //         dispatch(resetLaborer());
  //         dispatch(setIsLaborAuthenticated(false));

  //         navigate("/");
  // },[])

  const handleWithdraw = async () => {
    // Add withdrawal logic here
    console.log("Withdrawing:", amount, bankDetails);
    try {
      const numericAmount = Number(amount);

      if (!numericAmount || numericAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        // Ensure amount is converted to a number before comparison
       if (numericAmount > laborer.wallet.balance) {
            toast.error(`Insufficient balance. Available balance: ${laborer.wallet.balance}`);
            return;
        }
      
      const response = await handlewithdrowAmount({ amount: numericAmount, bankDetails  })
      if (response.status === 200) {
        // onUpdateBooking={handleRescheduleUpdate}
        const {withdrawalResponse } = response.data
        console.log('response setnd is this ', withdrawalResponse)
        setUpdatedBooking(withdrawalResponse)
        toast.success('withdrow amount succefflyll')
      }

    } catch (error) {
      console.error(error)
      toast.error('Error in the witdhow balance')
    }
    setIsWithdrawOpen(false);
  };


  const laborId = laborer?._id
  

  useEffect(() => {
    const fetchWithdrowalRequest = async () => {
      const response = await fetchWithdrowalRequests(laborId)
      if (response.status === 200) {
        const { withdrowalRequests } = response.data
        // console.log('Thsi si the rrrrrrrrrrrre333333333333333##############################',response)
        setUpdatedBooking(withdrowalRequests)
        // toast.success('Requsts fetch succesfully for withdrowallss')
      }
    }
    fetchWithdrowalRequest()
  }, [laborId])


  return (
    <div>
      {isWithdrawOpen && (
        <>
          {theam === "light" ? (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Withdraw Money</h2>

                <label className="block mb-2">
                  Amount:
                  <input
                    type="number"
                    className="w-full p-2 border rounded mt-1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </label>

                <label className="block mb-2">
                  Account Number:
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Enter account number"
                  />
                </label>

                <label className="block mb-2">
                  Bank Name:
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    placeholder="Enter bank name"
                  />
                </label>

                <label className="block mb-2">
                  IFSC Code:
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value,
                      })
                    }
                    placeholder="Enter IFSC code"
                  />
                </label>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={() => setIsWithdrawOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-white">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">
                  Withdraw Money
                </h2>

                <label className="block mb-2">
                  Amount:
                  <input
                    type="number"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </label>

                <label className="block mb-2">
                  Account Number:
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Enter account number"
                  />
                </label>

                <label className="block mb-2">
                  Bank Name:
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    placeholder="Enter bank name"
                  />
                </label>

                <label className="block mb-2">
                  IFSC Code:
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value,
                      })
                    }
                    placeholder="Enter IFSC code"
                  />
                </label>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    onClick={() => setIsWithdrawOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <RescheduleRequestModal
        isOpen={resheduleModal !== null}
        onClose={() => setResheduleModal(null)}
        bookingDetails={resheduleModal ? [resheduleModal] : []}
        onUpdateBooking={handleRescheduleUpdate}
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
              <div className="p-4  w-full max-w-6xl mx-auto lg:mt-3">
                <div className="rounded-xl border  md:h-[740px] h-screen bg-[#F8F9FA] text-[#212529] overflow-hidden">
                  <div className="flex h-full">
                    {/* Chat List Sidebar */}
                    <div
                      className={`
            h-auto
            lg:w-[400px]
            flex-shrink-0
            bg-[#FFFFFF] 
            transition-all
            duration-300
            ${isMobileChatListOpen ? "w-80" : "w-0"}
            lg:w-[400px]
            overflow-hidden
          `}
                    >
                      {/* Chat List Header */}
                      <div className="sticky top-0  z-10 bg-[#FFFFFF] border-b border-[#DEE2E6]">
                        <div className="p-4 flex items-center justify-between">
                          <h1 className="text-xl font-bold text-[#212529]">
                            My Chats
                          </h1>

                          <button
                            onClick={() => dispatch(toggleMobileChatList())}
                            className="lg:hidden p-2 hover:bg-[#E2E6EA] rounded-full"
                          >
                            <MenuIcon className="w-5 h-5 text-[#495057]" />
                          </button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-4 pb-2">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#CED4DA] rounded-lg text-[#212529] focus:ring-2 focus:ring-[#3ab3bc]"
                          />
                        </div>
                      </div>

                      {/* Chat List */}
                      <div className="h-[calc(100%-8rem)] overflow-y-auto">
                        <div className="divide-y divide-[#DEE2E6]">
                          {chats.length > 0 ? (
                            chats.map((chat) => (
                              <div
                                key={chat.id}
                                onClick={() => {
                                  handleChatSelect(chat.id);
                                  dispatch(toggleMobileChatList());
                                }}
                                className={`
                      flex items-center p-4
                      hover:bg-[#E2E6EA]
                      cursor-pointer
                      transition-colors
                      duration-150
                      ease-in-out
                      ${selectedChatId === chat.id ? "bg-[#DEE2E6]" : ""}
                    `}
                              >
                                {/* Notification Badge for Unread Chats */}
                                {chat.unreadCount > 0 && (
                                  <div className="right-0 top-1/2 -translate-y-1/2">
                                    <span className="bg-[#D9534F] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                      {chat.unreadCount}
                                    </span>
                                  </div>
                                )}

                                {/* Chat item content */}
                                <div className="relative">
                                  <img
                                    src={
                                      chat.userData?.profilePicture ||
                                      "default-profile-picture.jpg"
                                    }
                                    alt="User"
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#CED4DA]"
                                  />
                                  <div
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#FFFFFF] ${
                                      chat.userData?.online
                                        ? "bg-[#28A745]"
                                        : "bg-[#CED4DA]"
                                    }`}
                                  />
                                </div>

                                <div className="ml-4 flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-[#212529] truncate">
                                      {chat.userData?.name || "Unknown User"}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-[#6C757D]">
                              No chats available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-[#E9ECEF] min-w-0">
                      {selectedChatId ? (
                        <ChatComponents
                          chatId={selectedChatId}
                          onMenuClick={() => dispatch(toggleMobileChatList())}
                          currentPage={currentPages}
                        />
                      ) : (
                        <div className="flex-1 flex flex-col bg-[#F8F9FA]">
                          {/* Header with menu button */}
                          <div className="p-4 flex items-center">
                            {!isMobileChatListOpen && (
                              <button
                                onClick={() => dispatch(toggleMobileChatList())}
                                className="lg:hidden p-2 hover:bg-[#E2E6EA] rounded-full"
                              >
                                <MenuIcon className="w-5 h-5 text-[#495057]" />
                              </button>
                            )}
                          </div>

                          {/* Centered content with responsive margin */}
                          <div
                            className={`
                            flex-1 
                            flex 
                            items-center 
                            justify-center 
                            p-8
                            transition-all
                            duration-300
                            ${isMobileChatListOpen ? "ml-80 lg:ml-0" : "ml-0"}
                          `}
                          >
                            <div className="text-center max-w-md mx-auto">
                              <div className="bg-[#FFFFFF] p-6 rounded-xl shadow-sm border border-[#DEE2E6]">
                                <div className="bg-[#DEE2E6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <MessageCircle
                                    size={32}
                                    className="text-[#6C757D]"
                                  />
                                </div>
                                <h3 className="text-xl font-semibold text-[#212529] mb-2">
                                  Select a Conversation
                                </h3>
                                <p className="text-[#6C757D]">
                                  Choose a chat to start messaging
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                                bookingDetails[0].reschedule.isReschedule ===
                                  false && // Request is still pending
                                bookingDetails[0].reschedule.rejectedBy ===
                                  "user" && // Rejected by labor
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
                                      booking
                                        ? "animate-bounce shadow-blue-500"
                                        : ""
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
                                  booking.paymentStatus === "paid"
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

            {currentStage === "Works" && (
              <div className="p-4 w-full max-w-screen-lg mx-auto  text-[#333]">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-[#333] border-b pb-3">
                    Bookings & History
                  </h1>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#0056b3] transition-colors shadow-md">
                    <Filter className="w-5 h-5 text-white" />
                    <span className="text-white">Filters</span>
                    <select
                      className="bg-white text-[#333] border border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="" className="bg-white text-[#333]">
                        Filter by Status
                      </option>
                      <option value="canceled" className="bg-white text-[#333]">
                        Cancelled
                      </option>
                      <option
                        value="confirmed"
                        className="bg-white text-[#333]"
                      >
                        Confirmed
                      </option>
                      <option
                        value="completed"
                        className="bg-white text-[#333]"
                      >
                        Completed
                      </option>
                    </select>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto w-full max-w-screen-lg mx-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-[#e3f2fd] text-[#333]">
                      <tr>
                        {[
                          "Date",
                          "Customer Name",
                          "Job Description",
                          "Status",
                          "Payment",
                          "Payment Status",
                          "Customer Details",
                        ].map((head) => (
                          <th
                            key={head}
                            className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider border-b"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {bookingDetils?.length > 0 ? (
                        bookingDetils.map((booking, index) => (
                          <tr
                            key={booking?._id || index}
                            className="hover:bg-[#f1f1f1]"
                          >
                           <td className="px-4 py-4 text-xs sm:text-sm">
  {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
</td>

                            <td className="px-4 py-4 text-xs sm:text-sm">
                              {booking?.userId?.firstName || "N/A"}{" "}
                              {booking?.userId?.lastName || ""}
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm">
                              {booking?.quote?.description || "N/A"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block ${
                                  booking?.status === "confirmed"
                                    ? "bg-[#fff3cd] text-[#856404]"
                                    : booking?.status === "canceled"
                                    ? "bg-[#f8d7da] text-[#721c24]"
                                    : "bg-[#d4edda] text-[#155724]"
                                }`}
                              >
                                {booking?.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm">
                              ₹{booking?.quote?.estimatedCost || "0"}
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block ${
                                  booking?.paymentStatus === "paid"
                                    ? "bg-[#d4edda] text-[#155724]" // Green for Paid
                                    : booking?.paymentStatus === "pending"
                                    ? "bg-[#fff3cd] text-[#856404]" // Yellow for Pending
                                    : "bg-[#f8d7da] text-[#721c24]" // Red for Failed
                                }`}
                              >
                                {booking?.paymentStatus || "Unknown"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-500">
                                  <img
                                    src={
                                      booking?.userId?.ProfilePic ||
                                      "/default-profile.png"
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Customer Profile"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {booking?.userId?.address?.city || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-[#333]"
                          >
                            No bookings available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-4 mt-6 mb-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#007bff] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 text-[#333] py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-[#007bff] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStage === "Wallet" ? (
              laborer?.wallet ? ( // Check if wallet exists
                <div className="p-4 w-full max-w-screen-lg mx-auto">
                  <div className="rounded-lg bg-white p-6 shadow-lg">
                     <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold ">My Wallet</h1>
                      {updatedBooking ? (
                        updatedBooking.status === "pending" && updatedBooking.amount ? (
                           <p className="text-orange-500 font-medium text-sm sm:text-base md:text-lg bg-yellow-100 p-2 rounded-md border border-yellow-400">
                            Your withdrawal request of ₹{updatedBooking.amount} is pending. Please be patient.
                          </p>
                        ) : updatedBooking.status === "approved" || updatedBooking.status === "rejected" ? (
                          laborer?.wallet?.balance > 0 && (
                            <button
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
                              onClick={() => setIsWithdrawOpen(true)}
                            >
                              Withdraw Money
                            </button>
                          )
                        ) : null
                      ) : (
                        laborer?.wallet?.balance > 0 && (
                          <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
                            onClick={() => setIsWithdrawOpen(true)}
                          >
                            Withdraw Money
                          </button>
                        )
                      )}
                    </div>

                    <div className="mb-8 text-center">
                      <p className="text-gray-500 text-lg mb-2 uppercase tracking-wide">
                        Available Balance
                      </p>
                      <p className="text-5xl font-extrabold text-green-600 drop-shadow-lg">
                        ₹{laborer.wallet.balance?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Recent Transactions
                      </h2>

                      <div className="space-y-4">
                        {currentTransactions.length > 0 ? (
                          currentTransactions.map((transaction) => (
                            <div
                              key={transaction?._id}
                              className="flex justify-between items-center p-4 bg-gray-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="text-gray-900">
                                  <p className="font-medium">LaborLink</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(
                                      transaction.createdAt
                                    ).toLocaleString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-green-600 font-medium">
                                  +₹{transaction.amount.toLocaleString("en-IN")}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    transaction.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center">
                            No recent transactions.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6 mb-4">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4  py-2">
                      Page {currentPage} of {totalPagess}
                    </span>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage >= totalPagess}
                      className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                // Else case when there is no wallet
                <div className="rounded-lg bg-white p-6 shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    No Wallet Found
                  </h2>
                  <p className="text-gray-500 mt-2">
                    It looks like you don't have a wallet yet.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                    Create Wallet
                  </button>
                </div>
              )
            ) : null}
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
              <div className="p-4   w-full max-w-6xl mx-auto lg:mt-3">
                <div className="rounded-xl md:h-[740px] h-screen bg-gray-700 text-[#E0E0E0] overflow-hidden">
                  <div className="flex h-full">
                    {/* Chat List Sidebar */}
                    <div
                      className={`
                    h-auto
                    lg:w-[400px]
                    flex-shrink-0
                    bg-gray-800
                    transition-all
                    duration-300
                    ${isMobileChatListOpen ? "w-80" : "w-0"}
                    lg:w-[400px]
                    overflow-hidden
                  `}
                    >
                      {/* Chat List Header */}
                      <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
                        <div className="p-4 flex items-center justify-between">
                          <h1 className="text-xl font-bold text-[#E0E0E0]">
                            My Chats
                          </h1>

                          <button
                            onClick={() => dispatch(toggleMobileChatList())}
                            className="lg:hidden p-2 hover:bg-gray-700 rounded-full"
                          >
                            <MenuIcon className="w-5 h-5 text-gray-300" />
                          </button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-4 pb-2">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-700 rounded-lg text-[#E0E0E0] focus:ring-2 focus:ring-[#3ab3bc]"
                          />
                        </div>
                      </div>

                      {/* Chat List */}
                      <div className="h-[calc(100%-8rem)] overflow-y-auto">
                        <div className=" h-[calc(108vh-rem)] divide-y divide-[#3B3B4F]">
                          {chats.length > 0 ? (
                            chats.map((chat) => (
                              <div
                                key={chat.id}
                                onClick={() => {
                                  handleChatSelect(chat.id); // Handle selecting the chat
                                  dispatch(toggleMobileChatList()); // Close chat list when selecting a chat
                                }}
                                className={`
                                flex items-center p-4
                                hover:bg-gray-600
                                cursor-pointer
                                transition-colors
                                duration-150
                                ease-in-out
                                ${
                                  selectedChatId === chat.id
                                    ? "bg-gray-600"
                                    : ""
                                }
                              `}
                              >
                                {/* Notification Badge for Unread Chats */}
                                {chat.unreadCount > 0 && (
                                  <div className=" right-0 top-1/2 -translate-y-1/2">
                                    <span className="bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                      {chat.unreadCount}
                                    </span>
                                  </div>
                                )}

                                {/* Chat item content */}
                                <div className="relative">
                                  <img
                                    src={
                                      chat.userData?.profilePicture ||
                                      "default-profile-picture.jpg"
                                    }
                                    alt="User"
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3B3B4F]"
                                  />
                                  <div
                                    className={`
                                  absolute bottom-0 right-0 
                                  w-3 h-3 rounded-full 
                                  border-2 border-[#2A2A3B]
                                  ${
                                    chat.userData?.online
                                      ? "bg-[#4CAF50]"
                                      : "bg-[#3B3B4F]"
                                  }
                                `}
                                  />
                                </div>

                                <div className="ml-4 flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-[#E0E0E0] truncate">
                                      {chat.userData?.name || "Unknown User"}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-[#B0B0C0]">
                              No chats available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-[#2A2A3B] min-w-0">
                      {selectedChatId ? (
                        <ChatComponents
                          chatId={selectedChatId}
                          onMenuClick={() => dispatch(toggleMobileChatList())}
                          currentPage={currentPages}
                        />
                      ) : (
                        <div className="flex-1 flex flex-col bg-[#1E1E2E]">
                          {/* Header with menu button */}
                          <div className="p-4 flex items-center">
                            {!isMobileChatListOpen && (
                              <button
                                onClick={() => dispatch(toggleMobileChatList())}
                                className="lg:hidden p-2 hover:bg-gray-700 rounded-full"
                              >
                                <MenuIcon className="w-5 h-5 text-gray-300" />
                              </button>
                            )}
                          </div>

                          {/* Centered content with responsive margin */}
                          <div
                            className={`
                            flex-1 
                            flex 
                            items-center 
                            justify-center 
                            p-8
                            transition-all
                            duration-300
                            ${isMobileChatListOpen ? "ml-80 lg:ml-0" : "ml-0"}
                          `}
                          >
                            <div className="text-center max-w-md mx-auto">
                              <div className="bg-[#2A2A3B] p-6 rounded-xl shadow-sm border border-[#3B3B4F]">
                                <div className="bg-[#3B3B4F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <MessageCircle
                                    size={32}
                                    className="text-[#B0B0C0]"
                                  />
                                </div>
                                <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">
                                  Select a Conversation
                                </h3>
                                <p className="text-[#B0B0C0]">
                                  Choose a chat to start messaging
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                                bookingDetails[0]?.reschedule?.isReschedule ===
                                  false && // Request is still pending
                                bookingDetails[0]?.reschedule?.rejectedBy ===
                                  "user" && // Rejected by labor
                                bookingDetails[0]?.reschedule
                                  ?.rejectionNewDate && // Has a rejection date
                                bookingDetails[0]?.reschedule
                                  ?.rejectionNewTime && // Has a rejection time
                                bookingDetails[0]?.reschedule
                                  ?.rejectionReason && // Has a rejection reason
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
                        booking.paymentStatus === "paid"
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
            {currentStage === "Works" && (
              <div className="p-4 w-full max-w-screen-lg mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-white border-b pb-3">
                    Bookings & History
                  </h1>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md">
                    <Filter className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-200">Filters</span>
                    <select
                      className="bg-gray-900 text-gray-300 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="" className="bg-gray-800 text-white">
                        Filter by Status
                      </option>
                      <option
                        value="canceled"
                        className="bg-gray-800 text-white"
                      >
                        Cancelled
                      </option>
                      <option
                        value="confirmed"
                        className="bg-gray-800 text-white"
                      >
                        Confirmed
                      </option>
                      <option
                        value="completed"
                        className="bg-gray-800 text-white"
                      >
                        Completed
                      </option>
                    </select>
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto w-full max-w-screen-lg mx-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-700">
                      <tr>
                        {[
                          "Date",
                          "Customer Name",
                          "Job Description",
                          "Status",
                          "Payment",
                          "Payment Status",
                          "Customer Details",
                        ].map((head) => (
                          <th
                            key={head}
                            className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider border-b"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {bookingDetils?.length > 0 ? (
                        bookingDetils.map((booking, index) => (
                          <tr
                            key={booking?._id || index}
                            className="hover:bg-gray-700"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                              {booking?.createdAt
    ? new Date(booking.createdAt).toLocaleDateString()
    : "N/A"}
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm text-white">
                              {booking?.userId?.firstName || "N/A"}{" "}
                              {booking?.userId?.lastName || ""}
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm text-white">
                              {booking?.quote?.description || "N/A"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block
                        ${
                          booking?.status === "confirmed"
                            ? "bg-yellow-800 text-yellow-100"
                            : booking?.status === "canceled"
                            ? "bg-red-800 text-red-100"
                            : "bg-green-800 text-green-100"
                        }`}
                              >
                                {booking?.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                              ₹{booking?.quote?.estimatedCost || "0"}
                            </td>
                            <td className="px-4 py-4 text-xs sm:text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block ${
                                  booking?.paymentStatus === "paid"
                                    ? "bg-[#d4edda] text-[#155724]" // Green for Paid
                                    : booking?.paymentStatus === "pending"
                                    ? "bg-[#fff3cd] text-[#856404]" // Yellow for Pending
                                    : "bg-[#f8d7da] text-[#721c24]" // Red for Failed
                                }`}
                              >
                                {booking?.paymentStatus || "Unknown"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-500">
                                  <img
                                    src={
                                      booking?.userId?.ProfilePic ||
                                      "/default-profile.png"
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Customer Profile"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">
                                    {booking?.userId?.address?.city || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-white"
                          >
                            No bookings available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-4 mt-6 mb-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 text-white py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStage === "Wallet" ? (
              laborer?.wallet ? ( // Check if wallet exists
                <div className="p-4 w-full max-w-screen-lg mx-auto bg-gray-900">
                  <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-white">My Wallet</h1>
                
                {updatedBooking ? (
                  updatedBooking.status === "pending" && updatedBooking.amount ? (
                    <p className="text-orange-500 font-medium text-sm sm:text-base md:text-lg bg-yellow-100 p-2 rounded-md border border-yellow-400">
                      Your withdrawal request of <span className="font-semibold">₹{updatedBooking.amount}</span> is pending. Please be patient.
                    </p>
                  ) : (updatedBooking.status === "approved" || updatedBooking.status === "rejected") && laborer?.wallet?.balance > 0 ? (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-sm sm:text-base md:text-lg shadow-md"
                      onClick={() => setIsWithdrawOpen(true)}
                    >
                      Withdraw Money
                    </button>
                  ) : null
                ) : (
                  laborer?.wallet?.balance > 0 && (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-sm sm:text-base md:text-lg shadow-md"
                      onClick={() => setIsWithdrawOpen(true)}
                    >
                      Withdraw Money
                    </button>
                  )
                )}
              </div>

                    <div className="mb-8 text-center">
                      <p className="text-gray-400 text-lg mb-2 uppercase tracking-wide">
                        Available Balance
                      </p>
                      <p className="text-5xl font-extrabold text-emerald-400 drop-shadow-lg">
                        ₹{laborer.wallet.balance?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <h2 className="text-lg font-semibold text-gray-300 mb-4">
                        Recent Transactions
                      </h2>

                      <div className="space-y-4">
                        {currentTransactions.length > 0 ? (
                          currentTransactions.map((transaction) => (
                            <div
                              key={transaction._id}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="text-white">
                                    <p className="font-medium">
                                    {transaction.type === "debit"
                                      ? "Amount is credited to your bank account"
                                      : "LaborLink"}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {new Date(
                                      transaction.createdAt
                                    ).toLocaleString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-medium ${
                                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {transaction.type === "credit" ? "+₹" : "-₹"}
                                  {transaction.amount.toLocaleString("en-IN")}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center">
                            No recent transactions.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Pagination Controls */}
                  <div className="flex justify-center gap-4 mt-6 mb-4">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 text-white py-2">
                      Page {currentPage} of {totalPagess}
                    </span>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage >= totalPagess}
                      className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 w-full max-w-screen-md mx-auto bg-gray-900 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-white">
                    No Wallet Found
                  </h2>
                  <p className="text-gray-400 mt-2">
                    It looks like you don't have a wallet yet.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Create Wallet
                  </button>
                </div>
              )
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default LaborDashBoard;
