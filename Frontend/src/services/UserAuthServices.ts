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