import { Router } from "express";
import userRouter from './User/userRoute'

const router = Router()

router.use('/api/user',userRouter)

export default router