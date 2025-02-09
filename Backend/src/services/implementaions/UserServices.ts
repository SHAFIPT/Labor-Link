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

  async bookingLabor(bookingDetails: IBooking): Promise<IBooking | null> {
    try {
      const booking = await this.userRepository.createBooking(bookingDetails);

      return booking;
    } catch (error) {
      console.error("Error in booking labor:", error);
      throw new Error("Failed to book labor");
    }
  }
  async fetchLaborId(email: string): Promise<string | null> {
    return await this.userRepository.fetchLaborId(email);
  }
  async fetchBooking(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{ bookings: IBooking[]; total: number }> {
    return await this.userRepository.fetchBooking(userId, page, limit, filter);
  }
  async cancelBooking(data: {
    bookingId: string;
    reason: string;
    comments: string;
    isWithin30Minutes: boolean;
    canceledBy: "user" | "labor";
  }): Promise<IBooking | null> {
    try {
      const { bookingId } = data;

      const bookingFound = await this.userRepository.findBookingById(bookingId);

      if (!bookingFound) {
        throw new Error("The booking ID was not found.");
      }

      const updatedBooking = await this.userRepository.cancelBooking(
        bookingFound,
        data
      );

      if (!updatedBooking) {
        throw new Error("Failed to update the booking.");
      }

      return updatedBooking;
    } catch (error) {
      console.error("Error in cancelBooking:", error);
      throw new Error("Failed to cancel booking.");
    }
  }
  async updateReadStatus(
    bookingId: string,
    isUserRead: boolean
  ): Promise<IBooking | null> {
    return await this.userRepository.updateReadStatus(bookingId, isUserRead);
  }
  async resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: string
  ): Promise<IBooking | null> {
    return await this.userRepository.resheduleRequst(
      bookingId,
      newDate,
      newTime,
      reason,
      requestSentBy
    );
  }
  async workCompletion(
    bookingId: string,
    updateData: {
      isUserCompletionReported?: boolean;
      isLaborCompletionReported?: boolean;
    }
  ): Promise<IBooking | null> {
    return await this.userRepository.workCompletion(bookingId, updateData);
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
  async fetchBookinById(bookingId: string): Promise<IBooking | null> {
    return await this.userRepository.findBookingById(bookingId)
  }
  async reviewUpload(bookingId: string, rating: string, feedback: string ,imageUrls: string[]): Promise<IBooking | null> {
    try {

      const booking = await this.userRepository.findLabor(bookingId)

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (!booking.laborId || typeof booking.laborId === 'string' || 'ObjectId' in booking.laborId) {
        throw new Error('Labor details not properly populated');
      }

      if (!booking.userId || typeof booking.userId === 'string' || 'ObjectId' in booking.userId) {
        throw new Error('User details not properly populated');
      }

      const labor = booking.laborId as unknown as ILaborer;

      if (!labor) {
        throw new Error('Labor not found');
      }

      const updatedReivew = this.userRepository.reviewSubmiting(labor, rating, feedback ,imageUrls)
      
      if (!updatedReivew) {
         throw new Error('Errorn in update reivew and rating ');
      }

      return updatedReivew
      
    } catch (error) {
      console.error(error)
    }
  }
  async fetchAllBookings(
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
  }>{
     return await this.userRepository.fetchAllBookings(userId,page,limit,filter)
  }
}
