import { Schema, Document } from 'mongoose';

export interface ILaborer extends Document {
    _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
    phone: string;
  address: string;
  responsibility: string;
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
    lastUpdated?: Date;
  }[];
   DurationofEmployment: {
    startDate: string,
    currentlyWorking : boolean
  }
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
  lastLogin: Date | null;
  governmentProof: {
    idDocument: string;
    idType: string;
  };
  chats: Schema.Types.ObjectId;
  profileCompletion: boolean;
  currentStage: 'aboutYou' | 'profile' | 'experience';
  skill: string; // Skill or expertise of the laborer
  startTime: string; // Start time (could be a timestamp or ISO string)
  endTime: string; // End time (could be a timestamp or ISO string)
  availability: string[]; // Array of availability slots or statuses
  role: string;
  refreshToken: string[];
  isBlocked: boolean | null;
}
