import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store/store';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'user' | 'labor';
}

const LaborPublicRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated);
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);

//   if (role === 'user' && isUserAuthenticated) {
//     return <Navigate to='/'/>;
//   }

  if (role === 'labor' && isLaborAuthenticated || isUserAuthenticated) {
     return <>{children}</>;
  }

  // Redirect to login if the user is not authenticated or role doesn't match
  return <Navigate to='/login'/>;
};

export default LaborPublicRoute;
