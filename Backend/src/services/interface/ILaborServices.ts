import { IAboutMe, ILaborer } from "../../entities/LaborEntity";


export interface ILaborService{
    fetchLaborDetails(LaborId: string): Promise<ILaborer | null>
    updateLaborProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, password: string): Promise<ILaborer | null>
    fetchLabor(params: {
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
    aboutMe(data: { userId: string;  name: string; experience: string; description: string; }): Promise<IAboutMe> ;
}