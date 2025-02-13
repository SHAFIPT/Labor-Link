import ApiResponse from "../utils/Apiresponse";
import { AdminRepositooy } from "../repositories/implementaions/AdminRepository";
import { AdminService } from "../services/implementaions/AdminService";
import { IAdminService } from "../services/interface/IAdminService";
import { Request , Response ,NextFunction } from "express"
import { ApiError } from "../middleware/errorHander";
import { error } from "console";

class adminController {
    private adminService: IAdminService
    
    constructor() {
        const adminRepository = new AdminRepositooy()
        this.adminService = new AdminService(adminRepository)
    }

    public fetchUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
        console.log('this is the Request.qury',req.query)
        const query = req.query.query as string || '';
        const filter = req.query.filter as string || '';
        const page = parseInt(req.query.page as string || '1');
        const perPage = 6;
        const skip = (page - 1) * perPage;
        console.log('koooooooooooooooooiii',filter)

        const totalCount = await this.adminService.getTotalUsersCount(query);
        const usersFound = await this.adminService.fetchUsers(query, skip, perPage,filter);

        if (usersFound) {
            const totalPages = Math.ceil(totalCount / perPage);
            const userDetails = {
                usersFound,
                totalPage: totalPages,
            };
            res.status(200)
                .json(new ApiResponse(200, userDetails, 'Users found successfully!'));
        } else {
            return res.status(400).json(new ApiError(400, "Failed to fetch users"));
        }
    } catch (error) {
        console.error('Error in fetchUser:', error);
        return next(error);
    }
}

    
    public fetchLabor = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const query = req.query.query as string || '';
            const filter = req.query.filter as string || '';
            const page = parseInt(req.query.page as string || '1');
            const perPage = 6;
            const skip = (page - 1) * perPage;

            const totalCount = await this.adminService.getTotalLaborsCount(query);
            const laborFound = await this.adminService.fetchLabors(query, skip, perPage,filter)
    
              if (laborFound) {
                const totalPages = Math.ceil(totalCount / perPage);
                const LaborDetails = {
                    laborFound,
                    totalPage: totalPages,
            };
                res.status(200)
                .json(new ApiResponse(200, LaborDetails , 'laborFound succeffuly...!'))
            } else {
                console.log('this is the errorr')
                 return res.status(400).json(new ApiError(400, "Faiald to fetch labores..."));
            }
            
        } catch (error) {
            console.error('Error in admin login:', error);
            // Remove the res.status().json() here and just use next(error)
            return next(error);
        }
    }

    public userBlock = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.body
            
            console.log('this is the user email to block :', email)
            
            const blockResponse = await this.adminService.blockUser(email)

            return res.status(200).json({
                message: "User successfully blocked",
                user: blockResponse,
            });
            
        } catch (error) {
            console.error('Error in user block:', error);
            next(error);
            return res.status(error.statusCode || 500).json({
                error: error.message || 'Something went wrong.'
            });
        }
    }

    public userUnblock = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const unblockResponse = await this.adminService.unblockUser(email);

            return res.status(200).json({
                message: "User successfully unblocked",
                user: unblockResponse,
            });
        } catch (error) {
            console.error("Error in user unblock:", error);
            next(error);
        }
    };

    public laborBlock = async (req: Request, res: Response, next: NextFunction) => {
        try {

            
            const { email } = req.body
            
            console.log('this is the laborer email to block :', email)
            
            const blockResponse = await this.adminService.blockLabor(email)

            return res.status(200).json({
                message: "Labor successfully blocked",
                user: blockResponse,
            });

            
        } catch (error) {
            console.error('Error in labor block:', error);
            next(error);
            return res.status(error.statusCode || 500).json({
                error: error.message || 'Something went wrong.'
            });
        }
    }

     public laborUnblock = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const unblockResponse = await this.adminService.unblockLabor(email);

            return res.status(200).json({
                message: "Labor successfully unblocked",
                labor: unblockResponse,
            });
        } catch (error) {
            console.error("Error in labor unblock:", error);
            next(error);
        }
    };
    
    public Approve = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.body

            console.log('this is is the apprpve email :',email)
            
            const ApproveResonse = await this.adminService.approveLabor(email)

            return res.status(200).json({
                message: "Labor successfully Approved",
                labor: ApproveResonse,
            });
            
        } catch (error) {
            console.error("Error in labor unblock:", error);
            next(error);
        }
    }

    public UnApprove = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.body

            console.log('this is is the UnApprove email :',email)
            
            
            const UnApproveResonse = await this.adminService.UnApproveLabor(email)

            return res.status(200).json({
                message: "Labor successfully UnApproved",
                labor: UnApproveResonse,
            });
            
        } catch (error) {
            console.error("Error in labor unblock:", error);
            next(error);
        }
    }

    public rejectionReson = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email, reason } = req.body
            
            console.log('Thsi is the reason :',reason)
            console.log('Thsi is the email :',email)

            const updatedLabor = await this.adminService.existLaborAndSendMail(email,reason)

            if (!updatedLabor) {
                return res.status(404).json({message : 'Labor not found...!'})
            } else {
                  return res.status(200).json({ message: 'Labor rejected successfully, email sent.', updatedLabor  });
            }

            
        } catch (error) {
            console.error("Error in labor rejections :", error);
            next(error);
        }
    }

    public deleteLabor = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.query as { email: string };
            
            console.log('Thsi si sthe email. to delete : ', email)
            
            const response = await this.adminService.deleteLabor(email) 

            console.log('Response of delete labor',response)

            if (response) {
                return res.status(200)
                .json({message : 'Labor deleted succefuflyyll'})
            } else {
                throw new ApiError(401 , 'Error in labor removal...!')
            }
            
        } catch (error) {
            console.error("Error in labor deletion :", error);
            next(error);
        }
    }
    public fetchLaborBookins = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
        const {laborId} = req.params    
        
        if(!laborId){
            return res.status(404)
            .json({error : 'laborid is missing...'})
        }
            
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter = req.query.filter as string | undefined;   
        
        const { bookings, total } =
          await this.adminService.fetchLaborBookins(
            laborId,
            page,
            limit,
            filter
          ); 
        
        if (!bookings) {
            res.status(404).json({ message: "No bookings found by labor" });  
            }

        res.status(200).json({
            message: "fetching booking succesfully ..",
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
        } catch (error) {
            console.error("Error in fetch labors... :", error);
            next(error);
        }
    }
    
    public fetchAllBookins = async (req: Request, res: Response, next: NextFunction) => {
        try {
       
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter = req.query.filter as string | undefined;    
        
        const {bookings,total, totalLabors, totalUsers, totalAmount,bookingStats ,totalLaborErnigs ,totalCompnyProfit} = await this.adminService.fetchAllBookings(
            page,
            limit,
            filter
        ) 
        console.log('raaviiiiiiiii',bookingStats)
        
        if (!bookings) {
            res.status(404).json({ message: "No bookings found " });  
            }

        res.status(200).json({
            message: "fetching booking succesfully ..",
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalLabors,
            totalUsers,
            totalAmount,
            bookingStats,
            totalLaborErnigs,
            totalCompnyProfit
        });
        } catch (error) {
            console.error("Error in fetch all bookings.. :", error);
            next(error);
        }
    }
    
}

export default adminController

// totalLaborErnigs: number;
//     totalCompnyProfit : number