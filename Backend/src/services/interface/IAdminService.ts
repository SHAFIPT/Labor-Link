import { ILaborer } from "../../entities/LaborEntity";
import { IUser } from "../../entities/UserEntity";


export interface IAdminService {
    fetchUsers(): Promise<IUser[]>;
    fetchLabors(): Promise<ILaborer[]>;
    blockUser(email: string): Promise<IUser | null>;
    unblockUser(email: string): Promise<IUser | null>;
    blockLabor(email: string): Promise<ILaborer | null>;
    unblockLabor(email: string): Promise<ILaborer | null>;
    approveLabor(email: string): Promise<ILaborer | null>;
    UnApproveLabor(email: string): Promise<ILaborer | null>;
    existLaborAndSendMail(email: string , reason : string): Promise<ILaborer | null>;
}
