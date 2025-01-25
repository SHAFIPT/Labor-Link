import { ILaborer } from "../../entities/LaborEntity";


export interface ILaborSidRepository{
    fetchLabor(laborId: string): Promise<ILaborer | null>
    updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, NewPassword: string): Promise<ILaborer | null>
    fetchLabors(userLatandLog: { latitude: number; longitude: number }): Promise<ILaborer[]>;
    aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<void>
}