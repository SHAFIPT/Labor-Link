import { ILaborer } from "../../entities/LaborEntity"

export interface ILaborAuthSerives {
    registerAboutYou(labor: Partial<ILaborer>): Promise<ILaborer | null> 
    registerProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
} 