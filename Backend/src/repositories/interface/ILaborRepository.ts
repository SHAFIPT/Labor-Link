import { IOTP } from "../../entities/OtpEntity";
import { ILaborer } from "../../entities/LaborEntity";

export interface ILaborRepository {
    createLabor(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updateLabor(laborId: string, updates: Partial<ILaborer>): Promise<ILaborer | null>
    findByEmail(email: string): Promise<ILaborer | null>
    saveRefreshToken(laborId: string, refreshToken: string): Promise<ILaborer | null>
    removeRefreshToken(laborId: string, refreshToken: string): Promise<ILaborer | null>;
    findByUserEmil(email: string): Promise<ILaborer | null>
    createOtp(user: ILaborer): Promise<IOTP | null>
    findOTP(user: Partial<ILaborer>): Promise<IOTP> | null;
    changePassword(password: string, email: string): Promise<ILaborer | null>;
    findById(laborId: string): Promise<ILaborer | null>;
} 