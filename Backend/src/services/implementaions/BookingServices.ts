import { IBooking } from "../../controllers/entities/bookingEntity";

import { IBookingSerivese } from "../interface/IBookingServices";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";


export default class BookingServices implements IBookingSerivese{
    private bookingRepository: IBookingRepository
    
    constructor(bookingRepository: IBookingRepository) {
        this.bookingRepository = bookingRepository
    }

      async bookingLabor(bookingDetails: IBooking): Promise<IBooking | null> {
        try {
        const booking = await this.bookingRepository.createBooking(bookingDetails);

        return booking;
        } catch (error) {
        console.error("Error in booking labor:", error);
        throw new Error("Failed to book labor");
        }
    }

        async fetchBooking(
        userId: string,
        page: number,
        limit: number,
        filter: object
    ): Promise<{ bookings: IBooking[]; total: number }> {
        return await this.bookingRepository.fetchBooking(userId, page, limit, filter);
    }

    async cancelBooking(data: {
    bookingId: string;
    reason: string;
    comments: string;
    isWithin30Minutes: boolean;
    canceledBy: "user" | "labor";
  }): Promise<IBooking | null> {
    try {
      const { bookingId } = data;

      const bookingFound = await this.bookingRepository.findBookingById(bookingId);

      if (!bookingFound) {
        throw new Error("The booking ID was not found.");
      }

      const updatedBooking = await this.bookingRepository.cancelBooking(
        bookingFound,
        data
      );

      if (!updatedBooking) {
        throw new Error("Failed to update the booking.");
      }

      return updatedBooking;
    } catch (error) {
      console.error("Error in cancelBooking:", error);
      throw new Error("Failed to cancel booking.");
    }
  }
  
    async updateReadStatus(
    bookingId: string,
    isUserRead: boolean
  ): Promise<IBooking | null> {
    return await this.bookingRepository.updateReadStatus(bookingId, isUserRead);
    } 
    
    
  async resheduleRequst(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
    requestSentBy: string
  ): Promise<IBooking | null> {
    return await this.bookingRepository.resheduleRequst(
      bookingId,
      newDate,
      newTime,
      reason,
      requestSentBy
    );
  }
  async workCompletion(
    bookingId: string,
    updateData: {
      isUserCompletionReported?: boolean;
      isLaborCompletionReported?: boolean;
    }
  ): Promise<IBooking | null> {
    return await this.bookingRepository.workCompletion(bookingId, updateData);
  }
    
  async fetchBookinById(bookingId: string): Promise<IBooking | null> {
    return await this.bookingRepository.findBookingById(bookingId)
  }
  
  async fetchAllBookings(
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
  }>{
     return await this.bookingRepository.fetchAllBookings(userId,page,limit,filter)
  }  
  
   
    
    async fetchBookingsToLabor(laborId: string, page: number, limit: number, filter: object): Promise<{
        bookings: IBooking[];
        total: number;
        completedBookings: number;
        canceledBookings: number;
        totalAmount: number;
        pendingBookings : number
    }> {
        return await this.bookingRepository.fetchBookingsToLabor(laborId, page, limit ,filter);
    }


    async fetchBookingDetils(bookingId: string): Promise<IBooking | null> {
        return await this.bookingRepository.fetchBookingDetils(bookingId)
    }

    
    async rejectResheduleRequst(bookingId: string, newDate: string, newTime: string, rejectionReason: string, rejectedBy: string , requestSentBy : string): Promise<IBooking | null> {
        return await this.bookingRepository.rejectResheduleRequst(
        bookingId,
        newDate,
        newTime,
        rejectionReason,
        rejectedBy,
        requestSentBy
        );
    }
    async acceptResheduleRequst(bookingId: string , acceptedBy : string): Promise<IBooking | null> {
        return await this.bookingRepository.acceptResheduleRequst(bookingId , acceptedBy)
    }
    async additionalCharge(bookingId: string, amount: number, reason: string): Promise<IBooking | null> {
        return await this.bookingRepository.additionalCharge(bookingId , amount ,reason )
    }
    async acceptRequst(bookingId: string): Promise<IBooking | null> {
        return await this.bookingRepository.acceptRequst(bookingId)
    }
    async rejectRequst(bookingId: string): Promise<IBooking | null> {
        return await this.bookingRepository.rejectRequst(bookingId)
    }
    async fetchExistBooking(data: { userEmail: string; laborEmail: string; }): Promise<IBooking | null> {
        return this.bookingRepository.fetchExistBooking(data)
    }
    async fetchAllBookingsById(email: string): Promise<IBooking[] | null> {
       return this.bookingRepository.fetchAllBookingsById(email)
    }
    
    
}