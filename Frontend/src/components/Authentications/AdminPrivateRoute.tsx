import { ReactNode } from 'react';
import { RootState } from '../../redux/store/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
interface AdminPrivateRouteProps {
  children: ReactNode;
}

const AdminPrivateRoute= ({ children }: AdminPrivateRouteProps) => {
  const isAuthenticated= useSelector((state:RootState)=>state.admin.isAuthenticated)
  return isAuthenticated?children:<Navigate to='/admin/login'/>;
}

export default AdminPrivateRoute