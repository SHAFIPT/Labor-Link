import { Request, Response } from "express";
import OTPservices from "../services/implementaions/OTPservices"; // OTP service class
import OTPRepository from "../repositories/implementaions/OTPRepository"; // OTP repository
import { AuthService } from "../services/implementaions/AuthServices";
import UserRepository from "../repositories/implementaions/UserRepository";
import { sendEmailOtp } from "../utils/emailService"; // Email sending function
import { ApiError } from "../middleware/errorHander";
import User from "../models/userModel";
import { IUser } from "../entities/UserEntity";
import OtpModel from "models/otpModel";
import ApiResponse from "../utils/Apiresponse";

class AuthController {
    private otpservices: OTPservices;
    private authService: AuthService;


    options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
    };

    constructor() {
        const userRepository = new UserRepository();
        const otpRepository = new OTPRepository();
        this.authService = new AuthService(userRepository);
        // console.log("AuthService initialized:", this.authService); 
        this.otpservices = new OTPservices(otpRepository, sendEmailOtp);
    }


    async loginUser(req: Request, res: Response): Promise<void>{
        try {

            const user = req.body;

            const loginData = await this.authService.login(user)

            console.log('this si loging data',loginData)

             if (loginData?.userFound?.isBlocked) {
                 res.status(401).json(new ApiError(401, "You're blocked", "You're blocked"));
            }
            
            console.log('this is loginData' ,loginData)
 
            if (loginData) {
                res.status(200).cookie("refreshToken", loginData.refreshToken, this.options).json({
                    message: 'User Logined successfully...!',
                    loginData
                })
            } else { 
                res.status(400).json(new ApiError(400 , 'Faild to login user'))
            } 
            
        } catch (error) {
            console.error("Login Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body;
            
            const result = await this.authService.register(user);

            if (result) {
                res.status(201).cookie("refreshToken", result.refreshToken, this.options).json({
                    message: "User registered successfully!",
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                });
            } else {
                throw new ApiError(400, "Failed to register user.");
            }
        } catch (error: any) {
            console.error("Register Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async sendOtp(req: Request, res: Response): Promise<void> {
        try {

            
            const user = req.body;
            
            if (!user) {
                res.status(404).json({ message: 'user is not found..!' })
            }

            const otpExist = await this.otpservices.checkOTPExists(user)

            if (otpExist) {
                res.status(500).json(new ApiError(500, "Please Wait 1 Minute. Before Trying to register again"))
            }

            const Response = await this.otpservices.sendOtp(user as IUser);
            console.log('completed the send otp', Response);
            
            res.status(200).json({ message: "OTP sent successfully!", email: user.email });
        } catch (error: any) {
            console.error("Send OTP Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            console.log('This is emil :', email)
            console.log('This is otp :', otp)
            

            if (!email || !otp) {
                res.status(400).json('Email and OTP are required.')
            }

            const isValidOTP = await this.otpservices.verifyOtp(email, otp);

            console.log('this is ivAalidOtp Response', isValidOTP)

            if (isValidOTP) {
                res.status(200).json({ message: "OTP verified successfully!" });
            } else {
                throw new ApiError(400, "Invalid OTP.");
            }
        } catch (error: any) {
            console.error("Verify OTP Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            console.log('this is the email  : ',email)

            if (!email) {
                throw new ApiError(400, "Email is required.");
            }

            const Response = await this.otpservices.resendOtp(email);
            
            console.log('this resend otp :', Response) 
            res.status(200).json({ message: "OTP resent successfully!" });
        } catch (error: any) {
            console.error("Resend OTP Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async googleSignIn(req: Request, res: Response): Promise<void> {
        try {
            const { displayName, email, photoURL } = req.body;

            console.log('this is displayName :',displayName)
            console.log('this is email :',email)
            console.log('this is photoUrl :',photoURL)

            const userAfterAuth = await this.authService.googleSignIn({
                firstName: displayName,
                email: email, 
                ProfilePic: photoURL,
            }); 

            console.log('====================================');
            console.log(userAfterAuth);
            console.log('====================================');

            res
                .status(200)
                .cookie("refreshToken", userAfterAuth.refreshToken, this.options)
                .json(
                    new ApiResponse(200, userAfterAuth, "User authentication success")
                );
        } catch (error) {
            console.error("Resend OTP Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

   public forgetPassword = async (req: Request, res: Response) => {
    try {
        console.log('this is email from body :', req.body)
        
        const { email } = req.body
        
        console.log('this is email in backend:', email)

        const isUserExists = await this.authService.findUserWithEmail(email)

        console.log('this email exists:', isUserExists)

        if (!isUserExists || isUserExists?.isBlocked) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        isUserExists?.isBlocked
                            ? "Account is blocked"
                            : "Check Your Email"
                    )
                );
        }

        const isOtpExist = await this.otpservices.checkOTPExists(req.body)

        console.log('the OTP exists:', isOtpExist)

        // If OTP exists, inform the user and exit early
        // if (isOtpExist) {
        //     return res.status(500).json(
        //         new ApiError(500, "Please Wait 1 Minute. Before Trying again")
        //     );
        // }

        const ResendOTPResponse = await this.otpservices.sendForgetOtp(req.body);

        // console.log('the backend response:', ResendOTPResponse)

        if (ResendOTPResponse) {
            return res.status(200).json({ message: "OTP sent successfully" });
        } else {
            return res.status(500).json({ message: "Error occurred during forgotPasswordSendOTP" });
        }

    } catch (error) {
        console.error("Resend OTP Error:", error.message || error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
    }
    
    public forgetVerifyOtp = async (req: Request, res: Response) => {
        try {

            const { email, otp } = req.body;

            const isUserExists = await this.authService.findUserWithEmail(email)

            if (!isUserExists || isUserExists?.isBlocked) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        isUserExists?.isBlocked
                            ? "Account is blocked"
                            : "Check Your Email"
                    )
                );
            }
            
            const OTPVerification = await this.otpservices.verifyOtp(email, otp)

            
            if (!OTPVerification) {
                return res.status(500).json(new ApiError(500, "Entered Wrong OTP"));
            }

            const { password, refreshToken, ...user } = isUserExists;

            const accessToken = this.authService.generateTokenForForgotPassword(user);

            return res
                .status(200)
                .cookie("userOtpAccessToken", accessToken)
                .json(
                new ApiResponse(200, { accessToken }, "OTP Verified Successfully")
                );

            
        } catch (error) {
            console.error("forgetPasswordVerify otp errror:", error.message || error);
            return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    public resetPassword = async (req: Request, res: Response) => {
        try {

             const { password, token } = req.body;

            const decode = await this.authService.decodeAndVerifyToken(token);
            req.body.user = decode;

            if (!decode) {
                return res
                .status(405)
                .json(new ApiResponse(405, null, "Session Expired Try Again"));
            }

             const isUserExists = await this.authService.findUserWithEmail(req.body.user)

            if (!isUserExists || isUserExists?.isBlocked) {
                return res
                .status(400)
                .json(
                    new ApiResponse(
                    400,
                    null,
                    isUserExists.isBlocked ? "Account is blocked" : "Something Wrong"
                    )
                );
            }

             const passwordUpdated = await this.authService.changePassword(
                password,
                decode.email
            );


             if (passwordUpdated) {
                return res
                .status(200)
                .json(new ApiResponse(200, null, "reset success"));
            }

            return res
                .status(500)
                .json(new ApiError(500, "something went wrong", "reset Failed"));

            
        } catch (error) {
            console.error("reset new Password  errror:", error.message || error);
            return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }
}
export default AuthController;
