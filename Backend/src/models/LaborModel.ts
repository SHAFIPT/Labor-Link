
import mongoose, { Schema, ObjectId ,Types } from 'mongoose';
import { ILaborer } from 'controllers/entities/LaborEntity';
import { string } from 'joi';

const LaborersSchema: Schema = new Schema<ILaborer>({
  firstName: { type: String, required: true },  // Field name updated to match interface
  lastName: { type: String, required: true },   // Field name updated to match interface
  email: { type: String, required: true, unique: true }, // Field name updated to match interface
  password: { type: String, required: true },   // Field name updated to match interface
  phone: { type: String, required: true },      // Field name updated to match interface
   address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number]}, // [longitude, latitude]
  },
  profilePicture: { type: String, required: false }, // Field name updated to match interface
    language: { type : String },
  personalDetails: {
    dateOfBirth: { type: String, required: true }, // Field name updated to match interface
    gender: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
   DurationofEmployment: {
    startDate: {type : String},
    currentlyWorking : {type : Boolean}
  },
   skill: [{ type: String, required: false }], // Skill or expertise of the laborer
  startTime: { type: String, required: false }, // Start time (ISO string or timestamp)
  endTime: { type: String, required: false }, // End time (ISO string or timestamp)
  responsibility: { type : String },
  availability: [{ type: String, required: false }], 
  categories: [{ type: String, required: false }],
  certificates: [{
    certificateDocument: { type: String, required: false }, // Field name updated to match interface
    certificateName: { type: String, required: false },     // Field name updated to match interface
    lastUpdated: { type: Date, default: Date.now },
  }],
  workHistory: [{
    bookingId: { type: Schema.Types.ObjectId }, // Field name updated to match interface
    status: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  }],
  role: { type: String, default: 'labor' },
  createdAt: { type: Date, default: Date.now },
  walletBalance: { type: Number },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  isBlocked: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // Profile starts as inactive
  isApproved: { type: Boolean, default: false }, // Admin review flag
  governmentProof: {
    idDocument: { type: String, required: false }, // Field name updated to match interface
    idNumber: { type: String, required: false },   // Field name updated to match interface
    idType: { type: String, required: false },     // Field name updated to match interface
  },
  chats: { type: Schema.Types.ObjectId },
  profileCompletion: { 
    type: Boolean, 
    default: false, // Set to false until all steps are completed
  },            
  status: {   
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  currentStage: { 
    type: String, 
    enum: ['aboutYou', 'profile', 'experience'], // Enum to track where the user is in the process
    default: 'aboutYou', // Default to 'aboutYou'
  },
  refreshToken: { type: [String], default: [] }, 
  canReapply: { type: Boolean, default: false },
  aboutMe: {
    name: { type: String, required: false },
    experience: { type: String, required: false },
    description: { type: String, required: false },
  },
  rating: { type: Number, default: 0 },  // Average rating (e.g., 4.5)
  reviews: [{
    reviewerName: { type: String},  // Reviewer's name
    reviewText: { type: String },   // Review text
    rating: { type: Number },
    imageUrl: { type: [String] },// Rating score (e.g., 1-5)
    createdAt: { type: Date, default: Date.now },   // Date of review
  }],
});

LaborersSchema.index({ location: '2dsphere' });
// LaborersSchema.index({ name: 'text', email: 'text' });

const Labor = mongoose.model<ILaborer>('Labor', LaborersSchema);

export default Labor;
