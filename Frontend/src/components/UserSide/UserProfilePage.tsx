import { useDispatch, useSelector } from "react-redux";
import BgImage from "../../assets/userProfielBg.png";
import { RootState } from "../../redux/store/store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db} from '../../utils/firbase'; // Adjust path as needed
import '../UserSide/chatPage.css'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
import { motion } from "framer-motion"; // For smooth animations
import {
  Mail ,
  PenSquare,
  Calendar,
  ClockIcon,
} from "lucide-react";
import '../Auth/LoadingBody.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { editPassword, fetchBookings, pymnetSuccess, updateUser, userFetch } from "../../services/UserSurvice";
import { editProfileValidate, validatePassword } from "../../utils/userRegisterValidators";
import { resetUser, setError, setisUserAthenticated,  setLoading, setUser, setAccessToken } from "../../redux/slice/userSlice";
import { getDocs, query, collection, where} from "firebase/firestore";
import { toast } from "react-toastify";
import { resetLaborer, setIsLaborAuthenticated, setLaborer } from "../../redux/slice/laborSlice";
import Breadcrumb from "../BreadCrumb";
import { BookingDetails, setBookingDetails } from "../../redux/slice/bookingSlice";
import CancelBookingForm from "./CancelBookingForm";
import CancellationDetails from "./CancellationDetails";
import ResheduleModal from "./ResheduleModal";
import RescheduleRequestModal from "../LaborSide/laborSide/resheduleRequstModal";
import AdditionalChargeModal from "./AdditionalChargeModal";
import WorkCompleteModal from "./workCompleteModal";
import { AxiosError } from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  ProfilePic: string | null; // Add ProfilePic property
  authType?: string;
}

interface Reschedule {
  isReschedule?: boolean;
  newTime?: string;
  newDate?: string;
  reasonForReschedule?: string;
  requestSentBy?: string;
  rejectedBy?: string;
  rejectionNewDate?: string;
  rejectionNewTime?: string;
  rejectionReason?: string;
}


