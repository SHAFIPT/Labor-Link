import { Request , Response ,NextFunction } from "express"
import { ApiError } from "../middleware/errorHander";
import { AdminAuthRepository} from "../repositories/implementaions/AdimnAuthRepository";
import { AdminService } from "../services/implementaions/AdminAuthService";
import { IAdminAuthService } from "../services/interface/IAdminAuthService";
import ApiResponse from "../utils/Apiresponse";


class adminController {
    private adminservice: IAdminAuthService

    options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
    };
    
    constructor() {
        const adminRepository = new AdminAuthRepository()
        this.adminservice = new AdminService(adminRepository)
    }


    public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        console.log('This is the email:', email);
        console.log('This is the password:', password);

        if (!email || !password) {
            throw new ApiError(400, 'Admin email and password are required.');
        }

        const response = await this.adminservice.login({ email, password });

        console.log('This is the response:', response);

        if (!response) {
            throw new ApiError(401, 'Invalid credentials.');
        } 

        return res.status(200).cookie('adminRefreshToken',response.refreshToken,this.options).json({
            message: 'Login successful',
            admin: response.admin, 
            accessToken: response.accessToken,
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        next(error);
        return res.status(error.statusCode || 500).json({
            error: error.message || 'Something went wrong.'
        });  
    }
    };

    public logout = async ( req: Request & { admin: { rawToken: string; id: string } }, res: Response , next : NextFunction) => {
        try {

            const { admin } = req
            
            console.log('this is the admin : ,',admin)


            if (!admin) {
            return res.status(400).json({
                success: false, 
                message: 'User ID is required',
            });
            }

            const logoutResponse = await this.adminservice.logout(admin.rawToken, admin.id)
            
            if (logoutResponse) {
                res.status(200).clearCookie("refreshToken").json({message : 'admin Logout successfully....!'})
            } else {
                 console.log('this is the errorr')
                return res.status(400).json(new ApiError(400, "Error in Admin logout...!"));
            }
                    
                    
        } catch (error) {
            console.error('Error in admin logout:', error);
            next(error);
            return res.status(error.statusCode || 500).json({
                error: error.message || 'Something went wrong.'
            });
        }
    }

    public refreshAccessToken = async (req:Request & {user: {rawToken: string, id: string}} ,res:Response)=>{

        const {user} = req

 

        const accessToken = await this.adminservice.refreshAccessToken(user.id)

        if(accessToken){
          return res.status(200)
          .json(
            new ApiResponse(
              200,
              {accessToken},
              "token Created Successfully"
            )
          )
        }

        
      }

}

export default adminController