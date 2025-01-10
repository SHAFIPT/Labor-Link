
import mongoose, { Schema, ObjectId ,Types } from 'mongoose';
import { ILaborer } from 'entities/LaborEntity';

const LaborersSchema: Schema = new Schema<ILaborer>({
  firstName: { type: String, required: true },  // Field name updated to match interface
  lastName: { type: String, required: true },   // Field name updated to match interface
  email: { type: String, required: true, unique: true }, // Field name updated to match interface
  password: { type: String, required: true },   // Field name updated to match interface
  phone: { type: String, required: true },      // Field name updated to match interface
   address : {type : String , required :true}, 
  profilePicture: { type: String, required: false }, // Field name updated to match interface
    language: { type : String },
  personalDetails: {
    dateOfBirth: { type: String, required: true }, // Field name updated to match interface
    gender: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
   skill: { type: String, required: false }, // Skill or expertise of the laborer
  startTime: { type: String, required: false }, // Start time (ISO string or timestamp)
  endTime: { type: String, required: false }, // End time (ISO string or timestamp)
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
  rating: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  walletBalance: { type: Number },
  updatedAt: { type: Date, default: Date.now },
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
  currentStage: { 
    type: String, 
    enum: ['aboutYou', 'profile', 'experience'], // Enum to track where the user is in the process
    default: 'aboutYou', // Default to 'aboutYou'
  },
});

const Labor = mongoose.model<ILaborer>('Labor', LaborersSchema);

export default Labor;
