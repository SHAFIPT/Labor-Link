import {  Route, Routes } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

const MainLoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80">
    <Loader2 className="w-12 h-12 animate-spin text-primary" />
  </div>
);

const UserRoute = React.lazy(() => import('./routes/UserRoute'));


const App = () => {
  return (
    <div>
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
