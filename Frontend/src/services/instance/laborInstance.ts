  import axios, { AxiosError } from "axios";
  import store from "../../redux/store/store";
import { resetLaborer } from "../../redux/slice/laborSlice";

  // Get the API URL from environment
  const API_URL = import.meta.env.VITE_API_URL;

  // Ensure the base URL is properly formatted
  const normalizeBaseURL = (url: string) => {
    if (!url) {
      throw new Error("API_URL is not defined in environment variables");
    }

    const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    try {
      new URL(cleanUrl);
    } catch (error) {
      console.error(error)
      throw new Error(
        `Invalid API_URL: ${url}. URL must include protocol (e.g., http:// or https://)`
      );
    }

    return cleanUrl;
  };

  // Create axios instance with normalized base URL
  export const laborAxiosInstance = axios.create({
    baseURL: normalizeBaseURL(API_URL),
    withCredentials: true,
  });

  // Request interceptor
  laborAxiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("LaborAccessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  laborAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await getNewAccessToken();
          
          if (!newAccessToken) {
            // Force logout if no new token
            store.dispatch(resetLaborer());
            return Promise.reject(error);
          }

          localStorage.setItem("LaborAccessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return laborAxiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token Refresh Failed:', refreshError);
          store.dispatch(resetLaborer());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  async function getNewAccessToken() {
    try {
      const response = await axios.get(
        `${normalizeBaseURL(API_URL)}/api/auth/refresh-token`,
        { withCredentials: true }
      );

      if (!response.data?.data?.accessToken) {
        throw new Error("No access token received from refresh token endpoint");
      }

      return response.data.data.accessToken;
   } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Detailed Refresh Token Error:", axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
  }
