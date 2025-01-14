import { Router } from "express";
import AuthLaborController from '../../controllers/authLaborController';
import { decodedLaborRefreshToken } from "../../middleware/authMiddleware";

const laborAuthRoute = Router()
const authController = new AuthLaborController()

laborAuthRoute.post('/login',authController.login.bind(authController))
laborAuthRoute.post('/registerAboutYou',authController.aboutYou.bind(authController))
laborAuthRoute.post('/registerProfilePage',authController.profilePage.bind(authController))
laborAuthRoute.post('/registerExperiencePage',authController.experiencePage.bind(authController))
laborAuthRoute.patch('/logout', decodedLaborRefreshToken,authController.logoutLabor.bind(authController))

export default laborAuthRoute