import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/adminAuth/AdminLogin';
import AdminDashboardPage from '../pages/adminSide/AdminDashboard';
import AdminPublicRoute from '../components/Authentications/AdminPublicRoute';
import AdminPrivateRoute from '../components/Authentications/AdminPrivateRoute';
import AdminUserManagement from '../pages/adminSide/AdminUserManagement';
import AdminLaborManagement from '../pages/adminSide/AdminLaborManagement';
import UserViewPage from '../pages/adminSide/UserViewPage';
import LaborViewPage from '../pages/adminSide/LaborViewPage';
import LaborViewAllDetials from '../pages/adminSide/LaborViewAllDetials';
import BookingListingPage from '../pages/adminSide/BookingListingPage';
import PaymentEarnigsPage from '../pages/adminSide/PaymentEarnigs';
import WithdrowalPendings from '../pages/adminSide/WithdrowalPendings';
// import NewAdminDash from '../pages/newAdminSide/NewAdminDash';
// import UserManagentPage from '../pages/newAdminSide/UserMangements';
// import LaborMangementPage from '../pages/newAdminSide/LaborMangements';
// import BookingMangementPage from '../pages/newAdminSide/BookingMangement';

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>}/>
      <Route path='/adimDashboard' element={<AdminPrivateRoute><AdminDashboardPage/></AdminPrivateRoute>}/>
      <Route path='/userManagemnet' element={<AdminPrivateRoute><AdminUserManagement/></AdminPrivateRoute>}/>
      <Route path='/laborManagement' element={<AdminPrivateRoute><AdminLaborManagement/></AdminPrivateRoute>}/>
      <Route path='/userView' element={<AdminPrivateRoute><UserViewPage/></AdminPrivateRoute>}/>
      <Route path='/laborView' element={<AdminPrivateRoute><LaborViewPage/></AdminPrivateRoute>}/>
      <Route path='/viewAllDetails' element={<AdminPrivateRoute><LaborViewAllDetials/></AdminPrivateRoute>}/>
      <Route path='/bookingListing' element={<AdminPrivateRoute><BookingListingPage/></AdminPrivateRoute>}/>
      <Route path='/paymentEarnigs' element={<AdminPrivateRoute><PaymentEarnigsPage/></AdminPrivateRoute>}/>
      <Route path='/withdrowPendings' element={<AdminPrivateRoute><WithdrowalPendings /></AdminPrivateRoute>} />
      
      {/* <Route path='/adminDashBoard' element={<NewAdminDash/>}/>
      <Route path='/userManagentPage' element={<UserManagentPage/>}/>
      <Route path='/laborManagentPage' element={<LaborMangementPage/>}/>
      <Route path='/bookingsManagementPage' element={<BookingMangementPage/>}/> */}
    </Routes>
  )
}

export default AdminRoute
