import { ILaborer } from "../../entities/LaborEntity";
import { IUser } from "../../entities/UserEntity";

export interface IAdminRepository{
    fetch(): Promise<IUser[]>
    laborFound(query: string, skip: number, perPage: number): Promise<ILaborer[]>
    blockUser(email : string ) : Promise<IUser | null>
    blockLabor(email : string ) : Promise<ILaborer | null>
    unblockUser(email : string ) : Promise<IUser | null>
    unblockLabor(email : string ) : Promise<ILaborer | null>
    approveLabor(email : string ) : Promise<ILaborer | null>
    UnApproveLabor(email : string ) : Promise<ILaborer | null>
    existLabor(email : string ) : Promise<ILaborer | null>
    getLabourTotalCount(query: string): Promise<number>;
    updateStatus(email: string): Promise<ILaborer | null>
    deleteLabor(email: string): Promise<ILaborer | null>
}    