import { IAboutMe, ILaborer } from "controllers/entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import Labor from "../../models/LaborModel";
import mongoose, { SortOrder } from "mongoose";
import { IBooking } from "../../controllers/entities/bookingEntity";
import Booking from "../../models/BookingModal";
import User from "../../models/userModel";
import { IWallet } from "controllers/entities/withdrawalRequstEntity";
import WithdrawalRequest from "../../models/WithdrawalRequestModal";

export class LaborSideRepository implements ILaborSidRepository {
  async fetchLabor(laborId: string): Promise<ILaborer | null> {
    return Labor.findById(laborId).select("-password -refreshToken");
  }
  async updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null> {
    try {
      if (!labor.email) {
        throw new Error("Email is required to update the profile.");
      }

      const updateLabor = await Labor.findOneAndUpdate(
        { email: labor.email },
        { $set: labor },
        { new: true }
      );

      return updateLabor;
    } catch (error) {
      console.error("Error updating labor profile:", error);
      throw error;
    }
  }
  async updatePassword(
    email: string,
    NewPassword: string
  ): Promise<ILaborer | null> {
    return await Labor.findOneAndUpdate(
      { email }, // Query by email
      { $set: { password: NewPassword } }, // Update password field
      { new: true } // Return the updated document
    );
  }

