import axios from "axios";

export const uploadToCloudinary = async (file) => {
  // First, ensure your upload preset is properly configured
  const UPLOAD_PRESET = "laborlinkPresist"; // Must be configured in Cloudinary dashboard
  const CLOUD_NAME = "dni3mqui7";
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, // Added 'auto' for automatic resource type detection
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
    // Improved error handling
    if (error.response) {
      console.error("Cloudinary error:", error.response.data);
      throw new Error(error.response.data.error?.message || "Failed to upload to Cloudinary");
    }
    console.error("Upload error:", error);
    throw error;
  }
};