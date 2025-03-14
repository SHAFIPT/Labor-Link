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
import { IOTP } from './entities/OtpEntity';
import { ILaborer } from './entities/LaborEntity';
import formidable from 'formidable';
import cloudinary from '../utils/CloudineryCongif';
import { IAuthStrategy } from './entities/AuthStrategy';
import { IAdminAuthStrategy } from './entities/AdminAuthStrategy';
import { HttpStatus } from '../enums/HttpStatus';
import { Messages } from '../constants/Messages';

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
    async registerAboutYou(labor: Partial<ILaborer>){
        return this.laborAuthService.registerAboutYou(labor)
    }
    async registerProfile(labor: Partial<ILaborer>){
        return this.laborAuthService.registerProfile(labor)
    }
    async registerExperience(labor: Partial<ILaborer>): Promise<{ labor: ILaborer; accessToken: string; refreshToken: string }> {
        return this.laborAuthService.registerExperience(labor);
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
        .status(HttpStatus.OK)
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
        .status(HttpStatus.CREATED)
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
    try {
      const role = req.user ? "user" : req.labor ? "labor" : "admin";
      const entity = req.user || req.labor || req.admin;

      if (!entity) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ApiError(HttpStatus.BAD_REQUEST, Messages.AUTH_REQUIRED));
      }

      const strategy = AuthStrategyFactory.createStrategy(role);
      const result = await strategy.logout(entity.rawToken, entity.id);

      const cookieName =
        role === "user"
          ? "UserRefreshToken"
          : role === "labor"
          ? "LaborRefreshToken"
          : "AdminRefreshToken";

      if (result) {
        return res
          .status(HttpStatus.OK)
          .clearCookie(cookieName)
          .json(new ApiResponse(HttpStatus.OK, null, Messages.LOGOUT_SUCCESS));
      }

      throw new ApiError(HttpStatus.BAD_REQUEST, Messages.LOGOUT_FAILED);
    } catch (error) {
      next(error);
    }
  };

  public refreshAccessToken = async (
  req: Request & { user?: any; labor?: any; admin?: any }, 
  res: Response
) => {
    try {
      
    const role = req.user ? "user" : req.labor ? "labor" : req.admin ? "admin" : null;

          
    const entity = req.user || req.labor || req.admin;

    if (!entity) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ApiError(HttpStatus.BAD_REQUEST, Messages.AUTH_REQUIRED));
    }

    const strategy = AuthStrategyFactory.createStrategy(role);

    const accessToken = await strategy.refreshAccessToken(entity.id);

    if (accessToken) {
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { accessToken },
             Messages.TOKEN_REFRESHED
          )
        );
    }

    throw new ApiError(HttpStatus.BAD_REQUEST, Messages.TOKEN_REFRESHED_FAILD);
  } catch (error) {
    throw error;
  }
};
  
   public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
     try {
      
        const { role, ...user } = req.body;

      if (!user) {
        return res.status(400).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.USER_REQUIERD));
      }

      const strategy = AuthStrategyFactory.createStrategy(role);

      if (!strategy.sendOtp) {
        return res.status(400).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.NOT_SUPPORT_OTP));
      }

      const result = await strategy.sendOtp(user);

      if (!result) {
        return res.status(400).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.FAILED_TO_SEND_OTP));
      }

      return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, result, Messages.OTP_SEND_SUCCESSFULLY));
    } catch (error) {
      next(error);
    }
  };
  
   public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, role } = req.body;

        if (!email || !otp) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.EMAIL_AND_OTP_REQUIRD));
        }

        const strategy = AuthStrategyFactory.createStrategy(role);

        if (!strategy?.verifyOtp) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.NOT_SUPPORT_VERIFICATION_OTP));
        }

        const result = await strategy.verifyOtp(email, otp);

        if (!result) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, "Failed to verify OTP"));
        }

        return res.status(HttpStatus.OK).json({ message: Messages.OTP_VERIFIED_SUCCESSFULLY })
    } catch (error) {
        next(error); 
    }
};

    public googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { displayName, email, photoURL, role } = req.body;

        const strategy = AuthStrategyFactory.createStrategy(role);
  
        if (!strategy?.googleSignIn) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST,Messages.GOOGLE_SIGN_IN_NOT_SUPPPORT ));
        }

        const result = await strategy.googleSignIn({
            firstName: displayName,
            email: email, 
            ProfilePic: photoURL,
        });

        if (!result) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.GOOGLE_SIGN_IN_FAILD));
        }

        const cookieName =
        role === "user"
          ? "UserRefreshToken"
          : role === "labor"
          ? "LaborRefreshToken"
            : "AdminRefreshToken";
      
      console.log('This is teh google auth user ::::',result)

        return res.status(HttpStatus.OK)
        .cookie(cookieName, result.refreshToken, this.options)    
        .json(new ApiResponse(HttpStatus.OK, result, Messages.GOOGLE_SIGN_IN_SUCCESS));

    } catch (error) {
        console.error(Messages.GOOGLE_SIGN_IN_ERROR, error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR));
    }
};
   
   public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;

        // Validate required fields
        if (!email || !role) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.EMAIL_AND_ROLE_REQUIRED));
        }

        // Get authentication strategy
      const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.INVALID_ROLE));
        }

        // Check if the user exists and is not blocked
        const user = await strategy.findUserWithEmail(email);
        if (!user || user.isBlocked) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ApiResponse(
                    HttpStatus.BAD_REQUEST,
                    null,
                    user?.isBlocked ? Messages.ACCOUNT_IS_BLOCKED  : Messages.USER_NOT_FOUND_CHECK_YOU_EMIL
                )
            );
        }

        // Send OTP
        const otpSent = await strategy.sendForgetOtp(req.body);
        if (!otpSent) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.ERROR_OCCURED_IN_OTP_SENT));
        }

        return res.status(HttpStatus.OK).json({ message: Messages.OTP_SEND_SUCCESSFULLY });

    } catch (error) {
        console.error(Messages.FORGET_PASSWORD_ERROR, error);
        return res.status(500).json(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR));
    }
};

    public forgetVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, role } = req.body;

        // Validate required fields
        if (!email || !role || !otp) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.EMAIL_AND_OTP_REQUIRD));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.INVALID_ROLE));
        }

        // Check if the user exists and is not blocked
        const user = await strategy.findUserWithEmail(email);
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiResponse(HttpStatus.BAD_REQUEST, null, Messages.CHECK_YOU_EMIL));
        }

        if (user.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json(new ApiResponse(HttpStatus.FORBIDDEN, null, Messages.ACCOUNT_IS_BLOCKED));    
        }

        // Verify OTP
        const isOtpValid = await strategy.isVerify(user, req.body);
        if (!isOtpValid) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.ENTERD_WRONG_OTP));
        }

        // Generate access token
        const { password, refreshToken, ...userData } = user;
        const accessToken = await strategy.generateTokenForForgotPassword(userData);

        return res
            .status(HttpStatus.OK)
            .cookie("userOtpAccessToken", accessToken, { httpOnly: true })
            .json(new ApiResponse(HttpStatus.OK, { accessToken }, Messages.OTP_VERIFIED_SUCCESSFULLY));
    } catch (error) {
        return next(error);
    }
};
    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, token, role } = req.body;

        // Validate required fields
        if (!password || !role || !token) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_ROLE_TOKEN_REQURIED));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.INVALID_ROLE_PROVIDED));
        }

        // Decode and verify token
        const decoded = await strategy.decodeAndVerifyToken(token);
        if (!decoded) {
            return res.status(HttpStatus.UNAUTHORIZED).json(new ApiResponse(HttpStatus.UNAUTHORIZED, null, Messages.SESSION_EXPIRED));
        }

        req.body.user = decoded;

        
        const user = decoded as { _doc: Partial<IUser> };

        const email = user._doc?.email;

        // Check if user exists
        const isUserExists = await strategy.findUserWithEmail(email);
        if (!isUserExists) {
            return res.status(HttpStatus.NOT_FOUND).json(new ApiResponse(HttpStatus.NOT_FOUND, null, Messages.USER_NOT_FOUND));
        }

        // Change password
        const passwordUpdated = await strategy.changePassword(password, email);
        if (passwordUpdated) {
            return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, null, Messages.PASSWORD_RESET_SUCCESSFULY));
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR));
    } catch (error) {
        return next(error);
    }
};

    public resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
        const { role, ...user } = req.body;

        if (!role || Object.keys(user).length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.ROLE_AND_USER_DATA_REQURIED));
        }

        // Get authentication strategy
        const strategy = AuthStrategyFactory.createStrategy(role);
        if (!strategy || !strategy.resendOtp) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST,Messages.INVALID_ROLE_OR_RESEND_OTP_NOT_SUPPORTED ));
        }

        // Attempt to resend OTP
        const response = await strategy.resendOtp(user as IUser);

        if (!response) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST,Messages.FAILD_TO_RESEND_OTP ));
        }

        return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, response, Messages.OTP_RESEND_SUCCESSFULLY));

    } catch (error) {
        next(error);
    }
    
    
};

    public aboutYou = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            address,
            location,
            dateOfBirth,
            gender,
            language,
            role
        } = req.body;

        const strategy = AuthStrategyFactory.createStrategy(role);

        if (!strategy.registerAboutYou) {
            return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.REGITSTER_ABOUT_NOT_DEFIND));
        }

        const laborer = await strategy.registerAboutYou({
            firstName,
            lastName,
            email,
            password,
            phone: phoneNumber,
            address,
            location,
            personalDetails: {
                dateOfBirth,
                gender,
            },
            language,
        });

        return res.status(HttpStatus.OK).json({ success: true, data: laborer });

    } catch (error) {
        console.error(error);
        next(error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR));
    }
    };
    

     public profilePage = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => { 
        
         const role = 'labor'
        const form = formidable({ multiples: true });
        form.parse(req, async (err, field, files) => {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.ERROR_PARSE_FORM_DATA });
            }
            
          const imageFile = files.image ? files.image[0] : null;
          
          if (imageFile) {
            try {
    
                const result = await cloudinary.uploader.upload(imageFile.filepath,{folder : 'labor_profiles'})
  
                const imageUrl = result.secure_url;
                
                const { category, skill, startTime, endTime, availability ,email } = field;
    
                const parsedAvailability = JSON.parse(field.availability[0])

                const strategy = AuthStrategyFactory.createStrategy(role);

                if (!strategy.registerAboutYou) {
                    return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(HttpStatus.BAD_REQUEST, Messages.REGITSTER_ABOUT_NOT_DEFIND));
                }

                const response = await strategy.registerProfile({
                    profilePicture: imageUrl,
                    categories : category,
                    skill : skill,
                    startTime : startTime[0],
                    endTime : endTime[0],
                    availability: parsedAvailability,
                    email : email[0]
                })
              
                if (response) {
                   return res.status(HttpStatus.OK).json({   
                    success: true, data: response 
                }); 
                } else {
                    return res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.ERROR_PROFILE_PAGE_LABOR });
                }
    
            } catch (error) {
              console.error(Messages.ERROR_IN_PROFILE_CONTROLLER, error);
              next(error);
              console.error(Messages.ERROR_IN_PROFILE_CONTROLLER, error);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.ERROR_UPLOAD_IMAGE_CLOUDINERY });
            }
          } else {
              return res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.IMAGE_REQUERD });
          }
        });
    };
    
    public experiencePage = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const role = 'labor'
        const form = formidable({ multiples: true });
    
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.ERROR_PARSE_FORM_DATA });
          }
    
          // Handle ID Image
          const idImageFile = files.idImage?.[0];
          let idImageUrl = "";
          if (idImageFile) {
            try {
              const result = await cloudinary.uploader.upload(idImageFile.filepath, {
                folder: "labor_experience/id_documents",
              });
              idImageUrl = result.secure_url;
            } catch (error) {
              console.error(Messages.Error_UPLOADING_ID_IMAGE, error);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.FAILD_TO_UPLOAD_IMAGE_ID });
            }
          }
    
          // Handle Certificate Images
          const certificateImageFiles = files.certificateImages || [];
          let certificateUrls: string[] = [];
    
          for (const certificateFile of certificateImageFiles) {
            try {
              const result = await cloudinary.uploader.upload(certificateFile.filepath, {
                folder: "labor_experience/certificate",
              });
              certificateUrls.push(result.secure_url);
            } catch (error) {
              console.error(Messages.ERROR_UPLOAD_CERTIFICATE_IMAGE, error);
              continue;
            }
          }
    
          // Parse certificates data from JSON string
          const certificates = JSON.parse(fields.certificates[0] || '[]');
    
          // Combine certificate URLs with certificate data
          const completeCertificates = certificates.map((cert: any, index: number) => ({
            certificateDocument: certificateUrls[index] || '',
            certificateName: cert.certificateName,
            lastUpdated: new Date()
          }));
    
          const {
            startDate,
            responsibility,
            currentlyWorking,
            email,
            idType,
          } = fields;
    
          // Create the experience data object
          const experienceData = {
            governmentProof: {
              idDocument: idImageUrl,
              idType: idType[0],
            },
            certificates: completeCertificates,
            DurationofEmployment: {
              startDate: startDate[0],
              currentlyWorking: currentlyWorking[0] === 'true',
            },
            responsibility: responsibility[0],
            email: email[0],
          };
    
            console.log('Experience Data:', experienceData);
            
            const strategy = AuthStrategyFactory.createStrategy(role);

                if (!strategy.registerAboutYou) {
                    return res.status(HttpStatus.BAD_REQUEST).json(new ApiError(400, Messages.REGITSTER_ABOUT_NOT_DEFIND));
                }
    
             const response = await strategy.registerExperience(experienceData);
    
          if (response) {
            const laborData = { ...response.labor.toObject() }; // Convert to plain object
    
            // Remove sensitive fields
            delete laborData.password;
            delete laborData.refreshToken;
    
            return res.status(HttpStatus.OK)
              .cookie("LaborRefreshToken", response.refreshToken, this.options) // HTTP-only cookie for refresh token
              .json({
                success: true,
                message: Messages.EXPERIENCE_SAVED_SUCCESSFULLY,
                data: {
                  ...experienceData,
                  certificateUrls,
                  accessToken: response.accessToken, // Include access token here
                  laborData, // Include the labor data
                },
              });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
              error:  Messages.ERROR_IN_EXPERIENCE_SUBMIT
            });
          }
        });
      } catch (error) {
        console.error(Messages.ERROR_IN_EXPERIENCE_SUBMIT, error);
        next(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.INTERNAL_SERVER_ERROR });
      }
    };
}