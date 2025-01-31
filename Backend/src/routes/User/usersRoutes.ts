import userController from "../../controllers/userController";
import { Router } from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
const userSideController = new userController()
const usersRoutes = Router()
usersRoutes.get('/fetchUser',authenticateUser ,userSideController.fetchUsers.bind(userSideController))
usersRoutes.post('/profileUpdate',authenticateUser ,userSideController.profileUpdate.bind(userSideController))
usersRoutes.post('/UpdatePassword',authenticateUser ,userSideController.UpdatePassword.bind(userSideController))
usersRoutes.post('/bookingLabor',userSideController.bookingLabor.bind(userSideController))
usersRoutes.get('/fetchId/:email',userSideController.fetchLaborId.bind(userSideController))
// /user/users

export default usersRoutes