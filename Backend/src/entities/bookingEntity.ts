import { Document, Types } from 'mongoose';

export interface IAddressDetails {
  name: string;
  phone: string;
  district: string;
  place: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
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
  };

  addressDetails: IAddressDetails;

  createdAt?: Date;
  updatedAt?: Date;
}
