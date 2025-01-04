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

            if (!email) {
                throw new ApiError(400, "Email is required.");
            }

            const user = await User.findOne({ email });
            console.log('this is the user :', user)
            if (!user) {
                throw new ApiError(404, "User not found.");
            }
 
            await this.otpservices.resendOtp(user as IUser);
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
}
export default AuthController;
