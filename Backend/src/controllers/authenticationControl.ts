import { IUser } from 'controllers/entities/UserEntity';
import { AdminService } from '../services/implementaions/AdminAuthService';
import UserRepository from "../repositories/implementaions/UserRepository";
import { AuthService } from "../services/implementaions/AuthServices";
import { LaborAuthServies } from "../services/implementaions/LaborAuthServies";
import { LaborRepository } from "../repositories/implementaions/LaborRepository";
import { NextFunction , Request ,Response} from "express";
import { ApiError } from "../middleware/errorHander";
import ApiResponse from "../utils/Apiresponse";
import { AdminAuthRepository } from '../repositories/implementaions/AdimnAuthRepository';
import OTPservices from '../services/implementaions/OTPservices';
import OTPRepository from '../repositories/implementaions/OTPRepository';
import { sendEmailOtp } from '../utils/emailService';
import { error } from 'console';
import { IOTP } from './entities/OtpEntity';

// Define interfaces for common authentication operations
interface IAuthStrategy {
    login(credentials: any): Promise<any>;
    register(data: any): Promise<any>;
    logout(token: string, id: string): Promise<any>;
    refreshAccessToken(userId: string): Promise<string | null>;
    forgetPassword(email: string): Promise<any>;
    forgetVerifyOtp(data: any): Promise<any>;
    resetPassword(data: any): Promise<any>;
    sendOtp?(user: IUser): Promise<any>;
    verifyOtp?(email: string, otp: string): Promise<boolean>
    googleSignIn?(user: Partial<IUser>): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null>
    findUserWithEmail?(email: string): Promise<IUser | null>
    sendForgetOtp?(user: IUser): Promise<IOTP | null>
    isVerify?(user: Partial<IUser>, otp: IOTP): Promise<IOTP | null>
    generateTokenForForgotPassword?(user: Partial<IUser>): Promise<string>;
    decodeAndVerifyToken?(token: string): Promise<Partial<IUser | null>>
    changePassword?(password: string, email: string): Promise<IUser | null>
    resendOtp?(user: IUser): Promise<IOTP | null>
}

interface IAdminAuthStrategy {
    login(credentials: any): Promise<any>;
    logout(token: string, id: string): Promise<any>;
    refreshAccessToken(userId: string): Promise<string | null>;
    register?(data: any): Promise<any>;
    sendOtp?(user: IUser): Promise<any>;
    verifyOtp?(email: string, otp: string): Promise<boolean>
    googleSignIn?(user: Partial<IUser>): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null>
    findUserWithEmail?(email: string): Promise<IUser | null>
    sendForgetOtp?(user: IUser): Promise<IOTP | null>
    isVerify?(user: Partial<IUser>, otp: IOTP): Promise<IOTP | null>
    generateTokenForForgotPassword?(user: Partial<IUser>): Promise<string>;
    decodeAndVerifyToken?(token: string): Promise<Partial<IUser | null>>
    changePassword?(password: string, email: string): Promise<IUser | null>
    resendOtp?(user: IUser): Promise<IOTP | null>
}

// User authentication strategy
class UserAuthStrategy implements IAuthStrategy {
    private authService: AuthService; 
    private otpService: OTPservices;

    constructor(authService: AuthService , otpService: OTPservices) {
        this.authService = authService;
        this.otpService = otpService;
    }

    async login(credentials: any) {
        return this.authService.login(credentials);
    }

    async register(data: any) {
        return this.authService.register(data);
    }

    async logout(token: string, id: string) {
        return this.authService.logout(token, id);
    }

    async refreshAccessToken(userId: string) {
        return this.authService.refreshAccessToken(userId);
    }

    async forgetPassword(email: string) {
        return this.authService.findUserWithEmail(email);
    }

    async forgetVerifyOtp(data: any) {
        const user = await this.authService.findUserWithEmail(data.email);
        if (!user) return null;
        return this.authService.generateTokenForForgotPassword(user);
    }

