import { Router } from "express";
import AuthLaborController from '../../controllers/authLaborController';

const laborAuthRoute = Router()
const authController = new AuthLaborController()

laborAuthRoute.post('/registerAboutYou',authController.aboutYou.bind(authController))

export default laborAuthRoute