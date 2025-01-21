// UserRoute.jsx
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Route guards - these are typically small and can be imported directly
import PublicRoute from '../components/Authentications/PublicRoute';
import PrivateRoute from '../components/Authentications/PrivateRoute';
import UserProfilePage from '../pages/userSide/UserProfilePage';

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
        <Route path="/laborListing" element={<LaborLisingPage />} />
        {/* UserProfile Page */}
        <Route path="/userProfile" element={<UserProfilePage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoute;
