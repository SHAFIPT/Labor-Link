import userController from "../../controllers/userController";
import express, { Router } from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
const userSideController = new userController()

const usersRoutes = Router()
usersRoutes.get('/fetchUser',authenticateUser ,userSideController.fetchUsers.bind(userSideController))
usersRoutes.post('/profileUpdate',authenticateUser ,userSideController.profileUpdate.bind(userSideController))
usersRoutes.post('/UpdatePassword',authenticateUser ,userSideController.UpdatePassword.bind(userSideController))
usersRoutes.post('/bookingLabor',userSideController.bookingLabor.bind(userSideController))
usersRoutes.get('/fetchId/:email',userSideController.fetchLaborId.bind(userSideController))
usersRoutes.get('/fetchBookings',authenticateUser,userSideController.fetchBookings.bind(userSideController))
usersRoutes.post('/cancelBooking',userSideController.cancelBooking.bind(userSideController))
usersRoutes.put('/update-read-status/:bookingId',userSideController.updateReadStatus.bind(userSideController))
usersRoutes.post('/resheduleRequst',userSideController.reshedulRequest.bind(userSideController))
usersRoutes.post('/workCompletion/:bookingId',userSideController.workCompletion.bind(userSideController))
usersRoutes.post('/pymnetSuccess', userSideController.pymnetSuccess.bind(userSideController))
usersRoutes.post('/payment/webhook', express.raw({ type: 'application/json' }), userSideController.handleStripeWebhook.bind(userSideController));
usersRoutes.get('/fetchBookingWithId/:bookingId',authenticateUser,userSideController.fetchBookingWithId.bind(userSideController))
usersRoutes.post('/reviewSubmit/:bookingId', authenticateUser,userSideController.reviewSubmit.bind(userSideController))
usersRoutes.get('/fetchAllBooings/:userId',userSideController.fetchAllBooings.bind(userSideController))
export default usersRoutes