import { Router } from "express";
import userAuthRoute from "./userAuthRoute";

const userRoute = Router()

userRoute.use('/auth', userAuthRoute)

export default userRoute;