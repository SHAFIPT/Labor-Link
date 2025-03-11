import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store/store';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'user' | 'labor';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);

  if (role === 'labor' && isLaborAuthenticated) {
     return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
