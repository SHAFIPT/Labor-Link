import { IAboutMe, ILaborer } from "entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import Labor from "../../models/LaborModel";
import { SortOrder } from "mongoose";
import { IBooking } from "../../entities/bookingEntity";
import Booking from "../../models/BookingModal";

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
    limit: number
  ): Promise<{ bookings: IBooking[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ laborId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId", // Field to populate
          select: "firstName lastName  ProfilePic  ", // Fields to include from the Labor schema
        })
        .populate({
          path: 'laborId',
          select : 'location.coordinates'
        })
        .exec();

      const total = await Booking.countDocuments({
        laborId
      });

      return { bookings, total };
    } catch (error) {
      console.error("Error fetch bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }
}
