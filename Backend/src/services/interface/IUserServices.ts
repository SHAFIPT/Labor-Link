import { ILaborer } from "../../entities/LaborEntity";
import { IBooking } from "../../entities/bookingEntity";
import { IUser } from "../../entities/UserEntity";


export interface IUserServices {
    fetchUserDetails(userId: string): Promise<IUser | null>
    UpdateUser(user: Partial<IUser>): Promise<IUser | null>
    updatePassword(email: string, password: string): Promise<IUser | null>
    bookingLabor(bookingDetails: Partial <IBooking>): Promise<IBooking | null>;
    fetchLaborId(email : string): Promise<string | null>;
}