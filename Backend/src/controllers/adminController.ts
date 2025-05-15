import ApiResponse from "../utils/Apiresponse";
import { AdminRepositooy } from "../repositories/implementaions/AdminRepository";
import { AdminService } from "../services/implementaions/AdminService";
import { IAdminService } from "../services/interface/IAdminService";
import { Request , Response ,NextFunction } from "express"
import { ApiError } from "../middleware/errorHander";
import { HttpStatus } from "../enums/HttpStatus";
import { Messages } from "../constants/Messages";

class AdminController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  public fetchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = (req.query.query as string) || "";
      const filter = (req.query.filter as string) || "";
      const page = parseInt((req.query.page as string) || "1");
      const perPage = 6;
      const skip = (page - 1) * perPage;

      const totalCount = await this.adminService.getTotalUsersCount(query);
      const usersFound = await this.adminService.fetchUsers(
        query,
        skip,
        perPage,
        filter
      );

      if (usersFound) {
        const totalPages = Math.ceil(totalCount / perPage);
        const userDetails = {
          usersFound,
          totalPage: totalPages,
        };
        res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              HttpStatus.OK,
              userDetails,
              Messages.USERS_FETCH_SUCCESS
            )
          );
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new ApiError(HttpStatus.OK, Messages.USERS_FETCH_FAILURE));
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      return next(error);
    }
  };

  public fetchLabor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {        
    try {
      const query = (req.query.query as string) || "";
      const filter = (req.query.filter as string) || "";
      const page = parseInt((req.query.page as string) || "1");
      const perPage = 6;
      const skip = (page - 1) * perPage;

      const totalCount = await this.adminService.getTotalLaborsCount(query);   
      const laborFound = await this.adminService.fetchLabors(
        query,
        skip,   
        perPage,
        filter
      );

      if (laborFound) {
        const totalPages = Math.ceil(totalCount / perPage);
        const LaborDetails = {
          laborFound,
          totalPage: totalPages,
        };
        res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              HttpStatus.OK,
              LaborDetails,
              Messages.LABOR_FETCH_SUCCESSFULY
            )
          );
      } else {
        console.log("this is the errorr");
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new ApiError(400, Messages.FAILD_TO_FETCH_LABORS));
      }
    } catch (error) {
      console.error("Error in admin login:", error);
      return next(error);
    }
  };

  public userBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const blockResponse = await this.adminService.blockUser(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.USER_BLOCKED_SUCCESSFULY,
        user: blockResponse,
      });
    } catch (error) {
      console.error("Error in user block:", error);
      next(error);
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          error: error.message || Messages.INTERNAL_SERVER_ERROR,
        });
    }
  };

  public userUnblock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const unblockResponse = await this.adminService.unblockUser(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.USER_UNBLOCKED_SUCCESSFULY,
        user: unblockResponse,
      });
    } catch (error) {
      console.error("Error in user unblock:", error);
      next(error);
    }
  };

  public laborBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const blockResponse = await this.adminService.blockLabor(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.LABOR_BLOCKED_SUCCESSFULY,
        user: blockResponse,
      });
    } catch (error) {
      console.error("Error in labor block:", error);
      next(error);
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          error: error.message || Messages.INTERNAL_SERVER_ERROR,
        });
    }
  };

  public laborUnblock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const unblockResponse = await this.adminService.unblockLabor(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.LABOR_UNBLOCKED_SUCCESSFULY,
        labor: unblockResponse,
      });
    } catch (error) {
      console.error("Error in labor unblock:", error);
      next(error);
    }
  };

  public Approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const ApproveResonse = await this.adminService.approveLabor(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.LABOR_SUCCESSFULY_APPROVED,
        labor: ApproveResonse,
      });
    } catch (error) {
      console.error("Error in labor unblock:", error);
      next(error);
    }
  };

  public UnApprove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const UnApproveResonse = await this.adminService.UnApproveLabor(email);

      return res.status(HttpStatus.OK).json({
        message: Messages.LABOR_SUCCESSFULY_UNAPPROVED,
        labor: UnApproveResonse,
      });
    } catch (error) {
      console.error("Error in labor unblock:", error);
      next(error);
    }
  };

  public rejectionReson = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, reason } = req.body;

      const updatedLabor = await this.adminService.existLaborAndSendMail(
        email,
        reason
      );

      if (!updatedLabor) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.LABOR_NOT_FOUND });
      } else {
        return res
          .status(HttpStatus.OK)
          .json({
            message: Messages.LABOR_REJECTION_SUBMITED_SUCCESSFULLY,
            updatedLabor,
          });
      }
    } catch (error) {
      console.error("Error in labor rejections :", error);
      next(error);
    }
  };

  public deleteLabor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.query as { email: string };

      const response = await this.adminService.deleteLabor(email);

      if (response) {
        return res
          .status(HttpStatus.OK)
          .json({ message: Messages.DELETE_LAOBR_SUCCESSFULL });
      } else {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          Messages.ERROR_IN_LABOR_REMOVAL
        );
      }
    } catch (error) {
      console.error("Error in labor deletion :", error);
      next(error);
    }
  };
  public fetchLaborBookins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { laborId } = req.params;

      if (!laborId) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: Messages.LABOR_ID_NOTFOUND });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string | undefined;

      const { bookings, total } = await this.adminService.fetchLaborBookins(
        laborId,
        page,
        limit,
        filter
      );

      if (!bookings) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.NO_BOOKING_FOUND_BY_LABOR });
      }

      res.status(HttpStatus.OK).json({
        message: Messages.BOOKINGS_FETCH_SUCCESS,
        bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("Error in fetch labors... :", error);
      next(error);
    }
  };

  public fetchAllBookins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string | undefined;

      const {
        bookings,
        total,
        totalLabors,
        totalUsers,
        totalAmount,
        bookingStats,
        totalLaborErnigs,
        totalCompnyProfit,
      } = await this.adminService.fetchAllBookings(page, limit, filter);

      if (!bookings) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKING_NOT_FOUND });
      }

      res.status(HttpStatus.OK).json({
        message: Messages.BOOKINGS_FETCH_SUCCESS,
        bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalLabors,
        totalUsers,
        totalAmount,
        bookingStats,
        totalLaborErnigs,
        totalCompnyProfit,
      });
    } catch (error) {
      console.error("Error in fetch all bookings.. :", error);
      next(error);
    }
  };

  public fetchPendingWidrowRequsts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fetchedResponse = await this.adminService.fetchAllWithrowRequst();

      res
        .status(HttpStatus.OK)
        .json({
          message: Messages.WITHDROWAL_FETCH_SUCCESSFULL,
          fetchedResponse,
        });
    } catch (error) {
      console.error("Error in fetch all widrow penings.. :", error);
      next(error);
    }
  };
  public submitAcitons = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;


      if (!id) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: Messages.WITHDOWAL_ID_IS_MISSING });
      }

      const { status } = req.body;

      if (!status) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: Messages.WITHDOWAL_STATUS_IS_MISSING });
      }

      const response = await this.adminService.submitAction(id, status);

      return res
        .status(HttpStatus.OK)
        .json({ message: Messages.ACTION_SUBMITED_SUCCSSFULLY, response });
    } catch (error) {
      console.error("Error in submit acctions....:", error);
      next(error);
    }
  };
}

export default AdminController;
