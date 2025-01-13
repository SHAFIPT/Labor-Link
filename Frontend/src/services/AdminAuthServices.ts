import { IAdmin } from "../@types/admin";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const AdminLogin = async (credential: Partial<IAdmin>) => {
    const response = await api.post('/api/admin/auth/adminLoginPage', credential)
    return response
}