import bycript from "bcrypt";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import { IUserServices } from "../../services/interface/IUserServices";
import { IUser } from "../../controllers/entities/UserEntity";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { ILaborer } from "controllers/entities/LaborEntity";
import Stripe from 'stripe';
export default class UserServices implements IUserServices {
  private userRepository: IUserSideRepository;

  constructor(userRepository: IUserSideRepository) {
    this.userRepository = userRepository;
  }

  async fetchUserDetails(userId: string): Promise<IUser | null> {
    return await this.userRepository.fetchUser(userId);
  }
  async UpdateUser(user: IUser): Promise<IUser | null> {
    return await this.userRepository.profileUpdate(user);
  }
  async updatePassword(email: string, password: string): Promise<IUser | null> {
    const bycriptPassword = await bycript.hash(password, 10);
    return await this.userRepository.updatePassword(email, bycriptPassword);
  }

  async fetchLaborId(email: string): Promise<string | null> {
    return await this.userRepository.fetchLaborId(email);
  }

  async pymentSuccess(
    bookingId: string,
    laborId: string,
    userId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymnetStripeMethod = await this.userRepository.paymentSuccess(
        bookingId,
        laborId,
        userId
      );

      return paymnetStripeMethod;
    } catch (error) {}
  }

  async reviewUpload(
    bookingId: string,
    rating: string,
    feedback: string,
    imageUrls: string[]
  ): Promise<IBooking | null> {
    try {
      const booking = await this.userRepository.findLabor(bookingId);

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (
        !booking.laborId ||
        typeof booking.laborId === "string" ||
        "ObjectId" in booking.laborId
      ) {
        throw new Error("Labor details not properly populated");
      }

      if (
        !booking.userId ||
        typeof booking.userId === "string" ||
        "ObjectId" in booking.userId
      ) {
        throw new Error("User details not properly populated");
      }

      const labor = booking.laborId as unknown as ILaborer;
      const user = booking.userId as unknown as IUser;

      if (!labor) {
        throw new Error("Labor not found");
      }

      const updatedReivew = this.userRepository.reviewSubmiting(
        labor,
        user,
        rating,
        feedback,
        imageUrls
      );

      if (!updatedReivew) {
        throw new Error("Errorn in update reivew and rating ");
      }

      return updatedReivew;
    } catch (error) {
      console.error(error);
    }
  }
}
