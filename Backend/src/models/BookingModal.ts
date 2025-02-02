import { IBooking } from '../entities/bookingEntity';
import mongoose, { Schema, model } from 'mongoose';

const BookingSchema : Schema = new Schema<IBooking>({
  bookingId: { type: String, required: true, unique: true }, // Unique reference
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true }, 
  laborId: { type: Schema.Types.ObjectId, ref: 'Labor', required: true },

  quote: {
    description: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    arrivalTime: { type: Date, required: true }
  },

    
  additionalChargeRequest: {
    amount: { type: Number, default: 0 }, // Extra charge requested
    reason: { type: String }, // Explanation for extra charge
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'declined'], 
      default: 'pending' 
    }
  },

  status: {
    type: String,
    enum: ['confirmed', 'in-progress', 'pending-approval', 'completed', 'canceled'],
    default: 'confirmed' 
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending' 
  },

   addressDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      district: { type: String, required: true },
      place: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },

  cancellation: {
    reason: { type: String }, 
    comments: { type: String }, 
    canceledBy: { type: String, enum: ['user', 'labor'] }, 
    canceledAt: { type: Date, default: Date.now },
    cancellationFee: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
