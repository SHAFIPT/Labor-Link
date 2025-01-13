import { RootState } from '../../redux/store/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


interface PrivateRouteProps {
  children: React.ReactNode
  role?: 'user' | 'admin' | 'labor';
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
   const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated);
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
  const userRole = useSelector((state: RootState) => state.user.user?.role);
  const laborRole = useSelector((state: RootState) => state.labor.formData.role);


    console.log('Role required')
    console.log('Is Labor Authenticated:', isLaborAuthenticated);
    console.log('Labor Role:', laborRole);
    console.log('Is User Authenticated:', isUserAuthenticated);
    console.log('User Role:', userRole);
  // Check if user has correct role (if role is specified)
  // if (role && userRole !== role) {
  //   return <Navigate to="/" />;
  // }

  // Allow access based on authentication type
  if (userRole === 'user' && isUserAuthenticated) {
    return <>{children}</>;
  }

  if (laborRole === 'labor' &&  isLaborAuthenticated) {
    return <>{children}</>;
  }

  // Default fallback to home page
  return <Navigate to="/" />;
};

export default PrivateRoute