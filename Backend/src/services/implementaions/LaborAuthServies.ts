import { ILaborer } from "../../entities/LaborEntity";
import { ILaborAuthSerives } from "../../services/interface/ILaborAuthServies";
import bycript from 'bcrypt'
import Labor from "../../models/LaborModel";
import { ILaborRepository } from '../../repositories/interface/ILaborRepository';

export class LaborAuthServies implements ILaborAuthSerives{
   private laborRepository : ILaborRepository

    
    constructor(laborRepository: ILaborRepository) {
        this.laborRepository = laborRepository
    }

    async registerAboutYou(labor: Partial<ILaborer>): Promise<ILaborer | null> {
        try {

             if (!labor.email) {
            throw new Error('Email is required');
        }

        const existingLabor = await this.laborRepository.findByEmail(labor.email)
        
            if (existingLabor) {
                return this.laborRepository.updateLabor(existingLabor._id, {
                    ...labor,
                    currentStage: 'aboutYou',
                }); 
            } else {
                if (labor.password) {
                    labor.password = await bycript.hash(labor.password , 10)
                }
                return this.laborRepository.createLabor({
                    ...labor,
                    currentStage: 'aboutYou',
                });
            }

        } catch (error) {
            console.error("Error in registerAboutYou service:", error);
            throw error;
        }
    }
}