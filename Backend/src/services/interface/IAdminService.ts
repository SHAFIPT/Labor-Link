import { IAdmin } from "../../entities/adminEntity"
export interface IAdminService{
    login(admin : Partial<IAdmin>) : Promise<{ admin: IAdmin; accessToken: string; refreshToken: string }>
} 