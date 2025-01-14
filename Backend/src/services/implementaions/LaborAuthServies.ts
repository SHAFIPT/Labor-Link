import { ILaborer } from "../../entities/LaborEntity";
import { ILaborAuthSerives } from "../../services/interface/ILaborAuthServies";
import bycript from 'bcrypt'
import Labor from "../../models/LaborModel";
import { ILaborRepository } from '../../repositories/interface/ILaborRepository';
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils";
import { ApiError } from "../../middleware/errorHander";

export class LaborAuthServies implements ILaborAuthSerives{
   private laborRepository : ILaborRepository

    
    constructor(laborRepository: ILaborRepository) {
        this.laborRepository = laborRepository
    }

    async login(labor: Partial<ILaborer>): Promise<{ accessToken: string; refreshToken: string; LaborFound: Omit<ILaborer, "password">; }> {
        try {

            if (!labor.email) {
                throw new Error('Email is required');
            }    

            const LaborFound= await this.laborRepository.findByEmail(labor.email.toString())

            if (!LaborFound) {
                console.log('Invalid credentials...')
                return null
            }

            const compairPassword = await bycript.compare(labor.password.toString(), LaborFound.password.toString())
            
            if (!compairPassword) {
                // throw new ApiError(401, 'Invalid Credentials', 'Incorrect password. Please try again.');
                return null
            }

            const accessToken = generateAccessToken({
                id: LaborFound.id,
                role : LaborFound.role
            })

            const refreshToken = generateRefreshToken({
                id: LaborFound.id,
                role : LaborFound.role
            })

            const userWithNewToken = await this.laborRepository.saveRefreshToken(LaborFound.id, refreshToken);

            return {
                accessToken,
                refreshToken,
                LaborFound : userWithNewToken
            }
            
        } catch (error) {
            if (!(error instanceof ApiError)) {
                throw new ApiError(500, 'Server Error', error.message, error.stack);
            }
            throw error;
        }
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

    async registerExperience(labor: Partial<ILaborer>): Promise<{ labor: ILaborer; accessToken: string; refreshToken: string }> {
    try {
        const isExistOfLabor = await this.laborRepository.findByEmail(labor.email);

        console.log('Existing laborer:', isExistOfLabor);

        if (isExistOfLabor) {
            const updatedLabor = await this.laborRepository.updateLabor(isExistOfLabor._id, {
                ...labor,
                currentStage: 'experience',
                profileCompletion : true
            });

            if (updatedLabor?.currentStage === 'experience') {
                const accessToken = generateAccessToken({
                    id: updatedLabor.id, // Ensure `id` exists
                    role: updatedLabor.role, // Ensure `role` exists
                });

                const refreshToken = generateRefreshToken({
                    id: updatedLabor.id,
                    role: updatedLabor.role,
                });

                // Save the refresh token to the database
                const LaborAfterSavedToken = await this.laborRepository.saveRefreshToken(updatedLabor._id, refreshToken);

                return {
                    labor: LaborAfterSavedToken,
                    accessToken,
                    refreshToken,
                };
            } else {
                throw new Error('Failed to update labor current stage.');
            }
        } else {
            throw new Error('Laborer not found.');
        }
    } catch (error) {
        console.error('Error occurred during registerExperience:', error);
        throw error;
    }
    } 

    async logout(token: string, id: string): Promise<ILaborer | null> {
        const labor = await this.laborRepository.removeRefreshToken(id, token)
        return labor ? labor : null
    }
}