import { userAxiosInstance } from "./instance/userInstance";


interface CancelFormData {
  bookingId: string; // or number, depending on the type of bookingId
  reason: string;
  comments: string;
  isWithin30Minutes: boolean;
}

interface UpdateData {
  status?: string; // Example field, adjust the type based on the actual data
  comments?: string; // Optional field, can be undefined
  completedAt?: string; // Optional field for completion time (use string or Date)
}

interface PymnetData {
  bookingId: string;
  laborId: string;
  userId : string
}

interface RescheduleData {
  bookingId :string
  requestSentBy: string | null;  // Allowing null
}

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
export const workCompletion = async (updateData: UpdateData, bookingId: string) => {
  try {
    const response = await api.post(`/api/user/users/workCompletion/${bookingId}`, updateData)
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const pymnetSuccess = async (pymnetData: PymnetData) => {
  try {
    const response = await api.post('/api/user/users/pymnetSuccess', pymnetData)
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
