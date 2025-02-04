import { IUser } from "../../entities/UserEntity";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";
import { IBooking } from "entities/bookingEntity";
import { v4 as uuidv4 } from 'uuid';
import Booking from "../../models/BookingModal";
import { ILaborer } from "entities/LaborEntity";
import Labor from "../../models/LaborModel";


export default class UserSideRepository implements IUserSideRepository {
  async fetchUser(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-password -refreshToken");
  }
  async profileUpdate(userData: IUser): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email: userData.email },
      {
        $set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          ...(userData.ProfilePic && { ProfilePic: userData.ProfilePic }),
        },
      },
      { new: true } // Return the updated document
    );
  }
  async updatePassword(
    email: string,
    NewPassword: string
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email }, // Query by email
      { $set: { password: NewPassword } }, // Update password field
      { new: true } // Return the updated document
    );
  }
  async createBooking(
    bookingDetails: Partial<IBooking>
  ): Promise<IBooking | null> {
    try {
      if (
        !bookingDetails.quote?.description ||
        !bookingDetails.quote?.estimatedCost ||
        !bookingDetails.quote?.arrivalTime
      ) {
        throw new Error("Missing required quote fields");
      }

      if (
        !bookingDetails.addressDetails?.district ||
        !bookingDetails.addressDetails?.name ||
        !bookingDetails.addressDetails?.place ||
        !bookingDetails.addressDetails?.address ||
        !bookingDetails.addressDetails?.pincode ||
        !bookingDetails.addressDetails?.Userlatitude ||
        !bookingDetails.addressDetails?.Userlongitude
      ) {
        throw new Error("Missing address details");
      }

      console.log(
        "This is the CreateBooooking ;;;;;;;;;;;;;;;",
        bookingDetails
      );

      const bookingId = uuidv4();

      const newBooking = new Booking({
        bookingId,
        userId: bookingDetails.userId,
        laborId: bookingDetails.laborId,
        quote: {
          description: bookingDetails.quote.description,
          estimatedCost: bookingDetails.quote.estimatedCost,
          arrivalTime: bookingDetails.quote.arrivalTime,
        },
        addressDetails: bookingDetails.addressDetails,
        status: "confirmed",
        paymentStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("This is the newBokkkoioooooooooooooonng , ", newBooking);

      const savedBooking = await newBooking.save();
      return savedBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking");
    }
  }

  async fetchLaborId(email: string): Promise<string | null> {
    // Assuming _id is a string
    try {
      const labor = await Labor.findOne({ email }).select("_id");
      return labor ? labor._id.toString() : null; // Return the ID or null
    } catch (error) {
      console.error("Error labor id fetch:", error);
      throw new Error("Failed to fetch labor ID");
    }
  }

  async fetchBooking(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{ bookings: IBooking[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ userId, ...filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "laborId", // Field to populate
          select: "firstName lastName  phone  location.coordinates categories", // Fields to include from the Labor schema
        })
        .exec();

      const total = await Booking.countDocuments({
        userId,
        ...filter,
      });

      return { bookings, total };
    } catch (error) {
      console.error("Error fetch bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }
  async findBookingById(bookingId: string): Promise<IBooking | null> {
    try {
      return await Booking.findOne({ bookingId });
    } catch (error) {
      console.error("Error fetch bookingId:", error);
      throw new Error("Failed to fetch bookingId");
    }
  }
  async cancelBooking(
    bookingFound: IBooking,
    data: {
      reason: string;
      comments: string;
      isWithin30Minutes: boolean;
      canceledBy: "user" | "labor";
    }
  ): Promise<IBooking | null> {
    try {
      const { reason, comments, isWithin30Minutes, canceledBy } = data;

      // Get the current time and the booking's arrival time
      const currentTime = new Date();
      const arrivalTime = new Date(bookingFound.quote.arrivalTime);

      // Calculate the time difference in milliseconds
      const timeDifference = arrivalTime.getTime() - currentTime.getTime();

      // Convert the time difference to minutes
      const timeDifferenceInMinutes = timeDifference / (1000 * 60);

      // Check if the cancellation is within 30 minutes of the arrival time
      const isWithinCancellationWindow = timeDifferenceInMinutes <= 30;

      // Apply cancellation fee only if the cancellation is within 30 minutes
      const cancellationFee = isWithinCancellationWindow ? 100 : 0; // Example: $100 fee for cancellations within 30 minutes

      // Update booking status and cancellation details
      bookingFound.status = "canceled";
      bookingFound.cancellation = {
        reason,
        comments,
        canceledBy,
        canceledAt: currentTime,
        cancellationFee,
        isUserRead: false,
      };

      // Save the updated booking
      return await bookingFound.save();
    } catch (error) {
      console.error("Error in cancelBooking repository method:", error);
      throw new Error("Failed to cancel booking.");
    }
  }
  async updateReadStatus(
    bookingId: string,
    isUserRead: boolean
  ): Promise<IBooking | null> {
    try {
      const updatedBooking = await Booking.findOneAndUpdate(
        { bookingId },
        { $set: { "cancellation.isUserRead": isUserRead } },
        { new: true }
      );
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking read status:", error);
      throw error;
    }
  }
  async resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: "user" | "labor"
  ): Promise<IBooking | null> {
    try {
      const convertedDate = new Date(newDate);

      const booking = await Booking.findOne({ bookingId: bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      booking.reschedule = {
        newDate: convertedDate,
        newTime,
        reasonForReschedule: reason,
        requestSentBy,
        isReschedule: false,
      };

      await booking.save();

      return booking;
    } catch (error) {
      console.error("Error in reschedule request:", error);
      throw error;
    }
  }
}