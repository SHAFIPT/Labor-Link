import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxiosInstance } from "../../services/instance/userInstance";


const api = userAxiosInstance

export interface BookingDetails {
  bookingId: string;
  userId: string;
  laborId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  cancellation: {
    canceledBy: string
    isUserRead : boolean
  },
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
      dispatch(setBookingDetails(response.data.data.updtedBooking))
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
