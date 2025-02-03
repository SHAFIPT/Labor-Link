import bycript from "bcrypt";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import { IUserServices } from "../../services/interface/IUserServices";
import { IUser } from "../../entities/UserEntity";
import { IBooking } from "../../entities/bookingEntity";
import { ILaborer } from "entities/LaborEntity";

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
    canceledBy: 'user' | 'labor'
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
  async updateReadStatus(bookingId: string, isUserRead: boolean): Promise<IBooking | null> {
    return await this.userRepository.updateReadStatus(bookingId, isUserRead)
  }
}
