import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store/store';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'user' | 'labor';
}

const UserPrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated);

  if (role === 'user' && isUserAuthenticated) {
      return <>{children}</>
    }
    
    return <Navigate to="/" />;
  ;
};

export default UserPrivateRoute;
