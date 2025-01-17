import { ILaborer } from "../../entities/LaborEntity"

export interface ILaborAuthSerives {
    registerAboutYou(labor: Partial<ILaborer>): Promise<ILaborer | null> 
    registerProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    registerExperience(labor: Partial<ILaborer>): Promise<{ labor: ILaborer; accessToken: string; refreshToken: string }>
    logout(token: string, id: string): Promise<ILaborer | null>;
    login(labor: Partial<ILaborer>): Promise<{ accessToken: string; refreshToken: string, LaborFound: Omit<ILaborer, "password">; }>
} 
