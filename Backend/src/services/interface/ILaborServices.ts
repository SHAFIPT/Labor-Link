import { IBooking } from "../../controllers/entities/bookingEntity";
import { IAboutMe, ILaborer } from "../../controllers/entities/LaborEntity";


export interface ILaborService{
    fetchLaborDetails(LaborId: string): Promise<ILaborer | null>
    updateLaborProfile(labor: Partial<ILaborer>): Promise<ILaborer | null>
    updatePassword(email: string, password: string): Promise<ILaborer | null>
    fetchLabor(params: {
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
  aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe>;
  fetchBookings(laborId: string, page: number, limit: number, filter: object): Promise<{
    bookings: IBooking[],
    total: number,
    completedBookings: number;
    canceledBookings: number;
    totalAmount: number;
    pendingBookings : number
  }>
  fetchSimilorLabors(latitude: number, longitude: number, categorie: string, laborId: string): Promise<ILaborer[]>
  fetchBookingDetils(bookingId :string) : Promise<IBooking| null>
  acceptRequst(bookingId :string) : Promise<IBooking| null>
  rejectRequst(bookingId :string) : Promise<IBooking| null>
  acceptResheduleRequst(bookingId :string , acceptedBy : string) : Promise<IBooking| null>
  rejectResheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    rejectionReason: string,
    rejectedBy: string,
    requestSentBy : string
  ): Promise<IBooking | null>
  additionalCharge(bookingId: string, amount : number , reason : string) : Promise<IBooking | null>
}