import { Router } from "express";
import adminUserRoute from "./adminUserRoute";

const adminRoute = Router()

adminRoute.use('/user',adminUserRoute)

export default adminRoute          