import { ILaborer } from "./LaborEntity";
import { IOTP } from "./OtpEntity";
import { IUser } from "./UserEntity";

export interface IAdminAuthStrategy {
    login(credentials: any): Promise<any>;
    logout(token: string, id: string): Promise<any>;
    refreshAccessToken(userId: string): Promise<string | null>;
    register?(data: any): Promise<any>;
    sendOtp?(user: IUser): Promise<any>;
    verifyOtp?(email: string, otp: string): Promise<boolean>
    googleSignIn?(user: Partial<IUser>): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null>
    findUserWithEmail?(email: string): Promise<IUser | null>
    sendForgetOtp?(user: IUser): Promise<IOTP | null>
    isVerify?(user: Partial<IUser>, otp: IOTP): Promise<IOTP | null>
    generateTokenForForgotPassword?(user: Partial<IUser>): Promise<string>;
    decodeAndVerifyToken?(token: string): Promise<Partial<IUser | null>>
    changePassword?(password: string, email: string): Promise<IUser | null>
    resendOtp?(user: IUser): Promise<IOTP | null>
    registerAboutYou?(labor: Partial<ILaborer>): Promise<ILaborer | null> 
    registerProfile?(labor: Partial<ILaborer>): Promise<ILaborer | null>
    registerExperience?(labor: Partial<ILaborer>): Promise<{ labor: ILaborer; accessToken: string; refreshToken: string }>
}