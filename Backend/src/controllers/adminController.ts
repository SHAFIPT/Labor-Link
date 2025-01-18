import ApiResponse from "../utils/Apiresponse";
import { AdminRepositooy } from "../repositories/implementaions/AdminRepository";
import { AdminService } from "../services/implementaions/AdminService";
import { IAdminService } from "../services/interface/IAdminService";
import { Request , Response ,NextFunction } from "express"
import { ApiError } from "../middleware/errorHander";

class adminController {
    private adminService: IAdminService
    
    constructor() {
        const adminRepository = new AdminRepositooy()
        this.adminService = new AdminService(adminRepository)
    }

    public fetchUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const userFound = await this.adminService.fetchUsers()


            if (userFound) {
                res.status(200)
                .json(new ApiResponse(200, userFound , 'userFound succeffuly...!'))
            } else {
                console.log('this is the errorr')
                 return res.status(400).json(new ApiError(400, "Faiald to fetch users..."));
            }
            
        } catch (error) {
            console.error('Error in admin login:', error);
            next(error);
            return res.status(error.statusCode || 500).json({
                error: error.message || 'Something went wrong.'
            });
        }
    }

    public fetchLabor = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const query = req.query.query as string || '';
            const page = parseInt(req.query.page as string || '1');
            const perPage = 7;
            const skip = (page - 1) * perPage;

            const totalCount = await this.adminService.getTotalLaborsCount(query);
            const laborFound = await this.adminService.fetchLabors(query, skip, perPage)
    
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
    
}

export default adminController