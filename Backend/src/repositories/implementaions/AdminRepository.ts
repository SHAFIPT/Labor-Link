import User from "../../models/userModel";
import { IUser } from "../../controllers/entities/UserEntity";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ILaborer } from "../../controllers/entities/LaborEntity";
import Labor from "../../models/LaborModel";
import { IBooking } from "controllers/entities/bookingEntity";
import Booking from "../../models/BookingModal";

export class AdminRepositooy implements IAdminRepository {
  async fetch(
    query: string = "",
    skip: number,
    perPage: number,
    filter: string
  ): Promise<IUser[]> {
    try {
      let searchQuery: any = {};

      // Apply search query if provided
      if (query) {
        searchQuery.$or = [
          { firstName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ];
      }

      console.log("joooooooooooooooooooooi", filter);

      if (filter === "Active") {
        searchQuery.isBlocked = false;
      } else if (filter === "InActive") {
        searchQuery.isBlocked = true;
      }

      const users = await User.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .select("-password -refreshToken -__v");
      if (!users) {
        throw new ApiError(404, "User find errror occuded ");
      }
      return users;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch users",
        error.message,
        error.stack
      );
    }
  }

  async laborFound(
    query: string = "",
    skip: number,
    perPage: number,
    filter: string
  ): Promise<ILaborer[]> {
    try {
      // Use regex search instead of text search for more flexibility
      let searchQuery: any = {};
      if (query) {
        searchQuery.$or = [
          { firstName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ];
      }

      if (filter === "pending") {
        searchQuery.status = "pending";
      } else if (filter === "approved") {
        searchQuery.status = "approved";
      } else if (filter === "rejected") {
        searchQuery.status = "rejected";
      }

      const labors = await Labor.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .select("-password -refreshToken -__v");

      if (!labors) {
        throw new ApiError(404, "labors find error occurred");
      }
      return labors;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch labors",
        error.message,
        error.stack
      );
    }
  }

