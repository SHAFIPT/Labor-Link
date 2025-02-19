import { Router } from "express";
// import laborAuthRoute from "./laborAuthRoute";
import laborRoutes from "./laborRoutes";

const laborRoute = Router()

// laborRoute.use('/auth',laborAuthRoute)
laborRoute.use('/labors',laborRoutes)


export default laborRoute