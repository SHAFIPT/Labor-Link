import { ILaborer } from "../../entities/LaborEntity";
import { IBooking } from "../../entities/bookingEntity";
import { IUser } from "../../entities/UserEntity";


export interface IUserSideRepository{
    fetchUser(userId : string) : Promise<IUser | null>
    profileUpdate(userData: IUser): Promise<IUser | null>
    updatePassword(email: string, NewPassword: string): Promise<IUser | null>
    createBooking(bookingDetails: Partial <IBooking>): Promise<IBooking | null>;
    fetchLaborId(email : string): Promise<string | null>;
}                