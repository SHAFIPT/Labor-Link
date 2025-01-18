import { ILaborer } from "../../entities/LaborEntity";
import { IUser } from "../../entities/UserEntity";


export interface IAdminService {
    fetchUsers(): Promise<IUser[]>;
    fetchLabors(query: string , skip: number, perPage: number): Promise<ILaborer[]>;
    blockUser(email: string): Promise<IUser | null>;
    unblockUser(email: string): Promise<IUser | null>;
    blockLabor(email: string): Promise<ILaborer | null>;
    unblockLabor(email: string): Promise<ILaborer | null>;
    approveLabor(email: string): Promise<ILaborer | null>;
    UnApproveLabor(email: string): Promise<ILaborer | null>;
    existLaborAndSendMail(email: string, reason: string): Promise<ILaborer | null>;
    getTotalLaborsCount(query: string): Promise<number>;
    deleteLabor(email: string): Promise<ILaborer | null>;
}
