import { ILaborer } from "../../entities/LaborEntity";

export interface ILaborRepository{
    createLabor(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updateLabor(laborId: string, updates: Partial<ILaborer>): Promise<ILaborer | null>
    findByEmail(email: string): Promise<ILaborer | null>
    saveRefreshToken(laborId: string, refreshToken: string): Promise<ILaborer | null>
    removeRefreshToken(laborId: string, refreshToken: string): Promise<ILaborer | null>;
} 