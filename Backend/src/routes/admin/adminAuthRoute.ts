import { decodedAdminRefreshToken } from "../../middleware/authMiddleware";
import adminController from "../../controllers/authAdminController";
import { Router } from "express";

const adminAuthRoute = Router()
const adminControllerAuth = new adminController()

adminAuthRoute.post('/adminLoginPage',adminControllerAuth.login.bind(adminControllerAuth))
adminAuthRoute.post('/logout', decodedAdminRefreshToken,adminControllerAuth.logout.bind(adminControllerAuth))

export default adminAuthRoute