import { IUser } from "../../entities/UserEntity";
import { IAdminService } from "../../services/interface/IAdminService";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ILaborer } from "entities/LaborEntity";

export class AdminService implements IAdminService{
    private adminRepositery: IAdminRepository
    
    constructor(adminRepositery: IAdminRepository) {
        this.adminRepositery = adminRepositery
    }

    async fetchUsers(): Promise<IUser[]>{
        try {

            const userFouned = await this.adminRepositery.fetch()
            if (!userFouned) {
                throw new ApiError(404 , 'User not found for fetch ...!')
            }
            return userFouned
            
        } catch (error) {
            if (!(error instanceof ApiError)) {
                throw new ApiError(500, 'Server Error', error.message, error.stack);
            }
        }
    }

    async fetchLabors(): Promise<ILaborer[]> {
        try {

            const laborFound = await this.adminRepositery.laborFound()
            if (!laborFound) {
                throw new ApiError(404 , 'Labor not found for fetch ...!')
            }
            return laborFound
            
        } catch (error) {
           if (!(error instanceof ApiError)) {
                throw new ApiError(500, 'Server Error', error.message, error.stack);
            } 
        }
    }

    async blockUser(email: string): Promise<IUser | null> {
        return this.adminRepositery.blockUser(email);
    }

    async unblockUser(email: string): Promise<IUser | null> {
        return this.adminRepositery.unblockUser(email);
    }

    async blockLabor(email: string): Promise<ILaborer | null> {
        return this.adminRepositery.blockLabor(email);
    }

    async unblockLabor(email: string): Promise<ILaborer | null> {
        return this.adminRepositery.unblockLabor(email);
    }
    async approveLabor(email: string): Promise<ILaborer | null> {
        return this.adminRepositery.approveLabor(email)
    }
    async UnApproveLabor(email: string): Promise<ILaborer | null> {
        return this.adminRepositery.UnApproveLabor(email)
    }
}
