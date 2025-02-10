
import { Schema, Document ,Types } from 'mongoose';

export interface IReview {
  userId: Schema.Types.ObjectId;
  reviewerName: string;
  reviewText: string;
  imageUrl: string[]; 
  rating: number;  // Rating score (e.g., 1 to 5)
  createdAt: Date;
}

export interface IAboutMe {
  name?: string;
  experience?: string;
  description?: string;
}

export interface WalletTransaction {
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    bookingId?: Types.ObjectId;
    originalAmount?: number;
    commissionAmount?: number;
    createdAt: Date;
}

export interface Wallet {
    balance: number;
    transactions: WalletTransaction[];
}

export interface ILaborer extends Document {
    _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
    phone: string;   
  address: {
    city: string,
    state: string,
    postalCode: string,
    country: string,
  },
  location: {
    type: { type: string, enum: ['Point'] },
    coordinates: { type: [number] }, // [longitude, latitude]
  },
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
  wallet: Wallet;
  workHistory: {
    bookingId: Schema.Types.ObjectId;
    status: string;
    lastUpdated: Date; 
  }[];
  
  rating: number;  // Average rating
  reviews: IReview[];  // List of reviews
  createdAt: Date;
  walletBalance: number;
  updatedAt: Date;
  aboutMe: IAboutMe;
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
  skill: string[]; // Skill or expertise of the laborer
  startTime: string; // Start time (could be a timestamp or ISO string)
  endTime: string; // End time (could be a timestamp or ISO string)
  availability: string[]; // Array of availability slots or statuses
  role: string;
  refreshToken: string[];
  isBlocked: boolean | null;
  status: 'pending' | 'approved' | 'rejected'
  canReapply: boolean | null;
}
