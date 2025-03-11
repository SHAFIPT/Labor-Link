import { Router } from "express";
import usersRoutes from "./usersRoutes";

const userRoute = Router()

userRoute.use('/users', usersRoutes)

export default userRoute;