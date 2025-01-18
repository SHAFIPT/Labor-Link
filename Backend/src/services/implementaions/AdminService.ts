import { IUser } from "../../entities/UserEntity";
import { IAdminService } from "../../services/interface/IAdminService";
import { ApiError } from "../../middleware/errorHander";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ILaborer } from "../../entities/LaborEntity";
import { sendRejectionEmail } from "../../utils/emailService";

export class AdminService implements IAdminService {
  private adminRepositery: IAdminRepository;

  constructor(adminRepositery: IAdminRepository) {
    this.adminRepositery = adminRepositery;
  }

  async fetchUsers(): Promise<IUser[]> {
    try {
      const userFouned = await this.adminRepositery.fetch();
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

  async fetchLabors(query: string = '', skip: number, perPage: number): Promise<ILaborer[]> {
    try {
      const laborFound = await this.adminRepositery.laborFound(query, skip, perPage);
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
  async deleteLabor(email: string): Promise<ILaborer | null> {
    return this.adminRepositery.deleteLabor(email)
  }
}
