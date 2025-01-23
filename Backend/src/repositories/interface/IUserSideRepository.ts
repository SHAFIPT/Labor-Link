import { IUser } from "../../entities/UserEntity";


export interface IUserSideRepository{
    fetchUser(userId : string) : Promise<IUser | null>
    profileUpdate(userData: IUser): Promise<IUser | null>
    updatePassword(email : string , NewPassword : string) : Promise<IUser | null>
}