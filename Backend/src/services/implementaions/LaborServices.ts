import  bycript  from 'bcrypt';
import { ILaborer } from "entities/LaborEntity";
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
}