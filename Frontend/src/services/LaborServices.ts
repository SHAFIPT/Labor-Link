import { laborAxiosInstance } from "./instance/laborInstance";


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


export const fetchLaborsByLocation = async (filters) => {
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


export const aboutMe = async (data) => {
  try {
    
    const response = await api.post('/api/labor/labors/abouteMe',data)
    return response
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
export const fetchLaborBookings = async (page : number, limit : number) => {
  try {
    
    const response = await api.get(`/api/labor/labors/fetchBooking?page=${page}&limit=${limit}`)
    return response
  } catch (error) {
    console.error("Error in About me :", error);
    throw error;
  }
}
