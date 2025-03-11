import { authenticate } from "../../middleware/authMiddleware";
import { Router } from "express";

const adminUserRoute = Router()
import { adminController } from "../../config/container";


// users fetch
adminUserRoute.get('/usersFetch',authenticate,adminController.fetchUser.bind(adminController))
    
// labor fetch
adminUserRoute.get('/laborsFetch', authenticate,adminController.fetchLabor.bind(adminController))

adminUserRoute.get('/fetchLaborBookins/:laborId', authenticate, adminController.fetchLaborBookins.bind(adminController))

adminUserRoute.get('/fetchAllBookins', authenticate, adminController.fetchAllBookins.bind(adminController))

adminUserRoute.get('/fetchPendingWidrowRequsts', authenticate, adminController.fetchPendingWidrowRequsts.bind(adminController))

adminUserRoute.put('/submitAcitons/:id', authenticate, adminController.submitAcitons.bind(adminController))

// user block and unBlock
adminUserRoute.patch('/userBlock',authenticate,adminController.userBlock.bind(adminController))
adminUserRoute.patch('/userUnblock',authenticate, adminController.userUnblock.bind(adminController))

// labor block and unBlock
adminUserRoute.patch('/laborBlock',authenticate,adminController.laborBlock.bind(adminController))
adminUserRoute.patch('/laborUnblock', authenticate,adminController.laborUnblock.bind(adminController))

//labor aproove and unApprove
adminUserRoute.patch('/laborApprove',authenticate,adminController.Approve.bind(adminController))
adminUserRoute.patch('/UnApprove', authenticate, adminController.UnApprove.bind(adminController))

//labor rejection with reason
adminUserRoute.post('/rejectionReson', authenticate, adminController.rejectionReson.bind(adminController))

//labor delete
adminUserRoute.delete('/deleteLabor', authenticate, adminController.deleteLabor.bind(adminController))


export default adminUserRoute