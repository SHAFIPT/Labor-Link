import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingDetails {
  bookingId: string;
  userId: string;
  laborId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  quote: {
    description: string;
    estimatedCost: number;
    arrivalTime: string;
  };
  additionalChargeRequest: {
    amount: number;
    status: string;
  };
  __v: number;
  _id: string;
}

// ✅ Export BookingState so it can be imported in store.ts
export interface BookingState {
  bookingDetails: BookingDetails[] | null; // Now it's an array or null
}

const initialState: BookingState = {
  bookingDetails: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
     setBookingDetails: (state, action: PayloadAction<BookingDetails[]>) => {
      state.bookingDetails = action.payload; // Now accepts an array
    },
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
    },
  },
});

export const { setBookingDetails, clearBookingDetails } = bookingSlice.actions;
export default bookingSlice.reducer;

// ✅ Explicitly export BookingState
// export type { BookingState };
