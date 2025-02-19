import { ILaborer } from "../../controllers/entities/LaborEntity";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { IUser } from "../../controllers/entities/UserEntity";
import Stripe from 'stripe';

export interface IUserSideRepository {
  fetchUser(userId: string): Promise<IUser | null>;
  profileUpdate(userData: IUser): Promise<IUser | null>;
  updatePassword(email: string, NewPassword: string): Promise<IUser | null>;
  
  fetchLaborId(email: string): Promise<string | null>;

  findLabor(bookingId: string): Promise<IBooking | null>
  
  paymentSuccess(bookingId: string, laborId: string, userId: string): Promise<Stripe.PaymentIntent> 
  
  reviewSubmiting(labor: ILaborer, user: IUser, rating: string, feedback: string, imageUrls: string[]): Promise<IBooking | null>
  
}                