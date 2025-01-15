import { IAdmin } from "../@types/admin";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('AdminAccessToken')
  if (token) {
    config.headers['authorization'] = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
)

export default api;

export const AdminLogin = async (credential: Partial<IAdmin>) => {
    const response = await api.post('/api/admin/auth/adminLoginPage', credential)
    return response
}

export const logout = async () => {
  const response = await api.post('/api/admin/auth/logout')
  return response
}

export const fetchUser = async () => {
  const resonse = await api.get('/api/admin/user/usersFetch')
  return resonse
}

export const fetchLabor = async () => {
  const response = await api.get('/api/admin/user/laborsFetch')
  return response
}

export const blockUser = async ({email}) => {
  const response = await api.patch('/api/admin/user/userBlock',{email})
  return response
}
export const UnblockUser = async ({email}) => {
  const response = await api.patch('/api/admin/user/userUnblock',{email})
  return response
}
export const blockLabor = async ({email}) => {
  const response = await api.patch('/api/admin/user/laborBlock',{email})
  return response
}
export const UnblockLabor = async ({email}) => {
  const response = await api.patch('/api/admin/user/laborUnblock',{email})
  return response
}

export const unApprove = async ({ email }) => {
  const response = await api.patch('/api/admin/user/laborApprove', { email })
  return response
}
export const Approve = async ({ email }) => {
  const response = await api.patch('/api/admin/user/UnApprove', { email })
  return response
}
