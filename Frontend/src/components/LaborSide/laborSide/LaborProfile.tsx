import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"
import { useEffect, useState } from "react"
import { setFormData, setIsLaborAuthenticated, setLaborer, resetLaborer ,setError, setLoading} from "../../../redux/slice/laborSlice"
import { resetUser, setAccessToken, setisUserAthenticated, setUser } from '../../../redux/slice/userSlice'
import { toast } from "react-toastify"
import { useLocation, useNavigate , useHistory } from "react-router-dom"
import { logout } from "../../../services/LaborAuthServices"
import HomeNavBar from "../../HomeNavBar"
import LoginNav from "../../Auth/LoginNav"
import BgImage from '../../../assets/image 6.png'// Assuming you're using React Router for navigation
import firebase from 'firebase/app';
import {auth} from '../../../utils/firbase';
import HomeImage from '../../../assets/HomeIcon.png'
import char from '../../../assets/happy-female-electrician.avif'
import { persistor } from '../../../redux/store/store';
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import '../../Auth/LoadingBody.css'
import { Phone, Mail, MapPin, Clock,Globe, Heart, Star, Edit, Wallet , ChevronRight, Home, User ,
  Calendar, 
  CheckSquare, 
  Lock,
    X  } from 'lucide-react';
import './LaborProfile.css'
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LaborDashBoardNav from "./LaborDashBoardNav"
import { aboutMe, editPassword, laborFetch, updateProfile } from "../../../services/LaborServices"
import { validateAddress, validateAvailability, validateEndTime, validateFirstName, validateLanguage, validateLastName, validatePassword, validatePhoneNumber, validateSkill, validateStartTime } from "../../../utils/laborRegisterValidators"
import { ILaborer } from "../../../@types/labor"
import ChatComponets from "../../ChatPage/ChatComponets"
import { getDocs, query, collection, where, updateDoc, doc, getFirestore, serverTimestamp, addDoc } from "firebase/firestore";
import { db , app } from '../../../utils/firbase';
import Breadcrumb from "../../BreadCrumb"

const LaborProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  
  //   const formdata = useSelector((state: RootState) => state.labor.formData)
  //   const formdatarole = useSelector((state: RootState) => state.labor?.formData?.role)
  //   const Oldrole = useSelector((state: RootState) => state.labor?.laborer?.role)
  const theam = useSelector((state: RootState) => state.theme.mode)
   const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated); 
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
  const Laborer = useSelector((state : RootState) => state.labor.laborer)
  const email = useSelector((state : RootState) => state.labor.laborer.email)
  const loading = useSelector((state : RootState) => state.labor.loading)
  const currentUser = useSelector((state: RootState) => state.labor.laborer._id)
  const { state: user } = useLocation();
  
 
  console.log('Thsi is eth current Laborer Laborer  +++++++++++++++ :',user)
  // console.log('Thsi is eth currentisLaborAuthenticated :',isLaborAuthenticated)
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop();

  console.log("Thsi is the current paaaaaaaaaaaaaaaaaaageeeeeeeeeeeeeeeeee",currentPage)
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [laborData, setLaborData] = useState(null)
  const [openAbout, setOpenAbout] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [openChangePassword , setOpenChangePasswod] = useState(false)
  const [AboutFromData, setAboutFromData] = useState({
    name: "",
    experience: "",
    description: "",
  })
  const [submittedData, setSubmittedData] = useState(null);
   const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  language: string;
  availability: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
    All: boolean;
  };
  skills: string | string[];
  startTime: string;
  endTime: string;
  responsibilities: string;
  image: null;
}>({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  language: '',
  availability: {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
    All: false
  },
  skills: [], // Initialize as an array
  startTime: '',
  endTime: '',
  responsibilities: '',
  image: null
});
   
  useEffect(() => {
    
    console.log('This is the formData :',email)
  },[])
  
const error: {
     firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    language?: string;
    skills?: string;
    startTime?: string;
    endTime?: string;
    availability?: string; 
    password? : string
  } = useSelector((state: RootState) => state.labor.error);
  // const [availablityFormData, setAvailablityFormData] = useState({
  // availability: {
  //   Monday: false,
  //   Tuesday: false,
  //   Wednesday: false,
  //   Thursday: false,
  //   Friday: false,
  //   Saturday: false,
  //   Sunday: false,
  //   All: false
  // }
  // });
  // When initially loading dat
  // console.log('Theis is the console.log(error)-----++++-----',error);

    const handleEditProfile = () => {
  // Parse the availability from the string array
   const availableDays = laborData?.availability 
  ? laborData.availability.join(", ")
  : "No availability"
     const parsedSkills = Array.isArray(laborData?.skill) 
    ? JSON.parse(laborData.skill[0]) 
    : typeof laborData?.skill === 'string'
      ? JSON.parse(laborData.skill)
      : [];
      
      console.log("This is partsed Skills ........ +++++ ========= ",parsedSkills)
  
  // Reset formData with actual labor data
  setFormData({
    firstName: laborData?.firstName || "",
    lastName: laborData?.lastName || "",
    phone: laborData?.phone || "", // Note: changed from phoneNumber to phone
    address: laborData?.address || "",
    language: laborData?.language || "",
    skills: parsedSkills, // Note: changed from skills to skill
    responsibilities: laborData?.responsibility || "", // Note: changed from responsibilities to responsibility
    availability: {
      Monday: availableDays.includes('monday'),
      Tuesday: availableDays.includes('tuesday'),
      Wednesday: availableDays.includes('wednesday'),
      Thursday: availableDays.includes('thursday'),
      Friday: availableDays.includes('friday'),
      Saturday: availableDays.includes('saturday'),
      Sunday: availableDays.includes('sunday'),
      All: false
    },
    image: null,
    startTime: laborData?.startTime || "", // Added startTime
    endTime: laborData?.endTime || "",  
  });
  setOpenEditProfile(true);
  };
  

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await laborFetch();
        console.log("This is the Data LLLLLLLLLLLLLLLLLLLLLLLLLL", data);
  
        const { fetchUserResponse } = data
        
        //  console.log("This is the laborData LLLLLLLLLLLLLLLLlaborData", fetchUserResponse);
  
        dispatch(setLaborer(fetchUserResponse))
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          const errorMessage = error.response.data?.message || "Your account has been blocked.";
          toast.error(errorMessage); // Show dynamic error message
  
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
  // Parse the availability from the string array
   const availableDays =laborData?.availability 
  ? laborData.availability.join(", ")
  : "No availability"
  
  // Create a new availability object
  const initialAvailability = {
    Monday: availableDays.includes('monday'),
    Tuesday: availableDays.includes('tuesday'),
    Wednesday: availableDays.includes('wednesday'),
    Thursday: availableDays.includes('thursday'),
    Friday: availableDays.includes('friday'),
    Saturday: availableDays.includes('saturday'),
    Sunday: availableDays.includes('sunday'),
    All: false
  };

  setFormData(prev => ({
    ...prev,
    availability: initialAvailability
  }));
}, [laborData]);


  

  useEffect(() => {
  if (!isUserAuthenticated && !isLaborAuthenticated) {
    navigate('/login');
  }
}, [isUserAuthenticated, navigate ,isLaborAuthenticated]); 

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

 // Handle individual day change
