import { Link, useNavigate } from "react-router-dom"
import AnimatedPage from "../AnimatedPage/Animated"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { toast } from "react-toastify"
import { logout } from "../../services/UserAuthServices"
import { setIsAuthenticated, setUser } from '../../redux/slice/userSlice'

const UserHome = () => {

  const { user } = useSelector((state: RootState) => state.user)
  console.log('this is user',user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {

      const response = await logout()

      console.log('this is response : ',response)

    if (response?.status === 200) {
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

      
      dispatch(setUser({}))
      dispatch(setIsAuthenticated(false)) 
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
  
 return (
  <div className="flex justify-between items-center p-10">
    {/* Left Side: Welcome Text */}
    <AnimatedPage>
      <h1>Welcome to user Home page!</h1>
    </AnimatedPage>

    {/* Right Side: User Info or Login/Logout */}
    <div className="flex items-center gap-9">
     {Object.keys(user).length !== 0 ? (
      <h1 className="w-auto p-3 rounded-lg bg-[#24c852] text-white">
        {user.firstName} {user.lastName}
      </h1>
    ) : (
      <Link to="/login" className="w-22 p-3 rounded-lg bg-[#8dcbdd] text-white">
        Login
      </Link>
    )}

      {/* Logout button for logged-in users */}
      {Object.keys(user).length !== 0 && (
        <div className="p-3 rounded-lg bg-[#d71313] text-white" onClick={handleLogout}>
          Logout
        </div>
      )}
    </div>
  </div>
);
}

export default UserHome
