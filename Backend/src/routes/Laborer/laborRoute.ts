import { Router } from "express";
import laborAuthRoute from "./laborAuthRoute";

const laborRoute = Router()

laborRoute.use('/auth',laborAuthRoute)


export default laborRoute