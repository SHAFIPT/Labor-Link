import { IAdmin } from "controllers/entities/adminEntity";
import mongoose, { Schema } from 'mongoose';

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    refreshToken: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);


const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;