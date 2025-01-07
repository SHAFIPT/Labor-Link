import LaborResterPages from "../pages/LaborSide/LaborAuth/LaborResterPages";
import LaborDashboard from "../pages/LaborSide/LaborHomePage"
import { Route, Routes } from 'react-router-dom';


const LaborRout = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={<LaborDashboard />} />
      <Route path='/registerPage' element={<LaborResterPages/>} />
    </Routes>
  )
}

export default LaborRout
