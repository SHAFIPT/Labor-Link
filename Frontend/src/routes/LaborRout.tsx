import LaborRegisterExperience from "../components/LaborSide/laborAuth/LaborRegisterExperience";
import LaborRegisterProfile from "../components/LaborSide/laborAuth/LaborRegisterProfile";
import LaborResterPages from "../pages/LaborSide/LaborAuth/LaborResterPages";
import LaborDashboard from "../pages/LaborSide/LaborHomePage"
import { Route, Routes } from 'react-router-dom';
import LaborProfilePage from "../pages/LaborSide/LaborProfilePage";


const LaborRout = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={<LaborDashboard />} />
      <Route path='/registerPage' element={<LaborResterPages />} />
      <Route path="/Profile" element={<LaborRegisterProfile/>}/>
      <Route path="/experiencePage" element={<LaborRegisterExperience/>}/>
      <Route path="/ProfilePage" element={<LaborProfilePage/>}/>
    </Routes>
  )
}

export default LaborRout

