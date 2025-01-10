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
                let bcryptPassword; 
                if (labor.password) {
                     bcryptPassword = await bycript.hash(labor.password , 10)
                }
                console.log('this is let bcryptPassword; :',bcryptPassword)
                return this.laborRepository.createLabor({
                    ...labor,
                    password : bcryptPassword,
                    currentStage: 'aboutYou',
                });
            }

        } catch (error) {
            console.error("Error in registerAboutYou service:", error);
            throw error;
        }
    }

    async registerProfile(labor: Partial<ILaborer>): Promise<ILaborer | null> {
        try {

            const isExistOfLabor = await this.laborRepository.findByEmail(labor.email)

            console.log('this is exisitng userse :',isExistOfLabor)

            if (isExistOfLabor) {
                return this.laborRepository.updateLabor(isExistOfLabor._id, {
                    ...labor,
                    currentStage: 'profile',
                });
            }
        } catch (error) {
            console.error("Error in registerProfile service:", error);
            throw error;
        }
    }
}