
export interface ILaborer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  categories: string[];
  certificates: {
    certificateDocument: string;
    certificateName: string;
    lastUpdated: string;
  }[];
  personalDetails: {
    dateOfBirth: string;
    gender: string;
    lastUpdated: string;
  };
  workHistory: {
    bookingId: string;
    status: string;
    lastUpdated: string;
  }[];
  governmentProof: {
    idDocument: string;
    idNumber: string;
    idType: string;
  };
  rating: number;
  walletBalance: number;
  isActive: boolean;
  isApproved: boolean;
  profileCompletion: boolean;
  currentStage: 'aboutYou' | 'profile' | 'experience';
}
