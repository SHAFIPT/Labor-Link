import { Router } from "express";
import laborRoutes from "./laborRoutes";

const laborRoute = Router()

laborRoute.use('/labors',laborRoutes)


export default laborRoute