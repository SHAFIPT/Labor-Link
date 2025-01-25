import {  Route, Routes } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store/store';

const MainLoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80">
    <Loader2 className="w-12 h-12 animate-spin text-primary" />
  </div>
);



const UserRoute = React.lazy(() => import('./routes/UserRoute'));



const App = () => {



  const theme = useSelector((state: RootState) => state.theme.mode)
  

    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark'); 
      } else {
        document.documentElement.classList.remove('dark'); 
      }
    }, [theme]);


  return (
    <div className={`App ${
          theme === 'dark' ? 'bg-darkBg text-darkText' : 'bg-lightBg text-lightText'
        }`}>
       <ToastContainer theme="dark" />
      <Suspense fallback={<MainLoadingFallback />}>
        <Routes>
          <Route path="/*" element={<UserRoute />} />
        </Routes>
      </Suspense>
    </div>
  );
};  

export default App;
