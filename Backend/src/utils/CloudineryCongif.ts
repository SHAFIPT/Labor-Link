import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, // This will automatically use the CLOUDINARY_URL from .env
});

export default cloudinary;