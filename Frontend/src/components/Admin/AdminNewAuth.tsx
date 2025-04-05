import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { validatePassword } from "../../utils/userRegisterValidators";
import axios from "axios";
import {
    setError,
    setLoading,
    setAdmin,
    setAccessToken,
    setIsAdminAuthenticated
} from '../../redux/slice/adminSlice'
import { validateEmail } from '../../utils/laborRegisterValidators';
import { toast } from 'react-toastify';
import { AdminLogin } from '../../services/AdminAuthServices';
import { useNavigate } from 'react-router-dom';
import { HttpStatus } from '../../enums/HttpStaus';
import { Messages } from '../../constants/Messages';

const AdminNewAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state: RootState) => state.admin.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const validationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    const hasErrors = Object.values(validationErrors).some((error) => !!error);

    if (hasErrors) {
      dispatch(setError(validationErrors));
      dispatch(setLoading(false));
      toast.error("Please correct the highlighted errors.");
      return;
    }

    try {
      const role = "admin";
      const response = await AdminLogin({ email, password }, role);

      if (response.status === HttpStatus.OK) {

        const { admin, accessToken } = response.data.data;
        localStorage.setItem("AdminAccessToken", accessToken);
        dispatch(setAdmin(admin));
        dispatch(setIsAdminAuthenticated(true));
        dispatch(setAccessToken(accessToken));
        dispatch(setLoading(false));
        toast.success(Messages.ADMIN_LOGIN_SUCCESSFULLY)
        navigate('/admin/adminDashBoard')
      } else {
        dispatch(setLoading(false));
        throw new Error(response.data.message || "An error occurred");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error("Axios error:", message);
        toast.error(message);
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
    {loading && <div className="loader"></div>}
    
    <div className="flex min-h-screen items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500 p-2">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-lg border-0 bg-gray-800 px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-lg border-0 bg-gray-800 px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm pr-10" // Added pr-10 for padding-right
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Eye Icon for Show/Hide Password */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default to avoid focusing on the input
                  e.stopPropagation(); // Stop propagation to prevent input-related events
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 focus:outline-none z-20" // Added z-20 to ensure it's above the input
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <a
              href="#"
              className="inline-flex w-full justify-center rounded-lg border border-gray-700 bg-gray-800 py-2 px-4 text-sm font-medium text-gray-400 hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="inline-flex w-full justify-center rounded-lg border border-gray-700 bg-gray-800 py-2 px-4 text-sm font-medium text-gray-400 hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminNewAuth;