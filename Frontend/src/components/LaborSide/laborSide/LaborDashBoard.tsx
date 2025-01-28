import LaborDashBoardNav from "./LaborDashBoardNav"

import React, { useEffect, useState } from 'react';
import { HomeIcon, MessageSquare, Receipt, Briefcase, User, LogOut, DollarSign } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { auth, db } from "../../../utils/firbase";
import {  collection, getDocs, query, where, getDoc, doc, getCountFromServer, onSnapshot, Timestamp, serverTimestamp, updateDoc } from 'firebase/firestore';
import { setLoading } from "../../../redux/slice/laborSlice";
import '../../Auth/LoadingBody.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

interface ChatDocument {
  laborId: string;
  userId: string;
  lastMessage: string;
  lastUpdated: Timestamp;  // Change to Timestamp, not string
  quoteSent: boolean;
  messagesCount: number;
  lastReadTimestamp: Timestamp;
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
  const [currentStage, setCurrentStage] = useState("Dashboard");
  const [unreadChats, setUnreadChats] = useState({});
  const [chats, setChats] = useState<Chat[]>([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()


  console.log("Gthis si the chats :::::",chats)

  console.log("thsis eth labo data :A", email);


    const totalUnreadCount = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

     const navItems: NavItem[] = [
    { name: "Dashboard", icon: HomeIcon, stage: "Dashboard" },
    { name: "Browse Labors", icon: User, stage: "Browse" },
    { name: "Chats", icon: MessageSquare, stage: "Chats" },
    { name: "Billing History", icon: Receipt, stage: "Billing" },
    { name: "Total Works", icon: Briefcase, stage: "Works" },
    { name: "View Profile", icon: User, stage: "Profile" },
  ];


  const stats = [
    { title: "Total Work Taken", value: "24", icon: Briefcase },
    { title: "Work Completed", value: "18", icon: Receipt },
    { title: "Total Earnings", value: "$2,450", icon: DollarSign },
    { title: "Pending Tasks", value: "6", icon: MessageSquare },
  ];

  useEffect(() => {
    // Get the saved stage from localStorage or default to "Dashboard"
    const savedStage = localStorage.getItem("currentStage") || "Dashboard";
    setCurrentStage(savedStage);
  }, []);

  useEffect(() => {
    // Save the current stage to localStorage whenever it changes
    localStorage.setItem("currentStage", currentStage);
  }, [currentStage]);

  useEffect(() => {
    const initialUnreadState = chats.reduce((acc, chat) => {
      acc[chat.id] = chat.messagesCount > 0;
      return acc;
    }, {});
    setUnreadChats(initialUnreadState);
  }, [chats]);

const fetchChats = (userUid: string) => {
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

        // Get messages subcollection with timestamp filter
        const messagesCollection = collection(db, "Chats", doc.id, "messages");
        const unreadQuery = query(
          messagesCollection,
          where("timestamp", ">", chatData.lastReadTimestamp || new Timestamp(0, 0))
        );
        
        const unreadSnapshot = await getCountFromServer(unreadQuery);
        const unreadCount = unreadSnapshot.data().count;

        return {
          id: doc.id,
          ...chatData,
          unreadCount,
        };
      })
    );

    // Rest of the user data fetching code remains the same
    const userPromises = chatData.map(async (chat) => {
      try {
        const userDocRef = doc(db, "Users", chat.userId);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.exists()
          ? (userSnapshot.data() as UserData)
          : null;

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
          toast.error('Please sign in to view chats');
        }
      });

      return () => unsubscribe(); // Cleanup auth listener on unmount
    }, []);

   // Add a function to update the last read timestamp
const markChatAsRead = async (chatId: string) => {
  const chatRef = doc(db, "Chats", chatId);
  await updateDoc(chatRef, {
    lastReadTimestamp: serverTimestamp()
  });
};

// Modify the navigation handler to mark messages as read
const handleNavigateChatpage = async (chatId) => {
  await markChatAsRead(chatId);
  navigate(`/chatingPage/${chatId}`);
};

  console.log('this is the chat coutn :;;;;;;;;;;;;',unreadChats)


  return (
    <div>
      {loading && <div className="loader"></div>}
      <LaborDashBoardNav />
      <div className="flex h-screen ">
        {/* Desktop Sidebar */}
        {theme == "light" ? (
          <>
            <div className="hidden lg:block w-64 bg-white shadow-lg">
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
                        className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors relative"
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                        
                        {/* Only show notification badge for Chats and if there are unread messages */}
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
          <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            {chats.length > 0 ? (
              <div className="space-y-4" >
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full"
                     onClick={() => handleNavigateChatpage(chat.id)}
                  >
                    {/* User Profile Picture */}
                    <img
                      src={chat.userData?.profilePicture || 'default-profile-picture.jpg'}
                      alt="User Profile"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />

                    {/* Chat Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold">{chat.userData?.name || 'Unknown User'}</h3>
                        <span className="text-gray-500 text-sm">
                          {chat.lastUpdated && format(chat.lastUpdated.toDate(), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-600">{chat.lastMessage || 'No message'}</p>
                    </div>

                    {/* Message Count */}
                       {chat.unreadCount > 0 && (
                      <div className="ml-4 flex items-center">
                        <span className="bg-red-500 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-8">No chats available</p>
            )}
          </div>
        ) : null}


          </>
        ) : (
          <>
            <div className="hidden bg-[#0f8585] lg:mt-8 lg:block w-64 h-[460px] border border-gray-700 rounded-md shadow-lg">
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
                      className="flex items-center w-full px-4 py-3  rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors relative"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                      
                      {/* Only show notification badge for Chats and if there are unread messages */}
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

              
          {currentStage === 'Dashboard' && (
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
                      className="bg-[#0f8585] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-8 h-8 " />
                        <span className="text-2xl font-bold">{stat.value}</span>
                      </div>
                      <h3 className=" font-medium">{stat.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentStage === "Chats" ? (
            <div className="p-6 w-full">
              <h1 className="text-2xl font-bold mb-4">Chats</h1>
              {chats.length > 0 ? (
                <div className="space-y-4">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center p-4 bg-[#0f8585] rounded-lg shadow-md hover:shadow-lg transition-shadow w-full"
                    >
                      {/* User Profile Picture */}
                      <img
                        src={chat.userData?.profilePicture || 'default-profile-picture.jpg'}
                        alt="User Profile"
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />

                      {/* Chat Info */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-xl font-semibold">{chat.userData?.name || 'Unknown User'}</h3>
                          <span className=" text-sm">
                            {chat.lastUpdated && format(chat.lastUpdated.toDate(), 'h:mm a')}
                          </span>
                        </div>
                        <p className="">{chat.lastMessage || 'No message'}</p>
                      </div>

                      {/* Message Count */}
                       {chat.unreadCount > 0 && (
                      <div className="ml-4 flex items-center">
                        <span className="bg-red-500 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className=" text-center mt-8">No chats available</p>
              )}
            </div>
          ) : null}

            
          </>
        )}
      </div>
    </div>
  );
};

export default LaborDashBoard;
