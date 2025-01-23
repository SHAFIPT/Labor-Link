import { userAxiosInstance } from "./instance/userInstance";


const api = userAxiosInstance

export const userFetch = async () => {
  try {
    const response = await api.get('/api/user/users/fetchUser',);
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser =  async (formDataObj: FormData) => {
    try {
      
        const response = await api.post('/api/user/users/profileUpdate', formDataObj)
        
        return response
    
  } catch (error) {
    console.error("Error profile update user:", error);
    throw error;
  }
}

export const editPassword = async (PasswodData: { email: string; password: string }) => {
    try {
        const response = await api.post('/api/user/users/UpdatePassword', PasswodData)  
        return response
    } catch (error) {
        console.error("Error Paasword change:", error);
    throw error;
    }
}