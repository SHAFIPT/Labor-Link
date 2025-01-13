import { Request , Response ,NextFunction } from "express"
import { ApiError } from "../middleware/errorHander";
import { AdminRepository } from "../repositories/implementaions/AdimnRepository";
import { AdminService } from "../services/implementaions/AdminService";
import { IAdminService } from "../services/interface/IAdminService";


class adminController {
    private adminservice: IAdminService

    options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
    };
    
    constructor() {
        const adminRepository = new AdminRepository()
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

}

export default adminController