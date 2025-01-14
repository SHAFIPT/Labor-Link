import  bcrypt  from 'bcrypt';
import { IAdmin } from "../../entities/adminEntity";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepositoy } from "../../repositories/interface/IAdminAuthRepositoy";
import { IAdminService } from "../interface/IAdminAuthService";
import { generateAccessToken } from '../../utils/tokenUtils';


export class AdminService implements IAdminService{
    private adminRepository: IAdminRepositoy
    
    constructor(adminRepository: IAdminRepositoy) {
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
            admin: foundAdmin, // Return the found admin object
            accessToken, 
            refreshToken 
        };
        }
    }

}