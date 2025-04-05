import { Link,  useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import Handman from '../assets/Icons/Handiman.png'
import Electriion from '../assets/Icons/Electriion.png'
import Carpender from '../assets/Icons/Carpender.png'
import Ac from '../assets/Icons/Ac.png'
import Roofing from '../assets/Icons/Roofing.png'
import pipe from '../assets/Icons/pipe.png'
import repair from '../assets/Icons/repair.png'
import HomeCleaning from '../assets/Icons/HomeCleaning.png'
import Landscaling from '../assets/Icons/Landscaling.png'
import Guttor from '../assets/Icons/Guttor.png'
import { toast } from "react-toastify"
import './Auth/userLogin.css'
import './userHomeNave.css'
import './Auth/LoadingBody.css'
import image from '../assets/new1.png'
import dark from '../assets/LabourLinkDark.png'
import { persistor } from '../redux/store/store';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { toggleTheme } from "../redux/slice/themeSlice";
import { setisUserAthenticated, setUser, resetUser,setFormData, setLoading, setAccessToken } from '../redux/slice/userSlice'
import { logout } from "../services/UserAuthServices";
import { resetLaborer, setIsLaborAuthenticated, setLaborer } from "../redux/slice/laborSlice";
import LocationPrompt from "./LocationUser/LocationPrompt";
import NotificaionModal, { ChatNotification } from "./UserSide/notificaionModal";
import { auth, db } from "../utils/firbase";
import { collection, doc, getCountFromServer, getDoc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Bell } from "lucide-react";
import Button from "./ui/button";
import { HttpStatus } from "../enums/HttpStaus";
import { Messages } from "../constants/Messages";

interface ChatDocument {
  laborId: string;
  userId: string;
  lastMessage: string;
  lastUpdated: Timestamp;
  quoteSent: boolean;
  messagesCount: number;
  lastReadTimestamp: Timestamp;
  lastMessageSender : string
}

interface UserData {
  name?: string;
  email?: string;
  profilePicture? : string
}

interface Reschedule {
  rejectedBy?: "user" | "labor" | null;
  requestSentBy?: "user" | "labor" | null;
  acceptedBy?: "user" | "labor" | null;
  rejectionNewDate?: string;
  rejectionNewTime?: string;
  rejectionReason?: string;
  newTime?: string;
  newDate?: string;
  reasonForReschedule?: string;
}

interface Chat extends ChatDocument {
  id: string;
  userData?: UserData | null;
  unreadCount: number;
}



const HomeNavBar = () => {
  const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
  const loading = useSelector((state: RootState) => state.user.loading)
  const bookingDetails = useSelector((state: RootState) => state.booking?.bookingDetails || []);
  const [isScrolled, setIsScrolled] = useState(false);
  const locationOfUser = useSelector((state: RootState) => state.user.locationOfUser);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [notificaionOn, setNotificaionOn] = useState(false)
  const [chats, setChats] = useState<Chat[]>([]);
  const hasUnreadMessages = chats.some((chat) => chat.unreadCount > 0);
  const [isMenuOn , setIsMenuOn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   const handleLaborList = () => {
    if (locationOfUser.latitude === null || locationOfUser.longitude === null) {
      setShowLocationModal(true); 
    } else {
      dispatch(setLoading(false));
      navigate('/laborListing');
    }
};

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isOpen, setIsOpen] = useState(false);

    const toggleDarkMode = () => {
      dispatch(toggleTheme());
  };
  
   const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleViewProfile = () => {
    if (isUserAthenticated) {
      navigate('/userProfilePage')
    } else {
      navigate('/login')
    }
  }

 
  const shouldShowUserName = isUserAthenticated 

  const primaryServices = [
    { name: "HandyPerson", icon: Handman, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "Plumbing", icon: pipe, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Electrician", icon: Electriion, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "Roofing", icon: Roofing, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" }
  ];

  const secondaryServices = [
    { name: "Cleaning", icon: HomeCleaning, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Carpender", icon: Carpender, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Appliance Repair", icon: repair, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "HVAC", icon: Ac, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Landscaping", icon: Landscaling, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Guttor Service", icon: Guttor, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" }
  ];


  const fetchChats = (userUids: string) => {
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
        const chatListenerUnsubscribe = fetchChats(user.uid); 
        return () => chatListenerUnsubscribe && chatListenerUnsubscribe(); 
      } else {
        setChats([]);
        // toast.error("Please sign in to view chats");
      }
    });

    return () => unsubscribe();
  }, []);
  
   
  const handleLogout = useCallback(async () => {
    try {
      const response = await logout();
      
      if (response?.status === HttpStatus.OK) {
        // Clear all auth-related data
        localStorage.removeItem('UserAccessToken');
        localStorage.removeItem('LaborAccessToken');
        
        // Reset User State
        dispatch(setUser({}));
        dispatch(setFormData({}));
        dispatch(resetUser())
        dispatch(setisUserAthenticated(false));
        dispatch(setAccessToken(''));
        
        // Reset Labor State
        dispatch(setLaborer({}));
        dispatch(resetLaborer())
        dispatch(setIsLaborAuthenticated(false));
        
        // Clear persisted state
        await persistor.purge();
        
        toast.success(Messages.LOGOUT_SUCCESSFUL);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  }, [dispatch, navigate]);

  const hasRejectionDetails = (reschedule: Reschedule) => {
    const hasRejection = 
      reschedule.rejectedBy === "labor" &&
      reschedule.rejectionNewDate &&
      reschedule.rejectionNewTime &&
      reschedule.rejectionReason;

    const hasRequest = 
      reschedule.requestSentBy === "labor" &&
      reschedule.newDate &&
      reschedule.newTime &&
      reschedule.reasonForReschedule;

    return hasRejection || hasRequest;
  };

  const handlenotificaiotn = (e: React.FormEvent) => {
    e.stopPropagation(); 
  setNotificaionOn(true);
  }
  

  return (
    <div>
      {showLocationModal && (
        <LocationPrompt setShowLocationModal={setShowLocationModal} />
      )}

      {loading && <div className="loader"></div>}
      <div className="w-full flex justify-between ">
        <Link to={"/"}>
          <div className="loginNavbarlogo cursor-pointer">
            {theme === "dark" ? (
              <img src={dark} alt="" className="w-24 sm:w-24 md:w-28 lg:w-32 ml-8 sm:ml-12 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-9"/>
            ) : (
              <img src={image} alt=""  className="w-24 sm:w-24 md:w-28 lg:w-32 ml-8 sm:ml-12 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-9" />
            )}
          </div>
        </Link>

          <div className="rightSide flex items-center p-5 space-x-4 md:space-x-6 md:p-4 lg:space-x-16 lg:p-16 ">
            <div className="lg:block hidden">
              <div className="searchBox h-[23px] lg:h-[50px] lg:w-[630px] flex items-center border shadow-lg rounded-xl px-4 transition-all group ">
                <input
                  type="search"
                  name="search"
                  className="flex-1 h-full px-4 bg-transparent outline-none"
                  placeholder="Search..."
                />
                <svg
                  className="w-6 h-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
            </div>

          {!isMenuOn && (
            <div
              className={`rightDarkLighMode relative z-[60] md:z-0   ${
                theme === "dark"
                  ? "bg-darkBg text-darkText"
                  : "bg-lightBg text-lightText"
              } absolute top-0 right-4 md:right-6`}
            >
              <label className="toggle" htmlFor="switch" onClick={toggleDarkMode}>
                <input
                  id="switch"
                  className="input"
                  type="checkbox"
                  checked={theme === "dark"} // Check if the theme is dark
                  onChange={toggleDarkMode}
                />
                {theme === "dark" ? (
                  <div className="icon icon--sun">
                    {/* Sun Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 47.5 47.5"
                      className="w-[20px] h-[20px]"
                    >
                      <g fill="#ffac33" transform="matrix(1.25 0 0 -1.25 0 47.5)">
                        <path d="M17 35s0 2 2 2 2-2 2-2v-2s0-2-2-2-2 2-2 2v2zM35 21s2 0 2-2-2-2-2-2h-2s-2 0-2 2 2 2 2 2h2zM5 21s2 0 2-2-2-2-2-2H3s-2 0-2 2 2 2 2 2h2zM10.121 29.706s1.414-1.414 0-2.828-2.828 0-2.828 0l-1.415 1.414s-1.414 1.414 0 2.829c1.415 1.414 2.829 0 2.829 0l1.414-1.415ZM31.121 8.707s1.414-1.414 0-2.828-2.828 0-2.828 0l-1.414 1.414s-1.414 1.414 0 2.828 2.828 0 2.828 0l1.414-1.414ZM30.708 26.879s-1.414-1.414-2.828 0 0 2.828 0 2.828l1.414 1.414s1.414 1.414 2.828 0 0-2.828 0-2.828l-1.414-1.414ZM9.708 5.879s-1.414-1.414-2.828 0 0 2.828 0 2.828l1.414 1.414s1.414 1.414 2.828 0 0-2.828 0-2.828L9.708 5.879ZM17 5s0 2 2 2 2-2 2-2V3s0-2-2-2-2 2-2 2v2zM29 19c0 5.523-4.478 10-10 10-5.523 0-10-4.477-10-10 0-5.522 4.477-10 10-10 5.522 0 10 4.478 10 10"></path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="icon icon--moon">
                    {/* Moon Icon */}
                    <svg
                      height="32"
                      width="32"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[20px] h-[20px]"
                    >
                      <path
                        clipRule="evenodd"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                )}
              </label>
            </div>
            )}

            <Button onClick={handleLaborList}>Browse all labours</Button>

            {/* Navigation Container */}
            <div className="">
            {/* Menu Toggle Button for Mobile */}
               <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen 
            ? 'bg-transparent' 
            : isScrolled 
              ? theme === 'dark' 
                ? 'bg-gray-900 shadow-md' 
                : 'bg-white shadow-md'
              : 'bg-transparent'
        } lg:hidden`}
      >

                  <div className="p-4 flex justify-end ">
                    <button
                       onClick={() => {
                        toggleMenu(); // Toggle menu
                        setIsMenuOn(!isOpen); // Set isMenuOn based on new menu state 
                      }}
                      className="p-2 focus:outline-none transition-colors duration-300 gap-3"
                      aria-label="Toggle menu"
                      aria-expanded={isOpen}
                    >
                      <i
                        className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl ${
                          theme === 'dark' ? 'text-gray-300' : 'text-black'
                        }`}
                      />
                    </button>
                  </div>
                </div>

        {/* Overlay Menu for Mobile */}
        <div
          className={`fixed inset-0 h-screen  bg-black bg-opacity-50 transform transition-all duration-500 ease-in-out z-40 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
           onClick={() => {
            toggleMenu();
            setIsMenuOn(false); 
          }} 
        >
          <div
            className={`fixed inset-x-0 top-0 h-[54vh] bg-gradient-to-b from-teal-900 to-teal-800 
                        transform transition-all duration-500 ease-in-out z-40
                        ${isOpen ? 'translate-y-0' : '-translate-y-full'} 
                        shadow-2xl`}
          >
            <nav className="container mx-auto px-4 h-full flex flex-col items-center justify-center space-y-1 relative">
              {/* Notification Icon */}
              <div className="absolute bottom-0 left-8" onClick={handlenotificaiotn }>
                <button className="relative group">
                  <Bell className="w-6 h-6 text-white transition-colors duration-200 group-hover:text-teal-300" />
                  
                  {/* Dynamic notification indicators - mirroring desktop logic */}
                  {(
                    ((bookingDetails || []).length > 0 && (
                      (bookingDetails[0]?.additionalChargeRequest?.status === "pending" &&
                        bookingDetails[0]?.additionalChargeRequest?.amount > 0 &&
                        bookingDetails[0]?.additionalChargeRequest?.reason) ||
                      (bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
                        bookingDetails[0]?.reschedule?.rejectedBy === "user") ||
                      (bookingDetails[0]?.reschedule &&
                        hasRejectionDetails(bookingDetails[0]?.reschedule)) ||
                      (bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
                        bookingDetails[0]?.reschedule?.acceptedBy === null &&
                        bookingDetails[0]?.reschedule?.rejectedBy === null) ||
                      (bookingDetails[0]?.status === "canceled" &&
                        bookingDetails[0].cancellation?.canceledBy === "labor" &&
                        !bookingDetails[0].cancellation?.isUserRead &&
                        isUserAthenticated)
                    )) ||
                    (hasUnreadMessages && isUserAthenticated)
                  ) && (
                    <div className="absolute -top-1 -right-1">
                      <div className="relative">
                        {/* Static Red Dot */}
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"></div>
                        
                        {/* Pulsating Glow Effect */}
                        <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75"></div>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col items-center space-y-8 w-full max-w-md pt-[50px]">
                <button
                  className="w-full py-3 px-6 text-white text-xl font-medium tracking-wide rounded-lg 
                            bg-teal-700/30 hover:bg-teal-700/50 transition-all duration-200 
                            transform hover:scale-105 hover:shadow-lg
                            flex items-center justify-center space-x-2"
                  onClick={handleLaborList}
                >
                  <span>Browse all Labors</span>
                </button>

                <button
                  className="w-full py-3 px-6 text-white text-xl font-medium tracking-wide rounded-lg 
                            bg-teal-700/30 hover:bg-teal-700/50 transition-all duration-200 
                            transform hover:scale-105 hover:shadow-lg
                            flex items-center justify-center space-x-2"
                  onClick={handleViewProfile}
                >
                  <span>View Profile Page</span>
                </button>

                {shouldShowUserName ? (
                  <button
                    className="group flex items-center justify-center w-full max-w-xs h-12 
                              bg-gradient-to-r from-red-600 to-red-700 rounded-lg 
                              hover:from-red-700 hover:to-red-800
                              transition-all duration-300 transform hover:scale-105
                              shadow-lg hover:shadow-xl "
                    onClick={handleLogout}
                  >
                    <div className="flex items-center justify-center space-x-3 px-4">
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                      </svg>
                      <span className="text-white text-lg font-semibold">Logout</span>
                    </div>
                  </button>
                ):(
                    <Link to='/login'
                    className="group flex items-center justify-center w-full max-w-xs h-12 
                              bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg 
                              hover:from-blue-700 hover:to-blue-800
                              transition-all duration-300 transform hover:scale-105
                              shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-3 px-4">
                      <span className="text-white text-lg font-semibold">Login</span>
                    </div>
                  </Link>
                )}
                  </div>
            </nav>
          </div>
          </div>
          
            {notificaionOn && (
              <NotificaionModal
                onClose={() => setNotificaionOn(false)}
                chats={(chats || []).filter(chat => chat.userData !== null) as ChatNotification[]} 
                bookingDetails={bookingDetails || []}
              />
            )}

            {shouldShowUserName && (  
              <div className="di" onClick={() => setNotificaionOn(true)}>
                <div className="relative cursor-pointer hidden md:block lg:block">
                  {/* Notification Bell Icon */}
                  <i className="fas fa-bell text-2xl"></i>

                  {(bookingDetails || []).length > 0 && 
                    bookingDetails[0]?.additionalChargeRequest?.status ===
                      "pending" &&
                    bookingDetails[0]?.additionalChargeRequest?.amount > 0 &&
                    bookingDetails[0]?.additionalChargeRequest?.reason && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )}

                  {(bookingDetails || []).length > 0 && 
                    bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
                    bookingDetails[0]?.reschedule?.rejectedBy === "user" && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )}

                  {(bookingDetails || []).length > 0 && 
                    bookingDetails[0]?.reschedule &&
                    hasRejectionDetails(bookingDetails[0]?.reschedule) && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )}

                  {(bookingDetails || []).length > 0 && 
                    bookingDetails[0]?.reschedule?.requestSentBy === "user" &&
                    bookingDetails[0]?.reschedule?.acceptedBy === null &&
                    bookingDetails[0]?.reschedule?.rejectedBy === null && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )}

                  {bookingDetails?.length &&
                    bookingDetails[0]?.status === "canceled" &&
                    bookingDetails[0].cancellation?.canceledBy === "labor" &&
                    !bookingDetails[0].cancellation?.isUserRead &&
                    isUserAthenticated && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )}

                  {/* Glowing Red Notification Indicator */}
                  {hasUnreadMessages && isUserAthenticated && (
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        {/* Static Red Dot */}
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                        {/* Pulsating Glow Effect */}
                        <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* </>
            )} */}
          </div>
        </div>
        {shouldShowUserName ? (
          <>
            <div className=" relative userImage flex items-center lg:mr-9 mt-4 cursor-pointer group">
              {/* User Icon */}
              <i className="fa fa-user w-12 h-12 text-[28px] hidden md:block lg:block"></i>

              {/* Dropdown */}
              <div className="absolute top-[90px] right-0 w-[130px] hidden flex-col bg-white shadow-md rounded-md p-2 border border-gray-200 group-hover:flex">
                <button
                  className="text-gray-700 hover:text-blue-500 text-sm px-4 py-2 text-left"
                  onClick={handleViewProfile}
                >
                  View Profile
                </button>
                {/* <button className="text-gray-700 hover:text-blue-500 text-sm px-4 py-2 text-left" onClick={handleViewChats}>
                  My Chats
                </button> */}
                <button
                  className="text-gray-700 hover:text-blue-500 text-sm px-4 py-2 text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            {/* </Link> */}
          </>
        ) : (
          <button className="ButtonLogin hidden lg:block md:block sm:block lg:pr-14 md:pr-6 sm:pr-7 pr-5">
            <Link to={"/login"}>login</Link>
          </button>
        )}
      </div>
      {/* Divider Line */}
      <div className="w-full flex justify-center mt-4 sm:mt-5 md:mt-6 lg:mt-1">
        <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] h-[2px] bg-[#ECECEC]" />
      </div>

      <div className="px-2 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-5 md:mt-6 lg:mt-1 mb-5">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 md:gap-4 lg:gap-1">
          {/* Primary Services - Always Visible */}
          {theme === "dark" ? (
            <>
              <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="546.000000pt"
                    height="457.000000pt"
                    viewBox="0 0 546.000000 457.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                  >
                    <g
                      transform="translate(0.000000,457.000000) scale(0.100000,-0.100000)"
                      fill="#57e5d0"
                      stroke="none"
                    >
                      <path
                        d="M2395 4199 c-48 -15 -124 -76 -156 -127 -48 -76 -59 -129 -59 -289
                l0 -143 -600 0 c-574 0 -601 -1 -653 -20 -63 -24 -122 -79 -163 -152 l-29 -53
                -3 -448 -3 -447 2016 2 2017 3 -2 426 c0 235 -4 440 -9 456 -28 97 -102 181
                -187 213 -53 19 -75 20 -654 20 l-598 0 -4 163 c-3 161 -3 163 -36 229 -35 72
                -91 128 -157 159 -37 17 -68 19 -365 18 -179 0 -338 -5 -355 -10z m713 -27
                c66 -35 119 -88 149 -150 26 -54 28 -66 31 -219 l4 -163 -547 0 -547 0 4 163
                c3 138 7 169 25 208 40 90 125 161 213 180 19 4 168 7 330 6 287 -2 296 -3
                338 -25z"
                      />
                      <path
                        d="M1737 2290 c-290 -35 -552 -249 -679 -555 l-33 -80 0 -330 c0 -314 1
                -333 22 -387 38 -103 114 -176 204 -198 31 -7 484 -10 1514 -8 1440 3 1471 3
                1510 23 64 31 129 103 155 171 l22 59 -1 655 -1 655 -597 0 -598 0 -6 -96 c-5
                -99 -14 -124 -63 -177 -11 -13 -38 -33 -58 -43 -34 -18 -62 -19 -380 -19 -383
                0 -394 2 -452 71 -40 48 -49 73 -55 174 l-6 90 -215 1 c-118 1 -245 -2 -283
                -6z"
                      />
                    </g>
                  </svg>
                </div>
                <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                  HandyPerson
                </p>
              </div>

              {/* NEXT */}

              <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="356.000000pt"
                    height="351.000000pt"
                    viewBox="0 0 356.000000 351.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                  >
                    <g
                      transform="translate(0.000000,351.000000) scale(0.100000,-0.100000)"
                      fill="#57e5d0"
                      stroke="none"
                    >
                      <path
                        d="M860 2888 c-96 -66 -92 -197 9 -265 65 -44 167 -19 211 52 15 24 28
                34 39 31 9 -2 31 -8 50 -11 38 -8 105 -64 129 -109 13 -25 18 -73 22 -236 6
                -189 9 -211 34 -285 55 -160 179 -311 314 -383 57 -30 66 -32 168 -32 204 0
                224 -18 224 -202 l0 -118 316 0 316 0 -4 178 c-4 158 -7 185 -31 257 -39 117
                -91 199 -187 296 -71 71 -102 94 -181 133 -155 77 -164 78 -513 83 l-308 5 4
                131 c3 109 8 139 25 172 33 64 89 105 159 118 28 5 35 1 64 -35 53 -65 126
                -85 197 -52 106 51 113 212 11 274 -65 39 -177 18 -208 -39 -10 -20 -18 -21
                -319 -21 l-308 0 -24 26 c-36 38 -72 54 -127 54 -34 0 -59 -7 -82 -22z"
                      />
                      <path
                        d="M680 1960 l0 -531 208 3 c235 3 257 10 300 84 22 39 22 40 20 456 -3
                403 -4 417 -24 444 -50 68 -55 69 -290 72 l-214 3 0 -531z"
                      />
                    </g>
                  </svg>
                </div>
                <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                  Plumbing
                </p>
              </div>

              {/* NEXT */}

              <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="500.000000pt"
                    height="499.000000pt"
                    viewBox="0 0 500.000000 499.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                  >
                    <g
                      transform="translate(0.000000,499.000000) scale(0.100000,-0.100000)"
                      fill="#57e5d0"
                      stroke="none"
                    >
                      <path
                        d="M2345 4269 c-689 -37 -1292 -437 -1444 -958 -123 -423 46 -858 451
                  -1161 137 -103 339 -206 501 -256 l57 -18 0 -252 0 -251 41 -7 c85 -14 170
                  -80 184 -145 l7 -31 339 0 339 0 0 40 c0 23 7 55 16 71 17 33 81 68 126 69 39
                  0 78 20 79 42 1 10 3 23 4 28 1 6 3 106 4 223 l1 212 85 29 c389 132 704 390
                  856 700 285 586 -44 1240 -771 1532 -260 105 -556 150 -875 133z m266 -756
                  c-23 -170 -41 -315 -41 -321 0 -9 75 -12 291 -12 271 0 290 -1 287 -17 -3 -20
                  -917 -917 -925 -909 -1 1 33 139 77 306 43 168 80 314 82 325 3 20 -4 20 -286
                  25 -185 3 -291 9 -293 15 -3 9 187 216 657 715 70 74 140 150 156 169 15 19
                  30 29 32 23 1 -5 -15 -149 -37 -319z"
                      />
                      <path
                        d="M2130 987 c0 -13 12 -47 26 -76 76 -152 332 -214 512 -123 85 42 162
                  142 162 211 0 8 -96 11 -350 11 l-350 0 0 -23z"
                      />
                    </g>
                  </svg>
                </div>
                <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                  Electrician
                </p>
              </div>

              {/* nEXT */}
              {/* <div className="hidden lg:block md:block sm:hidden"></div> */}
              <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="551.000000pt"
                    height="453.000000pt"
                    viewBox="0 0 551.000000 453.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                  >
                    <g
                      transform="translate(0.000000,453.000000) scale(0.100000,-0.100000)"
                      fill="#57e5d0"
                      stroke="none"
                    >
                      <path
                        d="M1785 3473 c-48 -82 -234 -393 -413 -693 -178 -300 -327 -548 -329
                -552 -2 -4 -4 -303 -3 -664 0 -629 1 -657 20 -694 26 -51 91 -105 159 -132
                l56 -23 1545 0 c1510 0 1546 0 1610 20 52 16 76 30 121 75 48 46 59 63 68 108
                7 35 11 258 11 672 l0 620 -952 0 -953 0 -40 68 c-216 367 -801 1342 -806
                1342 -3 0 -45 -66 -94 -147z"
                      />
                    </g>
                  </svg>
                </div>
                <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                  Roofing
                </p>
              </div>

              {/* nEXT  */}

              <div className="hidden lg:block md:block sm:hidden">
                <div className=" flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 sm">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="508.000000pt"
                      height="491.000000pt"
                      viewBox="0 0 508.000000 491.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7  sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,491.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M1510 3930 c0 -17 -7 -20 -42 -20 -49 0 -124 -33 -139 -61 -29 -55
                39 -118 128 -119 52 0 52 0 71 -43 25 -57 60 -84 170 -132 50 -22 92 -44 92
                -48 0 -24 -227 -97 -301 -97 -64 0 -69 -5 -69 -76 l0 -64 38 0 c124 0 340 61
                448 126 55 33 61 35 101 25 27 -7 239 -11 597 -11 l556 0 0 183 c0 156 -3 188
                -19 223 -22 49 -70 88 -141 115 -48 18 -84 19 -770 19 -713 0 -720 0 -720 -20z"
                        />
                        <path
                          d="M2118 3164 c-4 -128 4 -112 -173 -359 -62 -88 -141 -200 -174 -248
                l-61 -88 0 -114 0 -115 433 -2 432 -3 0 -275 0 -275 -432 -3 -433 -2 0 -158
                c0 -153 1 -159 26 -198 31 -49 72 -77 144 -101 51 -17 101 -18 650 -18 547 0
                599 1 649 18 74 25 124 60 149 106 22 38 22 43 22 587 0 542 0 549 -21 584
                -12 19 -60 89 -107 155 -203 285 -256 362 -269 392 -8 20 -13 70 -13 128 l0
                95 -85 0 -85 0 0 -101 0 -100 -32 24 c-129 97 -312 158 -520 173 l-96 7 -4
                -109z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2  text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    Cleaning
                  </p>
                </div>
              </div>

              {/* nEXT  */}
              <div className="hidden lg:block md:block sm:hidden">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="515.000000pt"
                      height="484.000000pt"
                      viewBox="0 0 515.000000 484.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,484.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M1365 4091 c-81 -14 -150 -71 -166 -137 -6 -24 -9 -540 -7 -1319 l2
                -1280 -107 -3 -107 -3 0 -84 0 -85 1515 0 1515 0 0 85 0 84 -107 3 -108 3 -2
                1275 c-2 701 -3 1292 -3 1312 0 45 -42 98 -104 131 l-41 22 -1120 1 c-616 1
                -1138 -1 -1160 -5z m2215 -1451 l0 -1290 -1085 0 -1085 0 0 1283 c0 706 3
                1287 7 1290 3 4 492 7 1085 7 l1078 0 0 -1290z"
                        />
                        <path
                          d="M1630 3330 l0 -430 865 0 865 0 0 430 0 430 -865 0 -865 0 0 -430z
                m695 134 c43 -57 134 -103 250 -129 27 -6 23 -9 -46 -29 -133 -39 -199 -90
                -245 -191 -19 -42 -23 -47 -30 -30 -34 94 -64 133 -132 172 -25 15 -80 37
                -121 49 -69 20 -73 23 -46 29 81 18 140 41 180 69 53 38 79 70 107 133 l21 48
                19 -45 c11 -24 30 -59 43 -76z"
                        />
                        <path
                          d="M1630 2125 l0 -605 865 0 865 0 0 605 0 605 -865 0 -865 0 0 -605z
                m1113 371 c53 -167 227 -305 439 -347 94 -18 99 -19 94 -28 -3 -5 -29 -11 -58
                -15 -223 -30 -419 -175 -475 -353 -9 -29 -22 -53 -28 -53 -6 0 -16 19 -22 43
                -31 114 -134 232 -255 291 -71 35 -208 76 -254 76 -39 0 -37 19 3 25 255 44
                442 175 499 348 28 87 34 88 57 13z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    Carpender
                  </p>
                </div>
              </div>

              {/* mEXT  */}
              <div className="hidden lg:block md:block sm:hidden">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="447.000000pt"
                      height="443.000000pt"
                      viewBox="0 0 447.000000 443.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,443.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M1179 3586 c-58 -21 -96 -53 -121 -104 l-23 -47 -3 -1322 -2 -1323
                495 0 495 0 0 610 c0 692 -5 649 83 738 l51 52 74 0 73 0 -3 623 -3 623 -26
                49 c-18 35 -39 59 -74 80 l-48 30 -466 2 c-364 2 -474 0 -502 -11z m979 -798
                l2 -248 -70 0 -70 0 0 250 0 251 68 -3 67 -3 3 -247z"
                        />
                        <path
                          d="M2326 1679 l-26 -20 0 -273 c0 -230 2 -275 16 -294 l15 -22 388 0
                c363 0 389 1 404 18 15 16 17 52 17 295 0 271 0 277 -22 297 -21 19 -33 20
                -394 20 -361 0 -372 -1 -398 -21z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    Appliance Repair
                  </p>
                </div>
              </div>
              {/* nEXT  */}
              <div className="hidden lg:block md:block sm:hidden">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="544.000000pt"
                      height="459.000000pt"
                      viewBox="0 0 544.000000 459.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,459.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M1267 3399 c-90 -21 -165 -83 -192 -158 -12 -34 -15 -92 -15 -276 l0
                  -233 43 -59 c87 -118 224 -218 374 -272 121 -45 226 -61 389 -61 l144 0 0 68
                  c0 78 21 121 72 149 31 17 78 18 663 21 l630 2 45 -22 c65 -33 90 -76 90 -154
                  l0 -64 440 0 440 0 0 438 0 438 -25 51 c-26 52 -67 87 -140 120 -38 17 -118
                  18 -1480 20 -820 0 -1456 -3 -1478 -8z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    HVAC
                  </p>
                </div>
              </div>
              {/* nEXT */}
              <div className="hidden lg:block md:block sm:hidden">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="546.000000pt"
                      height="457.000000pt"
                      viewBox="0 0 546.000000 457.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,457.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M2395 4199 c-48 -15 -124 -76 -156 -127 -48 -76 -59 -129 -59 -289
                l0 -143 -600 0 c-574 0 -601 -1 -653 -20 -63 -24 -122 -79 -163 -152 l-29 -53
                -3 -448 -3 -447 2016 2 2017 3 -2 426 c0 235 -4 440 -9 456 -28 97 -102 181
                -187 213 -53 19 -75 20 -654 20 l-598 0 -4 163 c-3 161 -3 163 -36 229 -35 72
                -91 128 -157 159 -37 17 -68 19 -365 18 -179 0 -338 -5 -355 -10z m713 -27
                c66 -35 119 -88 149 -150 26 -54 28 -66 31 -219 l4 -163 -547 0 -547 0 4 163
                c3 138 7 169 25 208 40 90 125 161 213 180 19 4 168 7 330 6 287 -2 296 -3
                338 -25z"
                        />
                        <path
                          d="M1737 2290 c-290 -35 -552 -249 -679 -555 l-33 -80 0 -330 c0 -314 1
                -333 22 -387 38 -103 114 -176 204 -198 31 -7 484 -10 1514 -8 1440 3 1471 3
                1510 23 64 31 129 103 155 171 l22 59 -1 655 -1 655 -597 0 -598 0 -6 -96 c-5
                -99 -14 -124 -63 -177 -11 -13 -38 -33 -58 -43 -34 -18 -62 -19 -380 -19 -383
                0 -394 2 -452 71 -40 48 -49 73 -55 174 l-6 90 -215 1 c-118 1 -245 -2 -283
                -6z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    Landscaping
                  </p>
                </div>
              </div>
              {/* NEXT */}
              <div className="hidden lg:block md:block sm:hidden">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="486.000000pt"
                      height="397.000000pt"
                      viewBox="0 0 486.000000 397.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    >
                      <g
                        transform="translate(0.000000,397.000000) scale(0.100000,-0.100000)"
                        fill="#57e5d0"
                        stroke="none"
                      >
                        <path
                          d="M1000 2210 l0 -430 175 0 c151 0 184 3 237 21 121 41 217 127 253
                229 9 27 15 79 15 141 l0 99 945 0 945 0 0 185 0 185 -1285 0 -1285 0 0 -430z"
                        />
                        <path
                          d="M1837 2143 c-4 -3 -7 -108 -7 -233 l0 -227 -30 -60 c-50 -100 -136
                -166 -265 -204 -58 -17 -26 -18 1035 -16 1196 3 1128 0 1249 61 70 36 146 112
                176 178 24 51 25 61 25 274 l0 221 -322 6 c-421 9 -1853 9 -1861 0z"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    Electrician
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {primaryServices.map((service) => (
                <div
                  key={service.name}
                  className="flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105"
                >
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className={`${service.className} transition-transform duration-200 hover:scale-110`}
                    />
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    {service.name}
                  </p>
                </div>
              ))}

              {/* Secondary Services - Hidden on Mobile */}
              {secondaryServices.map((service) => (
                <div
                  key={service.name}
                  className="hidden sm:flex flex-col items-center justify-center p-1 sm:p-2 transition-all hover:scale-105"
                >
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className={`${service.className} transition-transform duration-200 hover:scale-110`}
                    />
                  </div>
                  <p className="mt-1 lg:mt-0 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-[10px] text-center font-normal sm:font-medium truncate w-full">
                    {service.name}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeNavBar
