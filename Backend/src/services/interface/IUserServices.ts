import { IBooking } from "../../controllers/entities/bookingEntity";
import { IUser } from "../../controllers/entities/UserEntity";
import Stripe from 'stripe';

export interface IUserServices {
  fetchUserDetails(userId: string): Promise<IUser | null>;
  UpdateUser(user: Partial<IUser>): Promise<IUser | null>;
  updatePassword(email: string, password: string): Promise<IUser | null>;

  fetchLaborId(email: string): Promise<string | null>;

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
   getSearchSuggest(query: string): Promise<{ id: string; name: string; category: string; profilePicture: string | null }[]> 
}

