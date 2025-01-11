import { Router } from "express";
import AuthLaborController from '../../controllers/authLaborController';

const laborAuthRoute = Router()
const authController = new AuthLaborController()

laborAuthRoute.post('/registerAboutYou',authController.aboutYou.bind(authController))
laborAuthRoute.post('/registerProfilePage',authController.profilePage.bind(authController))
laborAuthRoute.post('/registerExperiencePage',authController.experiencePage.bind(authController))

export default laborAuthRoute