import React, { useEffect, useState } from 'react'
import HomeNavBar from '../HomeNavBar'
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import {auth, db} from '../../utils/firbase'
import { collection, doc, getCountFromServer, getDoc, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ChatComponents from '../ChatPage/ChatComponets';
import { MenuIcon, MessageCircle } from 'lucide-react';
import { toggleMobileChatList } from '../../redux/slice/laborSlice';
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
}



interface Chat extends ChatDocument {
  id: string;
  userData?: UserData | null;
  unreadCount: number;
}


const UserChatPage = () => {
  const location = useLocation();
  const currentPages = location.pathname.split('/').pop();
  const theam = useSelector((state: RootState) => state.theme.mode)
  const isMobileChatListOpen = useSelector((state: RootState) => state.labor.isMobileChatListOpen);

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  console.log("This is my chatssssssssssssss:",chats)

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'LaborProfilePage', link: '/userProfilePage' }, 
    { label: 'ChatLising', link: null }, // No link for the current page
  ];

  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChats = chats.slice(startIndex, endIndex);
  const totalPages = Math.ceil(chats.length / itemsPerPage);

  console.log("This is the currrenet chattttttttttttttttttttts :",currentChats)
  const chatss = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how are you doing?",
      time: "10:30 AM",
      imageUrl: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Can we meet tomorrow?",
      time: "9:45 AM",
      imageUrl: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Mike Johnson",
      message: "The meeting was great!",
      time: "8:15 AM",
      imageUrl: "/api/placeholder/40/40",
    },
  ];

  const fetchChats = (userUids) => {
    if (!userUids) {
      throw new Error("Missing user credentials");
    }

    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.uid) {
      throw new Error("User is not authenticated");
    }

    const userUid = currentUser.uid;

    const chatCollection = collection(db, "Chats");
    const chatQuery = query(chatCollection, where("userId", "==", userUid));

    const unsubscribe = onSnapshot(chatQuery, async (chatSnapshot) => {
      const chatData = await Promise.all(
        chatSnapshot.docs.map(async (doc) => {
          const chatData = doc.data() as ChatDocument;

          let unreadCount = 0;
          if (chatData.lastMessageSender === "labor") {
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
            const unreadSnapShot = await getCountFromServer(unreadQuery);
            unreadCount = unreadSnapShot.data().count;
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
          const userDocRef = doc(db, "Labors", chat.laborId);
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.exists() ? userSnapshot.data() : null;

          return {
            ...chat,
            userData,
          };
        } catch (error) {
          console.error(
            `Error fetching labor data for chat ${chat.id}:`,
            error
          );
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

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
  };

  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <MessageCircle size={48} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">No Messages Yet</h3>
      <p className="text-slate-500 max-w-sm">
        Start a conversation with your connections. Your messages will appear here.
      </p>
    </div>
  );
  

  return (
    <div>
      {/* <HomeNavBar /> */}
      {theam === "light" ? (
        <>
          <div className="flex  h-[calc(108vh-4rem)] bg-slate-50">
            {/* Left Sidebar - Chat List */}
            <div
              className={`
        w-full md:w-96 lg:w-[400px] 
        border-r border-slate-200 bg-white 
        ${selectedChatId ? "hidden md:block" : "block"}
        `}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <div className="px-4 py-2">
                  <Breadcrumb
                    items={breadcrumbItems}
                    currentPage={currentPages}
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-800">Messages</h1>
                  <span className="text-sm text-slate-500">
                    {chats.length} conversations
                  </span>
                </div>

                {/* Optional: Add search bar */}
                <div className="px-4 pb-2">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ab3bc] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {chats.length > 0 ? (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        handleChatSelect(chat.id);
                        markChatAsRead(chat.id);
                      }}
                      className={`
                  flex items-center p-4 hover:bg-slate-50 cursor-pointer
                  transition-colors duration-150 ease-in-out
                  ${chat.unread ? "bg-blue-50 hover:bg-blue-100" : ""}
                  ${
                    selectedChatId === chat.id
                      ? "bg-slate-100 hover:bg-slate-100"
                      : ""
                  }
                `}
                    >
                      <div className="relative">
                        <img
                          src={
                            chat.userData?.profilePicture ||
                            "default-profile-picture.jpg"
                          }
                          alt={`${chat.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${chat.userData?.online ? "bg-green-500" : "bg-slate-300"}`}
                        />
                      </div>

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {chat.userData?.name || "Unknown User"}
                          </h3>
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {chat.lastUpdated &&
                              format(chat.lastUpdated.toDate(), "h:mm a")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm truncate ${
                              chat.unread
                                ? "text-slate-800 font-medium"
                                : "text-slate-600"
                            }`}
                          >
                            {chat.lastMessage || "No message"}
                          </p>

                          {chat.lastMessageSender === "labor" &&
                            chat.unreadCount > 0 && (
                              <span className="ml-2 flex-shrink-0 bg-[#3ab3bc] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* Right Side - Chat Component */}
            <div
              className={`
        flex-1 flex flex-col bg-white
        ${selectedChatId ? "block" : "hidden md:flex"}
      `}
            >
              {selectedChatId ? (
                <ChatComponents chatId={selectedChatId} />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                  <div className="text-center max-w-md mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        Select a Conversation
                      </h3>
                      <p className="text-slate-500">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex bg-[#1E1E2E] text-[#E0E0E0]">
            {/* Left Sidebar - Chat List */}
            <div
              className={`fixed lg:h-[740px] inset-y-0 left-0 bg-[#2A2A3B] w-80 z-50 transition-transform duration-300
    ${isMobileChatListOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:translate-x-0 md:w-96 lg:w-[400px] border-r border-[#3B3B4F] overflow-y-auto`}
            >
              <div className="top-0 sticky z-10 bg-[#2A2A3B] border-b border-[#3B3B4F]">
                {/* Breadcrumb */}
                <div className="px-4 py-2">
                  <Breadcrumb
                    items={breadcrumbItems}
                    currentPage={currentPages}
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <h1 className="text-xl font-bold text-[#E0E0E0]">Messages</h1>
                  <span className="text-sm text-[#B0B0C0]">
                    {chats.length} conversations
                  </span>
                  <button
                    onClick={() => dispatch(toggleMobileChatList())}
                    className="md:hidden p-2 hover:bg-gray-700 rounded-full"
                  >
                    ✖
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-4 pb-2">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-4 py-2 bg-[#1E1E2E] border border-[#3B3B4F] rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#3ab3bc] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Chat List with Scroll */}
              <div
                className="divide-y divide-[#3B3B4F] h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide"
                style={{
                  background:
                    "linear-gradient(to bottom, #1E1E2E, #2A2A3B, #3B3B4F)", // Dark gradient colors
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }}
              >
                {chats.length > 0 ? (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        handleChatSelect(chat.id);
                        markChatAsRead(chat.id);
                        dispatch(toggleMobileChatList());
                      }}
                      className={`
            flex items-center p-4 hover:bg-[#34344A] cursor-pointer
            transition-colors duration-150 ease-in-out
            ${chat.unread ? "bg-[#3B3B4F] hover:bg-[#454564]" : ""}
            ${
              selectedChatId === chat.id
                ? "bg-[#3B3B4F] hover:bg-[#454564]"
                : ""
            }
          `}
                    >
                      <div className="relative">
                        <img
                          src={
                            chat.userData?.profilePicture ||
                            "default-profile-picture.jpg"
                          }
                          alt={`${chat.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3B3B4F]"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2A2A3B]
                ${chat.userData?.online ? "bg-[#4CAF50]" : "bg-[#3B3B4F]"}`}
                        />
                      </div>

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold text-[#E0E0E0] truncate">
                            {chat.userData?.name || "Unknown User"}
                          </h3>
                          <span className="text-xs text-[#B0B0C0] flex-shrink-0">
                            {chat.lastUpdated &&
                              format(chat.lastUpdated.toDate(), "h:mm a")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm truncate ${
                              chat.unread
                                ? "text-[#E0E0E0] font-medium"
                                : "text-[#B0B0C0]"
                            }`}
                          >
                            {chat.lastMessage || "No message"}
                          </p>

                          {chat.lastMessageSender === "labor" &&
                            chat.unreadCount > 0 && (
                              <span className="ml-2 flex-shrink-0 bg-[#E63946] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* Right Side - Chat Component */}
            <div className="flex-1 flex flex-col h-screen bg-[#2A2A3B] min-w-0 ">
              {selectedChatId ? (
                <ChatComponents
                  chatId={selectedChatId}
                  onMenuClick={() => dispatch(toggleMobileChatList())}
                />
              ) : (
                <div className="flex-1 flex flex-col  bg-[#1E1E2E]">
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
                    flex-1 flex items-center justify-center  p-8 transition-all  duration-300
                                             ${
                                               isMobileChatListOpen
                                                 ? "ml-90 lg:ml-0"
                                                 : "ml-0"
                                             }
                                           `}
                  >
                    <div className="text-center max-w-md mx-auto">
                      <div className="bg-[#2A2A3B] p-6 rounded-xl shadow-sm border border-[#3B3B4F]">
                        <div className="bg-[#3B3B4F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle size={32} className="text-[#B0B0C0]" />
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
        </>
      )}
    </div>
  );
}

export default UserChatPage


