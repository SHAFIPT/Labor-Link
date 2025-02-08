import { ILaborer } from "../../controllers/entities/LaborEntity";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { IUser } from "../../controllers/entities/UserEntity";
import Stripe from 'stripe';

export interface IUserSideRepository {
  fetchUser(userId: string): Promise<IUser | null>;
  profileUpdate(userData: IUser): Promise<IUser | null>;
  updatePassword(email: string, NewPassword: string): Promise<IUser | null>;
  createBooking(bookingDetails: Partial<IBooking>): Promise<IBooking | null>;
  fetchLaborId(email: string): Promise<string | null>;
  fetchBooking(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{ bookings: IBooking[]; total: number }>;
  findBookingById(bookingId: string): Promise<IBooking | null>;
  cancelBooking(
    bookingFound: IBooking,
    data: {
      reason: string;
      comments: string;
      isWithin30Minutes: boolean;
      canceledBy: "user" | "labor";
    }
  ): Promise<IBooking | null>;
  updateReadStatus(
    bookingId: string,
    isUserRead: boolean
  ): Promise<IBooking | null>;
  workCompletion(bookingId: string, updateData: { isUserCompletionReported?: boolean; isLaborCompletionReported?: boolean }): Promise<IBooking | null>;
  resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: string
  ): Promise<IBooking | null>;
  foundBookingById(bookingId : string) : Promise <IBooking | null>
  findLabor(bookingId : string) : Promise <IBooking | null>
  paymentSuccess(bookingId: string, laborId: string, userId: string): Promise<Stripe.PaymentIntent> 
  reviewSubmiting(labor: ILaborer, rating: string, feedback: string ,imageUrls: string[]): Promise<IBooking | null>
}                