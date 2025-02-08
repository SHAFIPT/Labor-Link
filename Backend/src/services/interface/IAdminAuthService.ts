import { IAdmin } from "../../controllers/entities/adminEntity"
import jwt, { JwtPayload } from 'jsonwebtoken';
export interface IAdminAuthService{
    login(admin: Partial<IAdmin>): Promise<{ admin: IAdmin; accessToken: string; refreshToken: string }>
    logout(token: string, id: string): Promise<IAdmin | null>;
    refreshAccessToken(user: string | jwt.JwtPayload) : Promise <string | null>;
} 