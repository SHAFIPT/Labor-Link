import { ILaborer } from "../../entities/LaborEntity";
import { IBooking } from "../../entities/bookingEntity";
import { IUser } from "../../entities/UserEntity";


export interface IUserServices {
    fetchUserDetails(userId: string): Promise<IUser | null>
    UpdateUser(user: Partial<IUser>): Promise<IUser | null>
    updatePassword(email: string, password: string): Promise<IUser | null>
    bookingLabor(bookingDetails: Partial <IBooking>): Promise<IBooking | null>;
    fetchLaborId(email : string): Promise<string | null>;
    fetchBooking(userId: string, page: number, limit: number): Promise<{ bookings: IBooking[], total: number }>;
     cancelBooking(data: { 
        bookingId: string; 
        reason: string; 
        comments: string; 
        isWithin30Minutes: boolean; 
        canceledBy: 'user' | 'labor'
    }): Promise<IBooking | null>;
}

