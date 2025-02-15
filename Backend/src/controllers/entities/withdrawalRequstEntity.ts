import { Document, Types } from 'mongoose';
import { ILaborer } from './LaborEntity';

export interface IWallet extends Document {
  laborerId: Types.ObjectId | ILaborer;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  processedAt?: Date;
  paymentMethod: string;
  paymentDetails?: string;
}
