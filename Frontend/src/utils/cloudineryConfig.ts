import axios, { AxiosError } from "axios";

export const uploadToCloudinary = async (file: File) => {
  
  const UPLOAD_PRESET = "laborlinkPresist"; 
  const CLOUD_NAME = "dni3mqui7";
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data && response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error("Invalid response from Cloudinary");
    }
  } catch (error) {
     if (error instanceof AxiosError && error.response) {
    console.error("Cloudinary error:", error.response.data);
    throw new Error(error.response.data.error?.message || "Failed to upload to Cloudinary");
  } else {
    console.error("An unknown error occurred:", error);
    throw new Error("An unknown error occurred");
  }
  }
};