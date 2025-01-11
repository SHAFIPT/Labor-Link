export interface ILaborer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  language: string;
  address: string;
  password: string;
  image: string;
  category: string; // existing field, category list
  certificates: {
    certificateDocument: string;
    certificateName: string;
    lastUpdated: string;
  }[];
  DurationofEmployment: {
    startDate: string,
    currentlyWorking : boolean
  }
  dateOfBirth: string;
  gender: string;
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
  skill: string; // Skill or expertise of the laborer
  startTime: string; // Start time (could be a timestamp or ISO string)
  endTime: string; // End time (could be a timestamp or ISO string)
  availability: string[]; // Array of availability slots or statuses
}
