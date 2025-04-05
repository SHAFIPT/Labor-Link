
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth, db } from "../utils/firbase";
import { IUser } from "../@types/user";
import { userAxiosInstance } from "./instance/userInstance";
import { AxiosError } from "axios";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";


const api = userAxiosInstance

export const sendOtp = async (credentials: Partial<IUser>) => {
    try {
        const role = 'user'
        const responce = await api.post('/api/auth/send-otp', {...credentials,role})

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
    const role = "user";
    const resoponce = await api.post("/api/auth/register", { ...user, role });

    return resoponce;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};


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
    const role = 'user'
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    const { displayName, email, uid } = user;
    const defaultProfilePicture = "https://res.cloudinary.com/dni3mqui7/image/upload/v1740922929/labor_profiles/cem3eten6knkkbtbqz2z.jpg";

    // Save user data to Firestore
    const userData = {
      email: email || "",
      name: displayName || "", 
      profilePicture: defaultProfilePicture, 
      role: "user",
    };

    // Set the document in Firestore with the user's UID
    await setDoc(doc(db, "Users", uid), userData);

    // Continue with your API call
    const response = await api.post("/api/auth/google-sign-in", {...user, role});
    return response;
    } catch (error) {
    console.error("Google Sign-In error:", error);

    // Handle user closing the popup
     if (error instanceof FirebaseError && error.code === "auth/popup-closed-by-user") {
        console.warn("User closed the Google sign-in popup.");
        return { status: 400, data: { message: "Google sign-in was canceled." } };
      }
      
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

export const forgotPasswordSendOTP = async (email: string, role: string) => {
  try {
    const ForgetResoponce = await api.post("/api/auth/forgettPassword", {
      email: email,
      role,
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

        return response;
        
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        } else {
            return null;
        }  
    }
};

