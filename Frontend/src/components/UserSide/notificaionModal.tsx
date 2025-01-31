import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { Link, useLocation, useNavigate } from "react-router-dom";

const NotificationModal = ({ onClose , chats }) => {


    const location = useLocation();
    const navigate = useNavigate()
    const currentPages = location.pathname.split("/").pop();

    const handleNavigateChatPage = () => {
        if (currentPages === 'userChatPage') {
            onClose()
        }
        navigate('/userChatPage')
    }


    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return "Just now";

        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const theme = useSelector((state: RootState) => state.theme.mode);
    const unreadChats = chats.filter((chat) => chat.unreadCount > 0);
    return (
  <>
    {theme === 'light' ? (
        
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="border-t border-b py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">All</span>
            <button className="text-blue-500 hover:text-blue-700">Mark all as read</button>
          </div>
          {/* <Link to='/userChatPage'> */}
          <div className="space-y-2" onClick={handleNavigateChatPage}>
                {/* List of notifications */}
                {unreadChats.length > 0 ? (
                  unreadChats.map((chat) => (
                    <div key={chat.id} className="p-2 hover:bg-gray-100 rounded">
                      <p className="text-sm">
                        New message from {chat.userData?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chat.lastMessage} • {formatTimestamp(chat.lastUpdated)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No new notifications</p>
                )}
              </div>
              {/* </Link> */}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-[#21A391] text-white px-4 py-2 rounded hover:bg-[#229182]">
            Close
          </button>
        </div>
      </div>
    </div>
    ):(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#04968c] rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="border-t border-b py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">All</span>
            <button className="text-[#fff] hover:text-[#87c0d5]">Mark all as read</button>
          </div>
          {/* <Link to='/userChatPage'> */}
          <div className="space-y-2" onClick={handleNavigateChatPage}>
                {/* List of notifications */}
                {unreadChats.length > 0 ? (
                  unreadChats.map((chat) => (
                    <div key={chat.id} className="p-2 hover:bg-gray-100 rounded">
                      <p className="text-sm">
                        New message from {chat.userData?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chat.lastMessage} • {formatTimestamp(chat.lastUpdated)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No new notifications</p>
                )}
              </div>
              {/* </Link> */}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-[#32eae0] text-black px-4 py-2 rounded hover:bg-[#2bb5ae]">
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