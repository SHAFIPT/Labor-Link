import { IWallet } from "../../controllers/entities/withdrawalRequstEntity";
import { IBooking } from "../../controllers/entities/bookingEntity";
import { IAboutMe, ILaborer } from "../../controllers/entities/LaborEntity";


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
 

  fetchSimilorLabors(latitude: number, longitude: number, categorie: string, laborId: string): Promise<ILaborer[]>
  

  walletWithrow(
      laborId :string,
      amount: number,
      bankDetails: { accountNumber: string; bankName: string; ifscCode: string }
  ): Promise<IWallet | null>
  
  fetchAllLabor(): Promise<ILaborer[] | null>
}