  async fetchLabors(params: {
    latitude: number;
    longitude: number;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    category?: string;
    rating?: number;
    sortOrder?: "asc" | "desc";
  }): Promise<ILaborer[]> {
    try {
      // console.log("TTTTTTTTTTTheeeeeeeeeeees ratingggggggggggggg:",params.rating)

      // Construct filter object dynamically
      const filter: any = { isApproved: true };

      if (params.country) filter["address.country"] = params.country;
      if (params.state) filter["address.state"] = params.state;
      if (params.city) {
        filter["address.city"] = {
          $regex: `^${params.city}$`,
          $options: "i",
        };
      }
      if (params.zipCode) filter["address.postalCode"] = params.zipCode;
      if (params.category) filter["categories"] = params.category;
      if (params.rating) filter["rating"] = { $gte: params.rating };

      // Create the base query
      const baseQuery = {
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [params.longitude, params.latitude],
            },
            $maxDistance: 5000,
          },
        },
      };

      // Define sort options with correct type
      const sortOptions: { [key: string]: SortOrder } =
        params.sortOrder === "asc"
          ? { rating: 1 as SortOrder }
          : params.sortOrder === "desc"
          ? { rating: -1 as SortOrder }
          : {};

      const results = await Labor.find(baseQuery)
        .sort(sortOptions)
        .select("-password -refreshToken");

      return results;
    } catch (error) {
      console.error("Error fetching laborers:", error);
      throw new Error("Failed to fetch laborers.");
    }
  }

  async aboutMe(data: {
    userId: string;
    name: string;
    experience: string;
    description: string;
  }): Promise<IAboutMe> {
    try {
      const { userId, name, experience, description } = data;

      console.log("Thsi sthe user detials : ", {
        userId,
        name,
        description,
        experience,
      });

      const labor = await Labor.findById(userId);

      console.log("Thsis itehlagbor in db : ", labor);

      if (!labor) {
        throw new Error("Laborer not found");
      }

      // Check if 'aboutMe' already exists, then update or add new
      if (labor.aboutMe) {
        // Update existing aboutMe
        labor.aboutMe.name = name;
        labor.aboutMe.experience = experience;
        labor.aboutMe.description = description;
      } else {
        // Add new aboutMe
        labor.aboutMe = { name, experience, description };
      }

      await labor.save();

      return labor.aboutMe;
    } catch (error) {
      console.error(error);
      throw new Error("Error in aboutMe profile update");
    }
  }
  async fetchBooking(
    laborId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{
    bookings: IBooking[];
    total: number;
    completedBookings: number;
    canceledBookings: number;
    totalAmount: number
    pendingBookings : number
  }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ laborId , ...filter })
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
        ...filter
      });

      const completedBookings = await Booking.countDocuments({ 
        laborId, 
        status: 'completed',
        ...filter
      });

       const canceledBookings = await Booking.countDocuments({ 
        laborId, 
         status: 'canceled',
        ...filter
       });
      
       const pendingBookings = await Booking.countDocuments({ 
        laborId, 
         status: 'pending',
        ...filter
       });
      
      const totalAmountResult = await Booking.aggregate([
        {
          $match: {
            laborId: new mongoose.Types.ObjectId(laborId), // Convert userId to ObjectId
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
        totalAmount,
        pendingBookings
      };
      

    } catch (error) {
      console.error("Error fetch bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }
  async fetchSimilorLabors(
    latitude: number,
    longitude: number,
    categorie: string,
    laborId: string
  ): Promise<ILaborer[]> {
    try {
      // Find labors within a 5km radius of the user's location
      const labors = await Labor.find({
        _id: { $ne: laborId },
        isApproved: true,
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Longitude first, then latitude
            },
            $maxDistance: 5000, // 5 kilometers in meters
          },
        },
        categories: categorie,
      }).exec();

      return labors;
    } catch (error) {}
  }
  async fetchBookingDetils(bookingId: string): Promise<IBooking | null> {
    try {
      const booking = await Booking.findOne({ bookingId: bookingId });

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
    requestSentBy : string
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
        select: "firstName lastName phone categories profilePicture location.coordinates",
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
  async acceptResheduleRequst(bookingId: string, acceptedBy: string): Promise<any> {
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
      if (!currentBooking.reschedule.newDate || !currentBooking.reschedule.newTime) {
        throw new Error("New schedule time and date are required");
      }

      const newDateTime = new Date(currentBooking.reschedule.newDate);
      const [hours, minutes] = currentBooking.reschedule.newTime.split(":");
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      arrivalTime = newDateTime;
    } else {
      // Handle case where booking was rejected
      if (!currentBooking.reschedule.rejectionNewDate || !currentBooking.reschedule.rejectionNewTime) {
        throw new Error("Rejection schedule time and date are required");
      }

      const rejectionDateTime = new Date(currentBooking.reschedule.rejectionNewDate);
      const [hours, minutes] = currentBooking.reschedule.rejectionNewTime.split(":");
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
            rejectionReason: null
          }
        }
      },
      { new: true }
    );

    const updatedBooking = await Booking.findOne({ bookingId: bookingId })
      .populate({
        path: "laborId",
        select: "firstName lastName phone categories profilePicture location.coordinates",
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
  async additionalCharge(bookingId: string, amount: number, reason: string): Promise<IBooking | null> {
    try {

      const currentBooking = await Booking.findOne({ bookingId: bookingId });

      if (!currentBooking) {
        throw new Error("Booking not found");   
      }

      currentBooking.additionalChargeRequest = {
        amount,
        reason,
        status: 'pending',
      };

      await currentBooking.save();

      return currentBooking


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
        currentBooking.quote.estimatedCost + (currentBooking.additionalChargeRequest.amount || 0);
      
      await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
                "quote.estimatedCost": updatedEstimatedCost,
                "additionalChargeRequest.amount": null,
                "additionalChargeRequest.reason": null,
                "additionalChargeRequest.status": "approved"
          },
        },
        {new : true}
      ) 

      return currentBooking
      
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
                "additionalChargeRequest.status": "declined"
          },
        },
        {new : true}
      ) 

      return currentBooking
      
    } catch (error) {
      console.error("Error in rejectRequst", error);
      throw error;
    }
  }
  async fetchExistBooking(data: { userEmail: string; laborEmail: string; }): Promise<IBooking | null> {
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
            laborId: labor._id
        });

        if (!existingBooking) {
            throw new Error("No confirmed booking found");
        }

        return existingBooking;
    } catch (error) {
        console.error("Error in existing booking fetching...", error);
        throw error;
    } 
  }
  async walletWithrow(laborId: string, amount: number, bankDetails: { accountNumber: string; bankName: string; ifscCode: string; }): Promise<IWallet | null> {
    try {

      const withdrawalRequst = await WithdrawalRequest.create({
        laborerId: laborId,
        amount,
        createdAt: new Date(),
        paymentMethod: 'Bank Transfer',
        paymentDetails : JSON.stringify(bankDetails)
      })

      return withdrawalRequst as IWallet;
      
    } catch (error) {
      console.error("Error in wallet widhrow requst ...", error);
        throw error;
    }
  }
}
