import { IAboutMe, ILaborer } from "../../entities/LaborEntity";


export interface ILaborService{
    fetchLaborDetails(LaborId: string): Promise<ILaborer | null>
    updateLaborProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, password: string): Promise<ILaborer | null>
    fetchLabor(userLatandLog: { latitude: number; longitude: number }): Promise<ILaborer[]>;
    aboutMe(data: { userId: string;  name: string; experience: string; description: string; }): Promise<IAboutMe> ;
}