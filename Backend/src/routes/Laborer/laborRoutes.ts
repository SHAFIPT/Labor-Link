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
laborRoutes.get('/fetchBooking',authenticateLabor , laborSideContorller.fetchBooking.bind(laborSideContorller))
laborRoutes.get('/fetchSimilorLabors' , laborSideContorller.fetchSimilorLabors.bind(laborSideContorller))
laborRoutes.get('/fetchBooking/:bookingId' , laborSideContorller.fetchBookings.bind(laborSideContorller))
laborRoutes.post('/submitRejection',laborSideContorller.submitRejection.bind(laborSideContorller))
laborRoutes.put('/acceptBooking/:bookingId',laborSideContorller.acceptBooking.bind(laborSideContorller))

export default laborRoutes             