import { Document, Types } from 'mongoose';

export interface IAddressDetails {
  name: string;
  phone: string;
  district: string;
  place: string;
  address: string;
  pincode: string;
  Userlatitude: number;
  Userlongitude: number;
}

export interface IReschedule {
  newTime: string;            
  newDate: Date;               
  reasonForReschedule?: string; 
  requestSentBy?: 'user' | 'labor'; 
  isReschedule: boolean;       
  acceptedBy?: 'user' | 'labor' | null;  // Make optional
  rejectedBy?: 'user' | 'labor' | null;  // Make optional
  rejectionNewDate?: Date | null;  // Make optional
  rejectionNewTime?: string | null;  // Make optional
  rejectionReason?: string | null;  // Make optional
}


export interface IBooking extends Document {
  bookingId: string;
  userId: Types.ObjectId;
  laborId: Types.ObjectId;

  quote: {
    description: string;
    estimatedCost: number;
    arrivalTime: Date;
  };

  additionalChargeRequest?: {
    amount: number;
    reason?: string;
    status: 'pending' | 'approved' | 'declined';
  };

  status: 'confirmed' | 'in-progress' | 'pending-approval' | 'completed' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'failed';

  cancellation?: {
    reason?: string;
    comments?: string;
    canceledBy?: 'user' | 'labor';
    canceledAt?: Date;
    cancellationFee?: number;
    isUserRead?: boolean
  };

  addressDetails: IAddressDetails;
  reschedule?: IReschedule;

  createdAt?: Date;
  updatedAt?: Date;
}
