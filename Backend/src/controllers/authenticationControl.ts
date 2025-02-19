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
import { ILaborer } from './entities/LaborEntity';
import formidable from 'formidable';
import cloudinary from '../utils/CloudineryCongif';
import { IAuthStrategy } from './entities/AuthStrategy';
import { IAdminAuthStrategy } from './entities/AdminAuthStrategy';

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

      console.log('Thsi is the refreshToken.....jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',result)

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
  req: Request & { user?: any; labor?: any; admin?: any }, 
  res: Response
) => {
    try {
      
    const role = req.user ? "user" : req.labor ? "labor" : req.admin ? "admin" : null;

          
    const entity = req.user || req.labor || req.admin;

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

        const cookieName =
        role === "user"
          ? "UserRefreshToken"
          : role === "labor"
          ? "LaborRefreshToken"
          : "AdminRefreshToken";

        return res.status(200)
        .cookie(cookieName, result.refreshToken, this.options)    
        .json(new ApiResponse(200, result, "Google Sign-In successful"));

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

        console.log('Theeeeeeeeeeeeeee aoubt ROleeeeeeeeee:',role)

        const strategy = AuthStrategyFactory.createStrategy(role);

        if (!strategy.registerAboutYou) {
            return res.status(400).json(new ApiError(400, "registerAboutYou method is not defined in the strategy."));
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

        return res.status(200).json({ success: true, data: laborer });

    } catch (error) {
        // It's important to log or handle the error properly
        console.error(error);
        next(error)
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
    };
    

     public profilePage = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => { 
          console.log('iam  here see ;')
         const { email } = req.body
         const role = 'labor'
    
         console.log('this is email : ', email)
         console.log('Thsi sie th reole ',role)
        const form = formidable({ multiples: true });
    console.log('ebddddddddddddddddd')
        form.parse(req, async (err, field, files) => {
          if (err) {
            console.error("Error parsing form data :", err);
            return res.status(500).json({ error: "Errror parse form data..." });
            }
            
                console.log('mayreeeeeeeeeeeeeeeee')
    
            const imageFile = files.image ? files.image[0] : null;

            console.log('this is image file is back end :',imageFile)
          if (imageFile) {
            try {
    
                const result = await cloudinary.uploader.upload(imageFile.filepath,{folder : 'labor_profiles'})
    
                console.log('this is image result :', result)
                
                const imageUrl = result.secure_url;
            
                console.log('this is the image url to save :', imageUrl)
                
                const { category, skill, startTime, endTime, availability ,email } = field;
    
                console.log('this is category :',category)
                console.log('this is skill :',skill)
                console.log('this is startTime :',startTime)
                console.log('this is endTime :',endTime)
                console.log('this is availability :', availability)
                console.log('this is email :', email)
    
                const parsedAvailability = JSON.parse(field.availability[0]);
    
                console.log('this is parsedAvailability :  ++++++======&&&&&^^^#####3333', parsedAvailability)


                const strategy = AuthStrategyFactory.createStrategy(role);

                if (!strategy.registerAboutYou) {
                    return res.status(400).json(new ApiError(400, "registerAboutYou method is not defined in the strategy."));
                }


                console.log('Tiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                const response = await strategy.registerProfile({
                    profilePicture: imageUrl,
                    categories : category,
                    skill : skill,
                    startTime : startTime[0],
                    endTime : endTime[0],
                    availability: parsedAvailability,
                    email : email[0]
                })
                console.log('resoponse from backend :', response)
                if (response) {
                   return res.status(200).json({   
                    success: true, data: response 
                }); 
                } else {
                    return res.status(400).json({ error: 'error occurred ducing profile page submisingon...' });
                }
    
            } catch (error) {
              console.error("Error in profile controller:", error);
              next(error);
              console.error('Cloudinary upload error:', error);
              return res.status(500).json({ error: 'Error uploading image to Cloudinary.' });
            }
          } else {
              return res.status(400).json({ error: 'Image is required.' });
          }
        });
    };
    
    public experiencePage = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const role = 'labor'
        const form = formidable({ multiples: true });
    
        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Error parsing form data:", err);
            return res.status(500).json({ error: "Error parsing form data" });
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
              console.error("Error uploading ID image:", error);
              return res.status(500).json({ error: "Failed to upload ID image" });
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
              console.error("Error uploading certificate image:", error);
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
                    return res.status(400).json(new ApiError(400, "registerAboutYou method is not defined in the strategy."));
                }
    
             const response = await strategy.registerExperience(experienceData);
    
          if (response) {
            const laborData = { ...response.labor.toObject() }; // Convert to plain object
    
            // Remove sensitive fields
            delete laborData.password;
            delete laborData.refreshToken;
    
    
            console.log("Thsi sithe labordeata ++++_________++++++++",laborData)
    
            return res.status(200)
              .cookie("LaborRefreshToken", response.refreshToken, this.options) // HTTP-only cookie for refresh token
              .json({
                success: true,
                message: "Experience data saved successfully",
                data: {
                  ...experienceData,
                  certificateUrls,
                  accessToken: response.accessToken, // Include access token here
                  laborData, // Include the labor data
                },
              });
          } else {
            return res.status(400).json({ 
              error: 'Error occurred during ExperiencePage submission!' 
            });
          }
        });
      } catch (error) {
        console.error("Error in experiencePage controller:", error);
        next(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    };



  // Additional methods like forgetPassword, resetPassword, etc. would follow the same pattern
}