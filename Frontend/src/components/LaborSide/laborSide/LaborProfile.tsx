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
import char from '../../../assets/char1.jpeg'
import './LaborProfile.css'
const LaborProfile = () => {
    const formdata = useSelector((state: RootState) => state.labor.formData)
    const formdatarole = useSelector((state: RootState) => state.labor?.formData?.role)
    const Oldrole = useSelector((state: RootState) => state.labor?.laborer?.role)
    console.log('formdata :',formdata)
    console.log('formdata :',formdatarole)
    console.log('formdata :',Oldrole)
    const dispatch = useDispatch()
    const navigate = useNavigate()
  //  useEffect(() => {
  //   console.log('Dispatching setIsLaborAuthenticated to false');
  //     dispatch(setFormData({}))
  // dispatch(setIsLaborAuthenticated(false));
  // },[]);
  
   const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
    const laborRole = useSelector((state: RootState) => state.labor);
  
  
      console.log('Role required')
      console.log('Is Labor Authenticated:', isLaborAuthenticated);
      // console.log('Labor Role:', laborRole);

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
    //         dispatch(setIsLaborAuthenticated(false))
    //         toast('logout successfully....!')
    //         navigate('/');
    //     }
    // }

  return (
    <>
      {/* <LoginNav/> */}
      {/* <div className="flex justify-between p-6">
      <div className="text">
        <h1>This is Labor profile page....!</h1>
      </div>
      <div className="right">
        <button
        onClick={handleLogoutLabor}
        className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
        >
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
      <div className="profileImage w-full relative">
        <img
          src={BgImage}
          alt="Profile"
          className="
      w-full 
      h-[150px] 
      sm:h-[200px] 
      md:h-[234px] 
      lg:h-[240px] 
      object-cover"
        />

        {/* Profile Image inside a circular container */}
        <div
          className="absolute 
      left-20 sm:left-24 md:left-28 lg:left-28 
      -translate-x-1/2 sm:-translate-x-0
       sm:top-1/2 sm:mt-24 md:mt-28 
      -translate-y-1/2
      transform"
        >
          <img
            src={char}
            alt="Profile"
            className="w-[110px] h-[110px] 
          sm:w-[120px] sm:h-[120px] 
          md:w-[160px] md:h-[160px]
          lg:w-[220px] lg:h-[220px]
          rounded-full 
          border-4 
          shadow-lg 
          object-cover"
          />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-white">
            <img
              src={HomeImage}
              alt="Home"
              className="w-5 h-auto sm:w-10 md:w-8 md:mt-1 cursor-pointer hover:opacity-80 transition-opacity"
              // onClick={() => navigateToHome()}
            />
            <span className="text-2xl sm:text-3xl md:text-[30px] font-extrabold">
              {">"}
            </span>
            <span className="text-sm sm:text-base md:text-lg font-medium">
              Profile
            </span>
          </div>
        </div>

        {/* Right Box - Half inside and Half outside the background image */}
        <div className="CardPage absolute rounded-xl  md:right-28 lg:mt-10 transform -translate-y-1/2 bg-white p-4 sm:p-6 w-64 md:w-[240px] lg:w-1/4 border-gray-300 shadow-lg z-10">
        <div className="space-y-7">
          <h2 className="textPage lg:text-[25px] md:text-[16px] sm:text-[12px] flex justify-center font-semibold border-b-2 border-gray-300 pb-2">
            Expert Electrician
          </h2>
            <h4 className=" lg:text-left font-semibold">Expertise:</h4>
            
          <ul className=" list-disc  pl-5 space-y-2">
            <li className="textsies md:text-base lg:text-lg expertise-item font-medium">Residential Electrical Systems</li>
            <li className="textsies md:text-base lg:text-lg expertise-item font-medium">Commercial Electrical Installations</li>
            <li className="textsies md:text-base lg:text-lg expertise-item font-medium">Wiring and Circuit Design</li>
            <li className="textsies md:text-base lg:text-lg expertise-item font-medium">Lighting Installation and Repair</li>
          </ul>

          <div className="flex justify-center items-center h-full">
            <button
              // onClick={() => setShowMore(!showMore)}
              className="butoonText group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
            >
              <span className="buttontext md:text-base lg:text-lg">
                {/* {showMore ? "previous services" : "more services"} */}
                Booking & Start Chating
              </span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                <div className="relative h-full w-10 bg-white/20"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default LaborProfile
