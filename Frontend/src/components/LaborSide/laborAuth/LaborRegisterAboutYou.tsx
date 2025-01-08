import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import {
  validateFirstName,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateGender,
  validateLanguage,
  validateLastName,
  validatePassword,
  validatePhoneNumber
} from "../../../utils/laborRegisterValidators"
import { setError , setLoading ,setLaborer ,setFormData } from '../../../redux/slice/laborSlice'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"
import '../../Auth/LoadingBody.css'
import { toast } from 'react-toastify';
import { registerAboutYou } from "../../../services/LaborAuthServices"

const LaborRegister = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [language, setLanguage] = useState('')
  const { loading } = useSelector((state: RootState) => state.labor)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const error: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    language?: string;
  } = useSelector((state: RootState) => state.labor.error);

  

  const handleOnsubmitf = async (e: React.FormEvent) => {
    e.preventDefault()

    dispatch(setLoading(true))

    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const phoneNumberError = validatePhoneNumber(phoneNumber);
    const addressError = validateAddress(address);
    const dateOfBirthError = validateDateOfBirth(dateOfBirth);
    const genderError = validateGender(gender);
    const languageError = validateLanguage(language);
  
    const formDataError = {
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError,
      phoneNumber: phoneNumberError,
      address: addressError,
      dateOfBirth: dateOfBirthError,
      gender: genderError,
      language: languageError,
    };
    
    
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      phoneNumberError ||
      addressError ||
      dateOfBirthError ||
      genderError ||
      languageError
    ) {
      setTimeout(() => {
        dispatch(setLoading(false));
        dispatch(setError(formDataError));
        toast.error("Please correct the highlighted errors.");
      }, 1000);
      return;
    } else {

      const formData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        language,
      };

      try {

        console.log('this is formData :', formData)
      
        const Response = await registerAboutYou(formData)

        if (Response.status === 200) {
          toast.success('About page completed ')
        }
      

      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Axios error:", message);
          toast.error(message);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
      } finally {
        dispatch(setLoading(false));
      }
    };



    const handleNextProfilePage = () => {
      navigate('/labor/Profile')
    }


    return (
      <div>
        {loading && <div className="loader"></div>}
        <div className="mainText text-center sm:text-center md:text-left lg:text-left p-10 sm:p-10  lg:p-16 lg:ml-[143px] md:p-11 md:ml-[100px] ">
          <h1 className="font-semibold text-[25px] lg:text-[33px] md:text-[22px] sm:text-[18px]">Apply as a Labor</h1>
        </div>

        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[#21A391] rounded-full">
            <div className="absolute w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
          </div>
          <div className="w-auto flex items-center">
            <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
          </div>
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full">
     
          </div>
          <div className="w-auto flex items-center">
            <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
          </div>
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full">
      
          </div>
        </div>
        <form onSubmit={handleOnsubmitf}>
          <div className="formsForUser mt-16 sm:mt-0  items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
            <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">First Name</span>
                <input
                  placeholder="Enter your First Name...."
                  className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {error?.firstName && (
                  <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Last Name</span>
                <input
                  placeholder="Enter your Last Name...."
                  className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  onChange={(e) => setLastName(e.target.value)}
                />
                {error?.lastName && (
                  <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Phone</span>
                <input
                  type="tel"
                  placeholder="Enter your phone..."
                  className="px-3 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  pattern="^\+?[1-9]\d{1,14}$"
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {error?.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{error.phoneNumber}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Address</span>
                <textarea
                  placeholder="Enter your Address..."
                  className="px-3 h-28 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
                {error?.address && (
                  <p className="text-red-500 text-sm mt-1">{error.address}</p>
                )}
              </div>
            </div>
            <div className="rightDive space-y-7">
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Email</span>
                <input
                  placeholder="Enter your Email..."
                  className="px-3 w-[340px] p-4  text-[14px] bg-white  border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error?.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Password</span>
                <input
                  placeholder="Enter your password..."
                  className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error?.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Date of Birth</span>
                <div className="relative">
                  <input
                    className="px-3 text-black w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                    type="date"
                    required
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  {/* Custom icon for date picker, optional */}
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fa fa-calendar"></i> {/* Optional: Font Awesome calendar icon */}
                  </span>
                </div>
                {error?.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{error.dateOfBirth}</p>
                )}
              </div>

              <div className="flex flex-col mt-4">
                <span className="font-sans text-[14px] my-1">Gender</span>
                <select
                  className="px-3 w-[340px] p-4 text-[14px] text-black bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  required
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled selected>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {error?.gender && (
                  <p className="text-red-500 text-sm mt-1">{error.gender}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Language</span>
                <input
                  placeholder="Enter your Language..."
                  className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  onChange={(e) => setLanguage(e.target.value)}
                />
                {error?.language && (
                  <p className="text-red-500 text-sm mt-1">{error.language}</p>
                )}
              </div>
            </div>
          </div>
      
          <div className="flex items-center justify-center mt-9 mb-8">
            <div className="relative group">
              <button
                className="w-[350px] sm:w-[400px] md:w-[600px] lg:w-[900px] relative inline-block p-px font-semibold leading-6 text-white bg-[#1C3D7A] cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                <span
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                ></span>

                <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#1C3D7A]" onClick={handleNextProfilePage}>
                  <div className="relative z-10 flex items-center justify-end space-x-2">
                    <span className="transition-all duration-500 group-hover:translate-x-1"
                 
                    >
                      Next Step
                    </span>
                    <svg
                      className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                      data-slot="icon"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
export default LaborRegister
