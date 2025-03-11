// UserRoute.jsx
import React, { Suspense } from 'react';
import { Route, Routes} from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import PublicRoute from '../components/Authentications/PublicRoute';
import UserPublicRoute from '../components/Authentications/UserPublicRoute';
import UserProfilePage from '../pages/userSide/UserProfilePage';
import ChatPage from '../pages/Chat/ChatPage';
import UserChatView from '../pages/userSide/UserChatView';
import UserPrivateRoute from '../components/Authentications/UserPrivateRoute';
import ViewBookingPage from '../pages/userSide/ViewBookingDetils';
import ReviewRating from '../pages/userSide/ReviewRating';

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
        <Route
          path="/userProfilePage"
          element={
            <UserPrivateRoute role="user">
              <UserProfilePage />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/bookingDetails-and-history"
          element={
            <UserPrivateRoute role="user">
              <ViewBookingPage/>
            </UserPrivateRoute>
          }
        />
        <Route path="/chatingPage" element={<UserPublicRoute role='user'><ChatPage /></UserPublicRoute>} />
        <Route path="/userChatPage" element={<UserPrivateRoute role='user'><UserChatView /></UserPrivateRoute>} />
        <Route path="/reviewRating" element={<UserPrivateRoute role='user'><ReviewRating /></UserPrivateRoute>} />
        ;
      </Routes>
    </Suspense>
  );
};

export default UserRoute;
