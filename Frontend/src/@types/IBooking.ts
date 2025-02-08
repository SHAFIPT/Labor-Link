
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

export interface User {
  ProfilePic : string;
  firstName: string;
  lastName: string;
}
export interface Labor {
  _id : string
  profilePicture: string;
  firstName: string;
  lastName: string;
  phone: string
  location: string
}



export interface IBooking extends Document {
  bookingId: string;
  userId: User;  // Changed from User object to string
 laborId: Labor;

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
  isUserCompletionReported?: boolean
  isLaborCompletionReported?: boolean
  paymentStatus: 'pending' | 'paid' | 'failed';

  cancellation?: {
    reason?: string;
    comments?: string;
    canceledBy?: 'user' | 'labor';
    canceledAt?: Date;
    cancellationFee?: number;
    isUserRead?: boolean
  };
  paymentDetails?: {
    totalAmount?: number
    commissionAmount?: number
    laborEarnings?: number
    transactionId?:string
  }

  addressDetails: IAddressDetails;
  reschedule?: IReschedule;

  createdAt?: Date;
  updatedAt?: Date;
}
