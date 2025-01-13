import { Route, Routes } from 'react-router-dom';  // Import Routes and Route
import UserRegister from '../pages/userAuth/userRegister';  // Import UserRegister
import UserHomePage from '../pages/userSide/UserHomePage';
import UserLoginPage from '../pages/userAuth/userLogin';
import LaborRoute from './LaborRout';
import AdminRoute from '../routes/AdminRoute';
import PublicRoute from '../components/Authentications/PublicRoute';
import PrivateRoute from '../components/Authentications/PrivateRoute';

const UserRoute = () => {
  return (
    <Routes>
      <Route path='/admin/*' element={<AdminRoute/>}/>
      <Route path='/labor/*' element={<LaborRoute />} /> 
      <Route path='/login' element={<PublicRoute> <UserLoginPage/> </PublicRoute> }/>  
      <Route path="/register" element={<PublicRoute> <UserRegister /></PublicRoute>} />
      <Route path='/' element={<UserHomePage/>}/>
    </Routes>
  );
};  

export default UserRoute;
