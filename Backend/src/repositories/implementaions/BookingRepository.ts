import { IBooking } from "controllers/entities/bookingEntity";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import Booking from "../../models/BookingModal";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";
import Labor from "../../models/LaborModel";
import User from "../../models/userModel";
import { BaseRepository } from "../../repositories/BaseRepository/BaseRepository";

export default class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
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
      const booking = await this.findOne({ bookingId }); // Finds booking by its ID
      if (!booking) {
        throw new Error("Booking not found");
      }

      return await booking.populate({
        path: "laborId",
        select: "firstName lastName phone categories profilePicture reviews",
      })
        
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
      bookingFound.paymentStatus = "failed";
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

      const booking = await this.findOne({ bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      booking.reschedule = {
        newDate: convertedDate,
        newTime,
        reasonForReschedule: reason,
        requestSentBy,
        isReschedule: false,
        rejectedBy: null,
        acceptedBy: null,
      };

      await booking.save();

      booking.populate({
        path: "laborId", // Field to populate
        select: "firstName lastName  phone  location.coordinates categories", // Fields to include from the Labor schema
      });

      return booking;
    } catch (error) {
      console.error("Error in reschedule request:", error);
      throw error;
    }
  }

  async workCompletion(
    bookingId: string,
    updateData: {
      isUserCompletionReported?: boolean;
      isLaborCompletionReported?: boolean;
    }
  ): Promise<IBooking | null> {
    try {
      // console.log('JIIIIIIIIIIIIIIIIIIIIIII',updateData)

      const booking = await this.findOne({ bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (updateData.isUserCompletionReported !== undefined) {
        booking.isUserCompletionReported = updateData.isUserCompletionReported;
      }

      if (updateData.isLaborCompletionReported !== undefined) {
        booking.isLaborCompletionReported =
          updateData.isLaborCompletionReported;
      }

      if (
        booking.isUserCompletionReported &&
        booking.isLaborCompletionReported
      ) {
        booking.status = "completed";
      }

      await booking.save();

      return booking;
    } catch (error) {
      console.error("Error in workcompletion:", error);
      throw error;
    }
  }
  async foundBookingById(bookingId: string): Promise<IBooking | null> {
    try {
      const fetchedBooking = await Booking.aggregate([
        {
          $match: { bookingId: bookingId },
        },
        {
          $lookup: {
            from: "labors",
            localField: "laborId",
            foreignField: "_id",
            as: "laborDetails",
          },
        },
        {
          $unwind: "$laborDetails",
        },
        {
          $project: {
            _id: null,
            "laborDetails.firstName": 1,
            "laborDetails.lastName": 1,
            "laborDetails.reviews": 1,
            "laborDetails.rating": 1,
          },
        },
      ]);

      return fetchedBooking.length ? fetchedBooking[0] : null;
    } catch (error) {
      console.error("Error in fetchbooking :", error);
      throw error;
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
    totalAmount: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ userId, ...filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "laborId", // Field to populate
          select:
            "firstName lastName  phone  categories profilePicture address", // Fields to include from the Labor schema
        })
        .populate({
          path: "userId", // Field to populate
          select: "addressDetails", // Fields to include from the Labor schema
        })
        .exec();

      const total = await Booking.countDocuments({
        userId,
        ...filter,
      });

      const completedBookings = await Booking.countDocuments({
        userId,
        status: "completed",
        ...filter,
      });

      const canceledBookings = await Booking.countDocuments({
        userId,
        status: "canceled",
        ...filter,
      });

      const totalAmountResult = await Booking.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quote.estimatedCost" }, // Correct path to estimatedCost
          },
        },
      ]);

      const totalAmount =
        totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

      return {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        totalAmount,
      };
    } catch (error) {
      console.error("Error in fetchbookings:", error);
      throw error;
    }
  }

  async fetchBookingsToLabor(
    laborId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{
    bookings: IBooking[];
    total: number;
    completedBookings: number;
    canceledBookings: number;
    totalAmount: number;
    pendingBookings: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ laborId, ...filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId", // Field to populate
          select: "firstName lastName  ProfilePic  ", // Fields to include from the Labor schema
        })
        .populate({
          path: "laborId",
          select: "location.coordinates",
        })
        .exec();

      const total = await Booking.countDocuments({
        laborId,
        ...filter,
      });

      const completedBookings = await Booking.countDocuments({
        laborId,
        status: "completed",
        ...filter,
      });

      const canceledBookings = await Booking.countDocuments({
        laborId,
        status: "canceled",
        ...filter,
      });

      const pendingBookings = await Booking.countDocuments({
        laborId,
        status: "pending",
        ...filter,
      });

      const totalAmountResult = await Booking.aggregate([
        {
          $match: {
            laborId: new mongoose.Types.ObjectId(laborId), // Convert userId to ObjectId
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quote.estimatedCost" }, // Correct path to estimatedCost
          },
        },
      ]);

      const totalAmount =
        totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

      return {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        totalAmount,
        pendingBookings,
      };
    } catch (error) {
      console.error("Error fetch bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }

  async fetchBookingDetils(bookingId: string): Promise<IBooking | null> {
    try {
      const booking = await this.findOne({ bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking;
    } catch (error) {
      console.error("Error in fetchting bookings", error);
      throw error;
    }
  }
  async rejectResheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    rejectionReason: string,
    rejectedBy: string,
    requestSentBy: string
  ): Promise<IBooking | null> {
    try {
      await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
            "reschedule.isReschedule": false,
            "reschedule.rejectedBy": rejectedBy,
            "reschedule.requestSentBy": requestSentBy,
            "reschedule.rejectionNewDate": newDate,
            "reschedule.rejectionNewTime": newTime,
            "reschedule.rejectionReason": rejectionReason,
          },
        },
        { new: true }
      );

      const updatedBooking = await Booking.findOne({ bookingId: bookingId })
        .populate({
          path: "laborId",
          select:
            "firstName lastName phone categories profilePicture location.coordinates",
        })
        .populate({
          path: "userId",
          select: "firstName lastName phone ProfilePic",
        });

      return updatedBooking;
    } catch (error) {
      console.error("Error in reject Boooking", error);
      throw error;
    }
  }
  async acceptResheduleRequst(
    bookingId: string,
    acceptedBy: string
  ): Promise<any> {
    try {
      const currentBooking = await Booking.findOne({ bookingId: bookingId });

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      if (!currentBooking.reschedule) {
        throw new Error("No reschedule information found");
      }

      // First update quote arrival time based on rejection status
      let arrivalTime: Date;

      if (!currentBooking.reschedule.rejectedBy) {
        // Handle case where booking hasn't been rejected
        if (
          !currentBooking.reschedule.newDate ||
          !currentBooking.reschedule.newTime
        ) {
          throw new Error("New schedule time and date are required");
        }

        const newDateTime = new Date(currentBooking.reschedule.newDate);
        const [hours, minutes] = currentBooking.reschedule.newTime.split(":");
        newDateTime.setHours(parseInt(hours), parseInt(minutes));
        arrivalTime = newDateTime;
      } else {
        // Handle case where booking was rejected
        if (
          !currentBooking.reschedule.rejectionNewDate ||
          !currentBooking.reschedule.rejectionNewTime
        ) {
          throw new Error("Rejection schedule time and date are required");
        }

        const rejectionDateTime = new Date(
          currentBooking.reschedule.rejectionNewDate
        );
        const [hours, minutes] =
          currentBooking.reschedule.rejectionNewTime.split(":");
        rejectionDateTime.setHours(parseInt(hours), parseInt(minutes));
        arrivalTime = rejectionDateTime;
      }

      // Update booking with new arrival time and reset reschedule fields
      await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
            "quote.arrivalTime": arrivalTime,
            reschedule: {
              // Keep these two fields
              isReschedule: true,
              acceptedBy: acceptedBy,

              // Reset all other fields to initial state
              newTime: null,
              newDate: null,
              reasonForReschedule: null,
              requestSentBy: null,
              rejectedBy: null,
              rejectionNewDate: null,
              rejectionNewTime: null,
              rejectionReason: null,
            },
          },
        },
        { new: true }
      );

      const updatedBooking = await Booking.findOne({ bookingId: bookingId })
        .populate({
          path: "laborId",
          select:
            "firstName lastName phone categories profilePicture location.coordinates",
        })
        .populate({
          path: "userId",
          select: "firstName lastName phone ProfilePic",
        });

      return updatedBooking;
    } catch (error) {
      console.error("Error in accept booking", error);
      throw error;
    }
  }
  async additionalCharge(
    bookingId: string,
    amount: number,
    reason: string
  ): Promise<IBooking | null> {
    try {
      const currentBooking = await Booking.findOne({ bookingId: bookingId });

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      currentBooking.additionalChargeRequest = {
        amount,
        reason,
        status: "pending",
      };

      await currentBooking.save();

      return currentBooking;
    } catch (error) {
      console.error("Error in ", error);
      throw error;
    }
  }
  async acceptRequst(bookingId: string): Promise<IBooking | null> {
    try {
      const currentBooking = await Booking.findOne({ bookingId: bookingId });

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      const updatedEstimatedCost =
        currentBooking.quote.estimatedCost +
        (currentBooking.additionalChargeRequest.amount || 0);

      await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
            "quote.estimatedCost": updatedEstimatedCost,
            "additionalChargeRequest.amount": null,
            "additionalChargeRequest.reason": null,
            "additionalChargeRequest.status": "approved",
          },
        },
        { new: true }
      );

      return currentBooking;
    } catch (error) {
      console.error("Error in accept requat", error);
      throw error;
    }
  }
  async rejectRequst(bookingId: string): Promise<IBooking | null> {
    try {
      const currentBooking = await Booking.findOne({ bookingId: bookingId });

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
            "additionalChargeRequest.amount": null,
            "additionalChargeRequest.reason": null,
            "additionalChargeRequest.status": "declined",
          },
        },
        { new: true }
      );

      return currentBooking;
    } catch (error) {
      console.error("Error in rejectRequst", error);
      throw error;
    }
  }
  async fetchExistBooking(data: {
    userEmail: string;
    laborEmail: string;
  }): Promise<IBooking | null> {
    try {
      const { userEmail, laborEmail } = data;

      // Find the user by userEmail
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error("User not found");
      }

      // Find the labor by laborEmail
      const labor = await Labor.findOne({ email: laborEmail });
      if (!labor) {
        throw new Error("Labor not found");
      }

      // Find the booking where userId and laborId match, and status is "confirmed"
      const existingBooking = await Booking.findOne({
        userId: user._id,
        laborId: labor._id,
      }).sort({ createdAt: -1 });

      if (!existingBooking) {
        throw new Error("No confirmed booking found");
      }

      return existingBooking;
    } catch (error) {
      console.error("Error in existing booking fetching...", error);
      throw error;
    }
    }
    
    async fetchAllBookingsById(email: string): Promise<IBooking[] | null> {
    try {
        const labor = await Labor.findOne({ email: email });
        if (!labor) {
            throw new Error("Labor not found");
        }

        const confirmedBookings = await Booking.find({
            laborId: labor._id,
            status: 'confirmed',
        }).sort({ createdAt: -1 }); 

        // if (confirmedBookings.length === 0) {
        //     throw new Error("No confirmed bookings found");
        // }

        return confirmedBookings;
    } catch (error) {
        console.error(error);
        return null; 
    }
}
}