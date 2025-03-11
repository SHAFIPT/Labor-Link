import { authenticateLabor, authenticateUser } from "../../middleware/authMiddleware";
import { Router } from "express";


const laborRoutes = Router()
import { laborSideController } from "../../config/container";

laborRoutes.get('/fetchLabor',authenticateLabor , laborSideController.fetchLabors.bind(laborSideController))
laborRoutes.post('/updateProfile',authenticateLabor , laborSideController.updateProfile.bind(laborSideController))
laborRoutes.post('/UpdatePassword',authenticateLabor , laborSideController.UpdatePassword.bind(laborSideController))
laborRoutes.get('/fetchLaborsByLocation',laborSideController.fetchLaborsByLocation.bind(laborSideController))
laborRoutes.post('/abouteMe',authenticateLabor , laborSideController.abouteMe.bind(laborSideController))
laborRoutes.get('/fetchBooking',authenticateLabor , laborSideController.fetchBooking.bind(laborSideController))
laborRoutes.get('/fetchSimilorLabors' , laborSideController.fetchSimilorLabors.bind(laborSideController))
laborRoutes.get('/fetchBooking/:bookingId' , laborSideController.fetchBookings.bind(laborSideController))
laborRoutes.post('/submitRejection',laborSideController.submitRejection.bind(laborSideController))
laborRoutes.put('/acceptBooking/:bookingId',laborSideController.acceptBooking.bind(laborSideController))
laborRoutes.post('/additionalCharge',authenticateLabor,laborSideController.additionalCharge.bind(laborSideController))
laborRoutes.patch('/acceptRequst/:bookingId',laborSideController.acceptRequst.bind(laborSideController))
laborRoutes.patch('/rejectRequst/:bookingId', laborSideController.rejectRequst.bind(laborSideController))
laborRoutes.get('/withdrowalRequests/:laborId', laborSideController.withdrowalRequests.bind(laborSideController))
laborRoutes.get('/fetchIsBookingExist', laborSideController.fetchIsBookingExist.bind(laborSideController))
laborRoutes.get('/fetchAllBookingOfLabor', laborSideController.fetchAllBookingOfLabor.bind(laborSideController))
laborRoutes.get('/fetchAllLabors', laborSideController.fetchAllLabors.bind(laborSideController))
laborRoutes.post('/witdrowWalletAmount',authenticateLabor, laborSideController.witdrowWalletAmount.bind(laborSideController))

export default laborRoutes             