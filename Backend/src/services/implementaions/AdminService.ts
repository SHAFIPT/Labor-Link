import { IUser } from "../../controllers/entities/UserEntity";
import { IAdminService } from "../../services/interface/IAdminService";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ILaborer } from "../../controllers/entities/LaborEntity";
import { sendRejectionEmail } from "../../utils/emailService";
import { IBooking } from "../../controllers/entities/bookingEntity";

export class AdminService implements IAdminService {
  private adminRepositery: IAdminRepository;

  constructor(adminRepositery: IAdminRepository) {
    this.adminRepositery = adminRepositery;
  }

  async fetchUsers(query: string = '', skip: number, perPage: number,filter : string): Promise<IUser[]> {
    try {
      const userFouned = await this.adminRepositery.fetch(query, skip, perPage ,filter);
      if (!userFouned) {
        throw new ApiError(404, "User not found for fetch ...!");
      }
      return userFouned;
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw new ApiError(500, "Server Error", error.message, error.stack);
      }
    }
  }

  async fetchLabors(query: string = '', skip: number, perPage: number ,filter : string): Promise<ILaborer[]> {
    try {
      const laborFound = await this.adminRepositery.laborFound(query, skip, perPage,filter);
      if (!laborFound) {
        throw new ApiError(404, "Labor not found for fetch ...!");
      }
      return laborFound;
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw new ApiError(500, "Server Error", error.message, error.stack);
      }
    }
  }

  async blockUser(email: string): Promise<IUser | null> {
    return this.adminRepositery.blockUser(email);
  }

  async unblockUser(email: string): Promise<IUser | null> {
    return this.adminRepositery.unblockUser(email);
  }

  async blockLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.blockLabor(email);
  }

  async unblockLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.unblockLabor(email);
  }
  async approveLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.approveLabor(email);
  }
  async UnApproveLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.UnApproveLabor(email);
  }
  async existLaborAndSendMail(
    email: string,
    reason: string     
  ): Promise<ILaborer | null> {
      const existLabor = await this.adminRepositery.existLabor(email);
      
      console.log('tis is the labor name',existLabor.firstName)
      console.log('tis is the labor email',existLabor.email)

    if (existLabor) {
      const isEmailSent = await sendRejectionEmail(
        existLabor.email,
        reason,
        existLabor.firstName
        );
        console.log('The maail sented succeffuly.....!',isEmailSent)

      if (isEmailSent) {
        // Ensure updateStatus is properly handled
        const updateStatus = await this.adminRepositery.updateStatus(
          existLabor.email
          );
          console.log('thsi is the updated status :',updateStatus)
        if (updateStatus) {
          return updateStatus;
        } else {
          throw new ApiError(500, "Failed to update the labor status.");
        }
      } else {
        throw new ApiError(401, "Cannot send the reason to the email...!");
      }
    } else {    
      throw new ApiError(404, "Labor not found...!");
    }                       
  }
   async getTotalLaborsCount(query: string): Promise<number> {
        try {
            const count = await this.adminRepositery.getLabourTotalCount(query);
            return count;
        } catch (error) {
            console.error('Error getting total labor count:', error);
            throw new Error('Failed to get total labor count');
      }
  }
   async getTotalUsersCount(query: string): Promise<number> {
        try {
            const count = await this.adminRepositery.getTotalUsersCount(query);
            return count;
        } catch (error) {
            console.error('Error getting total labor count:', error);
            throw new Error('Failed to get total labor count');
      }
  }
  async deleteLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.deleteLabor(email)
  }
  async fetchLaborBookins(laborId: string, page: number, limit: number, filter?: string): Promise<{
      bookings: IBooking[];
      total: number;
    }> {
    return this.adminRepositery.fetchLaborBookins(
      laborId,
      page,
      limit,
      filter
    )
  }
  async fetchAllBookings(page: number, limit: number, filter?: string): Promise<{
    bookings: IBooking[];
    total: number;
    totalLabors: number;
    totalUsers: number;
    totalAmount: number;
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
  }>  {
    return this.adminRepositery.fetchAllBookings(
      page,
      limit,
      filter
    )
  }
}
