import { ILaborer } from "../../entities/LaborEntity";
import { IUser } from "../../entities/UserEntity";

export interface IAdminRepository{
    fetch(): Promise<IUser[]>
    laborFound(): Promise<ILaborer[]>
    blockUser(email : string ) : Promise<IUser | null>
    blockLabor(email : string ) : Promise<ILaborer | null>
    unblockUser(email : string ) : Promise<IUser | null>
    unblockLabor(email : string ) : Promise<ILaborer | null>
    approveLabor(email : string ) : Promise<ILaborer | null>
    UnApproveLabor(email : string ) : Promise<ILaborer | null>
}