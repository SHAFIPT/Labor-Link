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
    // Check if either latitude or longitude is null
    if (locationOfUser.latitude === null || locationOfUser.longitude === null) {
      setShowLocationModal(true); // Show location modal if location is not enabled
    } else {
      console.log("Iaaaaam herer..............................")
      dispatch(setLoading(false)); // Set loading to false
      navigate('/laborListing'); // Navigate to labor listing page if location is enabled
    }
};


  // useEffect(() => {
  //   console.log('isLaborAuthenticated :',isLaborAuthenticated)
  //   console.log('isUserAthenticated :',isUserAthenticated)
  //   console.log('laborer :',laborer)
  //   console.log('user :',user)
  // },[isLaborAuthenticated,isUserAthenticated,laborer,user])

  const dispatch = useDispatch();
  const navigate = useNavigate()// Get dispatch function
  // const history = useHistory();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isOpen, setIsOpen] = useState(false);// Get the current theme

    const toggleDarkMode = () => {
      dispatch(toggleTheme());  // Dispatch toggle action
  };
  
   const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleViewProfile = () => {
    navigate('/userProfilePage')
  }

 
  const shouldShowUserName = isUserAthenticated 
  // const shouldShowLaborName = isLaborAuthenticated 
  useEffect(() => {
     console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
    console.log('shouldShowUserName :', shouldShowUserName)
    
  },[shouldShowUserName])

    // First 4 services (always visible)
  const primaryServices = [
    { name: "HandyPerson", icon: Handman, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "Plumbing", icon: pipe, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Electrician", icon: Electriion, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "Roofing", icon: Roofing, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" }
  ];

  // Additional services (hidden on mobile)
  const secondaryServices = [
    { name: "Cleaning", icon: HomeCleaning, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Carpender", icon: Carpender, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Appliance Repair", icon: repair, className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" },
    { name: "HVAC", icon: Ac, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Landscaping", icon: Landscaling, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" },
    { name: "Guttor Service", icon: Guttor, className: "w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12" }
  ];


  const fetchChats = (userUids : string) => {
      console.log('hlooooooooooooooooooooooooooo')
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
     console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
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
  
   
  const handleLogout = useCallback(async () => {
     console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
    try {
      const response = await logout();
      
      if (response?.status === 200) {
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
        
        toast.success('Logged out successfully');
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
    console.log('Iam clicke dedd noti')
    e.stopPropagation(); // Prevent menu from closing
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
              <svg
                className="w-24 sm:w-24 md:w-28 lg:w-32 ml-8 sm:ml-12 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-4"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1008.000000 730.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,730.000000) scale(0.100000,-0.100000)"
                  fill="#45fffe"
                  stroke="none"
                >
                  <path
                    d="M4801 6364 c-67 -73 -93 -115 -136 -219 -25 -62 -29 -82 -29 -175 0
-113 14 -169 65 -270 56 -111 180 -229 279 -267 25 -9 48 -22 52 -27 4 -6 8
-242 8 -523 l0 -513 23 -4 c21 -4 146 -17 297 -31 l65 -6 -3 535 -3 535 23 14
c13 8 50 29 82 48 86 50 184 151 228 235 96 183 93 359 -8 554 -34 64 -127
180 -145 180 -5 0 -9 -81 -9 -188 0 -212 -6 -246 -63 -334 -20 -31 -45 -75
-57 -97 l-20 -41 -210 0 c-240 0 -223 -6 -279 103 -17 34 -43 82 -56 106 -24
43 -25 50 -25 248 0 115 -4 203 -9 203 -5 0 -37 -30 -70 -66z"
                  />
                  <path
                    d="M1821 5690 l-973 -5 -44 -48 c-24 -27 -48 -65 -54 -85 -16 -61 -13
-459 5 -519 18 -61 74 -117 134 -133 27 -7 398 -10 1198 -8 l1159 3 43 28 c58
39 82 95 89 210 l5 89 73 -4 c40 -2 76 -7 81 -12 11 -11 6 -431 -6 -454 -5
-10 -38 -30 -73 -44 -213 -87 -533 -217 -653 -265 -247 -98 -748 -304 -801
-329 -29 -14 -58 -32 -65 -41 -11 -12 -15 -81 -19 -295 -5 -253 -7 -280 -22
-289 -16 -9 -18 -27 -18 -149 0 -93 4 -140 11 -140 12 0 104 76 166 138 36 36
43 48 43 83 0 22 -8 52 -17 66 -15 23 -18 60 -21 258 -4 201 -2 233 12 247 17
18 265 125 611 263 941 378 974 393 988 424 7 16 12 135 15 312 5 378 11 366
-193 378 l-110 6 -6 80 c-8 97 -30 155 -75 194 -52 46 -94 53 -313 49 -108 -2
-634 -5 -1170 -8z"
                  />
                  <path
                    d="M7230 5690 c-44 -11 -67 -40 -76 -95 -10 -70 0 -327 14 -352 21 -38
64 -53 153 -53 l82 0 68 65 c60 56 74 65 107 65 47 0 118 -43 157 -94 20 -26
35 -36 55 -36 16 0 30 -7 34 -16 3 -9 6 -330 6 -714 l0 -698 191 -168 c105
-93 202 -177 215 -187 l24 -19 0 874 c0 480 3 883 6 896 5 18 13 22 43 22 31
0 42 7 75 45 21 25 61 64 89 86 62 49 58 50 294 -22 304 -93 327 -99 335 -86
11 17 10 85 -2 108 -20 37 -381 300 -485 352 l-60 31 -390 -2 -390 -1 -56 -60
c-99 -105 -147 -103 -254 6 l-56 58 -72 2 c-40 1 -88 -2 -107 -7z"
                  />
                  <path
                    d="M4048 4395 c-1 -57 -6 -106 -10 -110 -6 -6 -127 3 -343 25 -49 5
-128 13 -175 16 l-86 7 -89 -75 c-50 -41 -142 -121 -206 -179 -64 -57 -223
-198 -354 -314 -132 -115 -293 -260 -360 -321 -66 -60 -156 -141 -200 -180
-45 -38 -188 -163 -319 -279 -132 -115 -284 -249 -339 -298 -55 -48 -143 -127
-196 -176 -53 -49 -132 -119 -177 -157 -120 -102 -414 -363 -539 -479 -60 -56
-159 -146 -220 -200 -141 -126 -338 -316 -333 -321 6 -6 2038 -10 2038 -4 -1
7 -457 307 -526 346 -31 17 -60 36 -65 41 -9 9 63 85 166 175 22 19 106 93
186 164 80 71 220 194 310 274 90 80 209 186 264 235 55 50 152 135 215 190
63 55 183 161 265 235 403 361 470 420 480 420 3 0 48 -38 98 -84 51 -46 178
-159 282 -251 105 -92 262 -232 350 -310 275 -244 625 -554 739 -654 60 -53
154 -136 209 -186 55 -49 131 -118 171 -152 39 -35 71 -68 71 -75 0 -6 -110
-85 -245 -174 -135 -89 -254 -169 -265 -178 -18 -13 233 -15 2430 -15 1348 0
2458 -3 2468 -6 9 -4 17 -4 17 -1 0 10 -157 164 -431 421 -134 126 -411 390
-614 585 -204 195 -493 470 -642 610 -150 140 -270 257 -267 260 6 6 74 8 252
9 l122 1 -318 283 c-175 155 -478 425 -674 599 l-355 317 -128 -40 c-70 -22
-129 -39 -131 -36 -2 2 -8 29 -12 60 l-7 55 -45 -21 c-25 -11 -88 -37 -140
-58 l-95 -37 -3 -63 c-3 -86 -7 -96 -30 -75 -25 22 -38 21 -155 -18 -243 -81
-239 -80 -367 -67 -152 16 -288 28 -435 40 -156 13 -445 39 -565 51 -99 10
-117 10 -138 -4 -7 -4 -33 -48 -58 -97 -26 -53 -49 -87 -55 -83 -7 4 -10 73
-8 203 l3 196 -30 3 c-24 2 -257 39 -356 57 l-26 4 -4 -104z m2799 -368 c4 -7
51 -50 103 -96 52 -46 202 -178 332 -293 265 -233 320 -286 316 -307 -2 -8
-33 -30 -71 -48 -37 -18 -67 -38 -67 -43 0 -6 44 -10 108 -11 59 0 115 -4 125
-8 18 -6 19 -26 17 -336 0 -220 -4 -333 -12 -342 -8 -10 -166 -13 -824 -13
l-813 0 -241 168 c-357 248 -443 307 -598 412 -78 52 -137 99 -133 103 7 7
495 15 966 17 l90 0 -30 26 c-16 14 -45 32 -62 40 -35 15 -41 31 -20 56 17 21
193 179 392 350 94 81 217 190 275 242 103 93 131 109 147 83z"
                  />
                  <path
                    d="M6888 3712 c-26 -3 -28 -7 -28 -45 0 -81 5 -87 71 -87 l59 0 0 70 0
70 -37 -2 c-21 -2 -50 -4 -65 -6z"
                  />
                  <path d="M6672 3643 l3 -68 68 -3 67 -3 0 71 0 70 -70 0 -71 0 3 -67z" />
                  <path
                    d="M6675 3510 c-3 -5 -3 -32 1 -60 l7 -51 61 3 61 3 3 58 3 57 -65 0
c-36 0 -68 -4 -71 -10z"
                  />
                  <path d="M6870 3460 l0 -60 48 0 c66 0 74 8 70 66 l-3 49 -57 3 -58 3 0 -61z" />
                  <path
                    d="M3010 2447 l0 -197 193 2 192 3 3 191 2 192 -47 7 c-26 4 -114 5
-195 3 l-148 -3 0 -198z"
                  />
                  <path
                    d="M3585 2641 l-60 -6 0 -190 0 -190 191 -3 191 -2 6 192 c4 137 3 194
-5 199 -13 9 -239 8 -323 0z"
                  />
                  <path
                    d="M3010 1929 l0 -202 186 5 c102 3 189 9 195 15 6 6 8 84 7 194 l-3
184 -192 3 -193 3 0 -202z"
                  />
                  <path
                    d="M3526 2099 c-3 -17 -6 -105 -6 -194 l0 -162 53 -7 c73 -8 310 -7 324
2 9 6 13 61 13 197 l2 190 -190 3 -189 2 -7 -31z"
                  />
                  <path
                    d="M2500 685 l0 -625 368 0 c424 0 441 2 509 72 69 71 73 92 73 407 0
256 -2 279 -21 321 -24 53 -50 83 -99 113 -33 21 -49 22 -310 27 l-275 5 -3
153 -3 152 -119 0 -120 0 0 -625z m708 -153 l2 -222 -235 0 -235 0 0 225 0
225 233 -2 232 -3 3 -223z"
                  />
                  <path d="M7320 1190 l0 -120 120 0 120 0 0 120 0 120 -120 0 -120 0 0 -120z" />
                  <path
                    d="M8890 685 l0 -625 125 0 125 0 0 175 0 175 64 0 63 0 162 -175 162
-175 125 0 124 0 0 40 c0 37 -10 51 -175 232 -96 106 -175 196 -175 200 0 4
79 94 175 200 161 178 175 196 175 231 l0 37 -127 0 -128 0 -155 -170 -155
-169 -67 -1 -68 0 -2 323 -3 322 -122 3 -123 3 0 -626z"
                  />
                  <path
                    d="M150 645 l0 -585 585 0 585 0 0 125 0 125 -462 2 -463 3 -3 458 -2
457 -120 0 -120 0 0 -585z"
                  />
                  <path
                    d="M6055 1218 c-3 -7 -4 -269 -3 -583 l3 -570 585 -3 585 -2 0 125 0
125 -462 0 -463 0 0 460 0 460 -120 0 c-87 0 -122 -3 -125 -12z"
                  />
                  <path
                    d="M1410 880 l0 -120 355 0 355 0 0 -50 0 -50 -352 -2 -353 -3 -3 -195
c-3 -225 2 -253 61 -317 75 -81 53 -78 495 -81 l392 -3 0 381 c0 420 0 423
-63 489 -67 71 -67 71 -499 71 l-388 0 0 -120z m710 -505 l0 -65 -235 0 -235
0 0 65 0 65 235 0 235 0 0 -65z"
                  />
                  <path
                    d="M3712 979 c-52 -26 -105 -86 -120 -138 -8 -25 -12 -134 -12 -317 0
-314 3 -327 76 -398 64 -62 101 -68 427 -64 l284 3 49 30 c30 19 60 49 79 79
l30 49 3 291 c2 195 0 304 -8 329 -14 49 -74 115 -125 138 -36 17 -71 19 -340
19 -285 0 -302 -1 -343 -21z m578 -444 l0 -225 -235 0 -235 0 0 218 c0 120 3
222 7 225 3 4 109 7 235 7 l228 0 0 -225z"
                  />
                  <path
                    d="M4810 984 c-45 -20 -96 -69 -123 -119 -21 -39 -22 -49 -22 -420 l0
-380 123 -3 122 -3 0 351 0 350 255 0 255 0 0 120 0 120 -287 0 c-234 -1 -295
-4 -323 -16z"
                  />
                  <path d="M7320 530 l0 -470 120 0 120 0 0 470 0 470 -120 0 -120 0 0 -470z" />
                  <path
                    d="M7760 530 l0 -470 120 0 120 0 0 350 0 350 233 -2 232 -3 3 -347 2
-348 120 0 120 0 0 371 c0 253 -4 384 -12 410 -15 52 -68 113 -121 138 -42 20
-58 21 -430 21 l-387 0 0 -470z"
                  />
                </g>
              </svg>
            ) : (
              <svg
                className="w-24 sm:w-24 md:w-28 lg:w-32 ml-8 sm:ml-12 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-4"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1008.000000 730.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,730.000000) scale(0.100000,-0.100000)"
                  fill="#465b70"
                  stroke="none"
                >
                  <path
                    d="M4801 6364 c-67 -73 -93 -115 -136 -219 -25 -62 -29 -82 -29 -175 0
-113 14 -169 65 -270 56 -111 180 -229 279 -267 25 -9 48 -22 52 -27 4 -6 8
-242 8 -523 l0 -513 23 -4 c21 -4 146 -17 297 -31 l65 -6 -3 535 -3 535 23 14
c13 8 50 29 82 48 86 50 184 151 228 235 96 183 93 359 -8 554 -34 64 -127
180 -145 180 -5 0 -9 -81 -9 -188 0 -212 -6 -246 -63 -334 -20 -31 -45 -75
-57 -97 l-20 -41 -210 0 c-240 0 -223 -6 -279 103 -17 34 -43 82 -56 106 -24
43 -25 50 -25 248 0 115 -4 203 -9 203 -5 0 -37 -30 -70 -66z"
                  />
                  <path
                    d="M1821 5690 l-973 -5 -44 -48 c-24 -27 -48 -65 -54 -85 -16 -61 -13
-459 5 -519 18 -61 74 -117 134 -133 27 -7 398 -10 1198 -8 l1159 3 43 28 c58
39 82 95 89 210 l5 89 73 -4 c40 -2 76 -7 81 -12 11 -11 6 -431 -6 -454 -5
-10 -38 -30 -73 -44 -213 -87 -533 -217 -653 -265 -247 -98 -748 -304 -801
-329 -29 -14 -58 -32 -65 -41 -11 -12 -15 -81 -19 -295 -5 -253 -7 -280 -22
-289 -16 -9 -18 -27 -18 -149 0 -93 4 -140 11 -140 12 0 104 76 166 138 36 36
43 48 43 83 0 22 -8 52 -17 66 -15 23 -18 60 -21 258 -4 201 -2 233 12 247 17
18 265 125 611 263 941 378 974 393 988 424 7 16 12 135 15 312 5 378 11 366
-193 378 l-110 6 -6 80 c-8 97 -30 155 -75 194 -52 46 -94 53 -313 49 -108 -2
-634 -5 -1170 -8z"
                  />
                  <path
                    d="M7230 5690 c-44 -11 -67 -40 -76 -95 -10 -70 0 -327 14 -352 21 -38
64 -53 153 -53 l82 0 68 65 c60 56 74 65 107 65 47 0 118 -43 157 -94 20 -26
35 -36 55 -36 16 0 30 -7 34 -16 3 -9 6 -330 6 -714 l0 -698 191 -168 c105
-93 202 -177 215 -187 l24 -19 0 874 c0 480 3 883 6 896 5 18 13 22 43 22 31
0 42 7 75 45 21 25 61 64 89 86 62 49 58 50 294 -22 304 -93 327 -99 335 -86
11 17 10 85 -2 108 -20 37 -381 300 -485 352 l-60 31 -390 -2 -390 -1 -56 -60
c-99 -105 -147 -103 -254 6 l-56 58 -72 2 c-40 1 -88 -2 -107 -7z"
                  />
                  <path
                    d="M4048 4395 c-1 -57 -6 -106 -10 -110 -6 -6 -127 3 -343 25 -49 5
-128 13 -175 16 l-86 7 -89 -75 c-50 -41 -142 -121 -206 -179 -64 -57 -223
-198 -354 -314 -132 -115 -293 -260 -360 -321 -66 -60 -156 -141 -200 -180
-45 -38 -188 -163 -319 -279 -132 -115 -284 -249 -339 -298 -55 -48 -143 -127
-196 -176 -53 -49 -132 -119 -177 -157 -120 -102 -414 -363 -539 -479 -60 -56
-159 -146 -220 -200 -141 -126 -338 -316 -333 -321 6 -6 2038 -10 2038 -4 -1
7 -457 307 -526 346 -31 17 -60 36 -65 41 -9 9 63 85 166 175 22 19 106 93
186 164 80 71 220 194 310 274 90 80 209 186 264 235 55 50 152 135 215 190
63 55 183 161 265 235 403 361 470 420 480 420 3 0 48 -38 98 -84 51 -46 178
-159 282 -251 105 -92 262 -232 350 -310 275 -244 625 -554 739 -654 60 -53
154 -136 209 -186 55 -49 131 -118 171 -152 39 -35 71 -68 71 -75 0 -6 -110
-85 -245 -174 -135 -89 -254 -169 -265 -178 -18 -13 233 -15 2430 -15 1348 0
2458 -3 2468 -6 9 -4 17 -4 17 -1 0 10 -157 164 -431 421 -134 126 -411 390
-614 585 -204 195 -493 470 -642 610 -150 140 -270 257 -267 260 6 6 74 8 252
9 l122 1 -318 283 c-175 155 -478 425 -674 599 l-355 317 -128 -40 c-70 -22
-129 -39 -131 -36 -2 2 -8 29 -12 60 l-7 55 -45 -21 c-25 -11 -88 -37 -140
-58 l-95 -37 -3 -63 c-3 -86 -7 -96 -30 -75 -25 22 -38 21 -155 -18 -243 -81
-239 -80 -367 -67 -152 16 -288 28 -435 40 -156 13 -445 39 -565 51 -99 10
-117 10 -138 -4 -7 -4 -33 -48 -58 -97 -26 -53 -49 -87 -55 -83 -7 4 -10 73
-8 203 l3 196 -30 3 c-24 2 -257 39 -356 57 l-26 4 -4 -104z m2799 -368 c4 -7
51 -50 103 -96 52 -46 202 -178 332 -293 265 -233 320 -286 316 -307 -2 -8
-33 -30 -71 -48 -37 -18 -67 -38 -67 -43 0 -6 44 -10 108 -11 59 0 115 -4 125
-8 18 -6 19 -26 17 -336 0 -220 -4 -333 -12 -342 -8 -10 -166 -13 -824 -13
l-813 0 -241 168 c-357 248 -443 307 -598 412 -78 52 -137 99 -133 103 7 7
495 15 966 17 l90 0 -30 26 c-16 14 -45 32 -62 40 -35 15 -41 31 -20 56 17 21
193 179 392 350 94 81 217 190 275 242 103 93 131 109 147 83z"
                  />
                  <path
                    d="M6888 3712 c-26 -3 -28 -7 -28 -45 0 -81 5 -87 71 -87 l59 0 0 70 0
70 -37 -2 c-21 -2 -50 -4 -65 -6z"
                  />
                  <path d="M6672 3643 l3 -68 68 -3 67 -3 0 71 0 70 -70 0 -71 0 3 -67z" />
                  <path
                    d="M6675 3510 c-3 -5 -3 -32 1 -60 l7 -51 61 3 61 3 3 58 3 57 -65 0
c-36 0 -68 -4 -71 -10z"
                  />
                  <path d="M6870 3460 l0 -60 48 0 c66 0 74 8 70 66 l-3 49 -57 3 -58 3 0 -61z" />
                  <path
                    d="M3010 2447 l0 -197 193 2 192 3 3 191 2 192 -47 7 c-26 4 -114 5
-195 3 l-148 -3 0 -198z"
                  />
                  <path
                    d="M3585 2641 l-60 -6 0 -190 0 -190 191 -3 191 -2 6 192 c4 137 3 194
-5 199 -13 9 -239 8 -323 0z"
                  />
                  <path
                    d="M3010 1929 l0 -202 186 5 c102 3 189 9 195 15 6 6 8 84 7 194 l-3
184 -192 3 -193 3 0 -202z"
                  />
                  <path
                    d="M3526 2099 c-3 -17 -6 -105 -6 -194 l0 -162 53 -7 c73 -8 310 -7 324
2 9 6 13 61 13 197 l2 190 -190 3 -189 2 -7 -31z"
                  />
                  <path
                    d="M2500 685 l0 -625 368 0 c424 0 441 2 509 72 69 71 73 92 73 407 0
256 -2 279 -21 321 -24 53 -50 83 -99 113 -33 21 -49 22 -310 27 l-275 5 -3
153 -3 152 -119 0 -120 0 0 -625z m708 -153 l2 -222 -235 0 -235 0 0 225 0
225 233 -2 232 -3 3 -223z"
                  />
                  <path d="M7320 1190 l0 -120 120 0 120 0 0 120 0 120 -120 0 -120 0 0 -120z" />
                  <path
                    d="M8890 685 l0 -625 125 0 125 0 0 175 0 175 64 0 63 0 162 -175 162
-175 125 0 124 0 0 40 c0 37 -10 51 -175 232 -96 106 -175 196 -175 200 0 4
79 94 175 200 161 178 175 196 175 231 l0 37 -127 0 -128 0 -155 -170 -155
-169 -67 -1 -68 0 -2 323 -3 322 -122 3 -123 3 0 -626z"
                  />
                  <path
                    d="M150 645 l0 -585 585 0 585 0 0 125 0 125 -462 2 -463 3 -3 458 -2
457 -120 0 -120 0 0 -585z"
                  />
                  <path
                    d="M6055 1218 c-3 -7 -4 -269 -3 -583 l3 -570 585 -3 585 -2 0 125 0
125 -462 0 -463 0 0 460 0 460 -120 0 c-87 0 -122 -3 -125 -12z"
                  />
                  <path
                    d="M1410 880 l0 -120 355 0 355 0 0 -50 0 -50 -352 -2 -353 -3 -3 -195
c-3 -225 2 -253 61 -317 75 -81 53 -78 495 -81 l392 -3 0 381 c0 420 0 423
-63 489 -67 71 -67 71 -499 71 l-388 0 0 -120z m710 -505 l0 -65 -235 0 -235
0 0 65 0 65 235 0 235 0 0 -65z"
                  />
                  <path
                    d="M3712 979 c-52 -26 -105 -86 -120 -138 -8 -25 -12 -134 -12 -317 0
-314 3 -327 76 -398 64 -62 101 -68 427 -64 l284 3 49 30 c30 19 60 49 79 79
l30 49 3 291 c2 195 0 304 -8 329 -14 49 -74 115 -125 138 -36 17 -71 19 -340
19 -285 0 -302 -1 -343 -21z m578 -444 l0 -225 -235 0 -235 0 0 218 c0 120 3
222 7 225 3 4 109 7 235 7 l228 0 0 -225z"
                  />
                  <path
                    d="M4810 984 c-45 -20 -96 -69 -123 -119 -21 -39 -22 -49 -22 -420 l0
-380 123 -3 122 -3 0 351 0 350 255 0 255 0 0 120 0 120 -287 0 c-234 -1 -295
-4 -323 -16z"
                  />
                  <path d="M7320 530 l0 -470 120 0 120 0 0 470 0 470 -120 0 -120 0 0 -470z" />
                  <path
                    d="M7760 530 l0 -470 120 0 120 0 0 350 0 350 233 -2 232 -3 3 -347 2
-348 120 0 120 0 0 371 c0 253 -4 384 -12 410 -15 52 -68 113 -121 138 -42 20
-58 21 -430 21 l-387 0 0 -470z"
                  />
                </g>
              </svg>
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

            <button
              className="BrowserButton bg-[#21A391] focus:outline-none hidden lg:block md:hidden text-white p-3 w-[220px] rounded-xl"
              onClick={handleLaborList}
            >
              Brouse all labors
            </button>

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
            {/* 

            {shouldShowUserName && (
              <> */}

            {/* Bell Iconnnnnnnnnnnnnn */}

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
