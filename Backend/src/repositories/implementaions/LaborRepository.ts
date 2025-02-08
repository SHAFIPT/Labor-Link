import { ILaborer } from "../../controllers/entities/LaborEntity";
import { ILaborRepository } from "../../repositories/interface/ILaborRepository";
import { ApiError } from "../../middleware/errorHander";
import Labor from "../../models/LaborModel";
import otpModel from "../../models/otpModel";
import { IOTP } from "../../controllers/entities/OtpEntity";

export class LaborRepository implements ILaborRepository {
  async findByEmail(email: string): Promise<ILaborer | null> {
    return await Labor.findOne({ email });
  }
   
  async createLabor(labor: Partial<ILaborer>): Promise<ILaborer | null> {
    try {
      const newLabor = new Labor(labor);
      console.log("this is my newLabor:", newLabor);
      return await newLabor.save();
    } catch (error) {
      console.error("Error in create user :", error);
      throw new ApiError(500, "Failed to create user.");
    }
  }

  async updateLabor(
    laborId: string,
    updates: Partial<ILaborer>
  ): Promise<ILaborer | null> {
    try {
      return await Labor.findByIdAndUpdate(laborId, updates, {
        new: true,
      }).select("-password");
    } catch (error) {
      console.error("Error in updateLabor repository:", error);
      throw new ApiError(500, "Failed to update laborer.");
    }
  }

  async saveRefreshToken(
    laborId: string,
    refreshToken: string
  ): Promise<ILaborer | null> {
    try {
      return await Labor.findByIdAndUpdate(laborId, {
        $push: { refreshToken: refreshToken },
      }).select("-password");
    } catch (error) {
      console.error("Error in saving RefreshToken", error);
      throw new ApiError(500, "Failed to saving RefreshToken.");
    }
  }

  async removeRefreshToken(
    laborId: string,
    refreshToken: string
  ): Promise<ILaborer | null> {
    try {
      const resoponce = await Labor.findByIdAndUpdate(
        { _id: laborId },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");

      return resoponce;
    } catch (error) {
      console.error("Error in Logout :", error);
      throw new ApiError(500, "Failed to logout");
    }
  }

  async findByUserEmil(email: string): Promise<ILaborer | null> {
    try {
      const userfind = await Labor.findOne({ email });

      return userfind;
    } catch (error) {
      console.error("Error in forgetPasswordOtp send :", error);
      throw new ApiError(500, "Failed to forgetPasswordOtp send.");
    }
  }

  async createOtp(user: ILaborer): Promise<IOTP | null> {
    const otp = this.generateOtp();
    const expirationTime = new Date(Date.now() + 1 * 60000);

    const newOtp = new otpModel({
      email: user.email,
      otp: otp,
      expirationTime: expirationTime,
      attempts: 0,
      reSendCount: 0,
      lastResendTime: null,
      role: user.role,
    });

    await newOtp.save();
    return newOtp;
  }
  async findOTP(user: Partial<ILaborer>): Promise<IOTP | null> {
    const OTPFound = await otpModel
      .findOne({ email: user.email })
      .sort({ createdAt: -1 });
    if (OTPFound) {
      return OTPFound;
    }
    return null;
  }
  async changePassword(
    password: string,
    email: string
  ): Promise<ILaborer | null> {
    try {
      const updatePassword = await Labor.findOneAndUpdate(
        { email: email }, // Query by email
        { $set: { password: password } }, // Update password
        { new: true } // Return the updated document
      );
      return updatePassword;
    } catch (error) {
      console.error("Error in resetNew password :", error);
      throw new ApiError(500, "Failed to forgetPasswordOtp send.");
    }
  }
  async findById(laborId: string): Promise<ILaborer | null> {
    const userData = await Labor.findOne({ _id: laborId });

    return userData;
  }
  private generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}