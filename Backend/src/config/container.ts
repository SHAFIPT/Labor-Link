import { IUserServices } from "../services/interface/IUserServices";
import { IBookingService } from "../services/interface/IBookingServices";
import { IPaymentService } from "../services/interface/IPaymnetService";
import { IUserSideRepository } from "../repositories/interface/IUserSideRepository";
import { IBookingRepository } from "../repositories/interface/IBookingRepository";
import UserSideRepository from "../repositories/implementaions/UserSideRepository";
import BookingRepository from "../repositories/implementaions/BookingRepository";
import { IPaymnetRepository } from "../repositories/interface/IPaymentRepository";
import PaymnetRepository from "../repositories/implementaions/PaymentRepository";
import UserServices from "../services/implementaions/UserServices";
import BookingServices from "../services/implementaions/BookingServices";
import PaymentService from "../services/implementaions/PaymentService";
import { UserController } from "../controllers/userController";
import LaborSideController from "../controllers/laborControllers";
import { LaborServices } from "../services/implementaions/LaborServices";
import { LaborSideRepository } from "../repositories/implementaions/LaborSideRepository";
import { ILaborService } from "../services/interface/ILaborServices";
import { ILaborSideRepository } from "../repositories/interface/ILaborSideRepository";
import { IAdminRepository } from "../repositories/interface/IAdminRepository";
import { AdminRepositooy } from "../repositories/implementaions/AdminRepository";
import { IAdminService } from "../services/interface/IAdminService";
import { AdminService } from "../services/implementaions/AdminService";
import AdminController from "../controllers/adminController";

// Instantiate Repositories
const userSideRepository: IUserSideRepository = new UserSideRepository();
const bookingRepository: IBookingRepository = new BookingRepository();
const paymentRepository: IPaymnetRepository = new PaymnetRepository();
const laborSideRepository: ILaborSideRepository = new LaborSideRepository();
const adminRepository : IAdminRepository = new AdminRepositooy()

// Instantiate Services
const userService: IUserServices = new UserServices(userSideRepository);
const bookingService: IBookingService = new BookingServices(bookingRepository);
const paymentService: IPaymentService = new PaymentService(paymentRepository);
const laborService: ILaborService = new LaborServices(laborSideRepository);
const adminService: IAdminService = new AdminService(adminRepository)

// Inject dependencies into the controller
export const userController = new UserController(userService, bookingService, paymentService);
export const laborSideController = new LaborSideController(laborService, bookingService, paymentService);
export const adminController = new AdminController(adminService);