import  bcrypt  from 'bcrypt';
import { IAdmin } from "../../controllers/entities/adminEntity";
import { ApiError } from "../../middleware/errorHander";
import { IAdminAuthRepositoy } from "../../repositories/interface/IAdminAuthRepositoy";
import { IAdminAuthService } from "../interface/IAdminAuthService";
import { generateAccessToken } from '../../utils/tokenUtils';


export class AdminService implements IAdminAuthService{
    private adminRepository: IAdminAuthRepositoy
    
    constructor(adminRepository: IAdminAuthRepositoy) {
        this.adminRepository = adminRepository
    }

    async login(admin: Partial<IAdmin>): Promise<{ admin: IAdmin; accessToken: string; refreshToken: string }> {
        const { email, password } = admin;

        const foundAdmin = await this.adminRepository.findByEmail({ email });

        if (foundAdmin && (
           await bcrypt.compare(password, foundAdmin.password)
        )) {
            const id = foundAdmin._id;

            const accessToken = generateAccessToken({
                id,
                role : foundAdmin.role
            })
            const refreshToken = generateAccessToken({
                id,
                role : foundAdmin.role
            })

            await this.adminRepository.saveRefreshToken(id, refreshToken);

            return { 
            admin: foundAdmin,
            accessToken, 
            refreshToken 
        };
        }
    }
    async logout(token: string, id: string): Promise<IAdmin | null> {
        const admin = await this.adminRepository.removeRefreshToken(id, token)
        return admin ? admin : null
    }

    async refreshAccessToken(userId:string): Promise <string| null> {
        
        const adminFound  = await this.adminRepository.findById(userId)


        if(adminFound){
            const id = adminFound._id?.toString();
            
            const accessToken = generateAccessToken({
                id,
                role: adminFound.role,
            });

            return accessToken
        }
        return null
    }

}