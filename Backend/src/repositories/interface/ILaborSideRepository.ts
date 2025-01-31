import { IAboutMe, ILaborer } from "../../entities/LaborEntity";


export interface ILaborSidRepository{
    fetchLabor(laborId: string): Promise<ILaborer | null>
    updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, NewPassword: string): Promise<ILaborer | null>
    fetchLabors(params: {
        latitude: number;
        longitude: number;
        country?: string;
        state?: string;
        city?: string;
        zipCode?: string;
        category?: string;
        sortOrder?: 'asc' | 'desc';
        rating?: number;
    }): Promise<ILaborer[]>;
    aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe> 
}