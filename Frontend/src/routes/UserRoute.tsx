import { Route, Routes } from 'react-router-dom';  // Import Routes and Route
import UserRegister from '../pages/userAuth/userRegister';  // Import UserRegister
import UserHomePage from '../pages/userSide/UserHomePage';
import UserLoginPage from '../pages/userAuth/userLogin';
import LaborHomePage from '../pages/LaborSide/LaborHomePage';


const UserRoute = () => {
  return (
    <Routes>
      <Route path='/laborHome' element={<LaborHomePage/>}/>
      <Route path='/login' element={<UserLoginPage/>}/>  
      <Route path="/register" element={<UserRegister />} />
      <Route path='/' element={<UserHomePage/>}/>
    </Routes>
  );
};

export default UserRoute;
