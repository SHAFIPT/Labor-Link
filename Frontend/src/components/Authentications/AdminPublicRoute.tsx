import { RootState } from '../../redux/store/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const AdminPublicRoute = ({ children }) => {

       const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated);
      const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
      const userRole = useSelector((state: RootState) => state.user.user?.role);
      const laborRole = useSelector((state: RootState) => state.labor.formData.role);

  console.log('this is laborer',laborRole)
  console.log('this is user',userRole)
  // console.log('this is role',email) 
  console.log('this is isUserAthenticated',isUserAuthenticated)  
  console.log('this is isLaborAthenticated',isLaborAuthenticated)
    
    const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated)
    console.log('The admin is Authenicatd ',isAuthenticated)
    return isAuthenticated ? <Navigate to='/admin/adimDashboard' /> : children 
}
export default AdminPublicRoute