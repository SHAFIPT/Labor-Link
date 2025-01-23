import { ILaborer } from "../../entities/LaborEntity";


export interface ILaborSidRepository{
    fetchLabor(laborId: string): Promise<ILaborer | null>
    updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email : string , NewPassword : string) : Promise<ILaborer | null>
}