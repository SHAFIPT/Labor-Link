import axios from "axios";
import store from "../../redux/store/store";
import { resetUser } from "../../redux/slice/userSlice";

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
  } catch (e) {
    throw new Error(
      `Invalid API_URL: ${url}. URL must include protocol (e.g., http:// or https://)`
    );
  }

  return cleanUrl;
};

// Create axios instance with normalized base URL
export const userAxiosInstance = axios.create({
  baseURL: normalizeBaseURL(API_URL),
  withCredentials: true,
});

// Request interceptor
userAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("UserAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await getNewAccessToken();
        localStorage.setItem("UserAccessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return userAxiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(resetUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to get a new access token
async function getNewAccessToken() {
  try {
    const response = await axios.get(
      `${normalizeBaseURL(API_URL)}/api/user/auth/refresh-token`,
      { withCredentials: true }
    );

    if (!response.data?.data?.accessToken) {
      throw new Error("No access token received from refresh token endpoint");
    }

    return response.data.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
}