const handleAvailabilityChange = (day) => {
  setFormData(prev => {
    const newAvailability = {
      ...prev.availability,
      [day]: !prev.availability[day],
      All: false // Uncheck All when individual day is changed
    };

    return {
      ...prev,
      availability: newAvailability
    };
  });
  };


  // Handle All Days checkbox
const handleAllDaysChange = () => {
  setFormData(prev => {
    const isCurrentlyAll = prev.availability.All;
    const newAvailability = {
      Monday: !isCurrentlyAll,
      Tuesday: !isCurrentlyAll,
      Wednesday: !isCurrentlyAll,
      Thursday: !isCurrentlyAll,
      Friday: !isCurrentlyAll,
      Saturday: !isCurrentlyAll,
      Sunday: !isCurrentlyAll,
      All: !isCurrentlyAll
    };

    return {
      ...prev,
      availability: newAvailability
    };
  });
  };

  console.log("This is the form datat ... !!!h000000003030303003",submittedData)
  

const prepareAvailabilityForSubmission = () => {
  const days = Object.keys(formData.availability)
    .filter(day => day !== 'All' && formData.availability[day])
    .map(day => day.toLowerCase());

  // Validate availability
  const availabilityError = validateAvailability(days);
  if (availabilityError) {
    dispatch(setError({ availability: availabilityError }));
  }

  return days;
  };
  
  console.log('Thsi is eth current user:', user)
  console.log('Thsi is eth current Laborer :', Laborer)


   
   
  useEffect(() => {
  if (Laborer && Object.keys(Laborer).length > 0) {  // Check if Laborer is not empty
    console.log("Hi I am here++++++-----");
   const LaborfullAddress = Laborer?.address 
      ? `${Laborer.address.city || ''}, ${Laborer.address.state || ''}, ${Laborer.address.postalCode || ''}, ${Laborer.address.country || ''}`.trim()
      : '';
    
    setLaborData({
      ...Laborer,
      address: LaborfullAddress,
    });
  } else if (user) {
    console.log("kkkkkk kkkiiiii mmmmmmmmmm++++++-----");
    // Ensure user address is handled similarly to Laborer
    const UserLaborfullAddress = user?.address 
      ? typeof user.address === 'string'
        ? user.address
        : `${user.address.street || ''}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}, ${user.address.country}`
      : '';
    
    setLaborData({
      ...user,
      address: UserLaborfullAddress,
    });
    console.log('This is the Labor laborData +++++____+++++++++++ ;', laborData);
  }
}, [Laborer, user]);
  

  const handleInputChangeAbout = (e) => {
    const { name, value } = e.target;
    setAboutFromData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // useEffect(() => {
  //   const userId = currentUser || user?._id;
  //   console.log("This is the current user:", user); // Ensure the user object is present
  //   console.log("This is the userId:", userId);
  //   if (userId) {
  //   console.log("Ho iam enter here :: seeeee ------------------------")
  //     const savedData = localStorage.getItem(`aboutData_${userId}`);
  //       console.log("Thsi my shabeel savedDatat ",savedData)
  //   if (savedData) {
  //     setSubmittedData(JSON.parse(savedData));
  //      console.log("Thsi se th userId savedData  ++++ hasdfdsfojdf ",savedData)
  //   }
  // }
  // }, [currentUser, user]);
  
//   const userId = currentUser || user?._id;
console.log("This is the currentUser:", currentUser);

const handleSubmit = async () => {
  const userId = currentUser || user?._id;


  console.log("This is the current user:", currentUser);
    console.log("This is the userId:", userId);
   
  if (!userId) return;

  const newData = {
    userId,
    name: AboutFromData.name,
    experience: AboutFromData.experience,
    description: AboutFromData.description
  };

  // Save to user-specific localStorage
  // localStorage.setItem(`aboutData_${userId}`, JSON.stringify(newData));
  // setSubmittedData(newData);
  setOpenAbout(false);
  setIsEditing(false);


  try {

      console.log("This is the newData:", newData);

    const response = await aboutMe(newData)

    const { AboutMe } = response.data

    console.log("Thsi sie About me ;;;;;kkkkkk ++++++ __))(((())))",AboutMe)

    if (response.status === 200) {

       dispatch(setLaborer({
      ...Laborer,
      aboutMe: AboutMe, // Update only the aboutMe field
    }));
      toast.success('about page uploaded succefully.....')
    } else {
      toast.error('Errro in about me')
    }
    
  } catch (error) {
    console.error("Network error:", error);
    toast.error("about udpataing error")
  }
  };
  

  const updateFirebaseLaborProfilePicture = async (email, profilePictureUrl, name) => {
  try {
    console.log("Starting Firebase labor profile update...");
    console.log("Email:", email);
    console.log("Profile Picture URL:", profilePictureUrl);
    console.log("Name:", name);

    // Query the labor by email
    const usersRef = collection(db, "Labors");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Loop through matching documents and update
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const userDocRef = doc(db, "Labors", docSnapshot.id);
        
        // Log the data being updated
        console.log("Updating document ID:", docSnapshot.id);
        console.log("Data being updated:", {
          profilePicture: profilePictureUrl || "",
          name: name || "",
        });

        // Ensure no undefined values are passed
        await updateDoc(userDocRef, {
          profilePicture: profilePictureUrl || "",
          name: name || "",
        });
      });

      await Promise.all(updatePromises);
      console.log("Labor profile picture and name updated successfully in Firebase.");
    } else {
      console.error("No labor found with the provided email.");
    }
  } catch (error) {
    console.error("Error updating labor profile picture in Firebase:", error);
  }
}



  const handleEdit = () => {
   
    setOpenAbout(true);
    setIsEditing(true);
  };

  const handleSubmitEditProfile = async () => {
    dispatch(setLoading(true))

    const availabilityDays = prepareAvailabilityForSubmission();

    const ValidateError = {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      phone : validatePhoneNumber(formData.phone),
      // address: validateAddress(formData.address),
      language: validateLanguage(formData.language),
      skill: validateSkill(formData.skills),
      startTime: validateStartTime(formData.startTime),
      endTime : validateEndTime(formData.endTime),
      availability : validateAvailability(availabilityDays)
    }
    console.log("Therse are teh errros occurd :",ValidateError)
    // Check if any errors exist
    const hasErrors = Object.values(ValidateError).some(error => error !== null);
    if (hasErrors) {
      dispatch(setLoading(false))
      dispatch(setError(ValidateError))
      return
    } 

    try {
      const formDataToSubmit = new FormData();
    
      formDataToSubmit.append('firstName', formData.firstName);
      formDataToSubmit.append('lastName', formData.lastName);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('address', formData.address);
      formDataToSubmit.append('language', formData.language);
      formDataToSubmit.append('availability', JSON.stringify(availabilityDays));
      formDataToSubmit.append('skills', JSON.stringify(formData.skills));
      formDataToSubmit.append('responsibilities', formData.responsibilities);
      formDataToSubmit.append('startTime', formData.startTime);
      formDataToSubmit.append('endTime', formData.endTime);
      
      // Append email safely (assuming email is a string)
      formDataToSubmit.append('email', email || '');

      if (formData.image) {
        formDataToSubmit.append('profilePicture', formData.image, formData.image);
      }

      console.log('thde formDatat to submit....______++++++-0------')

      // Log FormData contents
      for (let [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await updateProfile(formDataToSubmit);

      console.log("Profile updated: succefully.....+++++ =======", response);

      if (response.status === 200) {


        console.log('Thsi sie the labor profile update page data ::::::::::::',response.data)

        const { profilePicture, firstName, lastName } = response.data.updatedLabor

           const fullName = `${firstName} ${lastName}`.trim();
          
          console.log('About to update Firebase'); // Add this before Firebase update
          await updateFirebaseLaborProfilePicture(email, profilePicture, fullName);
            
        // fetchLabor()
        dispatch(setLaborer(response.data.updatedLabor))
        setAboutFromData(response.data.updatedLabor)
        toast.success('The profile updated succefully')
        setOpenEditProfile(false)
        dispatch(setLoading(false))
      } else {
        toast.error('faild to update profile...!')
      }
      
    } catch (error) {
       console.error('Error updating profile:', error);
    } finally {
      dispatch(setError({}))
      dispatch(setLoading(false))
    }
  }
  

  const handleConfirm = async () => {
      const PasswordErrror = validatePassword(password);
      dispatch(setLoading(true))
      if (PasswordErrror) {
        dispatch(setLoading(false))
        dispatch(setError(PasswordErrror));
        return; // Stop further execution
      }
  
      if (password !== confirmPassword) {
        
        dispatch(setLoading(false))
        dispatch(setError({ password: "Passwords do not match" }));
        return toast.error("Passwords do not match");
      }
  
      const PasswodData = {
        password,
        email : email
      }
  
      try {
        dispatch(setError({}));
        // console.log('this sthe the PasswodDatat ------+++++-------:',PasswodData)
        const response = await editPassword(PasswodData)
  
        if (response.status === 200) {
          setOpenChangePasswod(false)
          dispatch(setLoading(false))
          toast.success('Password updated successfully..')
        } else {
          toast.error('errro in passord update...>!')
        }
      } catch (error) {
        console.error("Error Password change:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        dispatch(setLoading(false))
      }
  };
  

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        skills: Array.isArray(prev.skills) 
          ? [...prev.skills, newSkill.trim()]
          : [newSkill.trim()]
      }));
      setNewSkill(''); // Clear input after adding
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove)
    }));
  };


  // console.log('This labor daata . skills and dispal  ++++ 8888888 *(****)', JSON.parse(laborData?.skill?.[0]))
   const parsedSkillsData = Array.isArray(laborData?.skill) ? JSON.parse(laborData.skill[0])  : typeof laborData?.skill === 'string'
      ? JSON.parse(laborData.skill)
      : [];
  console.log('Role   ++++ &&%%%parsedSkillsData',parsedSkillsData)
  // const handleAllDaysToggle = () => {
  //   const newAllStatus = !formData.availability.All;
  //   setFormData(prev => ({
  //     ...prev,
  //     availability: Object.keys(prev.availability).reduce((acc, day) => {
  //       acc[day] = day !== 'All' ? newAllStatus : newAllStatus;
  //       return acc;
  //     }, {})
  //   }));
  // };

  
  //  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
  //   const laborRole = useSelector((state: RootState) => state.labor.laborer.role);
  //   const userRole = useSelector((state: RootState) => state.user);
  
  
  //     console.log('Role required')
  //     console.log('Is Labor Authenticated:', isLaborAuthenticated);
  //     console.log('Labor Role:', laborRole);
  //     console.log('user Role:', userRole);

    // const handleLogoutLabor = async () => {
    //   console.log('this is logout going logooiiu :')
    //   const response = await logout()
    //   console.log('this is logout response :',response)
      
        
    //     if (response.status === 200) {
    //       localStorage.removeItem('LaborAccessToken');
    //         dispatch(resetUser())
    //         dispatch(resetLaborer())
    //         dispatch(setLaborer({}))
    //         dispatch(setFormData({}))
    //       dispatch(setIsLaborAuthenticated(false))
    //       await persistor.purge();
    //         toast('logout successfully....!')
    //         navigate('/');
    //     }
  // }

  console.log("Thsi sieth laborData +++++{{{{{{{}}}}}}} :",formData) 
  
  if (!currentUser && !user?._id) {
  return null;
  }
  

  // console.log("This is the user object length ++___))((((()))))::", Object.keys(Laborer).length === 0)
  console.log("This is the leabor emeaillll+___))((((()))))::", user?.email)

