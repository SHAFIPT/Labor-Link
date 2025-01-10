import { ILaborer } from "../../entities/LaborEntity";

export interface ILaborRepository{
    createLabor(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updateLabor(laborId: string, updates: Partial<ILaborer>): Promise<ILaborer | null>
    findByEmail(email: string): Promise<ILaborer | null>
}