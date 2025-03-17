import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/adminAuth/AdminLogin';
import AdminPublicRoute from '../components/Authentications/AdminPublicRoute';
import AdminPrivateRoute from '../components/Authentications/AdminPrivateRoute';
import NewAdminDash from '../pages/newAdminSide/NewAdminDash';
import UserManagentPage from '../pages/newAdminSide/UserMangements';
import LaborMangementPage from '../pages/newAdminSide/LaborMangements';
import BookingMangementPage from '../pages/newAdminSide/BookingMangement';
import PaymentManagement from '../pages/newAdminSide/PaymentManagement';
import WithdrowalManagment from '../pages/newAdminSide/WithdrowalManagment';
import ViewUser from '../pages/newAdminSide/ViewUser';
import ViewLaobr from '../pages/newAdminSide/ViewLaobr';
import ProfilePage from '../pages/newAdminSide/ProfilePage';

const AdminRoute = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AdminPublicRoute>
            <AdminLogin />
          </AdminPublicRoute>
        }
      />

      <Route
        path="/*"
        element={
          <AdminPrivateRoute>
            <Routes>
              <Route path="adminDashBoard" element={<NewAdminDash />} />
              <Route path="userManagentPage" element={<UserManagentPage />} />
              <Route path="viewUser" element={<ViewUser />} />
              <Route
                path="laborManagentPage"
                element={<LaborMangementPage />}
              />
              <Route path="viewLabor" element={<ViewLaobr />} />
              <Route
                path="bookingsManagementPage"
                element={<BookingMangementPage />}
              />
              <Route
                path="paymentsManagementPage"
                element={<PaymentManagement />}
              />
              <Route
                path="withdrowalManagementPage"
                element={<WithdrowalManagment />}
              />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </AdminPrivateRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoute;
