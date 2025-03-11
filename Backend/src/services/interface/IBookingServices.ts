import { IBooking } from "../../controllers/entities/bookingEntity";


export interface IBookingService {
    bookingLabor(bookingDetails: Partial<IBooking>): Promise<IBooking | null>;

    fetchBooking(
    userId: string,
    page: number,
    limit: number,
    filter: object
    ): Promise<{ bookings: IBooking[]; total: number }>;

    cancelBooking(data: {
        bookingId: string;
        reason: string;
        comments: string;
        isWithin30Minutes: boolean;
        canceledBy: "user" | "labor";
    }): Promise<IBooking | null>; 

    updateReadStatus(
    bookingId: string,
    isUserRead: boolean
    ): Promise<IBooking | null>;
    

    fetchBookinById(bookingId: string): Promise<IBooking | null>;
    

  workCompletion(
    bookingId: string,
    updateData: {
      isUserCompletionReported?: boolean;
      isLaborCompletionReported?: boolean;
    }
  ): Promise<IBooking | null>;



  resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: string
  ): Promise<IBooking | null>;

  fetchAllBookings(
    userId: string,
    page: number,
    limit: number,
    filter: object
  ): Promise<{
    bookings: IBooking[];
    total: number;
    completedBookings: number;
    canceledBookings: number;
    totalAmount :number
  }>  
    
    fetchBookingsToLabor(laborId: string, page: number, limit: number, filter: object): Promise<{
    bookings: IBooking[],
    total: number,
    completedBookings: number;
    canceledBookings: number;
    totalAmount: number;
    pendingBookings : number
    }> 
    

    fetchBookingDetils(bookingId: string): Promise<IBooking | null>
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
    additionalCharge(bookingId: string, amount: number, reason: string): Promise<IBooking | null>
    fetchExistBooking(data: { userEmail: string; laborEmail: string }): Promise<IBooking | null>;

    fetchAllBookingsById(email: string)
    : Promise<IBooking[] | null>

}