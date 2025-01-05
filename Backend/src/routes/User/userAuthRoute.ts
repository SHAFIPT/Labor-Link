import { Router } from "express";
import { validateRegistration } from "../../validator/userValidator"; 
import AuthController from "../../controllers/authController";

const userAuthRoute = Router()
const authController = new AuthController()

userAuthRoute.post('/register', validateRegistration, authController.register.bind(authController));
userAuthRoute.post('/send-otp', authController.sendOtp.bind(authController));
userAuthRoute.post('/verify-otp', authController.verifyOtp.bind(authController));
userAuthRoute.post('/resend-otp', authController.resendOtp.bind(authController));
userAuthRoute.post('/google-sign-in',authController.googleSignIn.bind(authController))
userAuthRoute.post('/login',authController.loginUser.bind(authController))
userAuthRoute.post('/forgettPassword',authController.forgetPassword.bind(authController))
userAuthRoute.post('/ForgetVerify-otp',authController.forgetVerifyOtp.bind(authController))
userAuthRoute.post('/forgot-password-reset',authController.resetPassword.bind(authController))

export default userAuthRoute 