import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/src/assets/uploads/'); // You can change this to your preferred folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name to avoid conflicts
  },
});

const upload = multer({ storage });

export default upload