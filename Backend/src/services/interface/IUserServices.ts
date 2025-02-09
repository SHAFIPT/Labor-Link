import { ILaborer } from "../../controllers/entities/LaborEntity";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { IUser } from "../../controllers/entities/UserEntity";
import Stripe from 'stripe';

export interface IUserServices {
  fetchUserDetails(userId: string): Promise<IUser | null>;
  UpdateUser(user: Partial<IUser>): Promise<IUser | null>;
  updatePassword(email: string, password: string): Promise<IUser | null>;
  bookingLabor(bookingDetails: Partial<IBooking>): Promise<IBooking | null>;
  fetchLaborId(email: string): Promise<string | null>;
  fetchBooking(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{ bookings: IBooking[]; total: number }>;
  cancelBooking(data: {
    bookingId: string;
    reason: string;
    comments: string;
    isWithin30Minutes: boolean;
    canceledBy: "user" | "labor";
  }): Promise<IBooking | null>;
  updateReadStatus(
    bookingId: string,
    isUserRead: boolean
  ): Promise<IBooking | null>;
  fetchBookinById(bookingId: string): Promise<IBooking | null>;
  workCompletion(
    bookingId: string,
    updateData: {
      isUserCompletionReported?: boolean;
      isLaborCompletionReported?: boolean;
    }
  ): Promise<IBooking | null>;
  resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: string
  ): Promise<IBooking | null>;
  pymentSuccess(
    bookingId: string,
    laborId: string,
    userId: string
  ): Promise<Stripe.PaymentIntent>;
  reviewUpload(
    bookingId: string,
    rating: string,
    feedback: string,
    imageUrls: string[]
  ): Promise<IBooking | null>;
  fetchAllBookings(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{
    bookings: IBooking[];
    total: number;
    completedBookings: number;
    canceledBookings: number;
    totalAmount :number
  }>;
}

