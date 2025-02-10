import  bycript  from 'bcrypt';
import { IAboutMe, ILaborer } from "controllers/entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import { ILaborService } from "../../services/interface/ILaborServices";
import { IBooking } from 'controllers/entities/bookingEntity';

export class LaborServices implements ILaborService{
    private laborRepsitory: ILaborSidRepository
    
    constructor(laborRepsitory: ILaborSidRepository) {
        this.laborRepsitory = laborRepsitory
    }
    async fetchLaborDetails(LaborId: string): Promise<ILaborer | null> {
        return await this.laborRepsitory.fetchLabor(LaborId)
    }
    async updateLaborProfile(labor: Partial<ILaborer>): Promise<ILaborer | null> {
        return await this.laborRepsitory.updateProfile(labor)
    }
    async updatePassword(email: string, password: string): Promise<ILaborer | null> {
            const bycriptPassword = await  bycript.hash(password, 10)
            return await this.laborRepsitory.updatePassword(email, bycriptPassword)
    }
    async fetchLabor(userLatandLog: { latitude: number; longitude: number; }): Promise<ILaborer[]> {
         try {
      // Call the repository to fetch laborers
      const laborers = await this.laborRepsitory.fetchLabors(userLatandLog);
      return laborers;
    } catch (error) {
      console.error('Error fetching laborers:', error);
      throw new Error('Failed to fetch laborers.');
    }
    }

    async aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe> {
        try {

            return await this.laborRepsitory.aboutMe(data)
            
        } catch (error) {
            console.error('Error AboutMe:', error);
            throw new Error('Failed to Aboute me.');
        }
    }
    async fetchBookings(laborId: string, page: number, limit: number, filter: object): Promise<{
        bookings: IBooking[];
        total: number;
        completedBookings: number;
        canceledBookings: number;
        totalAmount: number;
        pendingBookings : number
    }> {
        return await this.laborRepsitory.fetchBooking(laborId, page, limit ,filter);
    }
    async fetchSimilorLabors(latitude: number, logitude: number, categorie: string , laborId: string) {
        return await this.laborRepsitory.fetchSimilorLabors(latitude,logitude,categorie , laborId)
    }
    async fetchBookingDetils(bookingId: string): Promise<IBooking | null> {
        return await this.laborRepsitory.fetchBookingDetils(bookingId)
    }
    async rejectResheduleRequst(bookingId: string, newDate: string, newTime: string, rejectionReason: string, rejectedBy: string , requestSentBy : string): Promise<IBooking | null> {
        return await this.laborRepsitory.rejectResheduleRequst(
        bookingId,
        newDate,
        newTime,
        rejectionReason,
        rejectedBy,
        requestSentBy
        );
    }
    async acceptResheduleRequst(bookingId: string , acceptedBy : string): Promise<IBooking | null> {
        return await this.laborRepsitory.acceptResheduleRequst(bookingId , acceptedBy)
    }
    async additionalCharge(bookingId: string, amount: number, reason: string): Promise<IBooking | null> {
        return await this.laborRepsitory.additionalCharge(bookingId , amount ,reason )
    }
    async acceptRequst(bookingId: string): Promise<IBooking | null> {
        return await this.laborRepsitory.acceptRequst(bookingId)
    }
    async rejectRequst(bookingId: string): Promise<IBooking | null> {
        return await this.laborRepsitory.rejectRequst(bookingId)
    }
}