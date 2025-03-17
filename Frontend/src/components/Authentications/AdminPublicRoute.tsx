import { ReactNode } from 'react';
import { RootState } from '../../redux/store/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
interface AdminPublicRouteProps {
  children: ReactNode;
}

const AdminPublicRoute = ({ children }: AdminPublicRouteProps) => {

  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated)
  
    return isAuthenticated ? <Navigate to='/admin/adminDashBoard' /> : children 
}
export default AdminPublicRoute