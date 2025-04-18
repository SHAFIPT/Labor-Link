import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"
import { useEffect, useState } from "react"
import { setIsLaborAuthenticated, setLaborer, resetLaborer ,setError, setLoading} from "../../../redux/slice/laborSlice"
import { resetUser, setAccessToken, setisUserAthenticated, setUser } from '../../../redux/slice/userSlice'
import { toast } from "react-toastify"
import { useLocation, useNavigate } from "react-router-dom"
import BgImage from '../../../assets/image 6.png'
import {auth} from '../../../utils/firbase';
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
import { motion } from "framer-motion"; // For smooth animations
import '../../Auth/LoadingBody.css'
import { Phone, Mail, MapPin, Clock,Globe, Star, Edit, User ,
  Calendar, 
  Lock,
    X  } from 'lucide-react';
import './LaborProfile.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { aboutMe, editPassword, fetchLaobrs, laborFetch, updateProfile } from "../../../services/LaborServices"
import { validateAvailability, validateEndTime, validateFirstName, validateLanguage, validateLastName, validatePassword, validatePhoneNumber, validateSkill, validateStartTime } from "../../../utils/laborRegisterValidators"
import { ILaborer } from "../../../@types/labor"
import { getDocs, query, collection, where, updateDoc, doc, getFirestore, serverTimestamp, addDoc } from "firebase/firestore";
import { db , app } from '../../../utils/firbase';
import Breadcrumb from "../../BreadCrumb"
import { sendPasswordResetEmail } from "firebase/auth"
import { IUser } from "../../../@types/user"
import { FirebaseError } from "firebase/app"
import { HttpStatus } from "../../../enums/HttpStaus"
import { Messages } from "../../../constants/Messages"

interface LaborData {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address: string;
  profilePicture?: string;
  language: string;
  skill?: string | string[]; // Ensure skill is defined
  responsibility?: string;
  availability: string[]; // Assuming it's an array of strings
  startTime?: string;
  endTime?: string;
  categories?: string[]; 
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerProfile: string; // Profile picture URL
  createdAt: string; // or Date, depending on your data type
  reviewText: string;
  rating: number;
  imageUrl?: string[]; // Optional array of image URLs
}

const LaborProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theam = useSelector((state: RootState) => state.theme.mode)
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated); 
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
  const Laborer = useSelector((state: RootState) => state.labor.laborer)
  const email = useSelector((state : RootState) => state.labor.laborer.email)
  const loading = useSelector((state : RootState) => state.labor.loading)
  const currentUser = useSelector((state: RootState) => state.labor.laborer._id)
  const { state: user } = useLocation();
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop()|| "defaultPage"; 
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [laborData, setLaborData] = useState<LaborData | null>(null);
  const [openAbout, setOpenAbout] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [openChangePassword, setOpenChangePasswod] = useState(false)
  const [similorLabors, setSimilorLabors] = useState<ILaborer[]>([])
  const [AboutFromData, setAboutFromData] = useState({
    name: "",
    experience: "",
    description: "",
  })
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [submittedData] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
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
  image: File | null;
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
  } = useSelector((state: RootState) => state.labor.error) ?? {}

  const laborId = user?._id;
  const categorie = user?.categories?.[0];
  const latitude = user?.location?.coordinates?.[1]; 
  const longitude = user?.location?.coordinates?.[0];