  async blockUser(email: string): Promise<IUser | null> {
    try {
      const blockUser = await User.findOneAndUpdate(
        { email: email },
        { isBlocked: true },
        { new: true }
      );

      if (!blockUser) {
        throw new ApiError(404, "User not found");
      }

      return blockUser;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to block the user",
        error.message,
        error.stack
      );
    }
  }

  async unblockUser(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { isBlocked: false },
        { new: true } // Return the updated user document
      );
      return user;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to unblock the user",
        error.message,
        error.stack
      );
    }
  }

  async blockLabor(email: string): Promise<ILaborer | null> {
    try {
      const blockLabor = await Labor.findOneAndUpdate(
        { email: email },
        { isBlocked: true },
        { new: true }
      );

      if (!blockLabor) {
        throw new ApiError(404, "User not found");
      }

      return blockLabor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to block the user",
        error.message,
        error.stack
      );
    }
  }

  async unblockLabor(email: string): Promise<ILaborer | null> {
    try {
      const labor = await Labor.findOneAndUpdate(
        { email },
        { isBlocked: false },
        { new: true } // Return the updated user document
      );
      return labor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to unblock the user",
        error.message,
        error.stack
      );
    }
  }

  async approveLabor(email: string): Promise<ILaborer | null> {
    try {
      const labor = await Labor.findOneAndUpdate(
        { email },
        { isApproved: true, status: "approved" },
        { new: true }
      );
      return labor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to approve the user",
        error.message,
        error.stack
      );
    }
  }
  async UnApproveLabor(email: string): Promise<ILaborer | null> {
    try {
      const labor = await Labor.findOneAndUpdate(
        { email },
        { isApproved: false },
        { new: true }
      );
      return labor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to UnApproveLabor the user",
        error.message,
        error.stack
      );
    }
  }
  async existLabor(email: string): Promise<ILaborer | null> {
    try {
      const labor = await Labor.findOne({ email });
      if (!labor) {
        throw new ApiError(500, "Labor not found....!");
      }
      return labor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to find labor",
        error.message,
        error.stack
      );
    }
  }

  async updateStatus(email: string): Promise<ILaborer | null> {
    try {
      const labor = await Labor.findOneAndUpdate(
        { email },
        { status: "rejected" },
        { new: true }
      ).select("-password -refreshToken  -__v");

      if (!labor) {
        throw new ApiError(404, "Labor not found for status update.");
      }

      return labor;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to update labor status.",
        error.message,
        error.stack
      );
    }
  }

  async getLabourTotalCount(query: string): Promise<number> {
    try {
      const searchQuery = query
        ? {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
            ],
          }
        : {};

      const count = await Labor.countDocuments(searchQuery);
      return count;
    } catch (error) {
      console.error("Repository error getting labor count:", error);
      throw new Error("Failed to get labor count from database");
    }
  }
  async getTotalUsersCount(query: string): Promise<number> {
    try {
      const searchQuery = query
        ? {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
            ],
          }
        : {};

      const count = await User.countDocuments(searchQuery);
      return count;
    } catch (error) {
      console.error("Repository error getting user count:", error);
      throw new Error("Failed to get user count from database");
    }
  }
  async deleteLabor(email: string): Promise<ILaborer | null> {
    try {
      const deleteLabor = await Labor.findOneAndDelete({ email });

      return deleteLabor;
    } catch (error) {
      console.error("Repository error delete labor:", error);
      throw new Error("Failed to delete labor");
    }
  }
  async fetchLaborBookins(
    laborId: string,
    page: number,
    limit: number,
    filter?: string
  ): Promise<{ bookings: IBooking[]; total: number }> {
    try {
      let query = { laborId };

      // if (filter) {
      //   query.status = filter
      // }

      const total = await Booking.countDocuments(query);
      const bookings = await Booking.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        

      return { bookings, total };
    } catch (error) {
      console.error("Repository error fetch bookins:", error);
      throw new Error("Failed to fetch labor bookings");
    }
  }
  async fetchAllBookings(
    page: number,
    limit: number,
    filter?: string
  ): Promise<{
    bookings: IBooking[];
    total: number;
    totalLabors: number;
    totalUsers: number;
    totalAmount: number;
    bookingStats: {
      completed: number;
      inProgress: number;
      pending: number;
      cancelled: number;
      paid: number;
      paymentPending: number;
      paymentFailed: number;
      monthlyEarnings: Array<{ month: string; earnings: number }>;
    };
  }> {
    try {
      const query: any = {};

      console.log('This si the filter  ss',filter)

      // Apply filter if needed
       if (filter === "confirmed") {
        query.status = "confirmed";
      } else if (filter === "completed") {
        query.status = "completed";
      } else if (filter === "canceled") {
        query.status = "canceled";
      }

      // Get total bookings count
      const total = await Booking.countDocuments(query);

      // Fetch paginated bookings
      const bookings = await Booking.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })  
        .populate({
          path: "laborId", // Field to populate
          select: "firstName lastName  phone  categories profilePicture address", // Fields to include from the Labor schema
        }) 
      
      const statusCounts = await Booking.aggregate([
        {
          $group: {
            _id: '$status',  // Group by status field instead of null
            count: { $sum: 1 }
          }
        }
      ]);

      const paymentCounts = await Booking.aggregate([
        {
          $group: {
            _id: '$paymentStatus',  // Fixed typo in paymentStatus
            count: { $sum: 1 }
          }
        }
      ]);

      const monthlyEarnings = await Booking.aggregate([
      {
        $match: { 
          status: 'completed',
          'paymentDetails.totalAmount': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          earnings: { $sum: '$paymentDetails.totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $substr: [
                  { $cond: [{ $lt: ['$_id.month', 10] }, 
                    { $concat: ['0', { $toString: '$_id.month' }] },
                    { $toString: '$_id.month' }
                  ]},
                  0,
                  2
                ]
              }
            ]
          },
          earnings: 1
        }
      },
      {
        $limit: 12
      }
    ]);

      // Get total amount of completed bookings
      const totalAmountResult = await Booking.aggregate([
        {
          $match: { 
            status: 'completed',
            'paymentDetails.totalAmount': { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$paymentDetails.totalAmount' }
          }
        }
      ]);

      const totalAmount =
        totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

      const totalUsers = await User.countDocuments();

      const totalLabors = await Labor.countDocuments({
        currentStage: "experience",
      });

       const bookingStats = {
        completed: statusCounts.find(s => s._id === 'completed')?.count || 0,
        inProgress: statusCounts.find(s => s._id === 'in-progress')?.count || 0,
        pending: statusCounts.find(s => s._id === 'confirmed')?.count || 0,
        cancelled: statusCounts.find(s => s._id === 'canceled')?.count || 0,
        paid: paymentCounts.find(p => p._id === 'paid')?.count || 0,
        paymentPending: paymentCounts.find(p => p._id === 'pending')?.count || 0,
        paymentFailed: paymentCounts.find(p => p._id === 'failed')?.count || 0,
        monthlyEarnings
      };

      return {
        bookings,
        total,
        totalLabors,
        totalUsers,
        totalAmount,
        bookingStats
      };
    } catch (error) {
      console.error("Repository error fetching bookings:", error);
      throw new Error("Failed to fetch labor bookings");
    }
  }
}   