    async resetPassword(data: any) {
        return this.authService.changePassword(data.password, data.email);
    }
    async sendOtp(user: IUser) { // Keep it mandatory
        return this.otpService.sendOtp(user);
    }
    async verifyOtp(email: string, otp: string) {
        return this.otpService.verifyOtp(email,otp)
    }
    async googleSignIn(user: Partial<IUser>) {
    return this.authService.googleSignIn({
        firstName: user.firstName,
        email: user.email, 
        ProfilePic: user.ProfilePic,
    });
}
    async findUserWithEmail(email: string) {
        return this.authService.findUserWithEmail(email)
    }
    async sendForgetOtp(user: IUser){
        return this.otpService.sendForgetOtp(user)
    }
    async isVerify(user: Partial<IUser>, otp: IOTP) {
        return this.otpService.isVerify(user, otp)
    }
    async generateTokenForForgotPassword(user: Partial<IUser>) {
        return this.authService.generateTokenForForgotPassword(user)
    }
    async decodeAndVerifyToken(token: string) {
        return this.authService.decodeAndVerifyToken(token)
    }
    async changePassword(password: string, email: string){
        return this.authService.changePassword(password,email)
    }
    async resendOtp(user: IUser) {
        return this.otpService.resendOtp(user)
    }
}

// Labor authentication strategy
class LaborAuthStrategy implements IAuthStrategy {
    private laborAuthService: LaborAuthServies;

    constructor(laborAuthService: LaborAuthServies) {
        this.laborAuthService = laborAuthService;
    }

    async login(credentials: any) {
        return this.laborAuthService.login(credentials);
    }

    async register(data: any) {
        return this.laborAuthService.registerAboutYou(data);
    }

    async logout(token: string, id: string) {
        return this.laborAuthService.logout(token, id);
    }

    async refreshAccessToken(userId: string) {
        return this.laborAuthService.refreshAccessToken(userId);
    }

    async forgetPassword(email: string) {
        return this.laborAuthService.findUserWithEmail(email);
    }

    async forgetVerifyOtp(data: any) {
        const labor = await this.laborAuthService.findUserWithEmail(data.email);
        if (!labor) return null;
        return this.laborAuthService.generateTokenForForgotPassword(labor);
    }

    async resetPassword(data: any) {
        return this.laborAuthService.changePassword(data.password, data.email);
    }
}


// Admin Authentication Strategy
class AdminAuthStrategy implements IAdminAuthStrategy  {
    private adminService: AdminService;

    constructor(adminService: AdminService) {
        this.adminService = adminService;
    }

    async login(credentials: any) {
        return this.adminService.login(credentials);
    }

    async logout(token: string, id: string) {
        return this.adminService.logout(token, id);
    }

    async refreshAccessToken(userId: string) {
        return this.adminService.refreshAccessToken(userId);
    }

}

// Auth strategy factory
class AuthStrategyFactory {
    static createStrategy(role: string): IAuthStrategy | IAdminAuthStrategy  {
        const userRepository = new UserRepository();
        const laborRepository = new LaborRepository();
        const adminRepository = new AdminAuthRepository();
        const otpRepository = new OTPRepository();
        const otpService = new OTPservices(otpRepository,sendEmailOtp); 

        switch (role) {
            case "user":
                return new UserAuthStrategy(new AuthService(userRepository), otpService);
            case "labor":
                return new LaborAuthStrategy(new LaborAuthServies(laborRepository));
            case "admin":
                return new AdminAuthStrategy(new AdminService(adminRepository));
            default:
                throw new Error("Invalid role specified");
        }
    }
}


