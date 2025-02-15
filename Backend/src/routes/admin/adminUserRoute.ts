import { authenticate } from "../../middleware/authMiddleware";
import adminController from "../../controllers/adminController";
import { Router } from "express";

const adminUserRoute = Router()
const adminUserController = new adminController()


// users fetch
adminUserRoute.get('/usersFetch',authenticate,adminUserController.fetchUser.bind(adminUserController))
    
// labor fetch
adminUserRoute.get('/laborsFetch', authenticate,adminUserController.fetchLabor.bind(adminUserController))

adminUserRoute.get('/fetchLaborBookins/:laborId', authenticate, adminUserController.fetchLaborBookins.bind(adminUserController))

adminUserRoute.get('/fetchAllBookins', authenticate, adminUserController.fetchAllBookins.bind(adminUserController))

adminUserRoute.get('/fetchPendingWidrowRequsts', authenticate, adminUserController.fetchPendingWidrowRequsts.bind(adminUserController))

adminUserRoute.put('/submitAcitons/:id', authenticate, adminUserController.submitAcitons.bind(adminUserController))

// user block and unBlock
adminUserRoute.patch('/userBlock',authenticate,adminUserController.userBlock.bind(adminUserController))
adminUserRoute.patch('/userUnblock',authenticate, adminUserController.userUnblock.bind(adminUserController))

// labor block and unBlock
adminUserRoute.patch('/laborBlock',authenticate,adminUserController.laborBlock.bind(adminUserController))
adminUserRoute.patch('/laborUnblock', authenticate,adminUserController.laborUnblock.bind(adminUserController))

//labor aproove and unApprove
adminUserRoute.patch('/laborApprove',authenticate,adminUserController.Approve.bind(adminUserController))
adminUserRoute.patch('/UnApprove', authenticate, adminUserController.UnApprove.bind(adminUserController))

//labor rejection with reason
adminUserRoute.post('/rejectionReson', authenticate, adminUserController.rejectionReson.bind(adminUserController))

//labor delete
adminUserRoute.delete('/deleteLabor', authenticate, adminUserController.deleteLabor.bind(adminUserController))


export default adminUserRoute