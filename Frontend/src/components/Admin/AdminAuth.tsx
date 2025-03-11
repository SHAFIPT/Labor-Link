import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateEmail } from "../../utils/laborRegisterValidators";
import { validatePassword } from "../../utils/userRegisterValidators";
import axios from "axios";
import {
    setError,
    setLoading,
    setAdmin,
    setAccessToken,
    setIsAdminAuthenticated
} from '../../redux/slice/adminSlice'

import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { AdminLogin } from "../../services/AdminAuthServices";
import { RootState } from "../../redux/store/store";
import '../Auth/LoadingBody.css'

const AdminAuth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state: RootState) => state.admin.loading);
  const dispatch = useDispatch();

  const handleOnSubmit = async (e: React.FormEvent) => {
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

      if (response.status === 200) {

        const { admin, accessToken } = response.data.data;
        localStorage.setItem("AdminAccessToken", accessToken);
        dispatch(setAdmin(admin));
        dispatch(setIsAdminAuthenticated(true));
        dispatch(setAccessToken(accessToken));
        dispatch(setLoading(false));
        // navigate('/admin/adimDashboard')
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
    <div>
      {loading && <div className="loader"></div>}
      <div className="flex items-center justify-center min-h-screen bg-[#D6CCCC]">
        <div className="lg:max-w-lg  md:w-[500px] md:h-[300px] lg:w-full">
          <div
            style={{
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            className="bg-[#E5E5E5] rounded-lg shadow-xl overflow-hidden "
          >
            <div className="p-8">
              <h2 className="text-center text-3xl font-extrabold text-[#A79B9B]">
                Admin Login
              </h2>
              <p className="mt-4 text-center text-gray-400"></p>
              <form onSubmit={handleOnSubmit} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm">
                  <div>
                    <label className="sr-only" htmlFor="email">
                      Email address
                    </label>
                    <input
                      placeholder="Email address"
                      className="appearance-none relative block w-full px-3 py-3 border  bg-[#D9D9D9] text-black rounded-md focus:outline-none  sm:text-sm"
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="sr-only" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        placeholder="Password"
                        className="appearance-none relative block w-full px-3 py-3 border  bg-[#D9D9D9] text-black  rounded-md focus:outline-none sm:text-sm"
                        type={showPassword ? "password" : "text"}
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-4 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-[#A79B9B] hover:bg-[#7c7272] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
