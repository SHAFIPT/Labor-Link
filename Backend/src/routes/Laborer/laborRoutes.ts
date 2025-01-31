import { authenticateLabor } from "../../middleware/authMiddleware";
import laborSideController from "../../controllers/laborControllers";
import { Router } from "express";


const laborRoutes = Router()
const laborSideContorller = new laborSideController()

laborRoutes.get('/fetchLabor',authenticateLabor , laborSideContorller.fetchLabors.bind(laborSideContorller))
laborRoutes.post('/updateProfile',authenticateLabor , laborSideContorller.updateProfile.bind(laborSideContorller))
laborRoutes.post('/UpdatePassword',authenticateLabor , laborSideContorller.UpdatePassword.bind(laborSideContorller))
laborRoutes.get('/fetchLaborsByLocation',laborSideContorller.fetchLaborsByLocation.bind(laborSideContorller))
laborRoutes.post('/abouteMe',authenticateLabor , laborSideContorller.abouteMe.bind(laborSideContorller))

export default laborRoutes             