useEffect(() => {
  const fetchSimilarLabors = async () => {
    if (latitude && longitude && categorie && laborId) {
      const response = await fetchLaobrs({ latitude, longitude, categorie, laborId }); 
      const { labors } = response.data
      setSimilorLabors(labors)
    }
  };

  fetchSimilarLabors();
}, [latitude, longitude, categorie, laborId]); 


    const handleEditProfile = () => {
  // Parse the availability from the string array
   const availableDays = laborData?.availability 
  ? laborData.availability.join(", ")
  : "No availability"
     const parsedSkills = (() => {
  try {
    if (Array.isArray(laborData?.skill)) {
      return JSON.parse(laborData.skill[0]);
    } else if (typeof laborData?.skill === 'string') {
      return JSON.parse(laborData.skill);
    }
  } catch (error) {
    console.warn("Could not parse skills:", error);
  }
  return []; // Default to empty array if parsing fails
})();

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
  
        const { fetchUserResponse } = data
        dispatch(setLaborer(fetchUserResponse))
      } catch (error) {
         if (error instanceof Error) {
          console.error("Error message:", error.message);
        } else {
          console.error("Unknown error:", error);
        
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

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };


 // Handle individual day change
const handleAvailabilityChange = (day: keyof typeof formData.availability) => {
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

  
const prepareAvailabilityForSubmission = () => {
  const days = Object.keys(formData.availability)
    .filter(day => day !== 'All' && formData.availability[day as keyof typeof formData.availability]) // ✅ Explicitly cast `day`
    .map(day => day.toLowerCase());

  // Validate availability
  const availabilityError = validateAvailability(days);
  if (availabilityError) {
    dispatch(setError({ availability: availabilityError }));
  }

  return days;
};

  useEffect(() => {
  if (Laborer && Object.keys(Laborer).length > 0) { 
   const LaborfullAddress = Laborer?.address 
      ? `${Laborer.address.city || ''}, ${Laborer.address.state || ''}, ${Laborer.address.postalCode || ''}, ${Laborer.address.country || ''}`.trim()
      : '';
    
    setLaborData({
      ...Laborer,
      address: LaborfullAddress,
      categories: Array.isArray(Laborer.categories) ? Laborer.categories :[Laborer.categories].filter(Boolean),
    });
  } else if (user) {
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
  }
}, [Laborer, user]);

  

  const handleInputChangeAbout = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)  => {
    const { name, value } = e.target;
    setAboutFromData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async () => {
  const userId = currentUser || user?._id;
   
  if (!userId) return;

  const newData = {
    userId,
    name: AboutFromData.name,
    experience: AboutFromData.experience,
    description: AboutFromData.description
  };

  setOpenAbout(false);
  setIsEditing(false);


  try {

    const response = await aboutMe(newData)

    const { AboutMe } = response.data

    if (response.status === HttpStatus.OK) {

       dispatch(setLaborer({
      ...Laborer,
      aboutMe: AboutMe, // Update only the aboutMe field
    }));
      toast.success(Messages.ABOUT_PAGE_UPLOADED_SUCCESSFULY)
    } else {
      toast.error('Errro in about me')
    }
    
  } catch (error) {
    console.error("Network error:", error);
    toast.error("about udpataing error")
  }
  };
  

const updateFirebaseLaborProfilePicture = async (
  email: string,
  profilePictureUrl: string | undefined,
  name: string | undefined
): Promise<void> => {
  try {
    // Query the labor by email
    const usersRef = collection(db, "Labors");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Loop through matching documents and update
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const userDocRef = doc(db, "Labors", docSnapshot.id);

        // Ensure no undefined values are passed
        await updateDoc(userDocRef, {
          profilePicture: profilePictureUrl || "",
          name: name || "",
        });
      });

      await Promise.all(updatePromises);
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
        formDataToSubmit.append('profilePicture', formData.image, formData.image.name);
      }

      const response = await updateProfile(formDataToSubmit);
      
      if (response.status === HttpStatus.OK) {

        const { profilePicture, firstName, lastName } = response.data.updatedLabor

           const fullName = `${firstName} ${lastName}`.trim();

          await updateFirebaseLaborProfilePicture(email, profilePicture, fullName);
            
        // fetchLabor()
        dispatch(setLaborer(response.data.updatedLabor))
        setAboutFromData(response.data.updatedLabor)
        toast.success(Messages.FAILD_TO_UPDATE_PROFILE)
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

  const handleFirebasePasswordReset = async (userEmail : string) => {
            // Ensure email is properly formatted and validated
            if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
                toast.error("Valid email is required for Firebase password reset");
                return;
            }
            
            try {
                // Send Firebase password reset email
                await sendPasswordResetEmail(auth, userEmail.trim());
                toast.info("A password reset email has been sent to your email address. Please check your inbox to complete the Firebase authentication update.");
             } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                // Now TypeScript knows that error has a 'code' property
                console.error("Failed to send Firebase password reset email:", error);
    
                if (error.code === 'auth/invalid-email') {
                    toast.error("The email address format is not valid. Please check your email.");
                } else if (error.code === 'auth/user-not-found') {
                    toast.info("If you haven't used Firebase login before, you may need to create an account first.");
                } else {
                    toast.warning("There was an issue sending the password reset email. You may need to use the 'Forgot Password' option at login if you have trouble signing in.");
                }
            } else {
                // Handle other errors that aren't Firebase errors
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    };
    
  

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
        const response = await editPassword(PasswodData)
  
        if (response.status === HttpStatus.OK) {
           await handleFirebasePasswordReset(email);
            setOpenModal(true);
          dispatch(setLoading(false))
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
  

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleRemoveSkill = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      skills: Array.isArray(prev.skills) 
        ? prev.skills.filter((_, index) => index !== indexToRemove) 
        : prev.skills // If skills is not an array, return it as-is
    }));
  };


   const parsedSkillsData: string[] = (() => {
  try {
    if (Array.isArray(laborData?.skill)) {
      return JSON.parse(laborData.skill[0]);
    } else if (typeof laborData?.skill === "string") {
      return JSON.parse(laborData.skill);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error parsing skills data:", error);
    return [];
  }
})();
  
  if (!currentUser && !user?._id) {
  return null;
  }

// Updated chat creation function
const handleChatPage = async (user: IUser) => {
  const laborEmail = user?.email;

  try {
    const userId = auth.currentUser?.uid;

    const laborId = await findLaborIdByEmail(laborEmail);
    const db = getFirestore(app);

    // Create or get chat document
    const chatRef = query(
      collection(db, "Chats"),
      where("userId", "==", userId),
      where("laborId", "==", laborId)
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
        lastReadTimestamp: serverTimestamp(), // Mark the time when chat was first created
      };
      const newChatRef = await addDoc(collection(db, "Chats"), newChat);
      chatId = newChatRef.id;
    } else {
      // Use existing chat
      chatId = chatSnapshot.docs[0].id;

      // Mark as read by updating lastReadTimestamp
      const chatDocRef = doc(db, "Chats", chatId);
      await updateDoc(chatDocRef, {
        lastReadTimestamp: serverTimestamp(), // Update the lastReadTimestamp to the current time
      });
    }

    // Navigate to chat page
    navigate(`/chatingPage`, { state: { user, chatId } });
  } catch (error) {
    console.error("Error in handleChatPage:", error);
    throw error;
  }
};

