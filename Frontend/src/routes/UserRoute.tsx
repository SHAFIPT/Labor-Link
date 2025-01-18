// UserRoute.jsx
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Route guards - these are typically small and can be imported directly
import PublicRoute from '../components/Authentications/PublicRoute';
import PrivateRoute from '../components/Authentications/PrivateRoute';

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
const AdminRoute = React.lazy(() => import('./AdminRoute'));
const LaborRoute = React.lazy(() => import('./AdminRoute'));

const UserRoute = () => {
  return (
    <Routes>
      {/* Admin and Labor routes with their own Suspense boundaries */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <AdminRoute />
          </Suspense>
        }
      />
      <Route
        path="/labor/*"
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <LaborRoute />
          </Suspense>
        }
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <UserLoginPage />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <UserRegister />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Home route */}
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <UserHomePage />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default UserRoute;