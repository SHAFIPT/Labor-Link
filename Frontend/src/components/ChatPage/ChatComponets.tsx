import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Star, Smile, Paperclip, Mic, Send, Info , X, MenuIcon } from 'lucide-react';
import char from '../../assets/char1.jpeg';
import user from '../../assets/girl1.jpeg';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc , where, getDocs, documentId  } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
import { auth , db } from '../../utils/firbase';
import { useLocation, useParams } from 'react-router-dom';
import QuoteMessage from './QuoteMessage';
import { uploadToCloudinary } from "../../utils/cloudineryConfig";
import MediaPreview from './MediaPreview';
import QuoteConfirmationModal from './QuoteConfirmationModal';
import { bookTheLabor } from '../../services/UserSurvice';
import { toast } from 'react-toastify';
import './Chat.css'
import SuccessModal from './SuccessModal';
import { fetchlaborId } from '../../services/UserSurvice';
import { setBookingDetails } from '../../redux/slice/bookingSlice';
import bgImage from '../../assets/toole.avif'        
import AddressModal from './AddressModal';
import { toggleMobileChatList } from '../../redux/slice/laborSlice';
import { validateNewDate } from '../../utils/userRegisterValidators';
import { validateDate } from '../../utils/laborRegisterValidators';

interface ChatComponentProps {
  chatId?: any; // Make chatId optional
  currentPage?: any;
}

