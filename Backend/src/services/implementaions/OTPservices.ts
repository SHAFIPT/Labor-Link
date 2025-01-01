import { IOTPservices } from "services/interface/IOTPservices";
import OTPRepository from "repositories/implementaions/OTPRepository";
import { IOTPRepository } from "repositories/interface/IOTPRepository";
import { sendEmailOtp } from "utils/emailService";
import { IOTP } from 'entities/OtpEntity';
import { IUser } from 'entities/UserEntity';

export default class OTPservices implements IOTPservices{
    private otpRepository: IOTPRepository;
    private sendEmailOtp: (email: string, otp: string) => Promise<boolean>;
    
    constructor(otpRepository: IOTPRepository, sendEmailOtp: (email: string, otp: string) => Promise<boolean>) {
        this.otpRepository = otpRepository;
        this.sendEmailOtp = sendEmailOtp
    }

    checkOTPExists(user: Partial<IUser>): Promise<IOTP | null> {
        return this.otpRepository.findOtpByEmail(user.email)
    }

    async sendOtp(user: IUser): Promise<IOTP | null> {


        const existOtp = await this.checkOTPExists(user)
        if (existOtp) {
            throw new Error('OTP already sent . Pleace verify or request a new one .')
        }

        const newOTp = await this.otpRepository.createOtp(user); 
        if (!newOTp) {
            throw new Error('Faild to generate the OTP..!')
        }

        const sendOTP = await this.sendEmailOtp(user.email, newOTp.otp);
        if (!sendOTP) {
            throw new Error('Faild to send the otp to the user ')
        } 

        return newOTp
    } 

    async verifyOtp(user: IUser, otp: string): Promise<boolean> {
        const existOTP = await this.otpRepository.findOtpByEmail(user.email)
        if (!existOTP) {
            throw new Error('OTP not found for the user...')
        }
        if (new Date() > new Date(existOTP.expirationTime)) {
            throw new Error('OTP is expired')
        }
        if (existOTP.otp !== otp) {
            throw new Error("Invalid otp ")
        }
        return true
    }

    async resendOtp(user: IUser): Promise<IOTP | null> {
        const existOTp = await this.checkOTPExists(user)
        if (!existOTp) {
            throw new Error('NO OTP found for this user')
        }
        if (existOTp.reSendCount >= 3) {
            throw new Error('Your have exceed the maximum no of OTP resend!')
        }

        await this.otpRepository.updateOtpResendCount(existOTp._id.toString(), existOTp.reSendCount + 1)
        
        const otpSend = await this.sendEmailOtp(user.email, existOTp.otp)
        if (!otpSend) {
            throw new Error('Faild to resend OTp')
        }
        return existOTp
    }
}