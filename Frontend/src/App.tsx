import {  Route, Routes } from 'react-router-dom'; 
import UserRoute from './routes/UserRoute';  // Import UserRoute
import { ToastContainer} from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>      
        <Route path='/*' element={<UserRoute/>}/>
      </Routes>
    </div>
  );
};

export default App;