const ChatComponents: React.FC<ChatComponentProps> = ({ chatId: chatIdProp, currentPage = null }) => {
  
  console.log('hoooooooooooooo')
  const userLogin = useSelector((state: RootState) => state.user.user);
  const LaborLogin = useSelector((state: RootState) => state.labor.laborer);
  const isMobileChatListOpen = useSelector((state: RootState) => state.labor.isMobileChatListOpen);

  console.log('jjjjjjjjjjjjjjj',userLogin.email)
  console.log('kkkkkkkkkkkk',LaborLogin.email)


  // const { chatId } = useParams();
  const location = useLocation();
  const { user, chatId: chatIdState } = location.state || {}; 

  console.log('Ngttttttttttttttttt',user)
  
  const chatId = chatIdProp || chatIdState;
  // const { state: chatId } = useLocation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [selectedQuoteDetails, setSelectedQuoteDetails] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const fileInputRef = useRef(null);
  const [chatDetails, setChatDetails] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fetchedLaborId, setFetchedLaborId] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const theam = useSelector((state: RootState) => state.theme.mode);
  const [userAddress, setUserAddress] = useState({
    name: "",
    phone: "",
    district: "",
    place: "",
    address: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });
  const [currentUserData, setCurrentUserData] = useState({
    profilePicture: "",
    name: "",
    email: "",
  });

  const [participants, setParticipants] = useState({
    user: {
      profilePicture: "",
      name: "",
      email: ""
    },
    labor: {
      profilePicture: "",
      name: "",
      email: "",
    },
  });

  console.log('This si the chatIdddddddddddddd<',chatId)
  
  console.log("888888888888888",participants)
  const [quoteData, setQuoteData] = useState({
    description: "",
    estimatedCost: "",
    arrivalTime: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return;
      const chatRef = doc(db, "Chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        setChatData(chatSnap.data());
      }
    };
    fetchChatData();
  }, [chatId]);

  // console.log("This is the chatDAAAAAADDDAAAATTTTAAA",chatData?.quoteAccepted)
  console.log("This is the chatDAAAAAADDDAAAATTTTAAA", LaborLogin);

  useEffect(() => {
    const fetchLaborId = async () => {
      const laborEmail = participants.labor.email;
      if (!laborEmail) {
        console.log("Labor email is missing, skipping fetchLaborId.");
        return; // If there's no labor email, skip the fetch
      }

      try {
        const response = await fetchlaborId(laborEmail);

        if (response.status === 200) {
          const { laborId } = response.data;
          setFetchedLaborId(laborId); // Store the fetched labor ID in state
          console.log("Fetched labor ID:", laborId);
        }
      } catch (error) {
        console.error("Error fetching labor ID:", error);
      }
    };

    if (participants.labor.email) {
      fetchLaborId(); // Only call fetchLaborId if labor email is available
    }
  }, [participants.labor.email]); // Dependency array to re-run if labor email changes

  // console.log("TTTTTTTTTJIIIIIIIIIIIIIIIIIIII ussssssssserrrrrrrrrr:::", user)

  // console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',fetchedLaborId)

  const laborId = fetchedLaborId || user?.user?._id;
  const userId = userLogin?._id;

  // console.log("This is the chatId ::: ", chatId);
  // console.log("This is the laobrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr ::: ", laborId);
  // console.log("This is the userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr ::: ", userId);

  // console.log("Thsi is the labor lllllllllllllllllllllllllllllllll:", LaborLogin);
  // console.log("Thsi is the user ||||||||||||||||||||||||||||||||||:", userLogin);

  // console.log("Thsi sit eh current labor is herrrrrrrrrrrrrrrrrrrrrrrrrr::::::::::",currentUserData)
  // console.log("Thsi sie the participants ;;;;;;;;;;;;;;;", participants);

  const fetchParticipantsData = async () => {
    try {
      if (!chatDetails) {
        console.log("No chat details available");
        return;
      }

      // Debug logging
      console.log("Fetching data for:", {
        userId: chatDetails.userId,
        laborId: chatDetails.laborId,
      });

      // Fetch user data
      const userRef = collection(db, "Users");
      // First, let's log a sample document to verify the field name
      const userSample = await getDocs(userRef);
      if (!userSample.empty) {
        console.log(
          "Sample User document structure:",
          userSample.docs[0].data()
        );
      }

      // Try both "uid" and "id" fields
      const userQuery = query(
        userRef,
        where(documentId(), "==", chatDetails.userId)
      );
      const userSnapshot = await getDocs(userQuery);
      console.log("User query results:", {
        empty: userSnapshot.empty,
        count: userSnapshot.size,
      });

      // Fetch labor data
      const laborRef = collection(db, "Labors");
      // Log sample labor document
      const laborSample = await getDocs(laborRef);
      if (!laborSample.empty) {
        console.log(
          "Sample Labor document structure:",
          laborSample.docs[0].data()
        );
      }

      const laborQuery = query(
        laborRef,
        where(documentId(), "==", chatDetails.laborId)
      );
      const laborSnapshot = await getDocs(laborQuery);
      console.log("Labor query results:", {
        empty: laborSnapshot.empty,
        count: laborSnapshot.size,
      });

      // Process user data if found
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log("Found user data:", userData);
        setParticipants((prev) => ({
          ...prev,
          user: {
            profilePicture: userData.profilePicture || "",
            name: userData.name || "",
            email : userData.email || ""
          },
        }));
      } else {
        console.log("No user document found with ID:", chatDetails.userId);
      }

      // Process labor data if found
      if (!laborSnapshot.empty) {
        const laborData = laborSnapshot.docs[0].data();
        console.log("Found labor data:", laborData);
        setParticipants((prev) => ({
          ...prev,
          labor: {
            profilePicture: laborData.profilePicture || "",
            name: laborData.name || "",
            email: laborData.email,
          },
        }));
      } else {
        console.log("No labor document found with ID:", chatDetails.laborId);
      }
    } catch (error) {
      console.error("Error fetching participants data:", error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
    }
  };

  // Add cleanup to useEffect
  useEffect(() => {
    let mounted = true;

    if (chatDetails) {
      fetchParticipantsData().catch((error) => {
        if (mounted) {
          console.error("Failed to fetch participants:", error);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [chatDetails]);

  // console.log("Thsi si ethe currentUserData :::::::::::", currentUserData);
  // console.log("Thsi si ethe userLogin?.email :::::::::::", userLogin?.ProfilePic);

  // Add this useEffect to fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the email of the currently logged in user
        const email = userLogin?.email || LaborLogin?.email;

        // console.log("This is the emilof chated user................kkkkkkkkkkkkffffffffkkkkkkkkkkkkk......",email)

        if (!email) {
          console.log("No email found");
          return;
        }

        // Query Firebase for user data
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        // console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",querySnapshot.docs)

        if (!querySnapshot.empty) {
          // Get the first matching document
          const userData = querySnapshot.docs[0].data();
          setCurrentUserData({
            profilePicture: userData.profilePicture || "",
            name: userData.name || "",
            email: userData.email || "",
          });

          // console.log("This is the mmmmmmmmmmyyyyyyyyyyyyyyyyymmmmmmmmmmmmmmmmmm",setCurrentUserData)
        } else {
          console.log("No user found with this email");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userLogin?.email, LaborLogin?.email]);

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
  // Modify your handleSendMessage function to handle both text and media

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      let messageData;
      let lastMessageContent;
      const senderId = auth.currentUser.uid;

      const chatDocRef = doc(db, "Chats", chatId);
      const chatSnap = await getDoc(chatDocRef);

      if (!chatSnap) {
        console.log("Chat is not found");
        return;
      }

      const ChatData = chatSnap.data();
      const { laborId, userId } = ChatData;

      // console.log("Thsi is the Loabor id from chat lllllllllllllkkkkkkkkkkkkkkkkkkk",laborId)
      // console.log("Thsi is the User id from chat lllllllllllllkkkkkkkkkkkkkkkkkkkk", userId)

      const isLabor = senderId === laborId;
      const lastMessageSender = isLabor ? "labor" : "user";

      // const

      if (mediaFile) {
        // Handle media message
        const mediaUrl = await uploadToCloudinary(mediaFile);
        lastMessageContent = mediaFile.type.startsWith("image/")
          ? "Sent an image"
          : "Sent a video";

        messageData = {
          content: lastMessageContent,
          mediaUrl: mediaUrl,
          type: mediaFile.type.startsWith("image/") ? "image" : "video",
          senderId: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        };

        // Clean up media preview
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setMediaFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (newMessage.trim()) {
        // Handle text message
        lastMessageContent = newMessage;

        messageData = {
          content: newMessage,
          type: "text",
          senderId: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        };

        setNewMessage("");
      }

      if (messageData) {
        // Add the message to the messages subcollection
        await addDoc(collection(db, "Chats", chatId, "messages"), messageData);

        // Update the main chat document with the last message
        await updateDoc(doc(db, "Chats", chatId), {
          lastMessage: lastMessageContent,
          lastUpdated: serverTimestamp(),
          lastMessageSender,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally add error handling UI feedback here
    }
  };
  // Send quote function
  const handleSubmitQuote = async () => {
    try {

         const arrivalTimeError = validateDate(quoteData.arrivalTime);
          if (arrivalTimeError) {
            toast.error(arrivalTimeError)
            return; // Stop execution if validation fails
          }


      const quoteMessage = {
        type: "quote",
        content: {
          description: quoteData.description,
          estimatedCost: quoteData.estimatedCost,
          arrivalTime: quoteData.arrivalTime, // New field
          status: "pending",
        },
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      };

      console.log("Sending quote message:", quoteMessage);

      await addDoc(collection(db, "Chats", chatId, "messages"), quoteMessage);

      await updateDoc(doc(db, "Chats", chatId), {
        quoteSent: true,
        lastUpdated: serverTimestamp(),
      });

      setShowModal(false);
      setQuoteData({ description: "", estimatedCost: "", arrivalTime: "" });
    } catch (error) {
      console.error("Error sending quote:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuoteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAcceptQuote = (messageId, quoteDetails) => {
    // console.log("Thsi sie messageId dddddddddddddddd",messageId)
    // console.log("Thsi sie quoteDetailsssssssssssss",quoteDetails)
    setSelectedQuoteId(messageId);
    setSelectedQuoteDetails(quoteDetails);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmQuoteAcceptance = async () => {
    setAddressModalOpen(true); // Show the modal before booking
  };

  const handleAddressSubmit = async () => {
    try {
      if (
        !userAddress.district ||
        !userAddress.place ||
        !userAddress.address ||
        !userAddress.pincode
      ) {
        toast.error("Please fill all fields!");
        return;
      }

      // Update the quote status in the message
      const messageRef = doc(db, "Chats", chatId, "messages", selectedQuoteId);
      await updateDoc(messageRef, { "content.status": "accepted" });

      // Update the chat document with the accepted quote
      await updateDoc(doc(db, "Chats", chatId), {
        quoteAccepted: true,
        acceptedQuoteAmount: selectedQuoteDetails.estimatedCost,
        quoteAcceptedAt: serverTimestamp(),
      });

      console.log("Thissssssssssssiis the userAddress", userAddress);

      // Send booking request with the address details
      const response = await bookTheLabor(
        userId,
        laborId,
        selectedQuoteDetails,
        userAddress
      );

      if (response.status === 201) {
        toast.success("Booking successful!");
        dispatch(setBookingDetails(response.data.booking));
        setSuccessModal(true);
        setIsConfirmModalOpen(false);
        setAddressModalOpen(false);
      }
    } catch (error) {
      console.error("Error accepting quote:", error);
    }
  };

  const onEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native); // Append selected emoji
    setShowEmojiPicker(false); // Close picker after selection
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        setMediaFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        alert("Please select an image or video file");
      }
    }
  };

  const cancelMediaUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up the preview URL
    }
    setMediaFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // console.log("This is the selected Queet4e in chat page leeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Modal */}

      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSubmit={handleAddressSubmit}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />

      {isConfirmModalOpen && (
        <QuoteConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmQuoteAcceptance}
          quoteDetails={selectedQuoteDetails}
        />
      )}

      {successModal && (
        <SuccessModal
          successModal={successModal}
          setSuccessModal={setSuccessModal}
        />
      )}

      {showModal && (
        <>
          {theam == "light" ? (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold">Quote Details</h2>

                {/* Description Input */}
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={quoteData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter a description of the work..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Arrival Time
                  </label>
                  <input
                    type="datetime-local"
                    value={quoteData.arrivalTime}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        arrivalTime: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Estimated Cost Input */}
                <div className="mt-4">
                  <label htmlFor="estimatedCost" className="block text-sm">
                    Estimated Cost:
                  </label>
                  <input
                    type="number"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={quoteData.estimatedCost}
                    onChange={handleChange}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter the estimated cost..."
                    min="0"
                  />
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleSubmitQuote}
                  >
                    Submit Quote
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-700 p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold">Quote Details</h2>

                {/* Description Input */}
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={quoteData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full mt-2 p-2 border text-black border-gray-600 rounded-lg"
                    placeholder="Enter a description of the work..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Arrival Time
                  </label>
                  <input
                    type="datetime-local"
                    value={quoteData.arrivalTime}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        arrivalTime: e.target.value,
                      })
                    }
                    className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Estimated Cost Input */}
                <div className="mt-4">
                  <label htmlFor="estimatedCost" className="block text-sm">
                    Estimated Cost:
                  </label>
                  <input
                    type="number"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={quoteData.estimatedCost}
                    onChange={handleChange}
                    className="w-full mt-2 text-black p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter the estimated cost..."
                    min="0"
                  />
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleSubmitQuote}
                  >
                    Submit Quote
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {theam === "light" ? (
        <div className="flex flex-col h-full bg-slate-50">
          {/* Header */}
          <div className="flex items-center px-4 py-3 bg-white text-gray-900 shadow-md border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex items-center flex-1 min-w-0 ml-2">
              <div className="relative">
                <img
                  src={
                    // If current user is logged in, show labor's profile picture
                    LaborLogin?.email === participants.labor.email
                      ? // If current labor is logged in, show user's profile picture
                        participants.user.profilePicture ||
                        "/default-avatar.png"
                      : participants.labor.profilePicture ||
                        "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="ml-3 min-w-0">
                <h1 className="text-lg font-semibold text-gray-800 truncate">
                  {
                    // If current user is logged in, show labor's profile picture
                    LaborLogin?.email === participants.labor.email
                      ? // If current labor is logged in, show user's profile picture
                        participants.user.name || "/default-avatar.png"
                      : participants.labor.name || "/default-avatar.png"
                  }
                </h1>
                {Object.keys(userLogin).length === 0 && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            style={{
              background:
                "linear-gradient(to bottom, #1E1E2E, #2A2A3B, #3B3B4F)", // Dark gradient colors
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
              "&::-webkit-scrollbar": {
                // Webkit (Chrome, Safari)
                display: "none",
              },
            }}
          >
            {messages.map((message) => {
              const isCurrentUser = message.senderId === auth.currentUser?.uid;
              const isLabor = message.senderId === chatDetails?.laborId;
              const senderProfilePic = isLabor
                ? participants.labor.profilePicture
                : participants.user.profilePicture;
                 const isQuoteMessage = message.type === "quote";

              return (
                  <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[75%]`}
                  >
                    {/* Render QuoteMessage only if it's a quote */}
                    {isQuoteMessage && (
                      <QuoteMessage
                        message={message}
                        isCurrentUser={isCurrentUser}
                        formatTimestamp={formatTimestamp}
                        participants={participants}
                        onAcceptQuote={handleAcceptQuote}
                        isLabor={isLabor}
                      />
                    )}

                    {message.type !== "quote" && (
                      <>
                        <div className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                          <img
                            src={senderProfilePic || "/default-avatar.png"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full flex-shrink-0 mb-1"
                          />

                          <div
                            className={`
                              px-4 py-2 rounded-2xl shadow-sm
                              ${isCurrentUser ? "bg-[#cdffcd] rounded-tr-none" : "bg-[#b0b0f4] rounded-tl-none"}
                            `}
                          >
                            {message.type === "text" ? (
                              <p className="text-gray-800 text-sm">{message.content}</p>
                            ) : message.type === "image" ? (
                              <img src={message.mediaUrl} alt="Shared" className="rounded-lg max-w-full h-auto" />
                            ) : message.type === "video" ? (
                              <video src={message.mediaUrl} controls className="rounded-lg max-w-full" />
                            ) : null}
                          </div>
                        </div>

                        <span className="text-xs text-gray-500 mt-1 px-12">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-[#f8f9fa] p-4 shadow-lg">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>

                  <label
                    htmlFor="mediaUpload"
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </label>

                  <button
                    type="submit"
                    className="p-2 bg-[#007bff] text-white rounded-full hover:bg-[#0056b3] transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {Object.keys(userLogin).length === 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#0056b3] transition-colors text-sm font-medium"
                  >
                    Send Quote
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Info className="w-5 h-5 text-gray-700" />
                    </button>

                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 text-sm text-gray-800 bg-gray-200 rounded-lg shadow-lg">
                        Click to send a formal quote including job details,
                        estimated cost, and payment terms.
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-200 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="mediaUpload"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4">
              <Picker data={data} onEmojiSelect={onEmojiSelect} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
          <div
            className={`flex items-center px-4 py-3 shadow-md border-gray-200 
            ${
              currentPage === "laborDashBoard"
                ? "bg-gray-700 text-white"
                : "bg-[#373749] border-gray-200 "
            }`}
            >
               {/* Back Arrow Button (Only visible on screens ≥ 768px) */}
              <button 
                onClick={() => window.history.back()} 
                className="hidden md:block text-white px-2 py-1 rounded-lg"
              >
                ← Back
              </button>
            {!isMobileChatListOpen && (
              <button
                onClick={() => dispatch(toggleMobileChatList())}
                className="md:hidden p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-gray-300" />
              </button>
            )}  

            <div className="flex items-center flex-1 min-w-0 ml-2">
              <div className="relative">
                <img
                  src={
                    LaborLogin?.email === participants.labor.email
                      ? participants.user.profilePicture ||
                        "/default-avatar.png"
                      : userLogin?.email === participants.user.email
                      ? participants.labor.profilePicture ||
                        "/default-avatar.png"
                      : "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>

              <div className="ml-3 min-w-0">
                <h1 className="text-lg font-semibold text-gray-100 truncate">
                  {
                    // If current user is logged in, show labor's profile picture
                    LaborLogin?.email === participants.labor.email
                      ? // If current labor is logged in, show user's profile picture
                        participants.user.name || "/default-avatar.png"
                      : participants.labor.name || "/default-avatar.png"
                  }
                </h1>
                {Object.keys(userLogin).length === 0 && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide transition-all`}
            style={{
              background:
                currentPage === "laborDashBoard"
                  ? "linear-gradient(to bottom, #18181f, #2A2A3B, #2A2A3B)" // Custom gradient for laborDashBoard
                  : "linear-gradient(to bottom, #1E1E2E, #2A2A3B, #3B3B4F)", // Default gradient
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {messages.map((message) => {
              const isCurrentUser = message.senderId === auth.currentUser?.uid;
              const isLabor = message.senderId === chatDetails?.laborId;
              const senderProfilePic = isLabor
                ? participants.labor.profilePicture
                : participants.user.profilePicture;
              
              const isQuoteMessage = message.type === "quote";
              
          
              return (
               <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[75%]`}
                  >
                    {/* Render QuoteMessage only if it's a quote */}
                    {isQuoteMessage && (
                      <QuoteMessage
                        message={message}
                        isCurrentUser={isCurrentUser}
                        formatTimestamp={formatTimestamp}
                        participants={participants}
                        onAcceptQuote={handleAcceptQuote}
                        isLabor={isLabor}
                      />
                    )}

                    {message.type !== "quote" && (
                      <>
                        <div className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                          <img
                            src={senderProfilePic || "/default-avatar.png"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full flex-shrink-0 mb-1"
                          />

                          <div
                            className={`
                              px-4 py-2 rounded-2xl shadow-sm
                              ${isCurrentUser ? "bg-[#cdffcd] rounded-tr-none" : "bg-[#b0b0f4] rounded-tl-none"}
                            `}
                          >
                            {message.type === "text" ? (
                              <p className="text-gray-800 text-sm">{message.content}</p>
                            ) : message.type === "image" ? (
                              <img src={message.mediaUrl} alt="Shared" className="rounded-lg max-w-full h-auto" />
                            ) : message.type === "video" ? (
                              <video src={message.mediaUrl} controls className="rounded-lg max-w-full" />
                            ) : null}
                          </div>
                        </div>

                        <span className="text-xs text-gray-500 mt-1 px-12">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className={`${
              currentPage === "laborDashBoard" ? "bg-gray-700" : "bg-[#2A2A3B]"
            } p-4 shadow-lg transition-all`}
          >
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div
                className={`flex items-center gap-2 border rounded-lg p-2 
      ${
        currentPage === "laborDashBoard"
          ? "bg-gray-800 border-gray-600"
          : "bg-gray-800 border-gray-700"
      }`}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm sm:text-base md:text-lg text-white placeholder-gray-400 focus:outline-none bg-transparent w-full sm:w-64 md:w-96 lg:w-128"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-300" />
                  </button>

                  <label
                    htmlFor="mediaUpload"
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-5 h-5 text-gray-300" />
                  </label>

                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {Object.keys(userLogin).length === 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Send Quote
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Info className="w-5 h-5 text-gray-300" />
                    </button>

                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
                        Click to send a formal quote including job details,
                        estimated cost, and payment terms.
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="mediaUpload"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4">
              <Picker data={data} onEmojiSelect={onEmojiSelect} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatComponents;