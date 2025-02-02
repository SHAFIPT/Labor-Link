import axios, { AxiosError } from "axios";
import { ILaborer } from "../@types/labor";

import { laborAxiosInstance } from "./instance/laborInstance";


const api = laborAxiosInstance


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



export const laborForgotPasswordSendOTP = async (email: string) => {
    try {

        console.log('this is email :',email)

        const ForgetResoponce = await api.post('/api/labor/auth/forgettPassword', { email: email })
        
         console.log('this is ForgetResoponce :' ,ForgetResoponce)
    

        return ForgetResoponce
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}



export const laborForgetPasswordVerify = async (otp : string,email: string) => {
    try {

        const ForgetOtpverify = await api.post('/api/labor/auth/ForgetVerify-otp', { email: email , otp : otp})
        
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
        
        const forgetPasswordResetresponse = await api.post('/api/labor/auth/forgot-password-reset', { password , token })
        
        return forgetPasswordResetresponse
        
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }  
    }
}