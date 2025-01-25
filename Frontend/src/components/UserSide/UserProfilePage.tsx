import { useDispatch, useSelector } from "react-redux";
import BgImage from "../../assets/userProfielBg.png";
import { RootState } from "../../redux/store/store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Mail ,
  Heart,
  ChevronRight,
  Home,
  User,
  PenSquare,
  Calendar,
} from "lucide-react";
import '../Auth/LoadingBody.css'
import { Link } from "react-router-dom";
import char from "../../assets/happy-female-electrician.avif";
import { useEffect, useState } from "react";
import { editPassword, updateUser, userFetch } from "../../services/UserSurvice";
import { editProfileValidate, validatePassword } from "../../utils/userRegisterValidators";
import { setError ,setLoading } from "../../redux/slice/userSlice";
import { toast } from "react-toastify";
const UserProfile = () => {
  const theam = useSelector((state: RootState) => state.theme.mode);
  const email = useSelector((state: RootState) => state.user.user.email)
  const loading  = useSelector((state: RootState) => state.user.loading)
  const dispatch = useDispatch()
  console.log('Thsi siw eht email :',email)
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [openChangePassword , setOpenChangePasswod] = useState(false)
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    image : null
  });
  const error: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  } = useSelector((state: RootState) => state.user.error);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userFetch();
        if (response.fetchUserResponse) {
          setUserData(response.fetchUserResponse);
        }
        console.log("This is the response:", response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (email) {
      fetchUser();
    }
  }, [email]);

    const handleEditProfile = () => {
    // Reset formData to initial state when opening edit modal
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      image: null
    });
    setOpenEditProfile(true);
  };


    // Handle input changes
 const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData((prev) => ({ ...prev, [id]: value }));
};

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSave = async () => {
    dispatch(setLoading(true))
     const profileData = {
      firstName: formData?.firstName, // Replace with your state variables
      lastName: formData?.lastName,  // Replace with your state variables
    };

    const validationErrors = await editProfileValidate(profileData);
    
    if (validationErrors) {
        dispatch(setLoading(false))
    // If there are validation errors, dispatch them to the Redux store
      dispatch(setError(validationErrors));
      return; // Stop further execution
    }
  
    try {
      dispatch(setError({}))
       dispatch(setLoading(true))
     const formDataObj = new FormData();
      formDataObj.append("firstName", formData.firstName);
      formDataObj.append("lastName", formData.lastName);
      formDataObj.append("email", userData.email);
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }
      
      const response = await updateUser(formDataObj); // Backend function to update user
      console.log("Profile updated:", response.data.updatedUser);
      

      if (response.data.updatedUser) {
        // Update local state with new user data
        setUserData(response.data.updatedUser);
        toast.success("Profile updated successfully!");
        setOpenEditProfile(false);
         dispatch(setLoading(false))
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
    toast.error("An error occurred. Please try again.");
    } finally {
       dispatch(setLoading(false))
    }

  }

  const handleConfirm = async () => {
     dispatch(setLoading(true))
    const PasswordErrror = validatePassword(password);

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
      email
    }

    try {
      dispatch(setError({}));
      console.log('this sthe the PasswodDatat ------+++++-------:',PasswodData)
      const response = await editPassword(PasswodData)

      if (response.status === 200) {
        setOpenChangePasswod(false)
         dispatch(setLoading(false))
        toast.success('Password updated successfully..')
      } else {
        toast.error('errro in passord update...>!')
         dispatch(setLoading(false))
      }
    } catch (error) {
      console.error("Error Password change:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
       dispatch(setLoading(false))
    }
  };

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

        <h2 className="text-xl font-semibold text-center mb-6">Edit Profile</h2>
        
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Image Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={formData.image ? URL.createObjectURL(formData.image) : userData?.ProfilePic || ""}
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
            value={formData.firstName }
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
            {error?.firstName && (
                 <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
            )}

          <input
            id="lastName"
            type="text"
            value={formData.lastName }
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {error?.lastName && (
                 <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
            )}


          <input
            id="email"
            value={userData.email }
            readOnly
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 cursor-default rounded-md shadow-sm"
          />

            {/* Password Change Button */}
            <button
              onClick={() => setOpenChangePasswod(true)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Change Password
            </button>
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
      <div className="w-full relative">
        <div className="relative">
          <img
            src={BgImage}
            alt="Profile"
            className="w-full h-[150px] sm:h-[200px] md:h-[234px] lg:h-[240px] object-cover"
          />

          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
            <nav className="py-3 px-4 sm:px-6 md:px-8">
              <div className="max-w-7xl mx-auto">
                <ol className="flex items-center space-x-2 text-sm sm:text-base">
                  <li className="flex items-center">
                    <Link
                      to="/"
                      className="transition-colors duration-200 flex items-center"
                    >
                      <Home
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                          theam === "light" ? "text-white" : ""
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={`ml-1 hidden sm:inline ${
                          theam === "light" ? "text-white" : ""
                        }`}
                      >
                        Home
                      </span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        theam === "light" ? "text-white" : ""
                      }`}
                    />
                  </li>
                  <li className="flex items-center">
                    <Link
                      to="/profile"
                      className="transition-colors duration-200 flex items-center"
                    >
                      <User
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                          theam === "light" ? "text-white" : ""
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={`ml-1 ${
                          theam === "light" ? "text-white" : ""
                        }`}
                      >
                        Profile
                      </span>
                    </Link>
                  </li>
                </ol>
              </div>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 relative -mt-16 sm:-mt-16 md:-mt-[90px]">
            <div className="w-full lg:w-1/2 relative">
              <div className="flex flex-col items-center lg:items-start lg:flex-row">
                <div className="flex justify-center lg:justify-start lg:ml-6 md:-mt-4">
                  <img
                    src={userData?.ProfilePic }
                    alt="Profile"
                    className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] rounded-full border-4 shadow-lg object-cover"
                  />
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
                      <div className="font-semibold font-[Rockwell] text-[28px] sm:text-[33px] md:text-[43px]">
                        {userData?.firstName || "First Name"}
                      </div>
                      <div className="font-semibold font-[Rockwell] text-[20px] sm:text-[23px]">
                         {userData?.lastName || "Last Name"}
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 my-4"></div>

                     <div className="flex items-center gap-3">
                      <Mail className={`w-5 h-5 ${theam === "light" ? "text-gray-600" : ""}`} />
                      <span className={theam === "light" ? "text-gray-800" : ""}>
                        {userData?.email || "user@example.com"}
                      </span>
                    
                    </div>

                    <button
                      className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border ${
                        theam === "light"
                          ? "border-gray-300 hover:bg-gray-50"
                          : "hover:bg-gray-500"
                      } rounded-md transition-colors`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 w-full lg:pl-36 sm:w-1/2">
                    <button
                      className="flex items-center lg:w-[700px] justify-center gap-2 px-4 py-2 bg-[#A2906A] text-white rounded-full hover:bg-[#7d6e4d] transition-colors"
                      onClick={handleEditProfile}
                    >
                      <PenSquare className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>

                    <button className="flex items-center lg:w-[700px]  justify-center gap-2 px-4 py-2 bg-[#21A391] text-white rounded-full hover:bg-[#20796d] transition-colors">
                      <Calendar className="w-5 h-5" />
                      <span>View & Manage Bookings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