// Unified Authentication Controller
export class UnifiedAuthController {
  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000,
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, ...credentials } = req.body;

      const strategy = AuthStrategyFactory.createStrategy(role);

      const result = await strategy.login(credentials);

      if (!result) {
        return res.status(401).json(new ApiError(401, "Invalid Credentials"));
      }

      const cookieName =
        role === "user"
          ? "UserRefreshToken"
          : role === "labor"
          ? "LaborRefreshToken"
          : "AdminRefreshToken";

      return res
        .status(200)
        .cookie(cookieName, result.refreshToken, this.options)
        .json(new ApiResponse(200, result));
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, ...user } = req.body;
      const strategy = AuthStrategyFactory.createStrategy(role);

      const result = await strategy.register(user);

      if (!result) {
        return res.status(400).json(new ApiError(400, "Registration failed"));
      }

      const cookieName =
        role === "user" ? "UserRefreshToken" : "LaborRefreshToken";

      return res
        .status(201)
        .cookie(cookieName, result.refreshToken, this.options)
        .json(new ApiResponse(201, result));
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: Request & { user?: any; labor?: any; admin?: any },
    res: Response,
    next: NextFunction
  ) => {
    console.log("User:", req.user);
    console.log("Labor:", req.labor);
    console.log("Admin:", req.admin);
    try {
      console.log("H8iiiiiiiiiiiiiiiiiii");
      const role = req.user ? "user" : req.labor ? "labor" : "admin";
      console.log("Thsi is the role......", role);
      const entity = req.user || req.labor || req.admin;
      console.log("Thsi is the entity....", entity);

      if (!entity) {
        return res
          .status(400)
          .json(new ApiError(400, "Authentication required"));
      }

      const strategy = AuthStrategyFactory.createStrategy(role);
      console.log("Thsi si eth strategy ...", strategy);
      const result = await strategy.logout(entity.rawToken, entity.id);

      const cookieName =
        role === "user"
          ? "UserRefreshToken"
          : role === "labor"
          ? "LaborRefreshToken"
          : "AdminRefreshToken";

      if (result) {
        return res
          .status(200)
          .clearCookie(cookieName)
          .json(new ApiResponse(200, null, "Logout successful"));
      }

      throw new ApiError(400, "Logout failed");
    } catch (error) {
      next(error);
    }
  };

  public refreshAccessToken = async (
    req: Request & { user?: any; labor?: any },
    res: Response
  ) => {
    try {
      const role = req.user ? "user" : "labor";
      const entity = req.user || req.labor;

      if (!entity) {
        return res
          .status(400)
          .json(new ApiError(400, "Authentication required"));
      }

      const strategy = AuthStrategyFactory.createStrategy(role);
      const accessToken = await strategy.refreshAccessToken(entity.id);

      if (accessToken) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { accessToken },
              "Token refreshed successfully"
            )
          );
      }

      throw new ApiError(400, "Token refresh failed");
    } catch (error) {
      throw error;
    }
  };
  
   public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, ...user } = req.body;

        
        console.log('Thsi sit her roel and ures s ', {
            role,
            user
        })

      if (!user) {
        return res.status(400).json(new ApiError(400, "user is required"));
      }

      const strategy = AuthStrategyFactory.createStrategy(role);

      if (!strategy.sendOtp) {
        return res.status(400).json(new ApiError(400, "OTP sending not supported for this role"));
      }

      const result = await strategy.sendOtp(user);

      if (!result) {
        return res.status(400).json(new ApiError(400, "Failed to send OTP"));
      }

      return res.status(200).json(new ApiResponse(200, result, "OTP sent successfully"));
    } catch (error) {
      next(error);
    }
  };
  
   public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, role } = req.body;

        if (!email || !otp) {
            return res.status(400).json(new ApiError(400, "Email and OTP are required."));
        }

        const strategy = AuthStrategyFactory.createStrategy(role);

        if (!strategy?.verifyOtp) {
            return res.status(400).json(new ApiError(400, "OTP verification not supported for this role"));
        }

        const result = await strategy.verifyOtp(email, otp);

        if (!result) {
            return res.status(400).json(new ApiError(400, "Failed to verify OTP"));
        }

        return res.status(200).json({ message: "OTP verified successfully!" })
    } catch (error) {
        next(error); 
    }
};

    public googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { displayName, email, photoURL, role } = req.body;

        const strategy = AuthStrategyFactory.createStrategy(role);

        if (!strategy?.googleSignIn) {
            return res.status(400).json(new ApiError(400, "Google Sign-In not supported for this role"));
        }

        const result = await strategy.googleSignIn({
            firstName: displayName,
            email: email, 
            ProfilePic: photoURL,
        });

        if (!result) {
            return res.status(400).json(new ApiError(400, "Google Sign-In failed"));
        }

        return res.status(200).json(new ApiResponse(200, result, "Google Sign-In successful"));

    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

   public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, role } = req.body;

        // Validate required fields
        if (!email || !role) {
            return res.status(400).json(new ApiError(400, "Email and role are required."));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(400).json(new ApiError(400, "Invalid role provided."));
        }

        // Check if Google Sign-In is supported
        // if (!strategy.googleSignIn) {
        //     return res.status(400).json(new ApiError(400, "Google Sign-In is not supported for this role."));
        // }

        // Check if the user exists and is not blocked
        const user = await strategy.findUserWithEmail(email);
        if (!user || user.isBlocked) {
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    user?.isBlocked ? "Account is blocked" : "User not found. Check your email."
                )
            );
        }

        // Send OTP
        const otpSent = await strategy.sendForgetOtp(req.body);
        if (!otpSent) {
            return res.status(500).json(new ApiError(500, "Error occurred while sending OTP."));
        }

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error in forgetPassword:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

    public forgetVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, role } = req.body;

        // Validate required fields
        if (!email || !role || !otp) {
            return res.status(400).json(new ApiError(400, "Email, OTP, and role are required."));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(400).json(new ApiError(400, "Invalid role provided."));
        }

        // Check if the user exists and is not blocked
        const user = await strategy.findUserWithEmail(email);
        if (!user) {
            return res.status(400).json(new ApiResponse(400, null, "Check Your Email"));
        }

        if (user.isBlocked) {
            return res.status(403).json(new ApiResponse(403, null, "Account is blocked."));    
        }

        // Verify OTP
        const isOtpValid = await strategy.isVerify(user, req.body);
        if (!isOtpValid) {
            return res.status(400).json(new ApiError(400, "Entered wrong OTP."));
        }

        // Generate access token
        const { password, refreshToken, ...userData } = user;
        const accessToken = await strategy.generateTokenForForgotPassword(userData);

        return res
            .status(200)
            .cookie("userOtpAccessToken", accessToken, { httpOnly: true })
            .json(new ApiResponse(200, { accessToken }, "OTP Verified Successfully"));
    } catch (error) {
        return next(error);
    }
};
    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, token, role } = req.body;

        console.log('This are teh datsaaaaaaaaaaaas , ',password ,role)

        // Validate required fields
        if (!password || !role || !token) {
            return res.status(400).json(new ApiError(400, "Password, role, and token are required."));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(400).json(new ApiError(400, "Invalid role provided."));
        }

        // Decode and verify token
        const decoded = await strategy.decodeAndVerifyToken(token);
        if (!decoded) {
            return res.status(401).json(new ApiResponse(401, null, "Session expired. Try again."));
        }

        req.body.user = decoded;

        
        const user = decoded as { _doc: Partial<IUser> };

        const email = user._doc?.email;
        console.log('Thsi sie the emils. .. .... ',email)

        // Check if user exists
        const isUserExists = await strategy.findUserWithEmail(email);
        console.log('Thsi sie the user .....',user)
        if (!isUserExists) {
            return res.status(404).json(new ApiResponse(404, null, "User not found."));
        }

        // Change password
        const passwordUpdated = await strategy.changePassword(password, email);
        if (passwordUpdated) {
            return res.status(200).json(new ApiResponse(200, null, "Password reset successful."));
        }

        return res.status(500).json(new ApiError(500, "Something went wrong. Reset failed."));
    } catch (error) {
        return next(error);
    }
};

    public resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
            console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
        const { role, ...user } = req.body;

        console.log('Thsis it eh user and roel ::', {
            role , user
        })

        if (!role || Object.keys(user).length === 0) {
            return res.status(400).json(new ApiError(400, "Role and user data are required."));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy || !strategy.resendOtp) {
            return res.status(400).json(new ApiError(400, "Invalid role or resend OTP not supported."));
        }

        // Attempt to resend OTP
        const response = await strategy.resendOtp(user as IUser);

        if (!response) {
            return res.status(400).json(new ApiError(400, "Failed to resend OTP."));
        }

        console.log("Resend OTP Response:", response);

        return res.status(200).json(new ApiResponse(200, response, "OTP resent successfully!"));

    } catch (error) {
        next(error);
    }
};



  // Additional methods like forgetPassword, resetPassword, etc. would follow the same pattern
}