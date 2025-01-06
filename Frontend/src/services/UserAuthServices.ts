
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


export const Login = async (user: Partial<IUser>) => {
    try {

        const loginResponse = await api.post('/api/user/auth/login', user)

        return loginResponse
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}

export const forgotPasswordSendOTP = async (email: string) => {
    try {

        console.log('this is email :',email)

        const ForgetResoponce = await api.post('/api/user/auth/forgettPassword', { email: email })
        
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

export const forgetPasswordVerify = async (otp : string,email: string) => {
    try {

        const ForgetOtpverify = await api.post('/api/user/auth/ForgetVerify-otp', { email: email , otp : otp})
        
        return ForgetOtpverify
        
    } catch (error) {
        if (error instanceof AxiosError) {
        return error.response;
        } else {
        return null;
        }
    }
}

export const forgotPasswordReset = async (password: string, token:string) => {
    try {
        
        const forgetPasswordResetresponse = await api.post('/api/user/auth/forgot-password-reset', { password , token })
        
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

        const response = await api.patch('/api/user/auth/log_out',null ,{withCredentials: true});

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
