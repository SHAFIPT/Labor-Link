import { IOTP } from "../../controllers/entities/OtpEntity";
import { ILaborer } from "../../controllers/entities/LaborEntity"
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ILaborAuthSerives {
    registerAboutYou(labor: Partial<ILaborer>): Promise<ILaborer | null> 
    registerProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    registerExperience(labor: Partial<ILaborer>): Promise<{ labor: ILaborer; accessToken: string; refreshToken: string }>
    logout(token: string, id: string): Promise<ILaborer | null>;
    login(labor: Partial<ILaborer>): Promise<{ accessToken: string; refreshToken: string, LaborFound: Omit<ILaborer, "password">; }>
    findUserWithEmail(email: string): Promise<ILaborer | null>;
    sendForgetOtp(user: ILaborer): Promise<IOTP | null>
    isVerify(user: Partial<ILaborer>, otp: IOTP): Promise<IOTP | null>
    generateTokenForForgotPassword(user: Partial<ILaborer>): string;
    decodeAndVerifyToken(token: string): Promise<Partial<ILaborer | null>>;
    changePassword(password: string, email: string): Promise<ILaborer | null>;
    refreshAccessToken(labor: string | jwt.JwtPayload) : Promise <string | null>;
} 
