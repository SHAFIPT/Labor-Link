import { Router } from "express";
import { validateRegistration } from "../../validator/userValidator"; 
import AuthController from "../../controllers/authController";
import {authenticateUser, decodedUserRefreshToken } from "../../middleware/authMiddleware";

const userAuthRoute = Router()
const authController = new AuthController()

userAuthRoute.post('/register', validateRegistration, authController.register.bind(authController));
userAuthRoute.post('/send-otp', authController.sendOtp.bind(authController));
userAuthRoute.post('/verify-otp', authController.verifyOtp.bind(authController));
userAuthRoute.post('/resend-otp', authController.resendOtp.bind(authController));
userAuthRoute.post('/google-sign-in',authController.googleSignIn.bind(authController))
userAuthRoute.post('/Userlogin',authController.loginUser.bind(authController))
userAuthRoute.post('/forgettPassword',authController.forgetPassword.bind(authController))
userAuthRoute.post('/ForgetVerify-otp',authController.forgetVerifyOtp.bind(authController))
userAuthRoute.post('/forgot-password-reset',authController.resetPassword.bind(authController))
userAuthRoute.get('/checkIsBlock',authenticateUser ,authController.checkIsBlock.bind(authController))
userAuthRoute.get('/refresh-token', decodedUserRefreshToken, authController.checkIsBlock.bind(authController));
userAuthRoute.patch('/log_out',decodedUserRefreshToken,authController.logout.bind(authController))

export default userAuthRoute 