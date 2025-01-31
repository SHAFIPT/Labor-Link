import React, { useEffect, useState } from 'react'
import HomeNavBar from '../HomeNavBar'
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../BreadCrumb';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import {auth, db} from '../../utils/firbase'
import { collection, doc, getCountFromServer, getDoc, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()
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

  const handleNavigateChatpage = async (chatId) => {
    await markChatAsRead(chatId);
    navigate(`/chatingPage/${chatId}`);
  };

  return (
    <div>
      <HomeNavBar />
      {theam === "light" ? (
        <>
          <nav className="py-3 px-4 sm:px-6 md:px-8">
            <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
          </nav>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12">
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            {chats.length > 0 ? (
              <div className="w-full max-w-8xl bg-slate-200 shadow-md rounded-lg">
                {currentChats
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
                      className={`flex items-center gap-6 p-6  hover:bg-slate-300  transition-colors duration-200 border-b border-slate-300 cursor-pointer ${
                        chat.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={
                            chat.userData?.profilePicture ||
                            "default-profile-picture.jpg"
                          }
                          alt={`${chat.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-semibold text-slate-800 truncate">
                            {chat.userData?.name || "Unknown User"}
                          </h3>
                          <span className="text-xs font-medium text-slate-500">
                            {chat.lastUpdated &&
                              format(chat.lastUpdated.toDate(), "h:mm a")}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            chat.unread
                              ? "text-slate-800 font-medium"
                              : "text-slate-600"
                          }`}
                        >
                          {chat.lastMessage || "No message"}
                        </p>
                      </div>
                      {chat.lastMessageSender === "labor" &&
                        chat.unreadCount > 0 && (
                          <div className="ml-4 flex items-center ">
                            <span className="bg-red-500 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-8">
                No chats available
              </p>
            )}
          </div>

          {chats.length > 0 && (
            <div className="flex justify-center gap-4 mt-6 mb-5">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <nav className="py-3 px-4 sm:px-6 md:px-8">
            <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
          </nav>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12">
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            {chats.length > 0  ? (
              <div className="w-full max-w-8xl bg-[#18a3b0] shadow-md rounded-lg">
                {currentChats
                  .slice() // Make a copy to avoid mutating state
                  .sort(
                    (a, b) =>
                      b.lastUpdated.toMillis() - a.lastUpdated.toMillis()
                  ) // Sort by latest message
                  .map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        handleNavigateChatpage(chat.id);
                        markChatAsRead(chat.id); // ✅ Mark as read on click
                      }}
                      className={`flex items-center gap-6 p-6  hover:bg-[#158590]  transition-colors duration-200 border-b border-[#357378] cursor-pointer ${
                        chat.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={
                            chat.userData?.profilePicture ||
                            "default-profile-picture.jpg"
                          }
                          alt={`${chat.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover ring-2 "
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-semibold  truncate">
                            {chat.userData?.name || "Unknown User"}
                          </h3>
                          <span className="text-xs font-medium ">
                            {chat.lastUpdated &&
                              format(chat.lastUpdated.toDate(), "h:mm a")}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            chat.unread
                            ? "text-slate-800 font-medium"
                            : "text-slate-600"
                          }`}
                        >
                          {chat.lastMessage || "No message"}
                        </p>
                      </div>
                      {chat.lastMessageSender === "labor" &&
                        chat.unreadCount > 0 && (
                          <div className="ml-4 flex items-center ">
                            <span className="bg-red-500 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-8">
                No chats available
              </p>
            )}
          </div>

          {(chats.length > 0 || chats.length > 0) && (
            <div className="flex justify-center gap-4 mt-6 mb-5">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserChatPage


