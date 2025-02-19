import  bycript  from 'bcrypt';
import { IAboutMe, ILaborer } from "controllers/entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import { ILaborService } from "../../services/interface/ILaborServices";
import { IBooking } from 'controllers/entities/bookingEntity';
import { IWallet } from 'controllers/entities/withdrawalRequstEntity';

export class LaborServices implements ILaborService{
    private laborRepsitory: ILaborSidRepository
    
    constructor(laborRepsitory: ILaborSidRepository) {
        this.laborRepsitory = laborRepsitory
    }
    async fetchLaborDetails(LaborId: string): Promise<ILaborer | null> {
        return await this.laborRepsitory.fetchLabor(LaborId)
    }
    async updateLaborProfile(labor: Partial<ILaborer>): Promise<ILaborer | null> {
        return await this.laborRepsitory.updateProfile(labor)
    }
    async updatePassword(email: string, password: string): Promise<ILaborer | null> {
            const bycriptPassword = await  bycript.hash(password, 10)
            return await this.laborRepsitory.updatePassword(email, bycriptPassword)
    }
    async fetchLabor(userLatandLog: { latitude: number; longitude: number; }): Promise<ILaborer[]> {
         try {
      // Call the repository to fetch laborers
      const laborers = await this.laborRepsitory.fetchLabors(userLatandLog);
      return laborers;
    } catch (error) {
      console.error('Error fetching laborers:', error);
      throw new Error('Failed to fetch laborers.');
    }
    }

    async aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe> {
        try {

            return await this.laborRepsitory.aboutMe(data)
            
        } catch (error) {
            console.error('Error AboutMe:', error);
            throw new Error('Failed to Aboute me.');
        }
    }

    async fetchSimilorLabors(latitude: number, logitude: number, categorie: string , laborId: string) {
        return await this.laborRepsitory.fetchSimilorLabors(latitude,logitude,categorie , laborId)
    }

    async walletWithrow(laborId : string,amount: number, bankDetails: { accountNumber: string; bankName: string; ifscCode: string; }): Promise<IWallet | null> {
        return this.laborRepsitory.walletWithrow(
            laborId,
            amount,
            bankDetails
        )
    }
}