import axios from "axios";
import { ILaborer } from "../@types/labor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const registerAboutYou = async (formData: Partial<ILaborer>) => {
  
  console.log('this is response formdata :',formData)

   try {
    const response = await api.post('/api/labor/auth/registerAboutYou', formData);
    return response
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const profilePage = async (formData: FormData ) => {
  try {

    const response = await api.post('/api/labor/auth/registerProfilePage', formData)
    return response
    
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const ExperiencePage = async (formData: FormData) => {
  try {

    const response = await api.post('/api/labor/auth/registerExperiencePage', formData)
    return response
    
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const logout = async () => {
  try {

    const response = await api.patch('/api/labor/auth/logout' )
    return response
    
  } catch (error) {
    console.error("Error during logout..!", error);
    throw error;
  }
}
  

export const LaborLogin = async (labor : Partial<ILaborer>) => {
  try {
    const reseponse = await api.post('/api/labor/auth/login', labor)
    return reseponse
  } catch (error) {
    console.error("Error during logout..!", error);
    throw error;
  }
}