import { IBooking } from "../../controllers/entities/bookingEntity";
import { IAboutMe, ILaborer } from "../../controllers/entities/LaborEntity";


export interface ILaborSidRepository{
    fetchLabor(laborId: string): Promise<ILaborer | null>
    updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, NewPassword: string): Promise<ILaborer | null>
    fetchLabors(params: {
        latitude: number;
        longitude: number;
        country?: string;
        state?: string;
        city?: string;
        zipCode?: string;
        category?: string;
        sortOrder?: 'asc' | 'desc';
        rating?: number;
    }): Promise<ILaborer[]>;
    aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe> 
  fetchBooking(laborId: string, page: number, limit: number ,filter: object): Promise<{
    bookings: IBooking[],
    total: number,
    completedBookings: number;
    canceledBookings: number;
    totalAmount: number;
    pendingBookings : number
  }>;
    fetchSimilorLabors(latitude: number, longitude: number, categorie: string, laborId: string): Promise<ILaborer[]> 
    fetchBookingDetils(bookingId : string) : Promise<IBooking | null>
    acceptResheduleRequst(bookingId : string ,acceptedBy : string) : Promise<IBooking | null>
    rejectResheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    rejectionReason: string,
    rejectedBy: string,
    requestSentBy : string
  ): Promise<IBooking | null>
  additionalCharge(bookingId: string, amount: number, reason: string): Promise<IBooking | null>
  acceptRequst(bookingId :string) : Promise<IBooking| null>
  rejectRequst(bookingId: string): Promise<IBooking | null>
  fetchExistBooking(data: { userEmail: string; laborEmail: string; }): Promise<IBooking | null> 
}