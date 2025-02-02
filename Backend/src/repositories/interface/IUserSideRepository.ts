import { ILaborer } from "../../entities/LaborEntity";
import { IBooking } from "../../entities/bookingEntity";
import { IUser } from "../../entities/UserEntity";


export interface IUserSideRepository{
    fetchUser(userId : string) : Promise<IUser | null>
    profileUpdate(userData: IUser): Promise<IUser | null>
    updatePassword(email: string, NewPassword: string): Promise<IUser | null>
    createBooking(bookingDetails: Partial <IBooking>): Promise<IBooking | null>;
    fetchLaborId(email: string): Promise<string | null>;
    fetchBooking(userId: string, page: number, limit: number): Promise<{ bookings: IBooking[], total: number }>;
    findBookingById(bookingId: string): Promise<IBooking | null>
    cancelBooking(bookingFound: IBooking, data: {
    reason: string;
    comments: string;
    isWithin30Minutes: boolean;
    canceledBy: 'user' | 'labor'
}): Promise<IBooking | null>
}                