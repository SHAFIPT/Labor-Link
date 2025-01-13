import { Router } from "express";
import userRouter from './User/userRoute'
import laborRoute from "./Laborer/laborRoute";
import adminRoute from "./admin/adminRoute";

const router = Router()

router.use('/api/user',userRouter)
router.use('/api/labor',laborRoute)
router.use('/api/admin',adminRoute)

export default router