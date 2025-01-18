import User from "../../models/userModel";
import { IUser } from "../../entities/UserEntity";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ILaborer } from "../../entities/LaborEntity";
import Labor from "../../models/LaborModel";

export class AdminRepositooy implements IAdminRepository {
  async fetch(): Promise<IUser[]> {
    try {
      const users = await User.find().select("-password -refreshToken -__v");
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

async laborFound(query: string = '', skip: number, perPage: number): Promise<ILaborer[]> {
    try {
        // Use regex search instead of text search for more flexibility
        const filter = query ? {
            $or: [
                { firstName : { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        } : {};

        const labors = await Labor.find(filter)
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
        throw new ApiError(500, 'Failed to unblock the user', error.message, error.stack);
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
        throw new ApiError(500, 'Failed to unblock the user', error.message, error.stack);
    }
  }
  
  async approveLabor(email: string): Promise<ILaborer | null> {
    try {

      const labor = await Labor.findOneAndUpdate(
        { email },
         { isApproved: true, status: 'approved' },
        { new: true }
      )
      return labor
    } catch (error) {
      throw new ApiError(500, 'Failed to approve the user', error.message, error.stack);
    }
  }
  async UnApproveLabor(email: string): Promise<ILaborer | null> {
    try {

      const labor = await Labor.findOneAndUpdate(
        { email },
        { isApproved: false },
        { new: true }
      )
      return labor
      
    } catch (error) {
      throw new ApiError(500, 'Failed to UnApproveLabor the user', error.message, error.stack);
    }
  }
  async existLabor(email: string): Promise<ILaborer | null> {
    try {

      const labor = await Labor.findOne({ email })
      if (!labor) {
        throw new ApiError(500, 'Labor not found....!');
      }
      return labor
      
    } catch (error) {
      throw new ApiError(500, 'Failed to find labor', error.message, error.stack);
    }
  }

  async updateStatus(email: string): Promise<ILaborer | null> {
    try {

      const labor = await Labor.findOneAndUpdate(
        { email },
        { status: 'rejected' },
        {new : true}
      ).select('-password -refreshToken  -__v')

      if (!labor) {
        throw new ApiError(404, 'Labor not found for status update.');
      }

      return labor
      
    } catch (error) {
       throw new ApiError(500, 'Failed to update labor status.', error.message, error.stack);
    }
  }

  async getLabourTotalCount(query: string): Promise<number> {
        try {
            const searchQuery = query
                ? {
                    $or: [
                        { firstName: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } },
                    ]
                }
                : {};

            const count = await Labor.countDocuments(searchQuery);
            return count;
        } catch (error) {
            console.error('Repository error getting labor count:', error);
            throw new Error('Failed to get labor count from database');
        }
    }
    async deleteLabor(email: string): Promise<ILaborer | null> {
      try {

        const deleteLabor = await Labor.findOneAndDelete({ email })
        
        return deleteLabor
        
      } catch (error) {
         console.error('Repository error delete labor:', error);
            throw new Error('Failed to delete labor');
      }
    }
}