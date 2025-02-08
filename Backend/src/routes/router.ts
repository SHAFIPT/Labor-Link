import express , { Router } from "express";
import userRouter from './User/userRoute'
import laborRoute from "./Laborer/laborRoute";
import adminRoute from "./admin/adminRoute";

const router = Router()

router.use("/api/user/users/payment/webhook", express.raw({ type: "application/json" }), userRouter);

router.use(express.json()) 

router.use('/api/user',userRouter)
router.use('/api/labor',laborRoute)
router.use('/api/admin',adminRoute)
// /api/user/labors/fetchLabor
export default router

