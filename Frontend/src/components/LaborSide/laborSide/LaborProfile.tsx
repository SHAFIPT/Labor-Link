import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"
import { useEffect } from "react"
import { setFormData, setIsLaborAuthenticated, setLaborer, resetLaborer } from "../../../redux/slice/laborSlice"
import { resetUser } from '../../../redux/slice/userSlice'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { logout } from "../../../services/LaborAuthServices"
import HomeNavBar from "../../HomeNavBar"
import LoginNav from "../../Auth/LoginNav"
import BgImage from '../../../assets/image 6.png'
import HomeImage from '../../../assets/HomeIcon.png'
import char from '../../../assets/happy-female-electrician.avif'
import { Phone, Mail, MapPin, Clock, Globe, Heart, Star, Edit, Wallet , ChevronRight, Home, User } from 'lucide-react';
import './LaborProfile.css'
import { Link } from "react-router-dom";
const LaborProfile = () => {
    const formdata = useSelector((state: RootState) => state.labor.formData)
    const formdatarole = useSelector((state: RootState) => state.labor?.formData?.role)
    const Oldrole = useSelector((state: RootState) => state.labor?.laborer?.role)
    const theam = useSelector((state: RootState) => state.theme.mode)
    console.log('formdata :',formdata)
    console.log('formdata :',formdatarole)
    console.log('formdata :',Oldrole)
    const dispatch = useDispatch()
    const navigate = useNavigate()
  //  useEffect(() => {
  //   console.log('Dispatching setIsLaborAuthenticated to false');
  //     dispatch(setFormData({}))
  //       dispatch(resetLaborer())
  // dispatch(setIsLaborAuthenticated(false));
  // },[]);
  
   const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
    const laborRole = useSelector((state: RootState) => state.labor);
  
  
      console.log('Role required')
      console.log('Is Labor Authenticated:', isLaborAuthenticated);
      // console.log('Labor Role:', laborRole);

    const handleLogoutLabor = async () => {
      console.log('this is logout going logooiiu :')
      const response = await logout()
      console.log('this is logout response :',response)
      
        
        if (response.status === 200) {
          localStorage.removeItem('LaborAccessToken');
            dispatch(resetUser())
            dispatch(resetLaborer())
            dispatch(setLaborer({}))
            dispatch(setFormData({}))
            dispatch(setIsLaborAuthenticated(false))
            toast('logout successfully....!')
            navigate('/');
        }
    }

  return (
    <>
      {/* <LoginNav /> */}
      {/* <HomeNavBar/> */}
      {/* <div className="flex justify-between p-6">
      <div className="text">
        <h1>This is Labor profile page....!</h1>
      </div>
      <div className="right">
       
        <div
            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
        >
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
            <path
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
            ></path>
            </svg>
        </div>
        <div
            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        >
            Logout
        </div>
        </button>

      </div>
    </div> */}
       <button
        onClick={handleLogoutLabor}
        className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
        ></button>
      <div className="w-full relative">
        {/* Background Image */}
        <div className="relative">
          <img
            src={BgImage} 
            alt="Profile"
            className="w-full h-[150px] sm:h-[200px] md:h-[234px] lg:h-[240px] object-cover"
          />

          {theam === 'light' ? (
            <>
              
          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
             <nav className=" py-3 px-4 sm:px-6 md:px-8 "> {/* chnge the px ------------------------*/}
                <div className="max-w-7xl mx-auto">
                  <ol className="flex items-center space-x-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <Link to='/labor/dashboard' className="transition-colors duration-200 flex items-center">
                          <Home 
                          className="md:w-6 md:h-6 w-4 h-4 sm:w-5 sm:h-5 text-white" 
                          strokeWidth={2} // Increase this value to make the icon thicker
                        />
                        <span className="ml-1 hidden sm:inline text-white">Home</span>
                      </Link>
                    </li>
                    
                    <li className="flex items-center text-white">
                        <ChevronRight className="md:w-6 md:h-6 w-4 h-4 sm:w-5 sm:h-5"
                      strokeWidth={2}
                        />
                    </li>
                    
                    <li className="flex items-center text-white">
                      <a 
                        href="/profile" 
                        className="  transition-colors duration-200 flex items-center"
                      >
                        <User className="md:w-6 md:h-6 w-4 h-4 sm:w-5 sm:h-5"  strokeWidth={3}/>
                        <span className="ml-1">Profile</span>
                      </a>
                    </li>
                  </ol>
                </div>
              </nav>
          </div>
          </>

          ): (
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
             <nav className=" py-3 px-4 sm:px-6 md:px-8 ">
                <div className="max-w-7xl mx-auto">
                  <ol className="flex items-center space-x-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <a 
                        href="/" 
                        className=" transition-colors duration-200 flex items-center"
                      >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 "  />
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
                    src={char}
                    alt="Profile"
                    className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] rounded-full border-4 shadow-lg object-cover"
                  />
                </div>

                {/* Rating Stars and Actions */}
                <div className="lg:ml-auto lg:mr-4 mt-4 lg:mt-24 flex flex-col items-center lg:items-end space-y-3">
                  {/* Stars and Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">5.0</span>
                    <span className="">(23 reviews)</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    <button className="flex w-[200px]  items-center gap-2 px-4 py-2 text-sm font-medium  text-white bg-[#5560A8]  rounded-full  transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button className="flex w-[200px] items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5560A8]   rounded-full  transition-colors">
                      <Wallet className="w-4 h-4" />
                      My Wallet
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              {theam === "light" ? (
                <div className="-md:mt-7 md:justify-center flex sm:justify-center lg:justify-start justify-center bg-white rounded-xl p-6 ">
                  <div className="space-y-4">
                    {/* Name Section */}
                    <div className="text-center lg:text-left">
                      <div className="font-semibold font-[Rockwell] lg:ml-14  text-[33px] md:text-[43px]">
                        Merry
                      </div>
                      <div className="font-semibold font-[Rockwell] lg:ml-20  text-[23px]  md:text-[23px]">
                        Susan
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-4"></div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">+91 9876543210</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">
                          johndoe@example.com
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">India</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">Full Day</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">Malayalam</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="-md:mt-7 md:justify-center flex sm:justify-center lg:justify-start justify-center rounded-xl p-6 ">
                  <div className="space-y-4">
                    {/* Name Section */}
                    <div className="text-center lg:text-left">
                      <div className="font-semibold font-[Rockwell] lg:ml-16  text-[33px] md:text-[43px]">
                        John
                      </div>
                      <div className="font-semibold font-[Rockwell] lg:ml-20  text-[23px]  md:text-[23px]">
                        Doe
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
                        <span className="">johndoe@example.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span className="">India</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 " />
                        <span className="">Full Day</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 " />
                        <span className="">Malayalam</span>
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
                      Expert Electrician
                    </h2>

                    <div>
                      <h4 className="font-semibold mb-3">Expertise:</h4>
                      <ul className="list-disc pl-5 font-[roboto] space-y-2 marker:text-[#21A391]">
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

                    <div className="flex justify-center pt-4">
                      <button className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
                        <span className="md:text-base lg:text-lg font-[Roboto]">
                          Booking & Start Chating
                        </span>
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                          <div className="relative h-full w-10 bg-white/20"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-4 sm:space-y-0 lg:mt-[195px] md:mt-[34px] sm:mt-[34px] mt-[45px]">
                  <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                    Total Works and Earnings
                  </button>
                  <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                    View Current Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:w-[400px] lg:ml-36 sm:w-full">
                <div className="border bg-[#0f7b73] rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="space-y-7">
                    <h2 className="text-center font-[Rockwell] lg:text-[25px] md:text-[16px] sm:text-[12px] font-semibold border-b-2  pb-2">
                      Expert Electrician
                    </h2>

                    <div>
                      <h4 className="font-semibold mb-3">Expertise:</h4>
                      <ul className="list-disc pl-5 font-[roboto] space-y-2 marker:text-[#21A391]">
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

                    <div className="flex justify-center pt-4">
                      <button className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
                        <span className="md:text-base lg:text-lg font-[Roboto]">
                          Booking & Start Chating
                        </span>
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                          <div className="relative h-full w-10 bg-white/20"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-4 sm:space-y-0 lg:mt-[195px] md:mt-[34px] sm:mt-[34px] mt-[45px]">
                  <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                    Total Works and Earnings
                  </button>
                  <button className="w-full sm:w-[230px] py-2 bg-[#21A391] text-white rounded-md font-[Roboto] text-[12px] hover:scale-105 transition-all duration-300">
                    View Current Status
                  </button>
                </div>
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

          {/* About Me Content */}
          <div className="space-y-4 lg:space-y-0 ">
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
              I am Jone, a highly skilled and experienced electrician with over
              10 years of experience in the field. I specialize in both
              residential and commercial electrical systems, offering
              top-quality services for installations, repairs, and more.
            </p>

            <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
              Electrical systems, providing top-notch installation, maintenance,
              and repair services. I am dedicated to ensuring the safety and
              satisfaction of my clients, adhering to the highest standards of
              electrical safety and compliance. With a keen eye for detail and a
              commitment to excellence, I have built a reputation for
              reliability and professionalism in the industry.
            </p>

            <p className="text-sm sm:text-base md:text-lg lg:text-[12px]">
              My passion is to ensure safety and efficiency in every project I
              undertake, and I am committed to providing the best solutions for
              my clients.
            </p>
          </div>

          {/* Read More Button */}
          <div className="mt-8">
            <button className="group relative inline-block text-[#21A391] text-sm sm:text-base md:text-lg lg:text-[17px] font-semibold transition-colors duration-300 hover:text-[#1a8275]">
              Read More
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#21A391] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="underLine h-[3px] bg-[#ECECEC]  flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div>

      {/* ReviewSeciotn  */}

      {/* Review Section */}
      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="sm:max-w-3xl md:max-w-[1200px] mx-auto">
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[19px] font-semibold mb-12">
            What Clients Say:
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
                  <h3 className="text-lg font-semibold ">
                    Alexander
                  </h3>
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
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              John has been our go-to electrician for several years now. Whether
              it's routine maintenance or emergency repairs, he is always
              prompt, courteous, and gets the job done right the first time. His
              commitment to safety and quality is unmatched, and we trust him
              completely with all our electrical needs.
            </p>
          </div>
        </div>
      </div>

      <div className="underLine h-[3px] bg-[#ECECEC] flex justify-center mx-auto w-full sm:w-[300px] md:w-[700px] lg:w-[1200px] my-4"></div>

      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
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
                  <h3 className="text-lg font-semibold ">
                    Alexander
                  </h3>
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
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              John has been our go-to electrician for several years now. Whether
              it's routine maintenance or emergency repairs, he is always
              prompt, courteous, and gets the job done right the first time. His
              commitment to safety and quality is unmatched, and we trust him
              completely with all our electrical needs.
            </p>
          </div>
        </div>
        <div className="mt-8">
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
                  <h3 className="text-lg font-semibold ">
                    Alexander
                  </h3>
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
                   <h3 className="text-[12px] font-semibold ">
                    Electrician
                  </h3>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              <span className="font-semibold">Expertise :</span> Residential Electrical Systems , Wiring and Circuit Design
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
                  <h3 className="text-lg font-semibold ">
                    Alexander
                  </h3>
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
                   <h3 className="text-[12px] font-semibold ">
                    Electrician
                  </h3>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[12px] ">
              <span className="font-semibold">Expertise :</span> Residential Electrical Systems , Wiring and Circuit Design
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LaborProfile
