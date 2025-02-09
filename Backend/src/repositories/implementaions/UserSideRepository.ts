import { IUser } from "../../controllers/entities/UserEntity";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { v4 as uuidv4 } from 'uuid';
import Booking from "../../models/BookingModal";
import { ILaborer, IReview } from "../../controllers/entities/LaborEntity";
import Labor from "../../models/LaborModel";
import Stripe from 'stripe';
import mongoose from "mongoose";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

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
      return await Booking.findOne({ bookingId }).populate({
        path: "laborId",
        select: "firstName lastName phone categories profilePicture reviews",
      });
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
        rejectedBy: null,
        acceptedBy: null
      }

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
  async workCompletion(bookingId: string, updateData: { isUserCompletionReported?: boolean; isLaborCompletionReported?: boolean }): Promise<IBooking | null> {
    try {

      // console.log('JIIIIIIIIIIIIIIIIIIIIIII',updateData)

      const booking = await Booking.findOne({ bookingId: bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (updateData.isUserCompletionReported !== undefined) {
        booking.isUserCompletionReported = updateData.isUserCompletionReported
      }


      if (updateData.isLaborCompletionReported !== undefined) {
        booking.isLaborCompletionReported = updateData.isLaborCompletionReported
      }

      if (booking.isUserCompletionReported && booking.isLaborCompletionReported) {
          booking.status = "completed";
      }


      await booking.save()

      return booking
      
    } catch (error) {
      console.error("Error in workcompletion:", error);
      throw error;
    }
  }
  async foundBookingById(bookingId: string): Promise<IBooking | null> {
  try {
    const fetchedBooking = await Booking.aggregate([
      {
        $match : {bookingId : bookingId}
      },
      {
        $lookup: {
          from: 'labors',
          localField: 'laborId',
          foreignField: '_id',
          as : 'laborDetails'
        },
      },
      {
        $unwind : '$laborDetails'
      },
      {
        $project: {
          _id: null,
           "laborDetails.firstName": 1,
          "laborDetails.lastName": 1,
          "laborDetails.reviews": 1,
          "laborDetails.rating": 1
        },
      }
    ])

    return fetchedBooking.length ? fetchedBooking[0] : null;

    
  } catch (error) {
    console.error("Error in fetchbooking :", error);
    throw error;
  }
}
  async paymentSuccess(bookingId: string, laborId: string, userId: string): Promise<any>  {
    try {

      const foundBooking = await Booking.findOne({ bookingId });

      if (!foundBooking) {
        throw new Error('booking is not found...')
      }


      const estimatedCost = foundBooking.quote.estimatedCost;
      // const commissionAmount = 100;
      // const laborAmount = estimatedCost - commissionAmount;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "dsglkd;s",
              },
              unit_amount: estimatedCost * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `http://localhost:5173/reviewRating?bookingId=${bookingId}`,
        cancel_url: "http://localhost:5173/userProfilePage",
        metadata: {
          bookingId,
          laborId,
          userId,
        },
      });

        //        const session = await stripe.checkout.sessions.create({
        //     payment_method_types :["card"],
        //     mode:"payment",
        //     line_items: [{ 
        //         price_data: {
        //             currency: details.currency.toLowerCase(),
        //             product_data: {
        //                 name: details.name,
        //             },
        //             unit_amount: details?.plan?.price * 100,
        //         },
        //         quantity: details.validity,
        //     }],
        //     success_url,
        //     cancel_url,
        //     metadata:{
        //         ...details,
        //         plan: JSON.stringify(planWithoutMenu)
        //     }
        // })
        // return session

      if (!session) {
        throw new Error('error in payment setinging ')
      }

      return session;

    } catch (error) {
      console.error("Error in pymentsuccess :", error);
      throw error;
    }
  }
  async findLabor(bookingId: string): Promise<IBooking | null> {
    try {

      return await Booking.findOne({ bookingId }).populate('laborId userId');

    } catch (error) {
      console.error("Error in fetch labor :", error);
      throw error;
    }
  }
  async reviewSubmiting(labor: ILaborer, rating: string, feedback: string ,imageUrls: string[]): Promise<IBooking | null> {
    try {

       const numericRating = parseFloat(rating);
    
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        throw new Error('Invalid rating value');
      }

      const booking = await Booking.findOne({
        laborId: labor?._id,
        status: { $ne: 'canceled' },
      }).populate('userId')

       if (!booking) {
        throw new Error('Active booking not found');
      }

      const user = booking.userId as IUser;
      if (!user) {
        throw new Error('User details not found');
      }

      const newReview : IReview = {
        reviewerName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        reviewText: feedback,
        rating: numericRating,
        imageUrl: imageUrls,
        createdAt: new Date()
      }

       return await Labor.findByIdAndUpdate(
        labor._id,
        {
          $push: { reviews: newReview },
          $set: {
            rating: await this.calculateAverageRating(labor._id, numericRating)
          }
        }
      );
      
    } catch (error) {
      console.error('Error in reviewSubmiting:', error);
      throw error;
    }
  }
      // Helper method to calculate average rating
    private async calculateAverageRating(laborId: string, newRating: number): Promise<number> {
      const labor = await Labor.findById(laborId);
      if (!labor) {
        return newRating;
      }

      const allRatings = [...labor.reviews.map(review => review.rating), newRating];
      const totalRating = allRatings.reduce((sum, rating) => sum + rating, 0);
      return Number((totalRating / allRatings.length).toFixed(1));
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
  }> {
    try {

       const skip = (page - 1) * limit;

      const bookings = await Booking.find({ userId, ...filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "laborId", // Field to populate
          select: "firstName lastName  phone  categories profilePicture address", // Fields to include from the Labor schema
        })
        .exec();
      
      const total = await Booking.countDocuments({
        userId,
        ...filter,
      });

      const completedBookings = await Booking.countDocuments({ 
        userId, 
        status: 'completed',
        ...filter
      });

       const canceledBookings = await Booking.countDocuments({ 
        userId, 
         status: 'canceled',
        ...filter
       });
      
      const totalAmountResult = await Booking.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quote.estimatedCost" } // Correct path to estimatedCost
          } 
        }
      ]);

      const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;
      
      return {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        totalAmount
        };
      
    } catch (error) {
      console.error('Error in fetchbookings:', error);
      throw error;
    }
  }
}


