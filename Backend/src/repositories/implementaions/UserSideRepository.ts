import { IUser } from "../../controllers/entities/UserEntity";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { v4 as uuidv4 } from 'uuid';
import Booking from "../../models/BookingModal";
import { ILaborer } from "../../controllers/entities/LaborEntity";
import Labor from "../../models/LaborModel";
import Stripe from 'stripe';
import mongoose from "mongoose";
import { IReview } from "controllers/entities/ReviewRatingEntity";


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
  async reviewSubmiting(
    labor: ILaborer,
    user : IUser,
    rating: string,
    feedback: string,
    imageUrls: string[]): Promise<IBooking | null> {
    try {

       const numericRating = parseFloat(rating);
    
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        throw new Error('Invalid rating value');
      }

      const booking = await Booking.findOne({
        laborId: labor?._id,
        status: { $ne: 'canceled' },
      })

       if (!booking) {
        throw new Error('Active booking not found');  
      }

      // const user = booking.userId as IUser;
      // if (!user) {
      //   throw new Error('User details not found');
      // }

      const newReview: IReview = {
        userId: user._id,
        reviewerProfile : user.ProfilePic,
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

  async getSearchSuggest(query: string): Promise<{ id: string; name: string; category: string; profilePicture: string | null; }[]> {
    try {

      const searchRegex = new RegExp(query, "i");

      const laborers = await Labor.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { categories: searchRegex },
                { skill: searchRegex }
            ]
      })
        .select("-password -refreshToken")
        .limit(10);

        const suggestions = laborers.map(laborer => ({
          id: laborer._id.toString(),  
          name: `${laborer.firstName} ${laborer.lastName}`,
          category: laborer.categories?.length ? laborer.categories[0] : (laborer.skill?.length ? laborer.skill[0] : "Labor"),
          profilePicture: laborer.profilePicture || null,
          ...laborer.toObject() // Convert Mongoose document to plain object
        }));

        return suggestions;
      
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
        throw error;
    }
  }

}


