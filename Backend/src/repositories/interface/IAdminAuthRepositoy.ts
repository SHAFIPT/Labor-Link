import { IAdmin } from "../../controllers/entities/adminEntity";

export interface IAdminAuthRepositoy {
    findByEmail(admin: Partial<IAdmin>): Promise<IAdmin | null>
    createAdmin(admin: Partial<IAdmin>): Promise<IAdmin | null>
    saveRefreshToken(adminId: string, refreshToken: string): Promise<IAdmin | null>;
    removeRefreshToken(AdminId: string, refreshToken: string): Promise<IAdmin | null>;
    findById(userId: string): Promise<IAdmin | null>;
}