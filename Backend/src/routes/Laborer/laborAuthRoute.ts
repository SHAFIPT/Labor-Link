// import { Router } from "express";
// import AuthLaborController from '../../controllers/authLaborController';
// import { decodedLaborRefreshToken, verifyRefreshLaborTokenMiddleware } from "../../middleware/authMiddleware";

// const laborAuthRoute = Router()
// const authController = new AuthLaborController()   

// laborAuthRoute.post('/login',authController.login.bind(authController))
// laborAuthRoute.post('/registerAboutYou',authController.aboutYou.bind(authController))
// laborAuthRoute.post('/registerProfilePage',authController.profilePage.bind(authController))
// laborAuthRoute.post('/registerExperiencePage', authController.experiencePage.bind(authController))
// laborAuthRoute.post('/forgettPassword',authController.forgetPassword.bind(authController))
// laborAuthRoute.post('/ForgetVerify-otp',authController.forgetVerifyOtp.bind(authController))
// laborAuthRoute.post('/forgot-password-reset',authController.resetPassword.bind(authController))
// laborAuthRoute.post('/logout', decodedLaborRefreshToken, authController.logoutLabor.bind(authController))
// laborAuthRoute.get('/refresh-token', verifyRefreshLaborTokenMiddleware, authController.refreshAccessToken.bind(authController));

// export default laborAuthRoute             