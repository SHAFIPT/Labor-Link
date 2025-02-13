import { IBooking } from "../../controllers/entities/bookingEntity";
import { ILaborer } from "../../controllers/entities/LaborEntity";
import { IUser } from "../../controllers/entities/UserEntity";

export interface IAdminRepository{
    fetch(
        query: string,
        skip: number,
        perPage: number,
        filter: string
    ): Promise<IUser[]>
    laborFound(
        query: string,
        skip: number,
        perPage: number,
        filter : string
        ): Promise<ILaborer[]>
    blockUser(email : string ) : Promise<IUser | null>
    blockLabor(email : string ) : Promise<ILaborer | null>
    unblockUser(email : string ) : Promise<IUser | null>
    unblockLabor(email : string ) : Promise<ILaborer | null>
    approveLabor(email : string ) : Promise<ILaborer | null>
    UnApproveLabor(email : string ) : Promise<ILaborer | null>
    existLabor(email : string ) : Promise<ILaborer | null>
    getLabourTotalCount(query: string): Promise<number>;
    getTotalUsersCount(query: string): Promise<number>;
    updateStatus(email: string): Promise<ILaborer | null>
    deleteLabor(email: string): Promise<ILaborer | null>
    fetchLaborBookins(laborId: string, page: number, limit: number, filter?: string): Promise<{
        bookings: IBooking[],
        total: number,
    }>
    fetchAllBookings( page: number, limit: number, filter?: string): Promise<{
    bookings: IBooking[];
    total: number;
    totalLabors: number;
    totalUsers: number;
    totalAmount: number;
    totalLaborErnigs: number;
    totalCompnyProfit : number
    bookingStats: {
      completed: number;
      inProgress: number;
      pending: number;
      cancelled: number;
      paid: number;
      paymentPending: number;
      paymentFailed: number;
      monthlyEarnings: Array<{ month: string; earnings: number }>;
    };
  }> 
}    