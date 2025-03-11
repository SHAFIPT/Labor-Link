import "./userLogin.css";  
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { toggleTheme } from "../../redux/slice/themeSlice";
import image from '../../assets/new1.png'
import dark from '../../assets/LabourLinkDark.png'
const LoginNav = () => {
      const dispatch = useDispatch();  // Get dispatch function
    const theme = useSelector((state: RootState) => state.theme.mode);  // Get the current theme

    const toggleDarkMode = () => {
      dispatch(toggleTheme());  // Dispatch toggle action
    };


  return (
    
     <div className="w-full flex justify-between items-center px-2 sm:px-4">
    <Link to={'/'}>
      <div className="loginNavbarlogo">
        {theme === "dark" ? (
          <img 
            src={dark} 
            alt="Dark Logo" 
            className="w-[90px] sm:w-24 md:w-28 lg:w-32 ml-2 sm:ml-8 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-4"
          />
        ) : (
          <img 
            src={image} 
            alt="Light Logo" 
            className="w-[90px] sm:w-24 md:w-28 lg:w-32 ml-2 sm:ml-8 md:ml-8 lg:ml-16 pt-4 sm:pt-6 lg:pt-9" 
          />
        )}
      </div>
    </Link>

    <div className="rightDarkLighMode p-4 sm:p-8 md:p-12 lg:p-12 mr-2 sm:mr-1 md:mr-6 lg:mr-8">
      <label className="toggle" htmlFor="switch" onClick={toggleDarkMode}>
        <input
          id="switch"
          className="input"
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleDarkMode}
        />
        {theme === "dark" ? (
          <div className="icon icon--sun">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 47.5 47.5"
              className="w-[18px] h-[18px] sm:w-[20px] sm:h-[25px] lg:w-[20px] lg:h-[25px]"
            >
              <g fill="#ffac33" transform="matrix(1.25 0 0 -1.25 0 47.5)">
                <path d="M17 35s0 2 2 2 2-2 2-2v-2s0-2-2-2-2 2-2 2v2zM35 21s2 0 2-2-2-2-2-2h-2s-2 0-2 2 2 2 2 2h2zM5 21s2 0 2-2-2-2-2-2H3s-2 0-2 2 2 2 2 2h2zM10.121 29.706s1.414-1.414 0-2.828-2.828 0-2.828 0l-1.415 1.414s-1.414 1.414 0 2.829c1.415 1.414 2.829 0 2.829 0l1.414-1.415ZM31.121 8.707s1.414-1.414 0-2.828-2.828 0-2.828 0l-1.414 1.414s-1.414 1.414 0 2.828 2.828 0 2.828 0l1.414-1.414ZM30.708 26.879s-1.414-1.414-2.828 0 0 2.828 0 2.828l1.414 1.414s1.414 1.414 2.828 0 0-2.828 0-2.828l-1.414-1.414ZM9.708 5.879s-1.414-1.414-2.828 0 0 2.828 0 2.828l1.414 1.414s1.414 1.414 2.828 0 0-2.828 0-2.828L9.708 5.879ZM17 5s0 2 2 2 2-2 2-2V3s0-2-2-2-2 2-2 2v2zM29 19c0 5.523-4.478 10-10 10-5.523 0-10-4.477-10-10 0-5.522 4.477-10 10-10 5.522 0 10 4.478 10 10"></path>
              </g>
            </svg>
          </div>
        ) : (
          <div className="icon icon--moon">
            <svg
              height="32"
              width="32"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[18px] h-[18px] sm:w-[20px] sm:h-[25px] lg:w-[20px] lg:h-[25px]"
            >
              <path
                clipRule="evenodd"
                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        )}
      </label>
    </div>
  </div>  
  );
};

export default LoginNav;
