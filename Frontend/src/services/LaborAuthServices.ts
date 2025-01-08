import axios from "axios";
import { ILaborer } from "../@types/labor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const registerAboutYou = async (formData  : Partial<ILaborer>) => {
   try {
    const response = await api.post('/api/labor/registerAboutYou', formData);
    return response.data; 
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}