// Updated chat creation function
const handleChatPage = async (user) => {
  console.log("The chatting page is triggering ;;;");
  const laborEmail = user?.email;
  if (!laborEmail) {
    console.log("Labor email is undefined");
    return;
  }

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("User not authenticated");
      return;
    }

    const laborId = await findLaborIdByEmail(laborEmail);
    if (!laborId) {
      console.log("Labor not found");
      return;
    }

    console.log("Firebase labor email:", laborEmail);
    console.log("Firebase userId:", userId);
    console.log("Firebase laborId:", laborId);

    const db = getFirestore(app);
    
    // Create or get chat document
    const chatRef = query(
      collection(db, 'Chats'),
      where('userId', '==', userId),
      where('laborId', '==', laborId)
    );

    const chatSnapshot = await getDocs(chatRef);
    let chatId;

    if (chatSnapshot.empty) {
      // Create new chat if it doesn't exist
      const newChat = {
        userId: userId,
        laborId: laborId,
        lastMessage: "",
        lastUpdated: serverTimestamp(),
        quoteSent: false,
        lastReadTimestamp: serverTimestamp(),  // Mark the time when chat was first created
      };
      const newChatRef = await addDoc(collection(db, 'Chats'), newChat);
      chatId = newChatRef.id;
      console.log("New chat created with ID:", chatId);
    } else {
      // Use existing chat
      chatId = chatSnapshot.docs[0].id;
      console.log("Existing chat found with ID:", chatId);

      // Mark as read by updating lastReadTimestamp
      const chatDocRef = doc(db, 'Chats', chatId);
      await updateDoc(chatDocRef, {
        lastReadTimestamp: serverTimestamp()  // Update the lastReadTimestamp to the current time
      });
      console.log("Chat marked as read");
    }

    // Navigate to chat page
    navigate(`/chatingPage`, { state: { user, chatId } });
    
  } catch (error) {
    console.error("Error in handleChatPage:", error);
    throw error;
  }
};

