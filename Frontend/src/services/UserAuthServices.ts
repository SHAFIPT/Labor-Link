
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "../utils/firbase";
import axios, { AxiosError } from "axios";
import { IUser } from "../@types/user";
import { userAxiosInstance } from "./instance/userInstance";


const api = userAxiosInstance

console.log('this is my api :', api)

export const sendOtp = async (credentials: Partial<IUser>) => {
    try {
        const role = 'user'
        const responce = await api.post('/api/auth/send-otp', {...credentials,role})

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
        const role = 'user'
        const Response = await api.post('/api/auth/verify-otp', { email, otp,role })
        
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
        const role = 'user'    
        const resoponce = await api.post('/api/auth/register',{ ...user ,role})
        
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
        const role = 'user'
        const responce = await api.post('/api/auth/resend-otp', {...credentials , role})

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
      const role = 'user'
      const result = await signInWithPopup(auth, googleProvider);
      
    console.log('this is the google responce : ',result)

      const { user } = result;
      
       console.log('this is the google user : ',user)

        const response = await api.post("/api/auth/google-sign-in", {...user,role});
        
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


export const Login = async (user: Partial<IUser>,role: string) => {
    try {

        const loginResponse = await api.post('/api/auth/login',{ ...user, role })

        return loginResponse
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}

export const forgotPasswordSendOTP = async (email: string, role : string) => {
    try {

        console.log('this is email :',email)
        const ForgetResoponce = await api.post('/api/auth/forgettPassword', { email: email , role})
        
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

export const forgetPasswordVerify = async (otp : string,email: string,role : string) => {
    try {
        
        const ForgetOtpverify = await api.post('/api/auth/ForgetVerify-otp', { email: email , otp : otp , role})
        
        return ForgetOtpverify
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}

export const forgotPasswordReset = async (password: string, token:string,role : string) => {
    try {
        
        const forgetPasswordResetresponse = await api.post('/api/auth/forgot-password-reset', { password , token, role })
        
        return forgetPasswordResetresponse
        
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }  
    }
}

export const logout = async () => { 
    try {

        const response = await api.post('/api/auth/logout')

        console.log('here the responce :',response)

        return response;
        
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        } else {
            return null;
        }  
    }
};

