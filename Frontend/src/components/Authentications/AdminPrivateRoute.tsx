import { RootState } from '../../redux/store/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const AdminPrivateRoute= ({children}) => {
  const isAuthenticated= useSelector((state:RootState)=>state.admin.isAuthenticated)
    console.log('this is isAthenticated',isAuthenticated)
  return isAuthenticated?children:<Navigate to='/admin/login'/>;
}

export default AdminPrivateRoute