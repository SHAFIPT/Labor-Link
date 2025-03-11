import express, { Router } from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
import { userController } from "../../config/container";

const usersRoutes = Router()
usersRoutes.get('/fetchUser',authenticateUser ,userController.fetchUsers.bind(userController))
usersRoutes.post('/profileUpdate',authenticateUser ,userController.profileUpdate.bind(userController))
usersRoutes.post('/UpdatePassword',authenticateUser ,userController.UpdatePassword.bind(userController))
usersRoutes.post('/bookingLabor',userController.bookingLabor.bind(userController))
usersRoutes.get('/fetchId/:email',userController.fetchLaborId.bind(userController))
usersRoutes.get('/fetchBookings',authenticateUser,userController.fetchBookings.bind(userController))
usersRoutes.post('/cancelBooking',userController.cancelBooking.bind(userController))
usersRoutes.put('/update-read-status/:bookingId',userController.updateReadStatus.bind(userController))
usersRoutes.post('/resheduleRequst',userController.reshedulRequest.bind(userController))
usersRoutes.post('/workCompletion/:bookingId',userController.workCompletion.bind(userController))
usersRoutes.post('/pymnetSuccess', userController.pymnetSuccess.bind(userController))
usersRoutes.post('/payment/webhook', express.raw({ type: 'application/json' }), userController.handleStripeWebhook.bind(userController));
usersRoutes.get('/fetchBookingWithId/:bookingId',authenticateUser,userController.fetchBookingWithId.bind(userController))
usersRoutes.get('/suggestions',userController.getSearchSuggestions.bind(userController))
usersRoutes.post('/reviewSubmit/:bookingId', authenticateUser,userController.reviewSubmit.bind(userController))
usersRoutes.get('/fetchAllBooings/:userId',userController.fetchAllBooings.bind(userController))
export default usersRoutes