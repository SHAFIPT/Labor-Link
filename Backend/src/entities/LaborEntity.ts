import { Schema, Document } from 'mongoose';

export interface ILaborer extends Document {
    _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
    phone: string;
    address: string;
  profilePicture: string;
    language: string;
  personalDetails: {
    dateOfBirth: string;
    gender: string;
    lastUpdated?: Date;
  };
  categories: string[];
  certificates: {
    certificateDocument: string;
    certificateName: string;
    lastUpdated: Date;
  }[];
  workHistory: {
    bookingId: Schema.Types.ObjectId;
    status: string;
    lastUpdated: Date;
  }[];
  rating: number;
  createdAt: Date;
  walletBalance: number;
  updatedAt: Date;
  isActive: boolean;
  isApproved: boolean;
  governmentProof: {
    idDocument: string;
    idNumber: string;
    idType: string;
  };
  chats: Schema.Types.ObjectId;
  profileCompletion: boolean;
  currentStage: 'aboutYou' | 'profile' | 'experience';
}
