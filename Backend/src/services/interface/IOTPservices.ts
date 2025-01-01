import { IUser } from "entities/UserEntity";
import { IOTP } from "entities/OtpEntity"

export interface IOTPservices{
    sendOtp(user: IUser): Promise<IOTP | null>
    verifyOtp(user: IUser, otp: string): Promise<boolean>
    checkOTPExists(user: Partial<IUser>): Promise<IOTP | null>
    resendOtp(user: IUser): Promise<IOTP | null>
}