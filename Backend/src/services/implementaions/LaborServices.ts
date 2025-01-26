import  bycript  from 'bcrypt';
import { IAboutMe, ILaborer } from "entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import { ILaborService } from "../../services/interface/ILaborServices";

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
}