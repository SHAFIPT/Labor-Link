
interface IAboutMe {
  name?: string;
  experience?: string;
  description?: string;
}



export interface ILaborer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  language: string;
  aboutMe: IAboutMe;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  profilePicture : string
  location: {
    type: 'Point'; // GeoJSON type
    coordinates: [number, number]; // [longitude, latitude]
  };
  password: string;
  role: 'labor';
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
  skills: string | string[]; // Skill or expertise of the laborer
  startTime: string; // Start time (could be a timestamp or ISO string)
  endTime: string; // End time (could be a timestamp or ISO string)
  availability: string[]; // Array of availability slots or statuses
}
