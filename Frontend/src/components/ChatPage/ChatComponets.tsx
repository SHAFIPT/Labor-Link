import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Star, Smile, Paperclip, Mic, Send, Info } from 'lucide-react';
import char from '../../assets/char1.jpeg';
import user from '../../assets/girl1.jpeg';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
import { auth , db } from '../../utils/firbase';
import { useParams } from 'react-router-dom';


const ChatComponents = () => {
    const { chatId } = useParams();
    console.log("This is the chatId ::: ",chatId)

  const userLogin = useSelector((state: RootState) => state.user.user);
  const LaborLogin = useSelector((state: RootState) => state.labor.laborer);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatDetails, setChatDetails] = useState(null);
//   const [laborData , setLaborData] = useState('')
  const messagesEndRef = useRef(null);

  console.log("Thsi sie userLogin : ", userLogin.ProfilePic);
    console.log("Thsi sie LaborLogin : ", LaborLogin);
    // setLaborData(La)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat details and messages
  useEffect(() => {
    if (!chatId) return;

    // Get chat details
    const fetchChatDetails = async () => {
      const chatDoc = await getDoc(doc(db, "Chats", chatId));
      if (chatDoc.exists()) {
        setChatDetails(chatDoc.data());
      }
    };

    // Listen to messages in real-time
    const messagesRef = collection(db, "Chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
      scrollToBottom();
    });

    fetchChatDetails();
    return () => unsubscribe();
  }, [chatId, db]);
    
    

  // Send message function
  const handleSendMessage = async (e) => {
  e.preventDefault();
  
  // Add validation checks
  if (!chatId) {
    console.error("Chat ID is missing");
    return;
  }
  
  if (!newMessage.trim()) {
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is signed in");
    return;
  }

  try {
    // Create message data
    const messageData = {
      content: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
      type: "text",
      mediaType: "",
      mediaUrl: "",
    };

    // Create references
    const chatRef = doc(db, "Chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    // Add the message
    await addDoc(messagesRef, messageData);

    // Update the chat document
    await updateDoc(chatRef, {
      lastMessage: newMessage,
      lastUpdated: serverTimestamp(),
    });

    setNewMessage("");
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
};

  // Send quote function
  const handleSendQuote = async () => {
    if (!LaborLogin) return;

    try {
      const quoteData = {
        type: "quote",
        content: {
          description: "",
          estimatedCost: 0,
          status: "pending",
        },
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "Chats", chatId, "messages"), quoteData);
      await updateDoc(doc(db, "Chats", chatId), {
        quoteSent: true,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending quote:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };



  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-2 sm:p-4 bg-[#21a391] text-white">
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-4 cursor-pointer" />
        <div className="flex items-center flex-1">
          <img
            src={
              userLogin.profilePic
                ? userLogin?.ProfilePic
                : LaborLogin?.profilePicture
            }
            alt="Labor Profile"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-4"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold truncate">
              {userLogin?.firstName && userLogin?.lastName
                ? `${userLogin.firstName} ${userLogin.lastName}`
                : `${LaborLogin?.firstName} ${LaborLogin?.lastName}`}
            </h1>
            {!userLogin && (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-grow p-2 sm:p-4 overflow-y-auto space-y-4 sm:space-y-6">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === auth.currentUser?.uid;

          if (message.type === "quote") {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-yellow-100 p-4 rounded-lg max-w-sm">
                  <p className="font-semibold">Quote Details</p>
                  <p>Status: {message.content.status}</p>
                  <p>Cost: ${message.content.estimatedCost}</p>
                  {message.content.description && (
                    <p>Description: {message.content.description}</p>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex items-start space-x-2 sm:space-x-4 ${
                isCurrentUser ? "justify-end space-x-reverse" : ""
              }`}
            >
              {/* Profile Picture - Receiver side */}
              {!isCurrentUser && (
                <img
                  src={
                    userLogin.profilePic
                      ? userLogin?.ProfilePic
                      : LaborLogin?.profilePicture
                  }
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                />
              )}

              {/* Time stamp - Left side for receiver, Right side for sender */}
              {isCurrentUser && (
                <span className="text-xs sm:text-sm text-gray-500 self-end whitespace-nowrap">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}

              {/* Message content */}
              <div
                className={`p-2 sm:p-3 rounded-lg max-w-[75%] sm:max-w-xs md:max-w-md ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <p className="text-sm sm:text-base">{message.content}</p>
              </div>

              {/* Time stamp - Right side for receiver, Left side for sender */}
              {!isCurrentUser && (
                <span className="text-xs sm:text-sm text-gray-500 self-end whitespace-nowrap">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}

              {/* Profile Picture - Sender side */}
              {isCurrentUser && (
                <img
                  src={userLogin?.ProfilePic || LaborLogin?.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-2 sm:p-4 bg-white border-t border-gray-300">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2 sm:space-x-4"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type here..."
            className="flex-grow p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer" />
            <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer" />
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer hidden sm:block" />
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
        {Object.keys(userLogin).length === 0 && (
          <div className="flex items-center mt-2 sm:mt-4 relative">
            <button
              className="w-[140px] sm:w-[174px] p-2 sm:p-3 text-sm sm:text-base bg-[#21a391] text-white rounded-lg hover:bg-green-600"
              onClick={handleSendQuote}
            >
              Send Quote
            </button>
            <div className="relative ml-2">
              <Info
                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 sm:w-72 p-2 text-xs sm:text-sm text-white bg-gray-800 rounded-lg shadow-lg z-50">
                  Click this button to send a formal quote to the user,
                  including job details, estimated cost, and payment terms.
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponents;