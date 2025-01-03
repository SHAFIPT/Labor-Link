import { IOTP } from "../../entities/OtpEntity";
import { IUser } from "../../entities/UserEntity";
import { IOTPRepository } from "../../repositories/interface/IOTPRepository";
import otpModel from "../../models/otpModel";

export default class OTPRepository implements IOTPRepository{
    async createOtp(user: IUser): Promise<IOTP | null> {
        const otp = this.generateOtp()
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10)
        
        const newOtp = new otpModel({
            email: user.email,
            otp: otp,
            expirationTime: expirationTime,
            attempts: 0,
            reSendCount: 0, 
            lastResendTime: null,
            role: user.role
        })

        await newOtp.save()
        return newOtp;

    }

    async findOtpByEmail(email: string): Promise<IOTP | null> {
        return otpModel.findOne({email})
    }

    async updateOtpAttempts(otpId: string, attempts: number): Promise<IOTP | null> {
        return otpModel.findByIdAndUpdate(otpId, { attempts }, { new: true })
    }

    async updateOtpResendCount(otpId: string, reSendCount: number): Promise<IOTP | null> {
        return otpModel.findByIdAndUpdate(otpId, { reSendCount }, { new: true })
    }

    async updateOtpExpiration(otpId: string, expirationTime: Date): Promise<IOTP | null> {
        return otpModel.findByIdAndUpdate(otpId, { expirationTime }, { new: true })
    }

    async deleteOtp(otpId: string): Promise<IOTP | null> {
        return otpModel.findByIdAndDelete(otpId)
    }

    async findOtpById(otpId: string): Promise<IOTP | null> {
        return otpModel.findById(otpId)
    }

    async resetOtp(user: IUser): Promise<IOTP | null> {
        const existOtp = await this.findOtpByEmail(user.email)
        if (existOtp) {
            await this.deleteOtp(existOtp._id.toString());
        }
        return this.createOtp(user)
    }

    private generateOtp(): string{
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
}