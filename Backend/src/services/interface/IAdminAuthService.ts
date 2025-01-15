import { IAdmin } from "../../entities/adminEntity"
export interface IAdminAuthService{
    login(admin: Partial<IAdmin>): Promise<{ admin: IAdmin; accessToken: string; refreshToken: string }>
    logout(token:string , id: string) : Promise <IAdmin | null>;
} 