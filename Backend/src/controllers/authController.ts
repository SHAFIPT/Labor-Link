import { Request, Response } from "express";
import OTPservices from "../services/implementaions/OTPservices"; // OTP service class
import OTPRepository from "../repositories/implementaions/OTPRepository"; // OTP repository
import { AuthService } from "../services/implementaions/AuthServices";
import UserRepository from "../repositories/implementaions/UserRepository";
import { sendEmailOtp } from "../utils/emailService"; // Email sending function
import { ApiError } from "../middleware/errorHander";
import User from "../models/userModel";
import { IUser } from "../entities/UserEntity";

class AuthController {
    private otpservices: OTPservices;
    private authService: AuthService;

    constructor() {
        const userRepository = new UserRepository();
        const otpRepository = new OTPRepository();
        this.authService = new AuthService(userRepository);
        // console.log("AuthService initialized:", this.authService); 
        this.otpservices = new OTPservices(otpRepository, sendEmailOtp);
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

 
            if (!email || !password) {
                throw new ApiError(400, "Email and password are required.");
            }

            console.log('BEFORE')
            
            const result = await this.authService.register({ email, password });

            // console.log('This is the result',result)

            if (result) {
                res.status(201).json({
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
            const { email } = req.body;
            
            console.log('this is email from body',email);
            

            if (!email) {
                throw new ApiError(400, "Email is required.");
            }

            const user = await User.findOne({ email });
            console.log('this is the user finded ',user);
            if (!user) {
                throw new ApiError(404, "User not found.");
            }

            await this.otpservices.sendOtp(user as IUser);
            console.log('completed the send otp');
            
            res.status(200).json({ message: "OTP sent successfully!" });
        } catch (error: any) {
            console.error("Send OTP Error:", error.message || error);
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                res.status(400).json('Email and OTP are required.')
            }

            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json("User not found.")
            }

            const isValidOTP = await this.otpservices.verifyOtp(user as IUser, otp);

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
            console.log('this is the user :',user)
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
}

export default AuthController;
