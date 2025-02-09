import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxiosInstance } from "../../services/instance/userInstance";


const api = userAxiosInstance

export interface User {
  ProfilePic : string;
  firstName: string;
  lastName: string;
}
export interface IReview {
  reviewerName: string;
  reviewText: string;
  imageUrl: string[]; 
  rating: number;  // Rating score (e.g., 1 to 5)
  createdAt: Date;
}
export interface Labor {
  _id : string
  ProfilePic: string;
  firstName: string;
  lastName: string;
  phone: string
  location: string
  reviews: IReview[]
}

export interface AddressDetails {
  phone: string;
  place: string;
}

export interface Quote {
  description: string;
  estimatedCost: number;
  arrivalTime: string;
}



export interface BookingDetails {
  _id: string;
  bookingId: string;
  userId: User;  // Changed from User object to string
  laborId: Labor; // Changed from Labor object to string
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isUserRead?: boolean; 
  cancellation: {
    isUserRead: boolean;
    canceledAt: string;
    cancellationFee: number;
  };
  isUserCompletionReported?: boolean
  isLaborCompletionReported?: boolean
  additionalChargeRequest?: {
    amount: number;
    reason?: string;
    status: 'pending' | 'approved' | 'declined';
  };
  reschedule: {
    isReschedule: boolean;
    requestSentBy: 'user' | 'labor';
    acceptedBy: 'user' | 'labor' | null;
    rejectedBy: 'user' | 'labor' | null;
    rejectionNewDate: string;
    rejectionNewTime: string;
    rejectionReason: string;
    newTime: string;
    newDate: string;
    reasonForReschedule: string;
  };
  // paymentStatus : boolean

  addressDetails: {
    name: string;
    phone: string;
    district: string;
    place: string;
    address: string;
  };
  quote: {
    description: string;
    estimatedCost: number;
    arrivalTime: string;
  };
}

// Redux State
export interface BookingState {
  bookingDetails: BookingDetails[] | null;
}

const initialState: BookingState = {
  bookingDetails: [],
};

// ✅ Async Thunk to update read status in backend
export const updateBookingReadStatusAsync = createAsyncThunk(
  "booking/updateReadStatus",
  async ({ bookingId, isUserRead }: { bookingId: string; isUserRead: boolean }, { dispatch }) => {
    try {
      const response = await api.put(`/api/user/users/update-read-status/${bookingId}`, { isUserRead });
      dispatch(updateBookingReadStatus({ bookingId, isUserRead }));
      const { data } = response.data
      
      console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",data)
      // dispatch(setBookingDetails(data))
    } catch (error) {
      console.error("Error updating read status", error);
    }
  }
);





const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDetails: (state, action: PayloadAction<BookingDetails[]>) => {
      state.bookingDetails = action.payload;
    },
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
    },
    updateBookingReadStatus: (state, action: PayloadAction<{ bookingId: string; isUserRead: boolean }>) => {
      if (state.bookingDetails) {
        const booking = state.bookingDetails.find((b) => b.bookingId === action.payload.bookingId);
        if (booking) {
          booking.isUserRead = action.payload.isUserRead;
        }
      }
    },
    updateSingleBooking: (state, action: PayloadAction<BookingDetails>) => {
        if (!Array.isArray(state.bookingDetails)) {
          state.bookingDetails = [action.payload]; // ✅ Convert into an array
        } else {
          state.bookingDetails = state.bookingDetails.map(booking =>
            booking.bookingId === action.payload.bookingId ? action.payload : booking
          );
        }
      }
  },
});

export const { setBookingDetails, clearBookingDetails, updateBookingReadStatus  , updateSingleBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
