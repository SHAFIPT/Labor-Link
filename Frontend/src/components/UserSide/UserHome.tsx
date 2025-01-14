import { Link, useNavigate } from "react-router-dom"
import AnimatedPage from "../AnimatedPage/Animated"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { toast } from "react-toastify"
import { logout } from "../../services/UserAuthServices"
import { setisUserAthenticated, setUser, resetUser ,setFormData} from '../../redux/slice/userSlice'
import { setIsLaborAuthenticated, setLaborer  } from '../../redux/slice/laborSlice'
import { useEffect } from "react"
import { resetLaborer }  from '../../redux/slice/laborSlice'

const UserHome = () => {

  const { user } = useSelector((state: RootState) => state.user)
  const { formData } = useSelector((state: RootState) => state.user.formData)
  const { laborer } = useSelector((state: RootState) => state.labor)
  const  firstName  = useSelector((state: RootState) => state.user.user.firstName)
  const  lastName  = useSelector((state: RootState) => state.user.user.lastName)
  const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
  const isLaborAthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
  // const accessToken = localStorage.getItem('accessToken');
  console.log('this is firstName',firstName)
  console.log('this is lastName',lastName)
  console.log('this is laborer',laborer)
  console.log('this is user',user)
  // console.log('this is role',email) 
  console.log('this is isAthenticated',isUserAthenticated)  
  console.log('this is isLaborAthenticated',isLaborAthenticated)
  const navigate = useNavigate()
  const dispatch = useDispatch()
 
  // useEffect(() => {
  //   dispatch(setisUserAthenticated(false))
  //  dispatch(resetUser())
  //       dispatch(setUser({}))
  //       dispatch(setFormData({}))
  // },[])

    const handleLogout = async () => {
      try {

        const response = await logout()

        console.log('this is response : ',response)

      if (response?.status === 200) {
          // Clear local storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

        dispatch(resetUser())
        dispatch(setUser({}))
        dispatch(setisUserAthenticated(false)) 
        // Redirect to login page
        toast('logout successfully....!')
          navigate('/login');
        } else {
          console.error('Logout failed:', response);
          alert('Failed to logout. Please try again.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
  };
  

  // const clearLaborDetails = () => {
  //   dispatch(resetLaborer());
  // };
  const clearLaborDetails = () => {
    dispatch(resetUser());
  };
  
  // const shouldlaborShow =  isLaborAthenticated && laborer.firstName ;
  const shouldShowUserName = isUserAthenticated 

  console.log('this is shouldShowUserName :',isUserAthenticated)
  
 return (
   <div className="flex justify-between items-center p-10">
     

     <button onClick={clearLaborDetails}>
      Clear Labor Details
    </button>

    {/* Left Side: Welcome Text */}
    <AnimatedPage>
      <h1>Welcome to user Home page!</h1>
    </AnimatedPage>

    {/* Right Side: User Info or Login/Logout */}
    <div className="flex items-center gap-9">
       {shouldShowUserName && (
         <h1 className="w-auto p-3 rounded-lg bg-[#24c852] text-white">
           {user.firstName} {user.lastName}
         </h1>
       )}

      {/* Logout button for logged-in users */}
      {shouldShowUserName && (
        <div className="p-3 rounded-lg bg-[#d71313] text-white" onClick={handleLogout}>
          Logout
        </div>
      )}
     </div>
     
     {!shouldShowUserName && (
        <Link to="/login" className="w-22 p-3 rounded-lg bg-[#8dcbdd] text-white">
        Login
      </Link>
      )}


    {/* <div className="flex items-center gap-9">
     {shouldlaborShow && (
      <h1 className="w-auto p-3 rounded-lg bg-[#24c852] text-white">
        {laborer.firstName} {laborer.lastName}
      </h1>
    )}

      {shouldlaborShow && (
        <div className="p-3 rounded-lg bg-[#d71313] text-white" onClick={handleLogout}>
          Logout
        </div>
      )}
    </div> */}
  </div>
);
}

export default UserHome
