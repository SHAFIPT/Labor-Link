import { ILaborer } from "../../entities/LaborEntity";
import { ILaborRepository } from "../../repositories/interface/ILaborRepository";
import { ApiError } from "../../middleware/errorHander";
import Labor from "../../models/LaborModel";

export class LaborRepository implements ILaborRepository{

    async findByEmail(email: string): Promise<ILaborer | null> {
        return await Labor.findOne({email})
    }


    async createLabor(labor: Partial<ILaborer>): Promise<ILaborer | null> {
        try {
            
            const newLabor = new Labor(labor)
            console.log('this is my newLabor:',newLabor)
            return await newLabor.save()

        } catch (error) {
            console.error('Error in create user :', error);
            throw new ApiError(500, 'Failed to create user.');
        }
    } 

    async updateLabor(laborId: string, updates: Partial<ILaborer>): Promise<ILaborer | null> {
        try {

            return await Labor.findByIdAndUpdate(laborId , updates ,{new : true})
            
        } catch (error) {
             console.error("Error in updateLabor repository:", error);
            throw new ApiError(500, "Failed to update laborer.");
        }
    }
}