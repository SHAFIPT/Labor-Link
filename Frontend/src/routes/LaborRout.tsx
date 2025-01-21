import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { RootState } from "../redux/store/store";
import LaborRegisterExperience from "../components/LaborSide/laborAuth/LaborRegisterExperience";
import LaborRegisterProfile from "../components/LaborSide/laborAuth/LaborRegisterProfile";
import LaborResterPages from "../pages/LaborSide/LaborAuth/LaborResterPages";
import LaborDashboard from "../pages/LaborSide/LaborHomePage";
import LaborProfilePage from "../pages/LaborSide/LaborProfilePage";
import PublicRoute from "../components/Authentications/PublicRoute";
import PrivateRoute from "../components/Authentications/PrivateRoute";

const LaborRout = () => {
  const navigate = useNavigate();
  const isLaborAuthenticated = useSelector(
    (state: RootState) => state.labor.isLaborAuthenticated
  );

  useEffect(() => {
    if (isLaborAuthenticated) {
      navigate('/labor/ProfilePage');
    }
  }, [isLaborAuthenticated, navigate]);

  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <Routes>
        <Route path='/dashboard' element={<LaborDashboard />} />
        <Route path='/registerPage' element={<LaborResterPages />} />
        <Route path='/Profile' element={<LaborRegisterProfile />} />
        <Route path='/experiencePage' element={<LaborRegisterExperience />} />
        <Route path='/ProfilePage' element={<LaborProfilePage />} />
      </Routes>
    </Suspense>
  );
};

export default LaborRout;
