import { IUserServices } from "../services/interface/IUserServices";
import { Request, Response, NextFunction } from "express"
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';
import { IBooking } from "./entities/bookingEntity";
import Stripe from 'stripe';
import { IBookingService } from "../services/interface/IBookingServices";
import { IPaymentService } from "../services/interface/IPaymnetService";
import { HttpStatus } from "../enums/HttpStatus";
import { Messages } from "../constants/Messages";
import { ApiError } from "../middleware/errorHander";

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});


export class UserController {
  private userService: IUserServices;
  private bookingService: IBookingService;
  private paymentService: IPaymentService;

  constructor(
    userService: IUserServices,
    bookingService: IBookingService,
    paymentService: IPaymentService
  ) {
    this.userService = userService;
    this.bookingService = bookingService;
    this.paymentService = paymentService;
  }

  public fetchUsers = async (
    req: Request & Partial<{ user: DecodedToken }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }

      const fetchUserResponse = await this.userService.fetchUserDetails(userId);

      if (fetchUserResponse) {
        res.status(HttpStatus.OK).json({
          message: Messages.USERS_FETCH_SUCCESS,
          fetchUserResponse,
        });
      } else {
        throw new Error(Messages.USERS_FETCH_FAILURE);
      }
    } catch (error) {
      console.error(Messages.USERS_FETCH_FAILURE, error);
      next(error);
    }
  };

  public profileUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: Messages.FORM_PARSE_ERROR,
        });
      }

      try {
        const { firstName, lastName, email } = fields;
        const imageFile = files.image ? files.image[0] : null;
        let imageUrl;

        // Upload image to Cloudinary if provided
        if (imageFile) {
          const uploadResult = await cloudinary.uploader.upload(
            imageFile.filepath,
            {
              folder: "user_profiles",
            }
          );
          imageUrl = uploadResult.secure_url;
        }

        const response = await this.userService.UpdateUser({
          firstName: firstName[0],
          lastName: lastName[0],
          email: email[0],
          ProfilePic: imageUrl,
        });

        if (response) {
          return res.status(HttpStatus.OK).json({
            message: Messages.PROFILE_UPDATE_SUCCESS,
            updatedUser: response,
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: Messages.PROFILE_UPDATE_FAILURE,
          });
        }
      } catch (error) {
        console.error(Messages.PROFILE_UPDATE_FAILURE, error);
        next(error);
      }
    });
  };

  public UpdatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          Messages.EMAIL_PASSWORD_REQUIRED
        );
      }

      const response = await this.userService.updatePassword(email, password);

      if (response) {
        return res.status(HttpStatus.OK).json({
          message: Messages.PASSWORD_UPDATE_SUCCESS,
          updatedUser: response,
        });
      } else {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          Messages.PASSWORD_UPDATE_FAILURE
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      next(error);
    }
  };
  

  public bookingLabor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId, laborId, quote, addressDetails } = req.body;

      if (!quote?.description || !quote?.estimatedCost || !quote?.arrivalTime) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_MISSING_QUOTE_FIELDS });
      }

      if (
        !addressDetails?.district ||
        !addressDetails?.place ||
        !addressDetails?.address ||
        !addressDetails?.pincode ||
        !addressDetails?.phone ||
        !addressDetails?.name
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_MISSING_ADDRESS_FIELDS });
      }

      const bookingDetails: Partial<IBooking> = {
        userId,
        laborId,
        quote: {
          description: quote.description,
          estimatedCost: quote.estimatedCost,
          arrivalTime: quote.arrivalTime,
        },
        addressDetails: {
          ...addressDetails,
          Userlatitude: addressDetails.latitude,
          Userlongitude: addressDetails.longitude,
        },
      };

      if (!userId || !laborId || !quote) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_MISSING_FIELDS });
      }

      const BookingResponse = await this.bookingService.bookingLabor(
        bookingDetails
      );

      if (BookingResponse) {
        res.status(201).json({
          message: Messages.BOOKING_SUCCESS,
          booking: BookingResponse,
        });
      }
    } catch (error) {
      console.error("Error in booking labor:", error);
      next(error);
    }
  };

  public fetchLaborId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.params;

      if (!email) {
        throw new Error(Messages.EMAIL_NOT_PROVIDED);
      }

      email as string;

      const laborId = await this.userService.fetchLaborId(email);
      if (laborId) {
        res.status(HttpStatus.OK).json({ laborId });
      } else {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          Messages.LABOR_ID_FETCH_FAILURE
        );
      }
    } catch (error) {
      console.error("Error in booking labor:", error);
      next(error);
    }
  };

  public fetchBookings = async (
    req: Request & { user: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      if (!userId) {
        throw new Error(Messages.USER_NOT_FOUND);
      }

      const filter = status ? { status } : {};

      const { bookings, total } = await this.bookingService.fetchBooking(
        userId,
        page,
        limit,
        filter
      );

      if (bookings) {
        return res.status(HttpStatus.OK).json({
          message: Messages.BOOKINGS_FETCH_SUCCESS,
          bookings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        });
      }
    } catch (error) {
      console.error("Error in fetch booking....:", error);
      next(error);
    }
  };

  public cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId, reason, comments, isWithin30Minutes, canceledBy } =
        req.body;

      if (!bookingId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.CANCEL_BOOKING_MISSING_ID });
      }

      const cancelledBooking = await this.bookingService.cancelBooking({
        bookingId,
        reason,
        comments,
        isWithin30Minutes,
        canceledBy,
      });

      if (!cancelledBooking) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.CANCEL_BOOKING_FAILURE });
      }

      res.status(HttpStatus.OK).json({
        message: Messages.CANCEL_BOOKING_SUCCESS,
        booking: cancelledBooking,
      });
    } catch (error) {
      console.error("Error in cancell booking", error);
      next(error);
    }
  };

  public updateReadStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;
      const { isUserRead } = req.body;

      if (!bookingId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_ID_REQUIRED });
      }

      const updatedBooking = await this.bookingService.updateReadStatus(
        bookingId,
        isUserRead
      );

      return res.status(200).json({
        message: Messages.BOOKING_READ_STATUS_UPDATED,
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Error in updating read status", error);
      next(error);
    }
  };

  public reshedulRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId, newDate, newTime, reason, requestSentBy } = req.body;

      const resheduleRequst = await this.bookingService.resheduleRequst(
        bookingId,
        newDate,
        newTime,
        reason,
        requestSentBy
      );

      if (resheduleRequst) {
        return res.status(HttpStatus.OK).json({
          message: Messages.RESCHEDULE_SUCCESS,
          reshedule: resheduleRequst,
        });
      }
    } catch (error) {
      console.error("Error in reshedule request.", error);
      next(error);
    }
  };

  public workCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;
      const updateData = req.body;

      if (!bookingId || !updateData) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.WORK_COMPLETION_MISSING_FIELDS });
      }

      const response = await this.bookingService.workCompletion(
        bookingId,
        updateData
      );

      if (response) {
        return res.status(HttpStatus.OK).json({
          message: Messages.WORK_COMPLETION_SUCCESS,
          reshedule: response,
        });
      }
    } catch (error) {
      console.error("Error in workCompletions.", error);
      next(error);
    }
  };

  public pymnetSuccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId, laborId, userId } = req.body;

      if (!bookingId || !laborId || !userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.PAYMENT_MISSING_FIELDS });
      }

      const successResponse = await this.paymentService.pymentSuccess(
        bookingId,
        laborId,
        userId
      );

      if (successResponse) {
        return res.status(HttpStatus.OK).json({
          message: Messages.PAYMENT_SUCCESS,
          pymentRespnose: successResponse,
        });
      }
    } catch (error) {
      console.error("Error in pyment section.", error);
      next(error);
    }
  };

  public handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      await this.paymentService.updateWebhook(event, sig);

      res.status(HttpStatus.OK).send({ received: true });
    } catch (error) {
      console.log(error);
    }
  };

  public fetchBookingWithId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKING_NOT_FOUND });
      }

      const fetchedBooking = await this.bookingService.fetchBookinById(
        bookingId
      );

      if (!fetchedBooking) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKINGS_FETCH_FAILURE });
      }

      if (fetchedBooking) {
        return res.status(HttpStatus.OK).json({
          message: Messages.BOOKINGS_FETCH_SUCCESS,
          fetchedBooking,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public reviewSubmit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.REVIEW_MISSING_BOOKING_ID });
      }

      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: Messages.REVIEW_FORM_PARSE_ERROR });
        }

        const rating = Array.isArray(fields.rating)
          ? fields.rating[0]
          : fields.rating;
        const feedback = Array.isArray(fields.feedback)
          ? fields.feedback[0]
          : fields.feedback;

        const images: string[] = [];

        if (files.image1) {
          const uploadResult1 = await cloudinary.uploader.upload(
            files.image1[0].filepath,
            {
              folder: "review_images",
            }
          );
          images.push(uploadResult1.secure_url);
        }

        if (files.image2) {
          const uploadResult2 = await cloudinary.uploader.upload(
            files.image2[0].filepath,
            {
              folder: "review_images",
            }
          );
          images.push(uploadResult2.secure_url);
        }

        const reiveSubmiting = await this.userService.reviewUpload(
          bookingId,
          rating,
          feedback,
          images
        );

        if (!reiveSubmiting) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: Messages.REVIEW_UPLOAD_ERROR });
        }

        return res.status(200).json({
          message: Messages.REVIEW_SUBMIT_SUCCESS,
          reiveSubmiting,
        });
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
  };

  public fetchAllBooings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: Messages.BOOKING_USER_ID_MISSING });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;

      const filter = status ? { status } : {};

      const {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        totalAmount,
      } = await this.bookingService.fetchAllBookings(
        userId,
        page,
        limit,
        filter
      );

      if (!bookings) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: Messages.BOOKINGS_FETCH_FAILURE 
        });
      }

      return res.status(HttpStatus.OK).json({
        message: Messages.BOOKINGS_FETCH_SUCCESS,
        bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        completedBookings,
        canceledBookings,
        totalAmount,
      });
    } catch (error) {
      console.log(error);
      next();
    }
  };

  public getSearchSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { query } = req.query;

      if (typeof query !== "string" || query.length < 2) {
        return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: Messages.SEARCH_QUERY_TOO_SHORT,
            });
      }

      const suggestions = await this.userService.getSearchSuggest(query);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: suggestions,
        message: Messages.SEARCH_SUGGESTIONS_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      next();
    }
  };
}

export default UserController;



















