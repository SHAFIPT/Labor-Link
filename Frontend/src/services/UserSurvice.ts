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
export const bookTheLabor = async (userId : string , laborId : string , quote : { description: string; estimatedCost: number; arrivalTime: Date }) => {
    try {
      const response = await api.post('/api/user/users/bookingLabor', {
        userId,
        laborId,
        quote
        })  
        return response
    } catch (error) {
        console.error("Error Paasword change:", error);
    throw error;
    }
}

export const fetchlaborId = async (email : string) => {
  try {
    
    const response = await api.get(`/api/user/users/fetchId/${email}`);
    return response
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}

export const fetchBookings = async (page : number , limit : number) => {
  try {

    const response = await api.get(`/api/user/users/fetchBookings?page=${page}&limit=${limit}`);
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  } 
}
export const cancelSubmision = async (cancelFormData) => {
  try {  

    const response = await api.post('/api/user/users/cancelBooking', {
      bookingId: cancelFormData.bookingId, 
      reason: cancelFormData.reason,
      comments: cancelFormData.comments,
      isWithin30Minutes: cancelFormData.isWithin30Minutes,
      canceledBy: 'user', 
    });
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
