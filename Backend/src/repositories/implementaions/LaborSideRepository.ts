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
