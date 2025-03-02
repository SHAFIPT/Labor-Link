import { laborAxiosInstance } from "./instance/laborInstance";

interface AboutMeData {
  userId: string;
  name: string;
  experience: string;
  description: string;
}

interface Filters {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  category: string;
  rating: number;
  sortOrder: string;
}


interface FetchLaborsParams {
  latitude: number;
  longitude: number;
  categorie: string;
  laborId: string;
}

interface CancelFormData {
  bookingId: string;
  reason: string;
  comments: string;
  isWithin30Minutes: boolean;
}

interface RejectionData {
  newTime: string;  // or Date, depending on your expected format
  newDate: string;  // or Date
  rejectionReason: string;
  bookingId: string; // assuming bookingId is a string
  rejectedBy: string
  requestSentBy: string; // assuming requestSentBy is a string
}


interface AdditionalChargeData {
  bookingId: string;
  amount: string;
  reason: string;
}

interface WithdrawalData {
  amount: number;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountName?: string; // Add if needed
  };
}

// Define the type for the bank details (example structure, adjust as needed)
// interface BankDetails {
//   accountNumber: string;
//   accountName: string;
//   routingNumber: string;
//   bankName: string;
// }

const api = laborAxiosInstance


export const laborFetch = async () => {
  try {
    const response = await api.get('/api/labor/labors/fetchLabor');
    return response.data
  } catch (error) {
    console.error("Error fetching labor:", error);
    throw error;
  }
};


export const updateProfile = async (formData: FormData) => {
  try {
    const response = await api.post('/api/labor/labors/updateProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error("Error updating labor profile:", error);
    throw error;
  }
};

export const editPassword = async (PasswodData: { email: string; password: string }) => {
    try {
        const response = await api.post('/api/labor/labors/UpdatePassword', PasswodData)  
        return response
    } catch (error) {
        console.error("Error Paasword change:", error);
    throw error;
    }
}


export const fetchLaborsByLocation = async (filters: Filters) => {
  try {

     const { latitude, longitude, country, state, city, zipCode, category, rating , sortOrder} = filters;
    const response = await api.get('/api/labor/labors/fetchLaborsByLocation', {
      params: { latitude, longitude, country, state, city, zipCode, category, rating ,  sortOrder }
    });
    return response
  } catch (error) {
    console.error("Error in labor locaiong searching :", error);
    throw error;
  }
}


export const aboutMe = async (data :AboutMeData ) => {
  try {
    
    const response = await api.post('/api/labor/labors/abouteMe',data)
    return response
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const fetchLaborBookings = async (page: number, limit: number, filter : string) => {
  try {
    
    const response = await api.get(`/api/labor/labors/fetchBooking?page=${page}&limit=${limit}&filter=${filter}`)
    return response
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const fetchLaobrs = async ({ latitude, longitude, categorie, laborId }: FetchLaborsParams)=> {
  try {
    // Assuming the backend accepts latitude and longitude in query params
    const response = await api.get('/api/labor/labors/fetchSimilorLabors', {
      params: {
        latitude,
        longitude,
        categorie,
        laborId
      }
    });
    return response;
  } catch (error) {
    console.error("Error in fetching similar labors:", error);
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
      canceledBy: 'labor', 
    });
    return response
    
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}

export const fetchBookings = async (bookingId : string) => {
  try {

    const response = await api.get(`/api/labor/labors/fetchBooking/${bookingId}`)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}

export const fetchLabors = async () => {
  try {

    const response = await api.get(`/api/labor/labors/fetchAllLabors`)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}

export const rejectReshedule = async  (rejectionData: RejectionData)  => {
  try {

    const response = await api.post('/api/labor/labors/submitRejection',rejectionData)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const acceptReshedule = async (bookingId :string, acceptedBy  :string) => {
  try {

    const response = await api.put(`/api/labor/labors/acceptBooking/${bookingId}`,acceptedBy)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const submitAdditionalCharge = async (additonalCharges: AdditionalChargeData) => {
  try {

    const response = await api.post('/api/labor/labors/additionalCharge',additonalCharges)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const acceptRequst = async (bookingId : string) => {
  try {

    const response = await api.patch(`/api/labor/labors/acceptRequst/${bookingId}`)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const rejectRequst = async (bookingId : string) => {
  try {

    const response = await api.patch(`/api/labor/labors/rejectRequst/${bookingId}`)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const fetchWithdrowalRequests = async (laborId :string) => {
  try {

    const response = await api.get(`/api/labor/labors/withdrowalRequests/${laborId}`)
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const fetchIsBookingExist = async (participentsData: { userEmail: string; laborEmail: string })  => {
  try {

    const response = await api.get('/api/labor/labors/fetchIsBookingExist', {
      params : participentsData
    })
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}
export const fetchAllBookingOfLabor = async (email  :string) => {
  try {

    const response = await api.get('/api/labor/labors/fetchAllBookingOfLabor', {
      params: { email } // Correct way to pass params
    });
    return response
    
  } catch (error) {
     console.error("Error fetchBooking :", error);
    throw error;
  }
}


export const handlewithdrowAmount = async   ({ amount, bankDetails }: WithdrawalData) => {
  try {

    const response = await api.post('/api/labor/labors/witdrowWalletAmount', {
      amount, 
      bankDetails 
    });
    return response
    
  } catch (error) {
    console.error("Error in withdrawal request:", error);
    throw error;
  }
}