import LoginNav from "./LoginNav";
import LoginImage from "../../assets/UpsacalRegisterpage.jpeg";
import "./userLoginBody.css";
import "./userLoginBody.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  setLoading,
  setFormData,
  setError,
  setAccessToken,
  setIsAuthenticated,
  setUser,
} from "../../redux/slice/userSlice";
import {register} from "../../utils/userRegisterValidators";
import { sendOtp , googleAuth} from "../../services/UserAuthServices";
import axios from "axios";
import { toast } from 'react-toastify';
import OtpForm from "./OtpModel";

const UserRegisterPage = () => {
  const commonPasswords = ["password", "123456", "qwerty", "abc123", "letmein"];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false)
  const [criteria, setCriteria] = useState({
    length: false,
    lowerCase: false,
    upperCase: false,
    unCommen: true,
  });

  const error: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  } = useSelector((state: RootState) => state.user.error);

  const validatePassword = (input: string) => {
    setCriteria({
      length: input.length >= 8,
      lowerCase: /[a-z]/.test(input),
      upperCase: /[A-Z]/.test(input),
      unCommen: !commonPasswords.includes(input),
    });
  };

  const { loading } = useSelector((state: RootState) => state.user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPassword(input);
    validatePassword(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setLoading(true));

    const formattedErrors = register({
      firstName,
      lastName,
      email,
      password,
    });

    if (formattedErrors && Object.keys(formattedErrors).length > 0) {
        setTimeout(() => {
          dispatch(setLoading(false));
          dispatch(setError(formattedErrors));
          toast.error("Please correct the highlighted errors.");
        }, 1000);

      return;
  }

    dispatch(setError({}));
    dispatch(setFormData({ firstName, lastName, email, password }));

    try {
      const Otpresponce = await sendOtp({ email, password });
      console.log("This is the Otpresponce:", Otpresponce);

      if (Otpresponce.status === 200) {
        const userEmail = Otpresponce.data.email;
        setEmail(userEmail);
        setOtpModalVisible(true);
        toast.success("OTP sent successfully! Please check your email.");
      } else {
        toast.error(
          Otpresponce.data?.message || "Unexpected response from the server."
        );
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
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setLoading(true));
      const googleResoponse = await googleAuth();

      if (googleResoponse.status === 200) {
        const { user, accessToken } = googleResoponse.data;
        dispatch(setUser(user));
        dispatch(setAccessToken(accessToken));
        dispatch(setIsAuthenticated(true));
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

  return (
    <div>
      {loading && <div className="loader"></div>}

      <OtpForm
        isVisible={isOtpModalVisible}
        onClose={() => setOtpModalVisible(false)}
      />

      <LoginNav />
      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Left Side Image */}
        <div className="LeftImage hidden lg:block lg:w-[60%] ml-16 mt-3 mb-7">
          <img
            src={LoginImage}
            alt="Login"
            className="w-full h-auto rounded-md  mb-7"
          />
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col lg:w-[50%] px-8">
          {/* Heading */}
          <div className="text-center lg:text-left mb-[30px] mt-12 lg:mt-0 lg:ml-[73px]">
            <h1 className="text-3xl font-serif relative">Sign Up</h1>
          </div>

          {/* User/Labor Options with Line Below */}
          {/* <div className="relative ">
 
            <div className="flex justify-center items-center space-x-[253px]">
       
              <div className="text-center cursor-pointer hover:text-blue-600 transition duration-200">
                <h2 className="text-[14px] font-medium font-poppins flex items-center justify-center gap-2">
                  <i className="fas fa-user text-blue-500"></i> I am a user
                </h2>
              </div>

              <div className="text-center cursor-pointer hover:text-yellow-600 transition duration-200">
                <h2 className="text-[14px] font-medium font-sans flex items-center justify-center gap-2">
                  <i className="fas fa-hard-hat text-yellow-500"></i> I am a
                  labor
                </h2>
              </div>
            </div>

            <span
              className="absolute w-[450px] bottom-[-15px] h-[3.5px] left-1/2 transform -translate-x-1/2"
              style={{
                background: `linear-gradient(to right, #21A391 50%, #8dcbdd  50%)`,
              }}
            ></span>
          </div> */}

          <form className="" onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="formFields  gap-3 flex flex-col pt-7">
              {/* Email Field */}
              <div className="form-control relative">
                <input
                  required
                  value={firstName}
                  className="w-full p-2 bg-transparent outline-none"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="flex">
                  <span style={{ transitionDelay: "0ms" }}>F</span>
                  <span style={{ transitionDelay: "50ms" }}>i</span>
                  <span style={{ transitionDelay: "100ms" }}>r</span>
                  <span style={{ transitionDelay: "150ms" }}>s</span>
                  <span style={{ transitionDelay: "200ms" }}>t</span>
                  <span style={{ transitionDelay: "250ms" }}>N</span>
                  <span style={{ transitionDelay: "300ms" }}>a</span>
                  <span style={{ transitionDelay: "350ms" }}>m</span>
                  <span style={{ transitionDelay: "400ms" }}>e</span>
                </label>
                {error?.firstName && (
                  <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
                )}
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px]"
                  style={{ background: `#8dcbdd 50%` }}
                ></div>
              </div>
              <div className="form-control relative">
                <input
                  required
                  value={lastName}
                  className="w-full p-2 bg-transparent outline-none"
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label className="flex">
                  <span style={{ transitionDelay: "0ms" }}>L</span>
                  <span style={{ transitionDelay: "50ms" }}>a</span>
                  <span style={{ transitionDelay: "100ms" }}>s</span>
                  <span style={{ transitionDelay: "150ms" }}>t</span>
                  <span style={{ transitionDelay: "200ms" }}>N</span>
                  <span style={{ transitionDelay: "250ms" }}>a</span>
                  <span style={{ transitionDelay: "300ms" }}>m</span>
                  <span style={{ transitionDelay: "350ms" }}>e</span>
                </label>
                {error?.lastName && (
                  <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
                )}
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px]"
                  style={{ background: `#8dcbdd 50%` }}
                ></div>
              </div>
              <div className="form-control relative">
                <input
                  required
                  value={email}
                  className="w-full p-2 bg-transparent outline-none"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="flex">
                  <span style={{ transitionDelay: "0ms" }}>E</span>
                  <span style={{ transitionDelay: "50ms" }}>m</span>
                  <span style={{ transitionDelay: "100ms" }}>a</span>
                  <span style={{ transitionDelay: "150ms" }}>i</span>
                  <span style={{ transitionDelay: "200ms" }}>l</span>
                </label>
                {error?.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px]"
                  style={{ background: `#8dcbdd 50%` }}
                ></div>
              </div>

              {/* Password Field */}
              <div className="form-control relative">
                <input
                  required
                  value={password}
                  className="w-full bg-transparent outline-none pr-10 "
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                />
                <label className="flex">
                  <span style={{ transitionDelay: "0ms" }}>P</span>
                  <span style={{ transitionDelay: "50ms" }}>a</span>
                  <span style={{ transitionDelay: "100ms" }}>s</span>
                  <span style={{ transitionDelay: "150ms" }}>s</span>
                  <span style={{ transitionDelay: "200ms" }}>w</span>
                  <span style={{ transitionDelay: "250ms" }}>o</span>
                  <span style={{ transitionDelay: "300ms" }}>r</span>
                  <span style={{ transitionDelay: "350ms" }}>d</span>
                </label>
                {error?.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px]"
                  style={{ background: `#8dcbdd 50%` }}
                ></div>
                <i
                  className="fas fa-eye absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility()}
                ></i>
              </div>
            </div>
            <div className="mt-2 text-md ">
              <ul className="list-disc ml-[20px] sm:ml-[20px] lg:ml-[94px] space-y-1 ">
                <li className={criteria.length ? "text-green-500" : ""}>
                  Must be at least 8 characters
                </li>
                <li className={criteria.lowerCase ? "text-green-500" : ""}>
                  Must include one lowercase character
                </li>
                <li className={criteria.upperCase ? "text-green-500" : ""}>
                  Must include one uppercase character
                </li>
                <li className={criteria.unCommen ? "text-green-500" : ""}>
                  Can't be too common
                </li>
              </ul>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="w-[450px] h-[48px] group/button relative inline-flex items-center justify-center overflow-hidden rounded-md"
                style={{ backgroundColor: "#21A391" }}
              >
                <span className="text-lg text-white">Sign Up</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/20"></div>
                </div>
              </button>
            </div>
            <div className="flex justify-center mt-2 mb-2">
              <div className="flex items-center my-2">
                <hr className="w-[199px] border-t border-gray-400" />
                <span className="mx-4 ">OR</span>
                <hr className="w-[199px] border-t border-gray-400" />
              </div>
            </div>
            <div className="googleLogin flex justify-center">
              <button
                className="border w-[450px] cursor-pointer text-black flex gap-2 items-center justify-center bg-white px-4 py-3 rounded font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
                onClick={handleGoogleSignIn}
              >
                <svg
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6"
                >
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
          </form>
          <div className="div ml-0 sm:ml-[0px] md:ml-[0px] lg:ml-[85px]">
            <Link to={"/login"} className="text-sm mt-[26px]">
              Already have an account ?{" "}
              <span>
                <a href="#" className="hover:underline text-[#23c7b1]">
                  {" "}
                  Sign in
                </a>
              </span>
            </Link>

            <div className="text-sm mt-[26px]">
              Looking to join us as a Labor ?
              <span>
                <Link to={'/laborHome'} className="hover:underline text-[#23c7b1]">Apply as a labor</Link>
                
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;
