import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store/store';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'user' | 'labor';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated);
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);

  if (role === 'user' && isUserAuthenticated) {
    return <Navigate to='/'/>;
  }

  if (role === 'labor' && isLaborAuthenticated) {
     return <>{children}</>;
  }
  
  return <Navigate to='/'/>;
};

export default PrivateRoute;
