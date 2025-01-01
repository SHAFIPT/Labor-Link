import { IOTP } from 'entities/OtpEntity'
import { IUser } from 'entities/UserEntity'

export interface IOTPRepository{
    createOtp(user: IUser): Promise<IOTP | null>
    findOtpByEmail(email: string): Promise<IOTP | null>
    updateOtpAttempts(otpId: string, attempts: number): Promise<IOTP | null>
    updateOtpResendCount(otpId: string, reSendCount: number): Promise<IOTP | null>
    updateOtpExpiration(otpId: string, expirationTime: Date): Promise<IOTP | null>
    deleteOtp(otpId: string): Promise<IOTP | null>
    findOtpById(otpId: string): Promise<IOTP | null>
    resetOtp(user: IUser): Promise<IOTP | null>
}