// Function to find labor ID by email
const findLaborIdByEmail = async (email  : string) => {
  if (!email) {
    toast.error("Invalid email value");
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
      isLaborAuthenticated
        ? { label: 'LaborDashBoard', link: '/labor/laborDashBoard' }
        : { label: 'LaborListing Page', link: '/laborListing' },
      { label: 'LaborProfile Page', link: undefined }, // No link for the current page
    ];
      
   const currentPages = location.pathname.split("/").pop()|| "defaultPage"; 


   const formatDate = (dateString : string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const LaborDetails = user ? user : Laborer ? Laborer : null;
  
  const showMoreReviews = () => {
    setVisibleReviews(LaborDetails.reviews.length);
  };

  const showLessReviews = () => {
    setVisibleReviews(3);
  };
  
    const handleNavigeProfilePage = (user : ILaborer) => {
      navigate("/labor/ProfilePage", { state: user });
  };

  const daysOfWeek: Array<keyof typeof formData.availability> = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
       {theam === "light" ? (
              <>
                {openModal && (
                  <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        p: 2,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ textAlign: "center", p: 3 }}
                    >
                      {/* Animated Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
                      </motion.div>
      
                      {/* Title */}
                      <DialogTitle
                        sx={{ fontSize: "20px", fontWeight: "600", mt: 2 }}
                      >
                        Password Reset Email Sent
                      </DialogTitle>
      
                      {/* Message */}
                      <DialogContent>
                        <Typography
                          variant="body1"
                          sx={{ color: "#555", fontSize: "16px", mt: 1 }}
                        >
                          A password reset link has been sent to your email. Please
                          check your inbox and set your new password.
                        </Typography>
                      </DialogContent>
      
                      {/* Button */}
                      <DialogActions sx={{ mt: 2 }}>
                        <Button
                          onClick={handleCloseModal}
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #007BFF 0%, #0056D2 100%)",
                            color: "white",
                            borderRadius: "8px",
                            px: 4,
                            "&:hover": { background: "#0056D2" },
                          }}
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                )}
              </>
            ) : (
              <>
                {openModal && (
                  <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        p: 2,
                        bgcolor: "#1E1E1E", // Dark mode background
                        color: "#E0E0E0", // Light text for dark mode
                        boxShadow: "0px 4px 30px rgba(0, 255, 128, 0.3)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ textAlign: "center", p: 3 }}
                    >
                      {/* Animated Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
                      </motion.div>
      
                      {/* Title */}
                      <DialogTitle
                        sx={{
                          fontSize: "20px",
                          fontWeight: "600",
                          mt: 2,
                          color: "#E0E0E0",
                        }}
                      >
                        Password Reset Email Sent
                      </DialogTitle>
      
                      {/* Message */}
                      <DialogContent>
                        <Typography
                          variant="body1"
                          sx={{ color: "#B0B0B0", fontSize: "16px", mt: 1 }}
                        >
                          A password reset link has been sent to your email. Please
                          check your inbox and set your new password.
                        </Typography>
                      </DialogContent>
      
                      {/* Button */}
                      <DialogActions sx={{ mt: 2 }}>
                        <Button
                          onClick={handleCloseModal}
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #0044CC 0%, #002A80 100%)",
                            color: "white",
                            borderRadius: "8px",
                            px: 4,
                            "&:hover": { background: "#003399" },
                          }}
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                )}
              </>
            )}
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
                        rows={3}
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
                  {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability[day]} // ✅ No more error
                          onChange={() => handleAvailabilityChange(day)} // ✅ No more error
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
                        rows={3}
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
                    {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.availability[day]} // ✅ No more error
                            onChange={() => handleAvailabilityChange(day)} // ✅ No more error
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
              <nav className="py-3 px-4 sm:px-6 md:px-8">
                <Breadcrumb
                  items={breadcrumbItems}
                  currentPage={currentPages}
                />
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
                          {/* <button className="flex w-[200px] items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5560A8]   rounded-full  transition-colors">
                            <Wallet className="w-4 h-4" />
                            My Wallet
                          </button> */}
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
                      Expert {laborData?.categories?.[0] ?? "Unknown"}
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
              </div>
            ) : (
              <div className="lg:w-[400px] lg:ml-36 sm:w-full">
                <div className="border bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg shadow-gray-900">
                  <div className="space-y-7">
                    <h2 className="text-center font-[Rockwell] lg:text-[25px] md:text-[16px] sm:text-[12px] font-semibold border-b-2 border-gray-700 pb-2 text-gray-200">
                       Expert {laborData?.categories?.[0] ?? "Unknown"}
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

                {/* {Laborer && Object.keys(Laborer).length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-4 sm:space-y-0 lg:mt-[195px] md:mt-[34px] sm:mt-[34px] mt-[45px]">
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      Total Works and Earnings
                    </button>
                    <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                      View Current Status
                    </button>
                  </div>
                )} */}
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
          


          {theam === 'dark' ? (
            <>
            {openAbout && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-11/12 sm:w-96 text-[#E0E0E0]">
              <h3 className="text-xl font-semibold mb-4">Add About You</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={AboutFromData.name}
                onChange={handleInputChangeAbout}
                className="w-full p-2 mb-3 border border-gray-600 rounded-lg bg-[#2A2A2A] text-white"
              />
              <input
                type="number"
                name="experience"
                placeholder="Experience (e.g., 10 years)"
                value={AboutFromData.experience}
                onChange={handleInputChangeAbout}
                className="w-full p-2 mb-3 border border-gray-600 rounded-lg bg-[#2A2A2A] text-white"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={AboutFromData.description}
                onChange={handleInputChangeAbout}
                className="w-full p-2 mb-3 border border-gray-600 rounded-lg bg-[#2A2A2A] text-white"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setOpenAbout(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#21A391] hover:bg-[#1C8576] text-white px-4 py-2 rounded-lg"
                >
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>

          )}
            </>
          ): (
            <>
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
            </>  
          )}

          {Laborer && Laborer?.aboutMe && (
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
        <>
          {LaborDetails.reviews.slice(0, visibleReviews).map((review: Review, index: number) => (
            <div key={index} className="sm:max-w-3xl md:max-w-[1200px] mx-auto mb-8">
              {/* Review Content */}
              <div className="space-y-6 lg:space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center">
                  <div className="w-full flex items-start mb-4 lg:mb-0">
                    {/* User Image */}
                    <div className="flex-shrink-0 lg:mr-4">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={review?.reviewerProfile}
                        alt="User Avatar"
                      />
                    </div>

                    {/* User Info */}
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold">{review.reviewerName}</h3>
                      <div className="flex items-center space-x-3 mb-2">
                        {/* Star Rating */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-5 h-5 ${
                                i < Math.round(LaborDetails.rating)
                                  ? "fill-[#FFD700] text-[#FFD700]"
                                  : "fill-gray-300 text-gray-300"
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

                {/* Review Text */}
                <p className="text-sm sm:text-base md:text-lg lg:text-[12px] mt-2">
                  {review.reviewText}
                </p>

                {/* Uploaded Images */}
                {review.imageUrl && review.imageUrl.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {review.imageUrl.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Review Image ${imgIndex + 1}`}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => setModalImage(img)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Underline */}
              <div className="underLine h-[3px] bg-[#ECECEC] flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-6"></div>
            </div>
          ))}

          {/* Show More / Show Less Button */}
          {LaborDetails.reviews.length > 3 && (
            <div className="flex justify-center mt-6">
              {visibleReviews < LaborDetails.reviews.length ? (
                <button
                  onClick={showMoreReviews}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Show More Reviews
                </button>
              ) : (
                <button
                  onClick={showLessReviews}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Show Less Reviews
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No reviews available.</p>
      )}

      {/* Modal for Image Preview */}
      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative max-w-3xl p-4">
            <button
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full hover:bg-gray-300"
              onClick={() => setModalImage(null)}
            >
              ✖
            </button>
            <img src={modalImage} alt="Full View" className="max-w-full max-h-screen rounded-lg" />
          </div>
        </div>
      )}
    </div>

      {/* <div className="underLine h-[3px] bg-[#ECECEC] flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div> */}
      {isUserAuthenticated && (

 <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 cursor-pointer">
  <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto">
    <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 text-center">
      Similar Labors
    </h2>

    {similorLabors.length > 0 ? (
      <div className="space-y-6 lg:space-y-4">
        {similorLabors.slice(0, 2).map((labor, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center lg:items-start border shadow-md rounded-lg p-6 lg:p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
            onClick={() => handleNavigeProfilePage(labor)}
          >
            {/* User Image */}
            <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border border-gray-300 transition-transform duration-300 hover:brightness-110"
                src={labor.profilePicture || 'default-avatar-url'}
                alt={labor.firstName}
              />
            </div>

            {/* User Info */}
            <div className="flex-grow text-center lg:text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold transition-colors duration-300 hover:text-[#21A391]">
                {labor.firstName} {labor.lastName}
              </h3>
              <div className="flex justify-center lg:justify-start items-center space-x-1 mt-2">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 md:w-6 md:h-6 ${starIndex < labor.rating ? 'text-[#21A391]' : 'text-gray-300'}`}
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
              <h3 className="text-sm sm:text-base font-semibold mt-2">
                {labor?.categories[0]}
              </h3>
              <p className="mt-2 text-sm sm:text-base md:text-lg line-clamp-2 transition-colors duration-300 hover:text-gray-700">
                {`Hi, I'm ${labor.firstName} ${labor.lastName}, a seasoned ${labor.categories[0]} with experience in the ${labor.categories[0]} industry.`}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-lg font-semibold text-gray-500">No Similar Labor Found</p>
    )}
  </div>
</div>
      )}


{/* <Footer/> */}
    </>
  );
}

export default LaborProfile
