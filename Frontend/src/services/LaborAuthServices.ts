
import { AxiosError } from "axios";
import { ILaborer } from "../@types/labor";

import { laborAxiosInstance } from "./instance/laborInstance";


const api = laborAxiosInstance


export const registerAboutYou = async (formData: Partial<ILaborer>) => {
  try {
     const role = 'labor'
     const response = await api.post('/api/auth/registerAboutYou', {
       ...formData,
       role
     });
    return response
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const profilePage = async (formData: FormData ) => {
  try {

    const response = await api.post('/api/auth/registerProfilePage', formData)
    return response
    
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const ExperiencePage = async (formData: FormData) => {
  try {
    
    const response = await api.post('/api/auth/registerExperiencePage', formData)
    return response
    
  } catch (error) {
    console.error("Error registering laborer:", error);
    throw error;
  }
}

export const logout = async () => {
  try {

    const response = await api.post('/api/auth/logout')
    return response
    
  } catch (error) {
    console.error("Error during logout..!", error);
    throw error;
  }
}
  

export const laborForgotPasswordSendOTP = async (email: string) => {
  try {
    const ForgetResoponce = await api.post("/api/auth/forgettPassword", {
      email: email,
    });

    return ForgetResoponce;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};



export const laborForgetPasswordVerify = async (otp : string,email: string) => {
    try {

        const ForgetOtpverify = await api.post('/api/auth/ForgetVerify-otp', { email: email , otp : otp})
        
        return ForgetOtpverify
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}

export const laborForgotPasswordReset = async (password: string, token:string) => {
    try {
        
        const forgetPasswordResetresponse = await api.post('/api/auth/forgot-password-reset', { password , token })
        
        return forgetPasswordResetresponse
        
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }  
    }
}