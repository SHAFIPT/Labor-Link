
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "../utils/firbase";
import axios, { AxiosError } from "axios";
import { IUser } from "../@types/user";



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

console.log('this is my api :', api)

export const sendOtp = async (credentials: Partial<IUser>) => {
    try {
        const responce = await api.post('/api/user/auth/send-otp', credentials)

        // console.log(re)
    
        return responce
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError) {
            return error.response
        } else {
            return null
        }
    }
}

export const verifyOtp = async (email: string, otp: string) => {
    try {
        const Response = await api.post('/api/user/auth/verify-otp', { email, otp })
        
        return Response
    } catch (error) {
         console.error(error)
        if (error instanceof AxiosError) {
            return error.response
        } else {
            return null
        }
    }
}


export const registUser = async (user: Partial<IUser>) => {
    try {

        console.log('thsi is backend user',user)

        const resoponce = await api.post('/api/user/auth/register', user )
        
        return resoponce
        
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError) {
            return error.response
        } else {
            return null
        }
    }
}


export const resendOtp = async (credentials: Partial<IUser>) => {
    try {

        const responce = await api.post('/api/user/auth/resend-otp', credentials)

        return responce
        
    } catch (error) {
         console.error(error)
        if (error instanceof AxiosError) {
            return error.response
        } else {
            return null
        }
    }
}


export const googleAuth = async () => {
    try {
       console.log('Ima first')
      const result = await signInWithPopup(auth, googleProvider);
      
    console.log('this is the google responce : ',result)

      const { user } = result;
      
       console.log('this is the google user : ',user)

        const response = await api.post("/api/user/auth/google-sign-in", user);
        
    console.log('this is the google Response : ',response)

    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};