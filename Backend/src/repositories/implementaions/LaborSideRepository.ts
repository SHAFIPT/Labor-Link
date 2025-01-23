import { ILaborer } from "entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import Labor from "../../models/LaborModel";

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
    async updatePassword(email: string, NewPassword: string): Promise<ILaborer | null> {
        return await Labor.findOneAndUpdate(
            { email }, // Query by email
            { $set: { password: NewPassword } }, // Update password field
            { new: true } // Return the updated document
        );
    }
}