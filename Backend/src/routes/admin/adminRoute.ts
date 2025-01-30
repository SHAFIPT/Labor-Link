import { Router } from "express";
import adminAuthRoute from "./adminAuthRoute";
import adminUserRoute from "./adminUserRoute";

const adminRoute = Router()

adminRoute.use('/auth',adminAuthRoute)
adminRoute.use('/user',adminUserRoute)

export default adminRoute          