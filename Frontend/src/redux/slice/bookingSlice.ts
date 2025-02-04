import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxiosInstance } from "../../services/instance/userInstance";


const api = userAxiosInstance

export interface User {
  ProfilePic: string;
  firstName: string;
  lastName: string;
}
export interface Labor {
  ProfilePic: string;
  firstName: string;
  lastName: string;
  phone : string
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
  _id :string
  bookingId: string;
  userId: User; // User is now an object, not a string
  laborId: Labor;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  cancellation: {
    canceledBy: string;
    isUserRead: boolean;
  };
  reschedule: {
    isReschedule: boolean;
    requestSentBy: 'user' | 'labor';
    acceptedBy: 'user' | 'labor'
    rejectedBy: 'user' | 'labor'
    rejectionNewDate: string;
    rejectionNewTime: string;
    rejectionReason: string;
  }
  addressDetails: AddressDetails; // Added addressDetails
  quote: Quote; // Added quote
  isUserRead?: boolean;
}

// Redux State
export interface BookingState {
  bookingDetails: BookingDetails[] | null;
}

const initialState: BookingState = {
  bookingDetails: null,
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
  },
});

export const { setBookingDetails, clearBookingDetails, updateBookingReadStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
