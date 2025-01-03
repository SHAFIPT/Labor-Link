import {  Route, Routes } from 'react-router-dom'; 
import UserRoute from './routes/UserRoute';  // Import UserRoute


const App = () => {
  return (
      <Routes>
        <Route path='/*' element={<UserRoute/>}/>
      </Routes>
  );
};

export default App;
