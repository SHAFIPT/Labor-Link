import { CancelFormData, PaymentData, RescheduleData, UpdateDatWorkcompleted } from "../@types/services.types";
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
export const bookTheLabor = async (
  userId: string,
  laborId: string,
  quote: { description: string; estimatedCost: number; arrivalTime: Date },
  addressDetails: { name: string; phone: string; district: string; place: string; address: string; pincode: string; latitude: number | null; longitude: number | null }
) => {
  try {
    const response = await api.post("/api/user/users/bookingLabor", {
      userId,
      laborId,
      quote,
      addressDetails
    });
    return response;
  } catch (error) {
    console.error("Error Paasword change:", error);
    throw error;
  }
};

export const fetchlaborId = async (email: string) => {
  try {
    const response = await api.get(`/api/user/users/fetchId/${email}`);
    return response;
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
};

export const fetchBookings = async (page: number, limit: number, filter: string) => {
  try {
    // Add the filter to the query string if it's provided
    const url = `/api/user/users/fetchBookings?page=${page}&limit=${limit}${filter ? `&status=${filter}` : ''}`;

    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
export const cancelSubmision = async (cancelFormData: CancelFormData) => {
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
export const handleRescheduleWork = async  (reshedulDatas: RescheduleData) => {
  try {

    const response = await api.post('/api/user/users/resheduleRequst', reshedulDatas)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const workCompletion = async (updateData: UpdateDatWorkcompleted, bookingId: string) => {
  try {
    const response = await api.post(`/api/user/users/workCompletion/${bookingId}`, updateData)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const pymnetSuccess = async (paymenttData: PaymentData) => {
  try {
    const response = await api.post('/api/user/users/pymnetSuccess', paymenttData)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const fetchBookingWithId = async (bookingId  :string) => {
  try {
    const response = await api.get(`/api/user/users/fetchBookingWithId/${bookingId}`)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const reviewSubmit = async (formData: FormData, bookingId: string) => {
  try {
    const response = await api.post(`/api/user/users/reviewSubmit/${bookingId}`,formData)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const fetchAllBooings = async (userId  :string, page :number , limit : number , filter : string) => {
  try {

     const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filter) {
      queryParams.append("status", filter);
    }
    const response = await api.get(`/api/user/users/fetchAllBooings/${userId}?${queryParams.toString()}`)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}


export const fetchSuggessions = async (query : string) => {
  try {
    const reponse = await api.get(`/api/user/users/suggestions?query=${query}`)

    return reponse
    
  } catch (error) {
    console.error("Error in serach term:", error);
    throw error;
  }
}