// Function to find labor ID by email
const findLaborIdByEmail = async (email) => {
  if (!email) {
    console.log("Invalid email value");
    return null;
  }

  const db = getFirestore(app); // Ensure you are using the correct Firestore instance

  const laborRef = collection(db, 'Labors');
  const q = query(laborRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];  // Assuming one labor matches the email
    return doc.id; // Return the labor document ID (laborId)
  } else {
    return null;  // Return null if no labor is found
  }
  };
  
    const breadcrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'LaborListing Page', link: '/laborListing' }, // No link for the current page
      { label: 'LaborProfile Page', link: null }, // No link for the current page
    ];


   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const LaborDetails = user ? user : Laborer ? Laborer : null;


  console.log('This si the usek kkkkkkkk',LaborDetails)
  

  return (
    <>
      {loading && <div className="loader"></div>}

      {openChangePassword && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 `}
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300 `}
          >
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Update password
            </h2>
            <p className="text-gray-600 mt-2">Enter your new Password</p>

            <div className="flex flex-col justify-center mt-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 bg-white text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error?.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            <div className="flex flex-col justify-center mt-4">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 bg-white text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setOpenChangePasswod(false)}
                className="px-4 py-2 w-full bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 w-full bg-orange-500 text-white rounded hover:bg-orange-600 transition ease-in-out"
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {theam === "light" ? (
        <>
          {openEditProfile && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Edit className="mr-2 text-[#5560A8]" /> Edit Profile
                  </h2>
                  <button
                    onClick={() => setOpenEditProfile(false)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                      Personal Information
                    </h3>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <User className="mr-2 text-[#5560A8]" /> First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        />
                        {error?.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.firstName}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <User className="mr-2 text-[#5560A8]" /> Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        />
                        {error?.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="mr-2 text-[#5560A8]" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={laborData?.email}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none cursor-default focus:ring-2 focus:ring-[#5560A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="mr-2 text-[#5560A8]" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span className="mr-2 text-[#5560A8]">Start Time</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.startTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.startTime}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span className="mr-2 text-[#5560A8]">End Time</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.endTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Profile Image and Additional Details */}
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                        <img
                          src={
                            formData.image
                              ? URL.createObjectURL(formData.image)
                              : laborData?.profilePicture || ""
                          }
                          alt="Profile"
                          className="rounded-full border w-full h-full object-cover"
                        />
                      </div>
                      <label
                        htmlFor="imageUpload"
                        className="bg-[#5560A8] text-white px-4 py-2 rounded-full text-sm cursor-pointer"
                      >
                        Upload Profile Picture
                      </label>
                      <input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="mr-2 text-[#5560A8]" /> Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        readOnly
                        className="w-full px-3 py-2 border cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Globe className="mr-2 text-[#5560A8]" /> Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arabic">Arabic</option>
                        {/* Add more languages as needed */}
                      </select>
                      {error?.language && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.language}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
                    <Calendar className="mr-2 text-[#5560A8]" /> Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability[day]}
                          onChange={() => handleAvailabilityChange(day)}
                          className="form-checkbox text-[#5560A8]"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability.All}
                        onChange={handleAllDaysChange}
                        className="form-checkbox text-[#5560A8]"
                      />
                      <span>All Days</span>
                    </label>
                    {error?.availability && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.availability}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categories
                    </label>
                    <input
                      type="text"
                      name="categories"
                      value={laborData?.categories}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibilities
                    </label>
                    <input
                      type="text"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Skills</h3>

                  {/* Skills List */}
                  <div className="space-y-2">
                    {Array.isArray(formData.skills) &&
                      formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Add Skill Input */}
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add a new skill (press Enter to add)"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                  />

                  {/* Error Display */}
                  {error?.skills && (
                    <p className="text-red-500 text-sm">{error.skills}</p>
                  )}
                </div>

                {/* Change Password */}
                <div className="mt-6 flex justify-center">
                  <button
                    className="flex items-center bg-[#5560A8] text-white px-4 py-2 rounded-full"
                    onClick={() => setOpenChangePasswod(true)}
                  >
                    <Lock className="mr-2" /> Change Password
                  </button>
                </div>

                {/* Save Changes */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setOpenEditProfile(false)}
                    className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-[#5560A8] text-white rounded-full hover:bg-opacity-90"
                    onClick={handleSubmitEditProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {openEditProfile && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#74c5c6] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Edit className="mr-2 text-[#5560A8]" /> Edit Profile
                  </h2>
                  <button
                    onClick={() => setOpenEditProfile(false)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                      Personal Information
                    </h3>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <User className="mr-2 text-[#5560A8]" /> First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 bg-[#0e5962] py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        />
                        {error?.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.firstName}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <User className="mr-2 text-[#5560A8]" /> Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        />
                        {error?.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="mr-2 text-[#5560A8]" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={laborData?.email}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none cursor-default focus:ring-2 focus:ring-[#5560A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="mr-2 text-[#5560A8]" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span className="mr-2 text-[#5560A8]">Start Time</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.startTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.startTime}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span className="mr-2 text-[#5560A8]">End Time</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      />
                      {error?.endTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Profile Image and Additional Details */}
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                        <img
                          src={
                            formData.image
                              ? URL.createObjectURL(formData.image)
                              : laborData?.profilePicture || ""
                          }
                          alt="Profile"
                          className="rounded-full bg-[#0e5962] w-full h-full object-cover"
                        />
                      </div>
                      <label
                        htmlFor="imageUpload"
                        className="bg-[#5560A8] text-white px-4 py-2 rounded-full text-sm cursor-pointer"
                      >
                        Upload Profile Picture
                      </label>
                      <input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="mr-2 text-[#5560A8]" /> Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0e5962] cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Globe className="mr-2 text-[#5560A8]" /> Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                      >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arabic">Arabic</option>
                        {/* Add more languages as needed */}
                      </select>
                      {error?.language && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.language}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
                    <Calendar className="mr-2 text-[#5560A8]" /> Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-black">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability[day]}
                          onChange={() => handleAvailabilityChange(day)}
                          className="form-checkbox text-[#5560A8]"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability.All}
                        onChange={handleAllDaysChange}
                        className="form-checkbox text-[#5560A8]"
                      />
                      <span>All Days</span>
                    </label>
                    {error?.availability && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.availability}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categories
                    </label>
                    <input
                      type="text"
                      name="categories"
                      value={laborData?.categories}
                      readOnly
                      className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibilities
                    </label>
                    <input
                      type="text"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Skills
                  </h3>

                  {/* Skills List */}
                  <div className="space-y-2">
                    {Array.isArray(formData.skills) &&
                      formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-[#0e5962] p-2 rounded-md"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Add Skill Input */}
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add a new skill (press Enter to add)"
                    className="w-full px-3  py-2 bg-[#0e5962] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5560A8]"
                  />

                  {/* Error Display */}
                  {error?.skills && (
                    <p className="text-red-500 text-sm">{error.skills}</p>
                  )}
                </div>

                {/* Change Password */}
                <div className="mt-6 flex justify-center">
                  <button
                    className="flex items-center bg-[#5560A8] text-white px-4 py-2 rounded-full"
                    onClick={() => setOpenChangePasswod(true)}
                  >
                    <Lock className="mr-2" /> Change Password
                  </button>
                </div>

                {/* Save Changes */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setOpenEditProfile(false)}
                    className="px-6 py-2 border  bg-[#99362d] border-gray-300 rounded-full  "
                  >
                    Cancel
                  </button>

                  <button
                    className="px-6 py-2 bg-[#5560A8] text-white rounded-full hover:bg-opacity-90"
                    onClick={handleSubmitEditProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="w-full relative">
        {/* Background Image */}
        <div className="relative">
          <img
            src={BgImage}
            alt="Profile"
            className="w-full h-[150px] sm:h-[200px] md:h-[234px] lg:h-[240px] object-cover"
          />

          {theam === "light" ? (
            <>
              <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
                <Breadcrumb items={breadcrumbItems} currentPage={currentPage} />
                <nav className=" py-3 px-4 sm:px-6 md:px-8 ">
                  {" "}
                  {/* chnge the px ------------------------*/}
                </nav>
              </div>
            </>
          ) : (
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
              <nav className=" py-3 px-4 sm:px-6 md:px-8 ">
                <div className="max-w-7xl mx-auto">
                  <ol className="flex items-center space-x-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <a
                        href="/"
                        className=" transition-colors duration-200 flex items-center"
                      >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 " />
                        <span className="ml-1 hidden sm:inline">Home</span>
                      </a>
                    </li>

                    <li className="flex items-center ">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </li>

                    <li className="flex items-center">
                      <a
                        href="/profile"
                        className="  transition-colors duration-200 flex items-center"
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="ml-1">Profile</span>
                      </a>
                    </li>
                  </ol>
                </div>
              </nav>
            </div>
          )}

          {/* Breadcrumb */}
        </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 relative md:-mt-[90px] sm:-mt-16 -mt-16">
            {/* Left Column - Profile Image and Details */}

            {/* Left Column - Profile Image and Details */}
            <div className="lg:w-1/2 relative">
              {/* Profile Image and Rating Container */}
              <div className="flex flex-col lg:flex-row">
                {/* Profile Image */}
                <div className="flex justify-center lg:justify-start lg:ml-6 md:-mt-4">
                  <img
                    src={laborData?.profilePicture}
                    alt="Profile"
                    className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] rounded-full border-4 shadow-lg object-cover"
                  />
                </div>

                {/* Rating Stars and Actions */}
                <div className="lg:ml-auto lg:mr-4 mt-4 lg:mt-24 flex flex-col items-center lg:items-end space-y-3">
                  {/* Stars and Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(LaborDetails?.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {LaborDetails?.rating?.toFixed(1)}
                    </span>
                    <span className="">
                      ({LaborDetails?.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  {Laborer && Object.keys(Laborer).length > 0 && (
                    <>
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-4">
                        <button
                          className="flex w-[200px]  items-center gap-2 px-4 py-2 text-sm font-medium  text-white bg-[#5560A8]  rounded-full  transition-colors"
                          onClick={handleEditProfile}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                        <button className="flex w-[200px] items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5560A8]   rounded-full  transition-colors">
                          <Wallet className="w-4 h-4" />
                          My Wallet
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              {theam === "light" ? (
                <div className="-md:mt-7 md:justify-center flex sm:justify-center lg:justify-start justify-center bg-white rounded-xl p-6 ">
                  <div className="space-y-4">
                    {/* Name Section */}
                    <div className="text-center lg:text-left">
                      <div className="font-semibold font-[Rockwell] lg:ml-0  text-[33px] md:text-[43px]">
                        {laborData?.firstName} {laborData?.lastName}
                      </div>
                      {/* <div className="font-semibold font-[Rockwell] lg:ml-20  text-[23px]  md:text-[23px]">
                        
                      </div> */}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-4"></div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      {/* <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">{laborData?.phone}</span>
                      </div> */}
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">
                          {laborData?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">
                          {laborData?.address}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        {/* Availability */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6">
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">
                              {laborData?.availability
                                ? laborData.availability.join(", ")
                                : "No availability"}
                            </span>
                          </div>
                        </div>

                        {/* Start Time */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-800">
                            Start: {laborData?.startTime || "N/A"}
                          </span>
                        </div>

                        {/* End Time */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Clock className="w-5 h-5 text-red-600" />
                          <span className="text-gray-800">
                            End: {laborData?.endTime || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">
                          {laborData?.language}
                        </span>
                      </div>
                    </div>

                    {/* Save Button */}
                    {Object.keys(Laborer).length === 0 &&
                      (user || Object.keys(user).length !== 0) && (
                        <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <Heart className="w-5 h-5 text-gray-600" />
                          <span>Save</span>
                        </button>
                      )}
                  </div>
                </div>
              ) : (
                <div className="-md:mt-7 md:justify-center flex sm:justify-center lg:justify-start justify-center rounded-xl p-6 ">
                  <div className="space-y-4">
                    {/* Name Section */}
                    <div className="text-center lg:text-left">
                      <div className="font-semibold font-[Rockwell] lg:ml-0  text-[33px] md:text-[43px]">
                        {laborData?.firstName} {laborData?.lastName}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-4"></div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 " />
                        <span className="">+91 9876543210</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 " />
                        <span className=""> {laborData?.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 " />
                        <span className="">{laborData?.address}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        {/* Availability */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6">
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <CalendarDaysIcon className="w-5 h-5" />
                            <span className="">
                              {laborData?.availability
                                ? laborData.availability.join(", ")
                                : "No availability"}
                            </span>
                          </div>
                        </div>

                        {/* Start Time */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="">
                            Start: {laborData?.startTime || "N/A"}
                          </span>
                        </div>

                        {/* End Time */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Clock className="w-5 h-5 text-red-600" />
                          <span className=" ">
                            End: {laborData?.endTime || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 " />
                        <span className="">{laborData?.language}</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-md hover:bg-gray-500 transition-colors">
                      <Heart className="w-5 h-5 " />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Box */}
            {theam === "light" ? (
              <div className="lg:w-[400px] lg:ml-36 sm:w-full">
                <div className="border bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="space-y-7">
                    <h2 className="text-center font-[Rockwell] lg:text-[25px] md:text-[16px] sm:text-[12px] font-semibold border-b-2  pb-2">
                      Expert {laborData?.categories[0]}
                    </h2>

                    <div>
                      <h4 className="font-semibold mb-3">Expertise:</h4>
                      <ul className="list-disc pl-5 font-[roboto] space-y-2 marker:text-[#21A391]">
                        {parsedSkillsData.map((skill, index) => (
                          <li
                            key={index}
                            className="md:text-base lg:text-lg font-medium"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(!Laborer || Object.keys(Laborer).length === 0) && (
                      <div className="flex justify-center pt-4">
                        <button
                          className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
                          onClick={() => handleChatPage(user)}
                        >
                          <span className="md:text-base lg:text-lg font-[Roboto] cursor-pointer">
                            Booking & Start Chating
                          </span>
                          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                            <div className="relative h-full w-10 bg-white/20"></div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {Laborer && Object.keys(Laborer).length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-4 sm:space-y-0 lg:mt-[195px] md:mt-[34px] sm:mt-[34px] mt-[45px]">
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      Total Works and Earnings
                    </button>
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      View Current Status
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="lg:w-[400px] lg:ml-36 sm:w-full">
                <div className="border bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg shadow-gray-900">
                  <div className="space-y-7">
                    <h2 className="text-center font-[Rockwell] lg:text-[25px] md:text-[16px] sm:text-[12px] font-semibold border-b-2 border-gray-700 pb-2 text-gray-200">
                      Expert Electrician
                    </h2>

                    <div>
                      <h4 className="font-semibold mb-3 text-gray-300">
                        Expertise:
                      </h4>
                      <ul className="list-disc pl-5 font-[Roboto] space-y-2 marker:text-[#21A391] text-gray-300">
                        <li className="md:text-base lg:text-lg font-medium">
                          Residential Electrical Systems
                        </li>
                        <li className="md:text-base lg:text-lg font-medium">
                          Commercial Electrical Installations
                        </li>
                        <li className="md:text-base lg:text-lg font-medium">
                          Wiring and Circuit Design
                        </li>
                        <li className="md:text-base lg:text-lg font-medium">
                          Lighting Installation and Repair
                        </li>
                      </ul>
                    </div>

                    {(!Laborer || Object.keys(Laborer).length === 0) && (
                      <div className="flex justify-center pt-4">
                        <button
                          className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#1E3A8A] dark:bg-[#0F172A] px-6 py-2 text-base font-semibold text-white dark:text-gray-200 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 dark:hover:shadow-blue-900/50 border border-white/20 dark:border-blue-500/30"
                          onClick={() => handleChatPage(user)}
                        >
                          <span className="md:text-base lg:text-lg font-[Roboto] cursor-pointer">
                            Booking & Start Chatting
                          </span>
                          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                            <div className="relative h-full w-10 bg-white/20 dark:bg-blue-400/20"></div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {Laborer && Object.keys(Laborer).length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-4 sm:space-y-0 lg:mt-[195px] md:mt-[34px] sm:mt-[34px] mt-[45px]">
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      Total Works and Earnings
                    </button>
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      View Current Status
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="underLine h-[3px] bg-[#ECECEC] flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div>

      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="sm:max-w-3xl md:max-w-[1200px] mx-auto">
          {/* About Me Header */}
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[19px] font-semibold  mb-6">
            About Me
          </h2>

          {/* {Laborer && Object.keys(Laborer).length > 0 ? (
            <>
            
            </>
          ) : (
              <div className="space-y-4 lg:space-y-0">
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  I am {laborData?.aboutMe?.name}, a highly skilled and experienced
                  professional with over {laborData?.aboutMe?.experience} of
                  experience in the field.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  {laborData?.aboutMe?.description}
                </p>
              </div> 
          )} */}
          {/*           
          {laborData?.aboutMe ? (
            <>
              <div className="space-y-4 lg:space-y-0">
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  I am {laborData.aboutMe.name}, a highly skilled and experienced
                  professional with over {laborData.aboutMe.experience} of
                  experience in the field.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  {laborData.aboutMe.description}
                </p>
              </div>
            </>
          ) : (
              <div className="text-center">
              {Laborer && Object.keys(Laborer).length > 0 && (
            
              <button
                onClick={() => setOpenAbout(true)}
                className="bg-[#21A391] text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add About You
              </button>
               )}
            </div>
          )} */}

          <div className="space-y-4 lg:space-y-0">
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
              I am {Laborer?.aboutMe?.name || user?.aboutMe?.name}, a highly
              skilled and experienced professional with over{" "}
              {Laborer?.aboutMe?.experience || user?.aboutMe?.experience} of
              experience in the field.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
              {Laborer?.aboutMe?.description || user?.aboutMe?.description}
            </p>
          </div>

          {!submittedData &&
            (!Laborer?.aboutMe || Object.keys(Laborer?.aboutMe).length === 0) &&
            (!user || Object.keys(user).length === 0) && (
              <button
                onClick={() => setOpenAbout(true)}
                className="bg-[#21A391] text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add About You
              </button>
            )}

          {/* {submittedData  ? (
            <>
              <div className="space-y-4 lg:space-y-0">
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  I am {submittedData.name}, a highly skilled and experienced
                  professional with over {submittedData.experience} of
                  experience in the field.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                  {submittedData.description}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              {Laborer && Object.keys(Laborer).length > 0 && (
            
              <button
                onClick={() => setOpenAbout(true)}
                className="bg-[#21A391] text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add About You
              </button>
               )}
            </div>
          )} */}

          {/* Modal */}
          {openAbout && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
                <h3 className="text-xl font-semibold mb-4">Add About You</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={AboutFromData.name}
                  onChange={handleInputChangeAbout}
                  className="w-full p-2 mb-3 border rounded-lg"
                />
                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (e.g., 10 years)"
                  value={AboutFromData.experience}
                  onChange={handleInputChangeAbout}
                  className="w-full p-2 mb-3 border rounded-lg"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={AboutFromData.description}
                  onChange={handleInputChangeAbout}
                  className="w-full p-2 mb-3 border rounded-lg"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setOpenAbout(false)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#21A391] text-white px-4 py-2 rounded-lg"
                  >
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Read More Button */}
          {/* console.log("This is the user object length ++___))((((()))))::", )
  console.log("This is the user object length ++___))((((()))))::", ) */}
          {Object.keys(Laborer).length !== 0 && (
            <div className="mt-8">
              <button
                className="group relative inline-block text-[#21A391] text-sm sm:text-base md:text-lg lg:text-[17px] font-semibold transition-colors duration-300 hover:text-[#1a8275]"
                onClick={handleEdit}
              >
                EDIT
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#21A391] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>
            </div>
          )}

          {/* {(submittedData && (!Laborer?.aboutMe || Object.keys(Laborer?.aboutMe).length > 0) && (Object.keys(user).length === 0)) && (
             
          )} */}
        </div>
      </div>

      <div className="underLine h-[3px] bg-[#ECECEC]  flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div>

      {/* ReviewSeciotn  */}

      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        {LaborDetails?.reviews && LaborDetails.reviews.length > 0 ? (
          LaborDetails.reviews.map((review, index) => (
            <div key={index} className="sm:max-w-3xl md:max-w-[1200px] mx-auto">
              <div className="space-y-6 lg:space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center">
                  {/* Container for image and user info in mobile */}
                  <div className="w-full flex items-start mb-4 lg:mb-0">
                    {/* User Image */}
                    <div className="flex-shrink-0 lg:mr-4">
                      {review.imageUrl?.[0] && (
                        <img
                          className="w-16 h-16 rounded-full object-cover"
                          src={review.imageUrl[0]}
                          alt="User Avatar"
                        />
                      )}
                    </div>

                    {/* User Info Container */}
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold">
                        {review.reviewerName}
                      </h3>
                      <div className="flex items-center space-x-3 mb-2">
                        {/* Star Rating */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-5 h-5 ${
                                i < Math.round(LaborDetails.rating) ? "fill-[#FFD700] text-[#FFD700]" : "fill-gray-300 text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.27l4.47 2.34-1.25-5.17 3.97-3.86-5.2-.45L10 0l-2.99 7.13-5.2.45 3.97 3.86-1.25 5.17L10 15.27z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px] mt-2">
                  {review.reviewText}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews available.</p>
        )}

        <div className="mt-8 text-center">
          <button className="group relative inline-block text-[#21A391] text-sm sm:text-base md:text-lg lg:text-[17px] font-semibold transition-colors duration-300 hover:text-[#1a8275]">
            More Reviews
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#21A391] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
        </div>
      </div>

      <div className="underLine h-[3px] bg-[#ECECEC] flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div>

      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="sm:max-w-3xl md:max-w-[1200px] mx-auto">
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[19px] font-semibold mb-12">
            Similar Labors
          </h2>
          <div className="space-y-6 lg:space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              {/* Container for image and user info in mobile */}
              <div className="w-full flex items-start mb-4 lg:mb-0">
                {/* User Image */}
                <div className="flex-shrink-0 lg:mr-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={char}
                    alt="User Avatar"
                  />
                </div>

                {/* User Info Container */}
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold ">Alexander</h3>
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-[#21A391]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27l4.47 2.34-1.25-5.17 3.97-3.86-5.2-.45L10 0l-2.99 7.13-5.2.45 3.97 3.86-1.25 5.17L10 15.27z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm ">May 08, 2024</span>
                  </div>
                  <h3 className="text-[12px] font-semibold ">Electrician</h3>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              <span className="font-semibold">Expertise :</span> Residential
              Electrical Systems , Wiring and Circuit Design
            </p>
          </div>
        </div>
      </div>

      {/* <div className="underLine h-[3px] bg-gray-200 flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1100px] my-4"></div>    */}

      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-1">
        <div className="sm:max-w-3xl md:max-w-[1200px] mx-auto">
          <div className="space-y-6 lg:space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              {/* Container for image and user info in mobile */}
              <div className="w-full flex items-start mb-4 lg:mb-0">
                {/* User Image */}
                <div className="flex-shrink-0 lg:mr-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={char}
                    alt="User Avatar"
                  />
                </div>

                {/* User Info Container */}
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold ">Alexander</h3>
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-[#21A391]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27l4.47 2.34-1.25-5.17 3.97-3.86-5.2-.45L10 0l-2.99 7.13-5.2.45 3.97 3.86-1.25 5.17L10 15.27z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm ">May 08, 2024</span>
                  </div>
                  <h3 className="text-[12px] font-semibold ">Electrician</h3>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              <span className="font-semibold">Expertise :</span> Residential
              Electrical Systems , Wiring and Circuit Design
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LaborProfile
