// UserRoute.jsx
import React, { Suspense } from 'react';
import { Route, Routes, useNavigate  } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Route guards - these are typically small and can be imported directly
import PublicRoute from '../components/Authentications/PublicRoute';
// import PrivateRoute from '../components/Authentications/UserPrivateRoute';
import UserPublicRoute from '../components/Authentications/UserPublicRoute';
import UserProfilePage from '../pages/userSide/UserProfilePage';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ChatPage from '../pages/Chat/ChatPage';

// Loading components
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Lazy load all page components
const UserHomePage = React.lazy(() => import('../pages/userSide/UserHomePage'));
const UserLoginPage = React.lazy(() => import('../pages/userAuth/userLogin'));
const UserRegister = React.lazy(() => import('../pages/userAuth/userRegister'));
const LaborLisingPage = React.lazy(() => import('../pages/userSide/LaborListingpage'));
const AdminRoute = React.lazy(() => import('./AdminRoute'));
const LaborRoute = React.lazy(() => import('./LaborRout'));
const UserRoute = () => {
  // const navigate = useNavigate()

  // const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
  // const laborRole = useSelector((state: RootState) => state.labor.laborer.role);

  //   if (isLaborAuthenticated && laborRole === 'labor') {
  //   console.log("its true gys...");
  //   navigate('/login');
  // }

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Admin and Labor routes */}
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/labor/*" element={<LaborRoute />} />
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <UserLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <UserRegister />
            </PublicRoute>
          }
        />
        {/* Home route */}
        <Route path="/" element={<UserHomePage />} />
        {/* Labor Listing */}
        <Route
          path="/laborListing"
          element={
            <UserPublicRoute role="labor">
              <LaborLisingPage />
            </UserPublicRoute>
          }
        />
        ;{/* Protected routes - only accessible when authenticated as user */}
        <Route
          path="/userProfilePage"
          element={
            <UserPublicRoute role="user">
              <UserProfilePage />
            </UserPublicRoute>
          }
        />
        <Route path="/chatingPage/:chatId" element={<ChatPage />} />
        ;
      </Routes>
    </Suspense>
  );
};

export default UserRoute;
