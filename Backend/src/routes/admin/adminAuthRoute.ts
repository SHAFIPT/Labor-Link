import { decodedAdminRefreshToken } from "../../middleware/authMiddleware";
import adminController from "../../controllers/authAdminController";
import { verifyRefreshAdminTokenMiddleware } from "../../middleware/authMiddleware";
import { Router } from "express";

const adminAuthRoute = Router()
const adminControllerAuth = new adminController()

adminAuthRoute.post('/adminLoginPage',adminControllerAuth.login.bind(adminControllerAuth))
adminAuthRoute.post('/logout', decodedAdminRefreshToken, adminControllerAuth.logout.bind(adminControllerAuth))
adminAuthRoute.get('/refresh-token',verifyRefreshAdminTokenMiddleware ,adminControllerAuth.refreshAccessToken.bind(adminControllerAuth))

export default adminAuthRoute