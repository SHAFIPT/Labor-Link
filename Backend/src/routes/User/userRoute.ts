import { Router } from "express";
import userAuthRoute from "./userAuthRoute";
import usersRoutes from "./usersRoutes";

const userRoute = Router()

userRoute.use('/auth', userAuthRoute)
userRoute.use('/users', usersRoutes)

export default userRoute;