const UserProfile = () => {
  const theam = useSelector((state: RootState) => state.theme.mode);
  const email = useSelector((state: RootState) => state.user.user.email);
  const loading = useSelector((state: RootState) => state.user.loading);
  const formDataUser = useSelector((state: RootState) => state.user);
  console.log('Thsi is the formData :::: ',formDataUser)
  const dispatch = useDispatch();
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [OpenCancelationModal, setOpenCancelationModal] = useState(false);
  const [openChangePassword, setOpenChangePasswod] = useState(false);
  const [workCompleteModal ,setWorkCompleteModal] = useState(null)
  const [userData, setUserData] = useState<UserData | null>(null);
  const [openModal, setOpenModal] = useState(false);
  console.log('Thsi ise teh userData ::::',userData)
  const [resheduleModals, setResheduleModal] = useState(null);
  const [additionalChageModal, setAdditionalChageModal] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cancelDetilsModal , setCancelDetilsModal] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const currentPages = location.pathname.split("/").pop() || "defaultPage";
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedBooking, setUpdatedBooking] = useState<BookingDetails | null>(null);
  const handleRescheduleUpdate = (newBooking  :BookingDetails) => {
      setUpdatedBooking(newBooking); // Update state when reschedule is accepted
    };
  const [filter, setFilter] = useState(""); 
  const limit = 1
  const [totalPages, setTotalPages] = useState(1);
  const [resheduleModal, setResheduleModalOpen] = useState(null)
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    image: File | null;
  }>({
    firstName: '',
    lastName: '',
    image: null,
  });
  const error: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  } = useSelector((state: RootState) => state.user.error);
  const bookingFromStore = useSelector(
  (state: RootState) => state.booking.bookingDetails
  );
  
  const bookingDetails = updatedBooking
    ? Array.isArray(updatedBooking) 
      ? updatedBooking 
      : [updatedBooking] // Convert to an array if it's an object
    : bookingFromStore;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userFetch();

        const { fetchUserResponse } = data;

        setUser(fetchUserResponse);
        setUserData(fetchUserResponse);
      } catch (error) {
       if (error instanceof AxiosError && error.response && error.response.status === 403) {
           toast.error("Your account has been blocked.");
          localStorage.removeItem("UserAccessToken");
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

  const handleEditProfile = () => {
    // Reset formData to initial state when opening edit modal
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      image: null,
    });
    setOpenEditProfile(true);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const updateFirebaseProfilePicture = async (
    email : string,
    profilePictureUrl : string,
    name : string
  ) => {
    try {
      // Query the user by email
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Loop through matching documents and update
        const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
          const userDocRef = doc(db, "Users", docSnapshot.id);

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
      } else {
        console.error("No user found with the provided email.");
      }
    } catch (error) {
      console.error("Error updating profile picture in Firebase:", error);
    }
  };

  const handleSave = async () => {
    dispatch(setLoading(true));

    try {
      const profileData = {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
      };

      const validationErrors = await editProfileValidate(profileData);

      if (validationErrors) {
        dispatch(setLoading(false));
        dispatch(setError(validationErrors));
        return;
      }

      dispatch(setError({}));

      const formDataObj = new FormData();
      formDataObj.append("firstName", formData.firstName);
      formDataObj.append("lastName", formData.lastName);
      formDataObj.append("email", userData?.email || ""); 
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      console.log("FormData contents:", {
        firstName: formDataObj.get("firstName"),
        lastName: formDataObj.get("lastName"),
        email: formDataObj.get("email"),
        image: formDataObj.get("image"),
      });

      const response = await updateUser(formDataObj);

      if (response.status === 200) {
        const { updatedUser } = response.data;

        const { ProfilePic, email, firstName, lastName } = updatedUser;
        const fullName = `${firstName} ${lastName}`.trim();

        await updateFirebaseProfilePicture(email, ProfilePic, fullName);

        dispatch(setUser(updatedUser));
        setUserData(updatedUser);
        toast.success("Profile updated successfully!");
        setOpenEditProfile(false);
      }
    } catch (error) {
      console.error("Error in handleSave:", error); // Modified error log
      toast.error("An error occurred. Please try again.");
    } finally {
      console.log("HandleSave completed"); // Add this to verify function completion
      dispatch(setLoading(false));
      dispatch(setError({}));
    }
  };

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
    dispatch(setLoading(true));
    const PasswordErrror = validatePassword(password);

    if (PasswordErrror) {
      dispatch(setLoading(false));
      dispatch(setError(PasswordErrror));
      return; // Stop further execution
    }

    if (password !== confirmPassword) {
      dispatch(setLoading(false));
      dispatch(setError({ password: "Passwords do not match" }));
      return toast.error("Passwords do not match");
    }

    const PasswodData = {
      password,
      email,
    };

    try {
      dispatch(setError({}));
      const response = await editPassword(PasswodData);

      if (response.status === 200) {
        await handleFirebasePasswordReset(email);
         setOpenModal(true);
        dispatch(setLoading(false));
      } else {
        toast.error("errro in passord update...>!");
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Error Password change:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCancelation = () => {
    setOpenCancelationModal(true);
  };

  

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetchBookings(currentPage, limit , filter); // Assuming fetchBookings is an API call
        if (response.status === 200) {
          console.log("Bookings fetched successfully:", response.data);
          const { bookings , totalPages } = response.data;
          dispatch(setBookingDetails(bookings));
          setUpdatedBooking(bookings);
          setTotalPages(totalPages);
        } else {
          console.error("Failed to fetch bookings:", response);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBooking(); // Call the function inside useEffect
  }, [currentPage, limit, dispatch , filter ]);

  const handleFilterChange = (value : string) => {
    setFilter(value);
  };

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "LaborProfilePage", link: undefined }, // No link for the current page
  ];


   const isRescheduleReset = (reschedule: Reschedule | null) => {
    return (reschedule?.isReschedule === false || reschedule?.isReschedule === true) &&
      !reschedule?.newTime &&
      !reschedule?.newDate &&
      !reschedule?.reasonForReschedule &&
      !reschedule?.requestSentBy &&
      !reschedule?.rejectedBy &&
      !reschedule?.rejectionNewDate &&
      !reschedule?.rejectionNewTime &&
      !reschedule?.rejectionReason;
};

  const hasRejectionDetails = (reschedule: Reschedule | null) => {
    const hasRejection = 
      reschedule?.rejectedBy === "labor" &&
      reschedule?.rejectionNewDate &&
      reschedule?.rejectionNewTime &&
      reschedule?.rejectionReason;

    const hasRequest = 
      reschedule?.requestSentBy === "labor" &&
      reschedule?.newDate &&
      reschedule?.newTime &&
      reschedule?.reasonForReschedule;

    return hasRejection || hasRequest;
  };



  const handleProceedToPay = async (bookingId: string, laborId: string, userId: string) => {
    try {
      dispatch(setLoading(true))

      //  const stripePromise = loadStripe("pk_test_51QptmEJLpjNdl80OuFdHAnnBNJazlv9gHMbHgUaRgXFy2cjgIkMUDml6y9GDga07mC7cgP3T47wFRCDsXMfKN8Qu008iPGiYpz"); 

      console.log('This sit is the dataa to passs :::', {
        bookingId,
        laborId,
        userId
      })

      if (!bookingId || !laborId || !userId) {
        toast.error('Missing Requarid fileds...')
        return
      }

      const pymnetData = {
        bookingId,
        laborId,
        userId
      }

      const pymnetResponse = await pymnetSuccess(pymnetData)

      if (pymnetResponse.status === 200) {
           dispatch(setLoading(false))
//         console.log(pymnetResponse.data.pymentRespnose
// .url)
        console.log("this si the succesfully payment ;;;;", pymnetResponse)
        window.location.href=pymnetResponse.data.pymentRespnose
          .url

        
        toast.success('your paymnet is successfull')
      }
      
    } catch (error) {
      console.error(error)
      toast.error('Error in the pyament')
    }finally{ dispatch(setLoading(false))}
  }

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

      {/* Reschedule Modal */}
      {resheduleModal && (
        <ResheduleModal
          onClose={() => setResheduleModalOpen(null)}
          bookingId={resheduleModal}
          onUpdateBooking={handleRescheduleUpdate}
        />
      )}
      <RescheduleRequestModal
        isOpen={resheduleModals !== null}
        onClose={() => setResheduleModal(null)}
        bookingDetails={resheduleModals ? [resheduleModals] : []}
        onUpdateBooking={handleRescheduleUpdate}
      />
      <AdditionalChargeModal
        isOpen={additionalChageModal !== null}
        onClose={() => setAdditionalChageModal(null)}
        bookingDetails={additionalChageModal ? [additionalChageModal] : []}
        onUpdateBooking={handleRescheduleUpdate}
      />

      {workCompleteModal && (
        <WorkCompleteModal
          onClose={() => setWorkCompleteModal(null)}
          bookingId={workCompleteModal}
          onUpdateBooking={handleRescheduleUpdate}
        />
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
              <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
                {/* Close Icon */}
                <button
                  onClick={() => setOpenEditProfile(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold text-center mb-6">
                  Edit Profile
                </h2>

                <div className="flex flex-col items-center space-y-6">
                  {/* Profile Image Section */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img
                        src={
                          formData.image
                            ? URL.createObjectURL(formData.image)
                            : userData?.ProfilePic || ""
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="imageUpload"
                      className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-2 cursor-pointer"
                    >
                      📷
                      <input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Rest of the modal content remains the same */}
                  <div className="w-full space-y-4">
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {error?.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.firstName}
                      </p>
                    )}

                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {error?.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.lastName}
                      </p>
                    )}

                    <input
                      id="email"
                      value={userData?.email || ""}
                      readOnly
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 cursor-default rounded-md shadow-sm"
                    />

                    {/* Password Change Button */}
                    {userData?.authType === "local" && (
                      <button
                        onClick={() => setOpenChangePasswod(true)}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Change Password
                      </button>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#1e1e1e] rounded-lg shadow-xl w-96 p-6 relative border border-[#444]">
                {/* Close Icon */}
                <button
                  onClick={() => setOpenEditProfile(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold text-center mb-6 text-gray-200">
                  Edit Profile
                </h2>

                <div className="flex flex-col items-center space-y-6">
                  {/* Profile Image Section */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500">
                      <img
                        src={
                          formData.image
                            ? URL.createObjectURL(formData.image)
                            : userData?.ProfilePic || ""
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="imageUpload"
                      className="absolute bottom-0 right-0 bg-gray-600 text-white rounded-full p-2 cursor-pointer hover:bg-gray-500"
                    >
                      📷
                      <input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Inputs */}
                  <div className="w-full space-y-4">
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2b2b2b] text-gray-200 border border-[#444] rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {error?.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {error.firstName}
                      </p>
                    )}

                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2b2b2b] text-gray-200 border border-[#444] rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {error?.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {error.lastName}
                      </p>
                    )}

                    <input
                      id="email"
                      value={userData?.email || ""}
                      readOnly
                      className="w-full px-3 py-2 bg-[#2b2b2b] text-gray-400 border border-[#444] rounded-md shadow-sm cursor-not-allowed"
                    />

                    {/* Password Change Button */}
                    {userData?.authType === "local" && (
                      <button
                        onClick={() => setOpenChangePasswod(true)}
                        className="w-full py-2 px-4 bg-[#333] text-gray-200 border border-gray-500 rounded-md hover:bg-[#444]"
                      >
                        Change Password
                      </button>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div
        className={`min-h-screen ${
          theam === "dark" ? "bg-[#111826]" : "bg-white"
        }`}
      >
        <div className="w-full relative">
          <div className="relative">
            <img
              src={BgImage}
              alt="Profile"
              className="w-full h-[150px] sm:h-[200px] md:h-[234px] lg:h-[240px] object-cover"
            />
            <div className="">
              <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
                <nav className="py-3 px-4 sm:px-6 md:px-8">
                  <Breadcrumb
                    items={breadcrumbItems}
                    currentPage={currentPages}
                  />
                </nav>
              </div>

              {/* <div className="absolute text-xl font-semibold  sm:text-2xl lg:text-3xl ">
          MY Chatfdssssssssssssssssssssss
        </div> */}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 relative -mt-16 sm:-mt-16 md:-mt-[90px]">
              <div className="w-full lg:w-1/2 relative">
                <div className="flex flex-col items-center lg:items-start lg:flex-row">
                  <div className="flex justify-center lg:justify-start lg:ml-6 md:-mt-4">
                    <img
                      src={userData?.ProfilePic || ""}
                      alt="Profile"
                      className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] rounded-full border-4 shadow-lg object-cover"
                    />
                    <div className="">
                      <Link to="/userChatPage">
                        <button className="chatBtn">
                          <svg
                            height="1.6em"
                            fill="white"
                            viewBox="0 0 1000 1000"
                            y="0px"
                            x="0px"
                            version="1.1"
                          >
                            <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                          </svg>
                          <span className="tooltip">Chat</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-6 lg:mt-8 ${
                    theam === "light" ? "bg-white" : ""
                  } rounded-xl p-4 sm:p-6`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-4 w-full sm:w-1/2">
                      <div className="text-center lg:text-left">
                        <div
                          className={`font-semibold font-[Rockwell] text-[28px] sm:text-[33px] md:text-[43px] ${
                            theam === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {userData?.firstName || "First Name"}{" "}
                          {userData?.lastName || "Last Name"}
                        </div>
                      </div>

                      <div
                        className={`h-px my-4 ${
                          theam === "dark" ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      ></div>

                      <div className="flex items-center gap-3">
                        <Mail
                          className={`w-5 h-5 ${
                            theam === "dark" ? "text-white" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`${
                            theam === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {userData?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:pl-36 sm:w-1/2">
                      <button
                        className="flex items-center lg:w-[700px] justify-center gap-2 px-4 py-2 bg-[#A2906A] text-white rounded-full hover:bg-[#7d6e4d] transition-colors"
                        onClick={handleEditProfile}
                      >
                        <PenSquare className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </button>

                      <button className="flex items-center lg:w-[700px] justify-center gap-2 px-4 py-2 bg-[#21A391] text-white rounded-full hover:bg-[#20796d] transition-colors">
                        <Link
                          to="/bookingDetails-and-history"
                          className="flex items-center gap-2 w-full justify-center text-white"
                        >
                          <Calendar className="w-5 h-5" />
                          <span>View & Manage Bookings</span>
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-4 sm:mt-5 md:mt-6 lg:mt-8 lg:mb-3">
          <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[72%] h-[2px] bg-[#ECECEC] mx-auto" />
        </div>

        <div className="currentStatus mb-4">
          <div className="max-w-3xl mx-auto border rounded-md p-4 mt-5">
            <div className="flex space-x-4 md:mb-0 mb-4 justify-center md:justify-start">
              <div className="relative w-64">
                <select
                  className="appearance-none w-full bg-gradient-to-r from-blue-600 to-blue-700 
                 text-white px-4 py-2 rounded-lg 
                 border border-blue-500 
                 shadow-md 
                 hover:from-blue-700 hover:to-blue-800 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                 transition-all duration-300 
                 cursor-pointer"
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="" className="bg-white text-gray-700">
                    Filter by Status
                  </option>
                  <option value="canceled" className="bg-white text-gray-700">
                    Cancelled
                  </option>
                  <option value="confirmed" className="bg-white text-gray-700">
                    Confirmed
                  </option>
                  <option value="completed" className="bg-white text-gray-700">
                    Completed
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <h2
                className={`text-xl font-semibold text-center mb-4 border rounded-full w-[200px] py-1 
                ${
                  theam === "dark"
                    ? "text-white border-white"
                    : "text-gray-900 border-gray-900"
                }`}
              >
                Current Status
              </h2>
            </div>

            {theam == "dark" ? (
              <>
                {bookingDetails && bookingDetails.length > 0 ? (
                  bookingDetails.map((booking) => (
                    <div className="border-2  border-gray-700 rounded-lg p-6 mb-5 bg-gray-800 shadow-md">
                      <div
                        key={booking?._id}
                        className="border-2 border-gray-600 rounded-lg p-5 mb-5 bg-gray-900"
                      >
                        <div className="space-y-5">
                          {/* Job Details */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Job Details:
                            </h3>
                            <p className="border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] text-gray-300 px-4 py-2">
                              {booking?.quote?.description || "N/A"}
                            </p>
                          </div>

                          {/* Estimated Cost */}
                          <div className="relative">
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Estimated Cost:
                            </h3>
                            <p className="border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] text-gray-300 px-4 py-2">
                              ₹{booking?.quote?.estimatedCost || "N/A"}
                            </p>

                            {/* Highlighted Button for Additional Charge Request */}
                            {bookingDetails?.length > 0 &&
                              booking?.additionalChargeRequest?.status ===
                                "pending" &&
                              booking?.additionalChargeRequest?.amount > 0 &&
                              booking?.additionalChargeRequest?.reason && (
                                <button
                                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center 
                                  font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                                  text-xs sm:text-sm md:text-base lg:text-sm
                                  ${
                                    booking
                                      ? "animate-bounce shadow-blue-500"
                                      : ""
                                  }
                                  ${
                                    theam === "dark"
                                      ? "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-gray-200 shadow-blue-700"
                                      : "bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 text-white shadow-blue-500"
                                  }`}
                                  onClick={() =>
                                    setAdditionalChageModal(booking)
                                  }
                                >
                                  <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-white" />
                                  <span className="hidden sm:inline">
                                    Requesting Additional Charge
                                  </span>
                                  <span className="sm:hidden">
                                    Requesting Charge
                                  </span>
                                </button>
                              )}
                          </div>

                          {/* Scheduled Date and Time */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Scheduled Date and Time:
                            </h3>
                            <p className="border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] text-gray-300 px-4 py-2">
                              {booking?.quote?.arrivalTime
                                ? new Date(
                                    booking.quote.arrivalTime
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>

                          {/* Laborer Name */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Laborer Name:
                            </h3>
                            <p className="border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] text-gray-300 px-4 py-2">
                              {booking?.laborId?.firstName}{" "}
                              {booking?.laborId?.lastName}
                            </p>
                          </div>

                          {/* Laborer Phone */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Laborer Phone:
                            </h3>
                            <p className="border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] text-gray-300 px-4 py-2">
                              {booking?.laborId?.phone || "N/A"}
                            </p>
                          </div>
                          {/* Status */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Work Status:
                            </h3>
                            <p
                              className={`border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] px-4 py-2 ${
                                booking?.status === "canceled"
                                  ? "text-red-500"
                                  : "text-green-400"
                              }`}
                            >
                              {booking?.status || "N/A"}
                            </p>
                          </div>

                          {/* payment Status */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#32eae0] mb-2">
                              Payment Status:
                            </h3>
                            <p
                              className={`border border-gray-600 p-2 rounded-full text-sm font-[RobotoMono] px-4 py-2 ${
                                booking?.paymentStatus === "paid"
                                  ? "text-green-500"
                                  : "text-yellow-500"
                              }`}
                            >
                              {booking?.paymentStatus || "N/A"}
                            </p>
                          </div>

                          {/* Cancellation Button and Logic */}
                          {OpenCancelationModal && (
                            <CancelBookingForm
                              onClose={() => setOpenCancelationModal(false)}
                              bookingId={booking.bookingId}
                            />
                          )}

                          {booking?.status !== "canceled" &&
                            booking?.status !== "completed" && (
                              <div className="flex flex-col md:flex-row items-center justify-between w-full pt-4 space-y-4 md:space-y-0">
                                {/* Cancel Booking Button - Full width on mobile, fixed width on larger screens */}
                                <button
                                  className="w-full md:w-[180px] bg-[#e74c3c] rounded-full text-white px-6 py-3 text-lg hover:bg-red-600 transition-colors"
                                  onClick={handleCancelation}
                                >
                                  Cancel Booking
                                </button>

                                <div className="w-full md:w-auto flex flex-col items-center">
                                  <div className="flex flex-col items-center w-full">
                                    <div className="flex flex-col items-center w-full space-y-4">
                                      {/* Case 1: Rejection with details */}
                                      {hasRejectionDetails(
                                        booking?.reschedule
                                      ) && (
                                        <div className="flex flex-col items-center w-full space-y-2">
                                          <button
                                            className="w-full md:w-[180px] bg-[#f39c12] text-white px-6 py-3 rounded-full text-lg hover:bg-[#e67e22] transition-colors"
                                            onClick={() =>
                                              setResheduleModal(booking)
                                            }
                                          >
                                            {booking?.reschedule?.rejectedBy ===
                                            "labor"
                                              ? "View Rejection"
                                              : "View Request"}
                                          </button>
                                          {(() => {
                                            if (
                                              booking?.reschedule
                                                ?.rejectedBy === "labor"
                                            ) {
                                              return (
                                                <p className="text-red-500 text-sm">
                                                  Your reschedule request was
                                                  rejected by{" "}
                                                  {booking?.laborId?.firstName}{" "}
                                                  {booking?.laborId?.lastName}
                                                </p>
                                              );
                                            } else if (
                                              booking.reschedule
                                                .requestSentBy === "labor"
                                            ) {
                                              return (
                                                <p className="text-yellow-500 text-sm">
                                                  labor sent a new reschedule
                                                  request
                                                </p>
                                              );
                                            }
                                            return null;
                                          })()}
                                        </div>
                                      )}

                                      {/* Case 2: Pending user request */}
                                      {((booking?.reschedule?.requestSentBy ===
                                        "user" &&
                                        booking?.reschedule?.acceptedBy ===
                                          null &&
                                        booking?.reschedule?.rejectedBy ===
                                          null) ||
                                        (booking?.reschedule?.requestSentBy ===
                                          "user" &&
                                          booking?.reschedule?.rejectedBy ===
                                            "user")) && (
                                        <div className="w-full text-center">
                                          <p className="text-yellow-500 text-sm">
                                            {booking?.reschedule?.rejectedBy ===
                                            "user"
                                              ? "Your reschedule rejection request is pending. Please wait for labor approval."
                                              : "Your reschedule request is pending. Please wait for labor approval."}
                                          </p>
                                        </div>
                                      )}

                                      {/* Case 3: Reset state */}
                                      {isRescheduleReset(
                                        booking?.reschedule
                                      ) && (
                                        <button
                                          className="w-full md:w-[180px] bg-[#f39c12] text-white px-6 py-3 rounded-full text-lg hover:bg-[#e67e22] transition-colors"
                                          onClick={() =>
                                            setResheduleModalOpen(
                                              booking?.bookingId
                                            )
                                          }
                                        >
                                          Reschedule
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {cancelDetilsModal && (
                        <CancellationDetails
                          booking={booking}
                          isOpen={cancelDetilsModal}
                          onClose={() => setCancelDetilsModal(false)}
                        />
                      )}

                      <div className="text-center mt-6">
                        {booking?.status === "canceled" ? (
                          booking?.cancellation?.canceledBy === "labor" ? (
                            // If the booking was canceled by the labor, show the cancel details button
                            <span
                              className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-red-500 text-white"
                              onClick={() => setCancelDetilsModal(true)}
                            >
                              View Cancel Details
                            </span>
                          ) : (
                            // If the booking was canceled by the user, show a message

                            <div className="bg-red-600 text-white text-center p-4 rounded-lg">
                              <p className="font-bold text-lg">
                                Booking Cancelled
                              </p>
                            </div>
                          )
                        ) : booking?.isUserCompletionReported &&
                          !booking?.isLaborCompletionReported ? (
                          // Case 1: User has reported work completion, waiting for labor
                          <p className="text-red-600 font-medium">
                            Your work completion request is uploaded. Please
                            wait for the labor's work completion report.
                          </p>
                        ) : !booking?.isUserCompletionReported &&
                          booking?.isLaborCompletionReported ? (
                          // Case 2: Labor has reported work completion, waiting for user
                          <>
                            <p className="text-gray-600 font-medium mb-2">
                              The labor has updated their work completion. Now,
                              we are waiting for your response.
                            </p>
                            <span
                              className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-[#1e40af] text-white"
                              onClick={() =>
                                setWorkCompleteModal(booking.bookingId)
                              }
                            >
                              Confirm Work Completion
                            </span>
                          </>
                        ) : booking?.isUserCompletionReported &&
                          booking?.isLaborCompletionReported ? (
                          // Case 3: Both user and labor reported completion → Show "Proceed to Pay" button
                          booking?.paymentStatus === "paid" ? (
                            <span className="text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-gray-400 text-white cursor-not-allowed">
                              Payment Completed
                            </span>
                          ) : (
                            <span
                              className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-green-500 text-white"
                              onClick={() =>
                                handleProceedToPay(
                                  booking.bookingId,
                                  booking.laborId?._id,
                                  booking.userId
                                )
                              }
                            >
                              Proceed to Pay
                            </span>
                          )
                        ) : (
                          // Default Case: Show normal "Work Completed" button
                          <span
                            className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-[#1e40af] text-white"
                            onClick={() =>
                              setWorkCompleteModal(booking.bookingId)
                            }
                          >
                            Work Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-lg font-medium text-center">
                    No Bookings Yet.
                  </p>
                )}
              </>
            ) : (
              <>
                {bookingDetails && bookingDetails.length > 0 ? (
                  bookingDetails.map((booking) => (
                    <div className="border-2 border-gray-300 rounded-lg p-6 mb-5 bg-white shadow-lg">
                      <div
                        key={booking?._id}
                        className="border-2 border-gray-200 rounded-lg p-5 mb-5 bg-gray-50"
                      >
                        <div className="space-y-5">
                          {/* Job Details */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Job Details:
                            </h3>
                            <p className="border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] text-gray-700 px-4 py-2">
                              {booking?.quote?.description || "N/A"}
                            </p>
                          </div>

                          {/* Estimated Cost */}
                          <div className="relative">
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Estimated Cost:
                            </h3>
                            <p className="border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] text-gray-700 px-4 py-2">
                              ₹{booking?.quote?.estimatedCost || "N/A"}
                            </p>
                            {/* Highlighted Button for Additional Charge Request */}
                            {bookingDetails?.length > 0 &&
                              booking?.additionalChargeRequest?.status ===
                                "pending" &&
                              booking?.additionalChargeRequest?.amount > 0 &&
                              booking?.additionalChargeRequest?.reason && (
                                <button
                                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center 
                                  font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-lg
                                  text-xs sm:text-sm md:text-base lg:text-sm
                                  ${
                                    booking
                                      ? "animate-bounce shadow-blue-500"
                                      : ""
                                  }
                                 ${"bg-gradient-to-r from-blue-500 to-orange-800 hover:from-blue-600 hover:to-orange-800 text-white"}`}
                                  onClick={() =>
                                    setAdditionalChageModal(booking)
                                  }
                                >
                                  <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-white" />
                                  <span className="hidden sm:inline">
                                    Requesting Additional Charge
                                  </span>
                                  <span className="sm:hidden">
                                    Requesting Charge
                                  </span>
                                </button>
                              )}
                          </div>
                          {/* Scheduled Date and Time */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Scheduled Date and Time:
                            </h3>
                            <p className="border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] text-gray-700 px-4 py-2">
                              {booking?.quote?.arrivalTime
                                ? new Date(
                                    booking?.quote?.arrivalTime
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>

                          {/* Laborer Name */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Laborer Name:
                            </h3>
                            <p className="border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] text-gray-700 px-4 py-2">
                              {booking?.laborId?.firstName}{" "}
                              {booking?.laborId?.lastName}
                            </p>
                          </div>

                          {/* Laborer Phone */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Laborer Phone:
                            </h3>
                            <p className="border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] text-gray-700 px-4 py-2">
                              {booking.laborId?.phone || "N/A"}
                            </p>
                          </div>

                          {/* Status */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Work Status:
                            </h3>
                            <p
                              className={`border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] px-4 py-2 ${
                                booking?.status === "canceled"
                                  ? "text-red-500"
                                  : "text-green-400"
                              }`}
                            >
                              {booking?.status || "N/A"}
                            </p>
                          </div>

                          {/* payment Status */}
                          <div>
                            <h3 className="font-semibold text-xl font-[rokkitt] text-[#1e40af] mb-2">
                              Payment Status:
                            </h3>
                            <p
                              className={`border border-gray-300 p-2 rounded-full text-sm font-[RobotoMono] px-4 py-2 ${
                                booking?.paymentStatus === "paid"
                                  ? "text-green-500"
                                  : "text-yellow-500"
                              }`}
                            >
                              {booking?.paymentStatus || "N/A"}
                            </p>
                          </div>

                          {/* Cancellation Button and Logic */}
                          {OpenCancelationModal && (
                            <CancelBookingForm
                              onClose={() => setOpenCancelationModal(false)}
                              bookingId={booking?.bookingId}
                            />
                          )}

                          {booking?.status !== "canceled" &&
                            booking?.status !== "completed" && (
                              <div className="flex flex-col md:flex-row items-center justify-between w-full pt-4 space-y-4 md:space-y-0">
                                {/* Cancel Booking Button - Full width on mobile, fixed width on larger screens */}
                                <button
                                  className="w-full md:w-[180px] bg-[#e74c3c] rounded-full text-white px-6 py-3 text-lg hover:bg-red-600 transition-colors"
                                  onClick={handleCancelation}
                                >
                                  Cancel Booking
                                </button>

                                <div className="w-full md:w-auto flex flex-col items-center">
                                  <div className="flex flex-col items-center w-full">
                                    <div className="flex flex-col items-center w-full space-y-4">
                                      {/* Case 1: Rejection with details */}
                                      {hasRejectionDetails(
                                        booking?.reschedule
                                      ) && (
                                        <div className="flex flex-col items-center w-full space-y-2">
                                          <button
                                            className="w-full md:w-[180px] bg-[#f39c12] text-white px-6 py-3 rounded-full text-lg hover:bg-[#e67e22] transition-colors"
                                            onClick={() =>
                                              setResheduleModal(booking)
                                            }
                                          >
                                            {booking?.reschedule?.rejectedBy ===
                                            "labor"
                                              ? "View Rejection"
                                              : "View Request"}
                                          </button>
                                          {(() => {
                                            if (
                                              booking?.reschedule
                                                ?.rejectedBy === "labor"
                                            ) {
                                              return (
                                                <p className="text-red-500 text-sm">
                                                  Your reschedule request was
                                                  rejected by{" "}
                                                  {booking?.laborId?.firstName}{" "}
                                                  {booking?.laborId?.lastName}
                                                </p>
                                              );
                                            } else if (
                                              booking?.reschedule
                                                ?.requestSentBy === "labor"
                                            ) {
                                              return (
                                                <p className="text-yellow-500 text-sm">
                                                  labor sent a new reschedule
                                                  request
                                                </p>
                                              );
                                            }
                                            return null;
                                          })()}
                                        </div>
                                      )}

                                      {/* Case 2: Pending user request */}
                                      {((booking?.reschedule?.requestSentBy ===
                                        "user" &&
                                        booking?.reschedule?.acceptedBy ===
                                          null &&
                                        booking?.reschedule?.rejectedBy ===
                                          null) ||
                                        (booking?.reschedule?.requestSentBy ===
                                          "user" &&
                                          booking?.reschedule?.rejectedBy ===
                                            "user")) && (
                                        <div className="w-full text-center">
                                          <p className="text-yellow-500 text-sm">
                                            {booking?.reschedule?.rejectedBy ===
                                            "user"
                                              ? "Your reschedule rejection request is pending. Please wait for labor approval."
                                              : "Your reschedule request is pending. Please wait for labor approval."}
                                          </p>
                                        </div>
                                      )}

                                      {/* Case 3: Reset state */}
                                      {isRescheduleReset(
                                        booking?.reschedule
                                      ) && (
                                        <button
                                          className="w-full md:w-[180px] bg-[#f39c12] text-white px-6 py-3 rounded-full text-lg hover:bg-[#e67e22] transition-colors"
                                          onClick={() =>
                                            setResheduleModalOpen(
                                              booking?.bookingId
                                            )
                                          }
                                        >
                                          Reschedule
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Work Completed Button */}
                      {/* <div className="text-center mt-6">
                      <span className="bg-[#1e40af] cursor-pointer text-white px-6 py-3 rounded-full text-lg font-medium md:w-[280px] inline-block">
                        Work Completed
                      </span>
                    </div> */}

                      {cancelDetilsModal && (
                        <CancellationDetails
                          booking={booking}
                          isOpen={cancelDetilsModal}
                          onClose={() => setCancelDetilsModal(false)}
                        />
                      )}

                      <div className="text-center mt-6">
                        {booking?.status === "canceled" ? (
                          // If the booking is canceled, show the cancel details button
                          <span
                            className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-red-500 text-white"
                            onClick={() => setCancelDetilsModal(true)}
                          >
                            View Cancel Details
                          </span>
                        ) : booking?.isUserCompletionReported &&
                          !booking?.isLaborCompletionReported ? (
                          // Case 1: User has reported work completion, waiting for labor
                          <p className="text-red-600 font-medium">
                            Your work completion request is uploaded. Please
                            wait for the labor's work completion report.
                          </p>
                        ) : !booking?.isUserCompletionReported &&
                          booking?.isLaborCompletionReported ? (
                          // Case 2: Labor has reported work completion, waiting for user
                          <>
                            <p className="text-gray-600 font-medium mb-2">
                              The labor has updated their work completion. Now,
                              we are waiting for your response.
                            </p>
                            <span
                              className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-[#1e40af] text-white"
                              onClick={() =>
                                setWorkCompleteModal(booking.bookingId)
                              }
                            >
                              Confirm Work Completion
                            </span>
                          </>
                        ) : booking?.isUserCompletionReported &&
                          booking?.isLaborCompletionReported ? (
                          // Case 3: Both user and labor reported completion → Show "Proceed to Pay" button
                          booking?.paymentStatus === "paid" ? (
                            <span className="text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-gray-400 text-white cursor-not-allowed">
                              Payment Completed
                            </span>
                          ) : (
                            <span
                              className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-green-500 text-white"
                              onClick={() =>
                                handleProceedToPay(
                                  booking.bookingId,
                                  booking.laborId?._id,
                                  booking.userId
                                )
                              }
                            >
                              Proceed to Pay
                            </span>
                          )
                        ) : (
                          // Default Case: Show normal "Work Completed" button
                          <span
                            className="cursor-pointer text-lg font-medium md:w-[280px] inline-block px-6 py-3 rounded-full bg-[#1e40af] text-white"
                            onClick={() =>
                              setWorkCompleteModal(booking.bookingId)
                            }
                          >
                            Work Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-lg font-medium text-center">
                    No Bookings Yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6 pb-6">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span
            className={`px-4 py-2 ${
              theam === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
