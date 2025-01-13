import { IAdmin } from "../../entities/adminEntity";
import { ApiError } from "../../middleware/errorHander";
import Admin from "../../models/AdminModal";
import { IAdminRepositoy } from "../../repositories/interface/IAdminRepositoy";


export class AdminRepository implements IAdminRepositoy{

    async findByEmail(admin: Partial<IAdmin>): Promise<IAdmin | null> {
        return await Admin.findOne({email : admin.email})
    }

    async createAdmin(admin: Partial<IAdmin>): Promise<IAdmin | null> {
        try {
            const newAdmin = new Admin(admin)
            console.log('This is the newAdmin :', newAdmin)
            return await newAdmin.save()
        } catch (error) {
            console.error('Error in create Admin :', error);
            throw new ApiError(500, 'Failed to create admin.');
        }
    }

    async saveRefreshToken(adminId: string, refreshToken: string): Promise<IAdmin | null> {
        try {
            return await Admin.findByIdAndUpdate(
                { _id: adminId },
                { $push: { refreshToken: refreshToken } },
                { new: true } 
            ).select("-password -refreshToken");
        } catch (error) {
            console.error('Error in saving refresh token:', error);
            throw new ApiError(500, 'Failed to save refresh token.');
        }
    }

}