import { Router } from "express";
import adminAuthRoute from "./adminAuthRoute";

const adminRoute = Router()

adminRoute.use('/auth',adminAuthRoute)

export default adminRoute