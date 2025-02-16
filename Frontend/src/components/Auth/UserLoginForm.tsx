import LoginNav from "./LoginNav";
import LoginImage from "../../assets/upsacelLoginpageimage.jpeg";
import './userLoginBody.css'
import './LoadingBody.css'
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../utils/firbase';
import React, { useEffect, useState } from "react";
import validate from "../../utils/userRegisterValidators";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setError, setisUserAthenticated }
  from '../../redux/slice/userSlice'
import { setLaborer , setIsLaborAuthenticated , setAccessToken ,setFormData} from '../../redux/slice/laborSlice'
import { RootState } from "../../redux/store/store";
import { toast } from 'react-toastify';
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { googleAuth } from "../../services/UserAuthServices";
import { Login, forgotPasswordSendOTP, forgetPasswordVerify, forgotPasswordReset ,  } from "../../services/UserAuthServices";
import { laborForgetPasswordVerify, laborForgotPasswordReset, laborForgotPasswordSendOTP, LaborLogin } from '../../services/LaborAuthServices'
import Forgottpasswod from "../UserSide/Forgottpasswod";
import AnimatedPage from "../AnimatedPage/Animated";
import ResetPassword from "../UserSide/ResetPassword";

const UserLoginForm = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgetpassword, setforgetPassword] = useState(false)
  const [visiblePassword, setvisiblePasswod] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [otpToken, setOtpToken] = useState("")
  const [imaLabor , setIamLabor] = useState(false)
  const [imaUser , setIamUser] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading  = useSelector((state: RootState) => state.user.loading)
  const isLaborAuthenticated = useSelector((state : RootState) => state.labor.isLaborAuthenticated)
  const laborer = useSelector((state : RootState) => state.labor.laborer)
  console.log('this is isLaborAuthenticated :',isLaborAuthenticated)
  console.log('this is laborer :',laborer)
  
  //   useEffect(() => {
  // dispatch(setError({}))
  //   })

  const error: {
    email?: string;
    password?: string;
  } = useSelector((state: RootState) => state.user.error);

  // console.log(dispatch(setError({})))
  console.log('this is errors :',error)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  dispatch(setLoading(true));

  const formDataError = validate({ email, password });
  if (formDataError) {
    setTimeout(() => {
      dispatch(setLoading(false));
      dispatch(setError(formDataError));
      toast.error("Please correct the highlighted errors.");
    }, 1000);
    return;
  } else {
    dispatch(setError({}));

    try {
      const role = imaUser ? "user" : "labor";
      console.log('Thsis it hro role ::',role)
      const loginResponse = await Login({ email, password }, role);

      if (loginResponse.status === 200) {
        console.log('thsis ie the loginResponse',loginResponse)
        const { userFound, LaborFound, accessToken } = loginResponse.data.data;

        try {
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Firebase Login Successful:', firebaseUserCredential);

          localStorage.setItem(`${role}AccessToken`, accessToken);
          toast.success(loginResponse.data.message || "Login successful!");

          if (imaUser) {
            dispatch(setUser(userFound));
            dispatch(setFormData(userFound));
            dispatch(setAccessToken(accessToken));
            dispatch(setisUserAthenticated(true));
            navigate('/');
          } else if (imaLabor) {
            dispatch(setLaborer(LaborFound));
            dispatch(setFormData(LaborFound));
            dispatch(setAccessToken(accessToken));
            dispatch(setIsLaborAuthenticated(true));
            navigate('/labor/laborDashBoard');
          }
        } catch (firebaseError) {
          console.error('Firebase Authentication failed:', firebaseError);
          toast.error(firebaseError.message || 'Error during Firebase authentication.');
          dispatch(setLoading(false));
        }
      } else {
        toast.error(loginResponse.data.message || "Error occurred during login.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
};
;
    const handleForgetPassword = async ( email : string) => {
      try {

        console.log('this is email',email)
        const role = imaUser ? "user" : "labor";
        dispatch(setLoading(true))
        const response = await forgotPasswordSendOTP(email, role)  

        if (response.status == 200) {
          toast.success(response.data.message || 'Otp sended successfully')
          dispatch(setLoading(false));
         return true;
      }
      
      if (response.status === 500 || response.status === 404) {
        toast.error(response.data.message || 'An error occurred during the otp send for forgetpassword...!')
        dispatch(setLoading(false))
        return
      }
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Axios error:", message);
          toast.error(message);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
      }
  }
  
  const handleVerifyOtp = async (otp: string, email: string) => {
    try {

      dispatch(setLoading(false))

      if (!otp || otp.length != 4) {
        toast.error("Please Enter valid OTP");
        return null;
      }
      const role = imaUser ? "user" : "labor";
      const response = await forgetPasswordVerify(otp, email ,role)

       if (response.status == 200) {
          toast.success('Otp verify successfully...!')
      }

      if (response?.data.statusCode == 400 || response?.data.statusCode == 500) {
        toast.error(response.data.message || "Enter valid OTP");
      }

      if (response?.data.success) {
        dispatch(setLoading(false));
        setOtpToken(response.data.data.accessToken);
        setforgetPassword(false);
        setResetPassword(true);
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Axios error:", message);
          toast.error(message);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
    }
  }

  const handleConformResetPassword = async (password : string) => {
    try {
      dispatch(setLoading(true))

      const role = imaUser ? "user" : "labor";
      const response = await forgotPasswordReset(password, otpToken, role)
      
      if (response?.data.success) {
        dispatch(setLoading(false));

        return true;
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Axios error:", message);
          toast.error(message);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
    }
  }
      
    const handleGoogleSignIn = async () => {
      try {
        dispatch(setLoading(true));
        const googleResoponse = await googleAuth();
    
        if (googleResoponse.status === 200) {
          const { user, accessToken } = googleResoponse.data.data;
          localStorage.setItem('UserAccessToken',accessToken)
          dispatch(setUser(user));
          dispatch(setAccessToken(accessToken));
          dispatch(setisUserAthenticated(true));
          dispatch(setLoading(false));
          toast.success("Successfully signed in with Google!");
          navigate('/');
        } else {
          toast.error(
            googleResoponse.data?.message || "Google Sign-In failed."
          );
        }
      } catch (error) {
        console.error("Google Sign-In error:", error);
        toast.error("Something went wrong with Google Sign-In.");
      } finally {
        dispatch(setLoading(false));
      }
  };
  
  const handleCancelation = () => {
    setforgetPassword(false)
    dispatch(setLoading(false))
    setResetPassword(false)
  }

    const handleLoginTypeChange = (type: 'user' | 'labor') => {
      if (type === 'user') {
        setIamUser(true)
        setIamLabor(false)
      } else {
        setIamLabor(true)
        setIamUser(false)
      }
      // Clear form when switching types
      setEmail('')
      setPassword('')
      dispatch(setError({}))
    }



    return (
      <div>
        {loading && <div className="loader"></div>}
        <AnimatedPage>
        {forgetpassword && (
            <Forgottpasswod
              onVerify={handleVerifyOtp}
              conform={handleForgetPassword}
              onCancel={handleCancelation}
              message="Enter your email"
              title="Forgot Password"
            />
          )}

          {resetPassword && (
            <ResetPassword
              conform={handleConformResetPassword}
              title='Reset password'
              message='Enter your New Password'
              onCancel={handleCancelation}
            />
          )}
          </AnimatedPage>

        <LoginNav />
        <div className="flex">
          {/* Left Side Image */}
          <div className="hidden sm:hidden md:mt-[40px] lg:mt-5 md:block w-[80%] md:w-[50%] lg:block lg:w-[60%] ml-12 ">
          <img src={LoginImage} alt="Login" className=" w-full h-auto rounded-md" />
        </div>

          {/* Right Side Content */}
          <div className="flex flex-col  lg:w-[50%] px-14 sm:px-20 md:px-20 lg:px-9">
            {/* Heading */}
            <div className="text-center lg:text-left mb-[30px] lg:ml-[73px]">
              <h1 className="text-3xl font-serif relative">
                Sign In
            
              </h1>
            </div>
          
            {/* User/Labor Options with Line Below */}
            <div className="relative ">
              {/* Options */}
              <div className="flex justify-center items-center space-x-[253px]">
                {/* I am a user option */}
                <div className="text-center cursor-pointer hover:text-blue-600 transition duration-200">
                  <h2 className="text-[14px] font-medium font-poppins flex items-center justify-center gap-2"
                    onClick={() => handleLoginTypeChange('user')}
                  >
                    <i className="fas fa-user text-blue-500"></i> I am a user
                  </h2>
                </div>

                {/* I am a labor option */}
                <div className="text-center cursor-pointer hover:text-yellow-600 transition duration-200">
                  <h2 className="text-[14px] font-medium font-sans flex items-center justify-center gap-2"
                    onClick={() => handleLoginTypeChange('labor')}
                  >
                    <i className="fas fa-hard-hat text-yellow-500"></i> I am a labor
                  </h2>
                </div>
              </div>
                
              {/* Line below options */}
              
              {imaUser && !imaLabor ? (
                <span
                className="absolute w-[450px] bottom-[-15px] h-[3.5px] left-1/2 transform -translate-x-1/2"
                   style={{
                     background: `linear-gradient(to right, #21A391 50%, #8dcbdd  50%)`,
                  }}
                ></span>
              ) : (
                 <span
                className="absolute w-[450px] bottom-[-15px] h-[3.5px] left-1/2 transform -translate-x-1/2"
                   style={{
                     background: `linear-gradient(to left, #21A391 50%, #8dcbdd  50%)`,
                  }}
                ></span> 
                )}
               
              
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <div className="formFields flex flex-col pt-7">
                {/* Email Field */}
                <div className="form-control relative">
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                  />
                  <label className="flex">
                    <span style={{ transitionDelay: '0ms' }}>E</span>
                    <span style={{ transitionDelay: '50ms' }}>m</span>
                    <span style={{ transitionDelay: '100ms' }}>a</span>
                    <span style={{ transitionDelay: '150ms' }}>i</span>
                    <span style={{ transitionDelay: '200ms' }}>l</span>
                  </label>
                  {error?.email && (
                    <p className="text-red-500 text-sm mt-1">{error.email}</p>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: `#8dcbdd 50%` }}></div>
                </div>

                {/* Password Field */}
                <div className="form-control relative">
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={visiblePassword ? 'text' : 'password'}
                    className="w-full bg-transparent outline-none "
                  />
                  <label className="flex">
                    <span style={{ transitionDelay: '0ms' }}>P</span>
                    <span style={{ transitionDelay: '50ms' }}>a</span>
                    <span style={{ transitionDelay: '100ms' }}>s</span>
                    <span style={{ transitionDelay: '150ms' }}>s</span>
                    <span style={{ transitionDelay: '200ms' }}>w</span>
                    <span style={{ transitionDelay: '250ms' }}>o</span>
                    <span style={{ transitionDelay: '300ms' }}>r</span>
                    <span style={{ transitionDelay: '350ms' }}>d</span>
                  </label>
                  {error?.password && (
                    <p className="text-red-500 text-sm mt-1">{error.password}</p>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: `#8dcbdd 50%` }}></div>
                              {/* Password Visibility Toggle */}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setvisiblePasswod((prev) => !prev)}
                  >
                    {visiblePassword  ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            <div className="flex justify-center mt-4">
              <button
                className="w-[450px] h-[48px] group/button relative inline-flex items-center justify-center overflow-hidden rounded-md"
                style={{ backgroundColor: "#21A391" }}
              >
                <span className="text-lg text-white">Sign In</span>
                <div
                  className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
                >
                  <div className="relative h-full w-10 bg-white/20"></div>
                </div>
              </button>
              </div>
            </form>
            
            {imaUser && !imaLabor &&  (
               <div className="flex justify-center mt-2 mb-2">
              <div className="flex items-center my-2">
                <hr className="w-[199px] border-t border-gray-400" />
                <span className="mx-4 text-gray-500">OR</span>
                <hr className="w-[199px] border-t border-gray-400" />
              </div>
            </div>
            )}

            {imaUser && !imaLabor &&  (
              <div className="googleLogin flex justify-center">
              <button
                className="border w-[450px] cursor-pointer text-black flex gap-2 items-center justify-center bg-white px-4 py-3 rounded font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
                onClick={handleGoogleSignIn}
              >
                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6">
                  <path
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    fill="#FFC107"
                  ></path>
                  <path
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    fill="#FF3D00"
                  ></path>
                  <path
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    fill="#4CAF50"
                  ></path>
                  <path
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    fill="#1976D2"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </div>
            )}

            <div className="div ml-0 sm:ml-[0px] md:ml-[0px] lg:ml-[85px]">
              <div className="forgetpassword mt-2 ">
                <a className="text-sm text-[#7747ff] underline" href="#" onClick={()=> setforgetPassword(true)}>Forgot your password?
                </a>
              </div>
              <div className="text-sm mt-[5px]">Don’t have an account yet?</div>
              <div className="signUnasuser">
                <div className="flex gap-4 font-semibold text-[#23c7b1] mt-2">
                  <Link to={'/register'}  className="hover:underline" >Sign up as user</Link>
                  <span className="text-gray-500">OR</span>
                  <Link to={'/labor/dashboard'} className="hover:underline">Sign up as labor</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  };
  

export default UserLoginForm;