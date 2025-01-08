import { Router } from "express";
import userRouter from './User/userRoute'
import laborRoute from "./Laborer/laborRoute";

const router = Router()

router.use('/api/user',userRouter)
router.use('/api/labor',laborRoute)

export default router