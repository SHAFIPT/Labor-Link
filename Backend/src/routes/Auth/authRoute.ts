import { identifyUserRole } from "../../middleware/authMiddleware";
import { UnifiedAuthController } from "../../controllers/authenticationControl";
import { Router } from "express";

const authRoute = Router();

const authController = new UnifiedAuthController();

authRoute.post('/login', authController.login.bind(authController));
authRoute.post('/logout',identifyUserRole, authController.logout.bind(authController));
authRoute.post('/register', authController.register.bind(authController));
authRoute.post('/send-otp', authController.sendOtp.bind(authController));
authRoute.post('/verify-otp', authController.verifyOtp.bind(authController));
authRoute.post('/register', authController.register.bind(authController));
authRoute.post('/google-sign-in', authController.googleSignIn.bind(authController));
authRoute.post('/resend-otp', authController.resendOtp.bind(authController));
authRoute.post('/forgettPassword', authController.forgetPassword.bind(authController));
authRoute.post('/ForgetVerify-otp', authController.forgetVerifyOtp.bind(authController));
authRoute.post('/forgot-password-reset', authController.resetPassword.bind(authController));

export default authRoute;
    