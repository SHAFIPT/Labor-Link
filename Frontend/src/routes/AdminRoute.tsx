import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/adminAuth/AdminLogin';
import AdminDashboardPage from '../pages/adminSide/AdminDashboard';
import AdminPublicRoute from '../components/Authentications/AdminPublicRoute';
import AdminPrivateRoute from '../components/Authentications/AdminPrivateRoute';
import AdminUserManagement from '../pages/adminSide/AdminUserManagement';
import AdminLaborManagement from '../pages/adminSide/AdminLaborManagement';

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>}/>
      <Route path='/adimDashboard' element={<AdminPrivateRoute><AdminDashboardPage/></AdminPrivateRoute>}/>
      <Route path='/userManagemnet' element={<AdminPrivateRoute><AdminUserManagement/></AdminPrivateRoute>}/>
      <Route path='/laborManagement' element={<AdminPrivateRoute><AdminLaborManagement/></AdminPrivateRoute>}/>
    </Routes>
  )
}

export default AdminRoute
