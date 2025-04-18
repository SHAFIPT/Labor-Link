import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { toast } from "react-toastify"
import '../../Auth/userLogin.css'
import '../../userHomeNave.css'
import '../../Auth/userLoginBody.css'
import { FaCalendarCheck } from "react-icons/fa"; 
import { persistor } from '../../../redux/store/store';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toggleTheme } from "../../../redux/slice/themeSlice";
import { Bell, Briefcase, HomeIcon, LucideIcon, MessageSquare, Receipt, User} from 'lucide-react';
import { resetUser } from "../../../redux/slice/userSlice";
import { resetLaborer, setFormData, setIsLaborAuthenticated, setLaborer } from "../../../redux/slice/laborSlice";
import { logout } from "../../../services/LaborAuthServices";
import NotificationModal, { ChatNotification } from "../../UserSide/notificaionModal";
import { auth, db } from "../../../utils/firbase";
import { collection, doc, DocumentData, getCountFromServer, getDoc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import NotificaionModal from "../../UserSide/notificaionModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IconType } from "react-icons/lib";
import { HttpStatus } from "../../../enums/HttpStaus";
import { Messages } from "../../../constants/Messages";

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
interface Chat {
  id: string;
  message?: string; 
  unreadCount: number;
  userData: DocumentData | null;
  laborId: string;
  userId: string;
  lastMessage: string;
  lastUpdated: Timestamp;
  quoteSent: boolean;
  messagesCount: number;
  lastReadTimestamp: Timestamp;
  lastMessageSender: string;
}
interface NavItem {
  name: string;
  icon: LucideIcon | IconType; 
  stage: string;
}

type LaborDashBoardNavProps = {
  setCurrentStage: React.Dispatch<React.SetStateAction<string>>; // Example: for a number state
};

const LaborDashBoardNav: React.FC<LaborDashBoardNavProps> = ({ setCurrentStage }) => {
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
  const loading = useSelector((state: RootState) => state.user.loading);
  const bookingDetails = useSelector((state: RootState) => state.booking?.bookingDetails || []);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isOpen, setIsOpen] = useState(false); 
  const [notificaionOn, setNotificaionOn] = useState(false)
  const [chats, setChats] = useState<Chat[]>([]);
  const hasUnreadMessages = chats.some((chat) => chat.unreadCount > 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOn , setIsMenuOn] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const shouldShowUserName = isLaborAuthenticated;
  
      const handleLogoutLabor = async () => {
        const response = await logout()
        
        if (response.status === HttpStatus.OK) {
          localStorage.removeItem('LaborAccessToken');
            dispatch(resetUser())
            dispatch(resetLaborer())
            dispatch(setLaborer({}))
            dispatch(setFormData({}))
          dispatch(setIsLaborAuthenticated(false))
          await persistor.purge();
            toast(Messages.LOGOUT_SUCCESSFUL)
            navigate('/');
        }
  }

    const fetchChats = (userUids : string) => {
    if (!userUids) {
      throw new Error("Missing user credentials");
    }

    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.uid) {
      throw new Error("User is not authenticated");
    }

    const userUid = currentUser.uid;

    const chatCollection = collection(db, "Chats");
    const chatQuery = query(chatCollection, where("laborId", "==", userUid));

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
          const userDocRef = doc(db, "Users", chat.userId);
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.exists() ? userSnapshot.data() : null;

          return {
            ...chat,
            userData,
          };
        } catch (error) {
          console.error(
            `Error fetching user data for chat ${chat.id}:`,
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
        // toast.error("Please sign in to view chats");
      }
    });

    return () => unsubscribe(); // Cleanup auth listener on unmount
  }, []);



    const navItems: NavItem[] = [
    { name: "Dashboard", icon: HomeIcon, stage: "Dashboard" },
    { name: "Bookings", icon: FaCalendarCheck, stage: "Bookings" },
    { name: "Chats", icon: MessageSquare, stage: "Chats" },
    { name: "  Bookings & History ", icon: Briefcase, stage: "Works" },
    { name: "My Wallet", icon: Receipt, stage: "Wallet" },
    { name: "My Profile", icon: User, stage: "User" },
  ];

  
   const handlenotificaiotn = (e: React.FormEvent) => {
     toggleMenu();
      setIsMenuOn(false); 
      e.stopPropagation(); // Prevent menu from closing
     setNotificaionOn(true);
     
    }

    
  return (
    <div>
      {notificaionOn && (
        <NotificationModal
          onClose={() => setNotificaionOn(false)}
          chats={(chats || []).filter(chat => chat.userData !== null) as ChatNotification[]} 
          bookingDetails={bookingDetails || []}
          setCurrentStage={isLaborAuthenticated ? setCurrentStage : undefined}
        />
      )}

      <div>
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
              <div className="searchBox h-[23px] lg:h-[50px] lg:w-[630px] flex items-center border shadow-lg rounded-xl px-4 transition-all group lg:focus-within:w-[700px] sm:focus-within:w-[200px] md:focus-within:w-[10px] focus-within:w-[200px] ">
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
              <label
                className="toggle"
                htmlFor="switch"
                onClick={toggleDarkMode}
              >
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
                      <g
                        fill="#ffac33"
                        transform="matrix(1.25 0 0 -1.25 0 47.5)"
                      >
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

            {/* <button
            className="BrowserButton bg-[#21A391] focus:outline-none hidden lg:block md:hidden text-white p-3 w-[220px] rounded-xl"
          
          >
            Brouse all labors
          </button> */}
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
          className={`fixed inset-0 h-screen bg-black bg-opacity-50 transform transition-all duration-500 ease-in-out z-40 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={() => {
            toggleMenu();
            setIsMenuOn(false); 
          }} // Close menu when clicking outside
        >
          <div
            className={`fixed inset-x-0 top-0 h-[100vh] bg-gradient-to-b from-teal-900 to-teal-800 
                        transform transition-all duration-500 ease-in-out z-40
                        ${isOpen ? 'translate-y-0' : '-translate-y-full'} 
                        shadow-2xl`}
          >
            <nav className="container mx-auto px-4 h-full flex flex-col items-center justify-center space-y-1 relative">
              {/* Notification Icon */}
              <div className="absolute bottom-0 left-8 lg:hidden" onClick={handlenotificaiotn }>
            <button className="relative group">
              <Bell className="w-6 h-6 text-white transition-colors duration-200 group-hover:text-teal-300" />
              <div className="absolute -top-3 -right-1">
                      <div className="relative">
                        {/* Static Red Dot */}
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"></div>
                        
                        {/* Pulsating Glow Effect */}
                        <div className="w-4 h-4 -top-1 bg-red-500 rounded-full absolute animate-ping opacity-75"></div>
                      </div>
                    </div>
            </button>
          </div>

              {/* Menu Items */}
              <div className="flex flex-col items-center space-y-8 w-full max-w-md mt-16">
                 {/* Nav Items from the array */}
                {navItems.map((item, index) => (
                  item.name === "My Profile" ? (
                    <Link
                      key={index}
                      to="/labor/ProfilePage"
                      className="w-full py-3 px-6 text-white text-lg font-medium tracking-wide rounded-lg 
                                bg-teal-700/30 hover:bg-teal-700/50 transition-all duration-200 
                                transform hover:scale-105 hover:shadow-lg
                                flex items-center space-x-3"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      key={index}
                      className="w-full py-3 px-6 text-white text-lg font-medium tracking-wide rounded-lg 
                              bg-teal-700/30 hover:bg-teal-700/50 transition-all duration-200 
                              transform hover:scale-105 hover:shadow-lg
                              flex items-center space-x-3"
                      onClick={() => setCurrentStage && setCurrentStage(item.stage)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  )
                ))}



                {shouldShowUserName && (
                  <button
                    className="group flex items-center justify-center w-full max-w-xs h-12 
                              bg-gradient-to-r from-red-600 to-red-700 rounded-lg 
                              hover:from-red-700 hover:to-red-800
                              transition-all duration-300 transform hover:scale-105
                              shadow-lg hover:shadow-xl"
                    // onClick={handleLogout}
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
                setCurrentStage={isLaborAuthenticated ? setCurrentStage : undefined}
              />
            )}

            

            {/* </>
            )} */}
          </div>

            <div className="di" onClick={() => setNotificaionOn(true)}>
              <div className="relative cursor-pointer hidden md:block lg:block">
                {/* Notification Bell Icon */}
                <i className="fas fa-bell text-2xl"></i>

                 {bookingDetails?.length > 0 &&
                  // bookingDetails[0]?.status === "canceled" &&
                  bookingDetails[0]?.cancellation?.canceledBy === "user" &&
                  !bookingDetails[0]?.cancellation?.isUserRead &&
                  isLaborAuthenticated && (
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        {/* Static Red Dot */}
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                        {/* Pulsating Glow Effect */}
                        <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                      </div>
                    </div>
                  )}
                


                  {bookingDetails?.length > 0 &&
                    bookingDetails[0]?.reschedule && // Ensure reschedule exists
                    bookingDetails[0]?.reschedule.isReschedule === false && // Request is still pending
                    bookingDetails[0]?.reschedule.requestSentBy === "user" && // Request sent by the user
                    bookingDetails[0]?.reschedule.acceptedBy === null && // Not yet accepted
                    bookingDetails[0]?.reschedule.rejectedBy === null && // Not yet rejected
                    (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                    )
                }
                

                {bookingDetails?.length > 0 &&
                  bookingDetails[0]?.reschedule &&
                  bookingDetails[0]?.reschedule.isReschedule === false && // Request is still pending
                  bookingDetails[0]?.reschedule.rejectedBy === "labor" && // Rejected by labor
                  bookingDetails[0]?.reschedule.rejectionNewDate && // Has a rejection date
                  bookingDetails[0]?.reschedule.rejectionNewTime && // Has a rejection time
                  bookingDetails[0]?.reschedule.rejectionReason && // Has a rejection reason
                  !isLaborAuthenticated &&
                  (
                    <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                  )
                }
                {bookingDetails?.length > 0 &&
                  bookingDetails[0]?.reschedule &&
                  bookingDetails[0]?.reschedule?.isReschedule === false && // Request is still pending
                  bookingDetails[0]?.reschedule?.rejectedBy === "user" && // Rejected by labor
                  bookingDetails[0]?.reschedule?.rejectionNewDate && // Has a rejection date
                  bookingDetails[0]?.reschedule?.rejectionNewTime && // Has a rejection time
                  bookingDetails[0]?.reschedule?.rejectionReason && // Has a rejection reason
                  isLaborAuthenticated &&
                  (
                    <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          {/* Static Red Dot */}
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>

                          {/* Pulsating Glow Effect */}
                          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping opacity-75 right-0"></div>
                        </div>
                      </div>
                  )
                }



                {/* Glowing Red Notification Indicator */}
                {hasUnreadMessages && isLaborAuthenticated && (
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
          </div>
          {isLaborAuthenticated ? (
            <>
              <div className=" relative userImage flex items-center lg:mr-20 mt-4 cursor-pointer group">
                {/* User Icon */}
                <i className="fa fa-user w-12 h-12 text-[28px] hidden md:block lg:block"></i>

                {/* Dropdown */}
                <div className="absolute top-[90px] right-0 w-[130px] hidden flex-col bg-white shadow-md rounded-md p-2 border border-gray-200 group-hover:flex">
                  <Link to="/labor/ProfilePage">
                    <button className="text-gray-700 hover:text-blue-500 text-sm px-4 py-2 text-left">
                      View Profile
                    </button>
                  </Link>
                  <button
                    className="text-gray-700 hover:text-blue-500 text-sm px-4 py-2 text-left"
                    onClick={handleLogoutLabor}
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
        {/* <div className="w-full flex justify-center mt-4 sm:mt-5 md:mt-6 lg:mt-0 lg:mb-3">
            <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[72%] h-[2px] bg-[#ECECEC] mx-auto" />
          </div> */}
      </div>
    </div>
  );
}

export default LaborDashBoardNav
