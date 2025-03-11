export interface CancelFormData {
  bookingId: string; 
  reason: string;
  comments: string;
  isWithin30Minutes: boolean;
}

export interface UpdateDatWorkcompleted {
  status?: string; 
  comments?: string; 
  completedAt?: string; 
}

export interface PaymentData {
  bookingId: string;
  laborId: string;
  userId : string
}

export interface RescheduleData {
  bookingId :string
  requestSentBy: string | null;  
}

export interface AboutMeData {
  userId: string;
  name: string;
  experience: string;
  description: string;
}

export interface Filters {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  category: string;
  rating: number;
  sortOrder: string;
}


export interface FetchLaborsParams {
  latitude: number;
  longitude: number;
  categorie: string;
  laborId: string;
}

export interface CancelFormData {
  bookingId: string;
  reason: string;
  comments: string;
  isWithin30Minutes: boolean;
}

export interface RejectionData {
  newTime: string;
  newDate: string; 
  rejectionReason: string;
  bookingId: string; 
  rejectedBy: string
  requestSentBy: string; 
}


export interface AdditionalChargeData {
  bookingId: string;
  amount: string;
  reason: string;
}

export interface WithdrawalData {
  amount: number;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountName?: string; 
  };
}



export interface FetchUserParams {
  query: string; 
  pageNumber: number;  
  selectedFilter: string;  
}

export interface BlockUserParams {
  email: string;
}

export interface UnblockUserParams {
  email: string;  
}
export interface UnblockLaborParams {
  email: string;  
}

export interface BlockLaborParams {
  email: string;  
}

export interface DeleteLaborParams {
  email: string; 
}

export interface ApproveParams {
  email: string;  
}

export interface RejectionParams {
  reason: string;  
  email: string;  
}

export interface SubmitDataParams {
  id: string | number; 
  status: string; 
}

export interface FetchLaborParams {
  query: string;
  pageNumber: number;
  selectedFilter: string;
}
