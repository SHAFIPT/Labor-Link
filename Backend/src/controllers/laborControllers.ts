import { ILaborService } from "../services/interface/ILaborServices"
import { Request , Response ,NextFunction } from "express"
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';
import { IBookingService } from "../services/interface/IBookingServices";
import { IPaymentService } from "../services/interface/IPaymnetService";
import { Messages } from "../constants/Messages";
import { HttpStatus } from "../enums/HttpStatus";


interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}


class LaborSideController {
  private laborService: ILaborService;
  private bookingService: IBookingService;
  private paymentService: IPaymentService;

  constructor(
    laborService: ILaborService,
    bookingService: IBookingService,
    paymentService: IPaymentService
  ) {
    this.laborService = laborService;
    this.bookingService = bookingService;
    this.paymentService = paymentService;
  }

  public fetchLabors = async (
    req: Request & Partial<{ labor: DecodedToken }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const laborId = req.labor?.id;
      if (!laborId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.LABOR_ID_NOTFOUND });
      }

      const fetchUserResponse = await this.laborService.fetchLaborDetails(
        laborId
      );

      if (fetchUserResponse) {
        res.status(HttpStatus.OK).json({
          message: Messages.LABOR_LOGIN_SUCCESSFULLY,
          fetchUserResponse,
        });
      } else {
        throw new Error(Messages.ERROR_IN_FETCH_LABORS);
      }
    } catch (error) {
      console.error(Messages.ERROR_IN_FETCH_LABORS, error);
      next(error);
    }
  };

  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.ERROR_PARSE_FORM_DATA });
      }

      try {
        const {
          firstName,
          lastName,
          email,
          phone,
          address,
          language,
          availability,
          skills,
          responsibilities,
          startTime,
          endTime,
        } = fields;

        const imageFile = files.profilePicture ? files.profilePicture[0] : null;
        let profilePictureUrl;

        // Upload image to Cloudinary if provided
        if (imageFile) {
          const uploadResult = await cloudinary.uploader.upload(
            imageFile.filepath,
            {
              folder: "labor_profiles",
            }
          );
          profilePictureUrl = uploadResult.secure_url;
        }

        const response = await this.laborService.updateLaborProfile({
          firstName: firstName[0],
          lastName: lastName[0],
          email: email[0],
          phone: phone[0],
          language: language[0],
          availability: JSON.parse(availability[0]),
          skill: skills,
          responsibility: responsibilities[0],
          startTime: startTime[0],
          endTime: endTime[0],
          profilePicture: profilePictureUrl,
        });

        return res.status(HttpStatus.OK).json({
          message: Messages.LABOR_PROFILE_UPDATED_SUCCESSFULLY,
          updatedLabor: response,
        });
      } catch (error) {
        console.error(Messages.ERROR_UPDATE_LABOR_PROFILE, error);
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
        throw new Error(Messages.EMIAL_PASSWORD_MISSING);
      }

      const response = await this.laborService.updatePassword(email, password);

      if (response) {
        return res.status(HttpStatus.OK).json({
          message: Messages.PASSWORD_UPDATED_SUCCESSFULLY,
          updatedUser: response,
        });
      }
    } catch (error) {
      console.error(Messages.ERROR_IN_UPDATE_PASSWORD, error);
      next(error);
    }
  };

  public fetchLaborsByLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { latitude, longitude, sortOrder } = req.query;

      // Check if latitude and longitude are provided
      if (!latitude || !longitude) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.LATITTUDE_LOGITUDE_REQUIERD });
      }

      // Convert latitude and longitude to numbers
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      // Check if the conversion resulted in valid numbers
      if (isNaN(lat) || isNaN(lng)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_LATITUDE_AND_LOGITUDE });
      }

      const validatedSortOrder =
        sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined;

      // Explicitly cast the other optional query parameters
      const country = req.query.country as string | undefined;
      const state = req.query.state as string | undefined;
      const city = req.query.city as string | undefined;
      const zipCode = req.query.zipCode as string | undefined;
      const category = req.query.category as string | undefined;
      const rating = req.query.rating
        ? parseFloat(req.query.rating as string)
        : undefined;

      // Call the service method with the converted numbers
      const laborers = await this.laborService.fetchLabor({
        latitude: lat,
        longitude: lng,
        country,
        state,
        city,
        zipCode,
        category,
        rating,
        sortOrder: validatedSortOrder,
      });

      return res.status(HttpStatus.OK).json({ laborers });
    } catch (error) {
      console.error(Messages.ERROR_IN_FETCH_LABOR_BY_LOCATION, error);
      next(error);
    }
  };

  public abouteMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, name, experience, description } = req.body;

      const AboutData = {
        userId,
        name,
        experience,
        description,
      };

      const AboutMe = await this.laborService.aboutMe(AboutData);

      return res
        .status(HttpStatus.OK)
        .json({ message: Messages.ABOUT_PAGE_UPDTAED_SUCCESSFULLY, AboutMe });
    } catch (error) {
      console.error(Messages.ERROR_IN_ABOUT_PAGE, error);
      next(error);
    }
  };

  public fetchBooking = async (
    req: Request & { labor: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const laborId = req.labor.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.filter as string | undefined;

      const filter = status ? { status } : {};

      if (!laborId) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.LABOR_NOT_FOUND });
      }

      const {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        pendingBookings,
        totalAmount,
      } = await this.bookingService.fetchBookingsToLabor(
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
        completedBookings,
        canceledBookings,
        totalAmount,
        pendingBookings,
      });
    } catch (error) {
      console.error(Messages.BOOKINGS_FETCH_FAILURE, error);
      next(error);
    }
  };

  public fetchSimilorLabors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { latitude, longitude, categorie } = req.query;

      const laborId: string =
        typeof req.query.laborId === "string"
          ? req.query.laborId
          : Array.isArray(req.query.laborId) &&
            typeof req.query.laborId[0] === "string"
          ? req.query.laborId[0]
          : "";

      if (!latitude || !longitude) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.LATITTUDE_LOGITUDE_REQUIERD,
        });
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      // Ensure categorie is always a string
      const category: string =
        typeof categorie === "string"
          ? categorie
          : Array.isArray(categorie)
          ? String(categorie[0]) // Ensure it's converted to a string
          : "";

      if (!category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.CATEGORY_REQUIERD,
        });
      }

      // Fetch similar labors
      const labors = await this.laborService.fetchSimilorLabors(
        lat,
        lng,
        category,
        laborId
      );

      res.status(HttpStatus.OK).json({
        message: Messages.SIMILOR_LABOR_FETCHED_SUCCESSFULY,
        labors,
      });
    } catch (error) {
      console.error(Messages.ERROR_IN_FETCH_SIMILOR_LABOR, error);
      next(error);
    }
  };

  public fetchBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKING_ID_NOT_FOUND });
      }

      const bookingDetails = await this.bookingService.fetchBookingDetils(
        bookingId
      );

      if (bookingDetails) {
        return res.status(HttpStatus.OK).json({
          message: Messages.BOOKINGS_FETCH_SUCCESS,
          bookings: bookingDetails,
        });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKING_NOT_FOUND });
      }
    } catch (error) {
      console.error(Messages.BOOKING_FETCH_FAILD, error);
      next(error);
    }
  };

  public submitRejection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        newTime,
        newDate,
        rejectionReason,
        bookingId,
        rejectedBy,
        requestSentBy,
      } = req.body;

      const resheduleRequst = await this.bookingService.rejectResheduleRequst(
        bookingId,
        newDate,
        newTime,
        rejectionReason,
        rejectedBy,
        requestSentBy
      );

      if (resheduleRequst) {
        return res.status(HttpStatus.OK).json({
          message: Messages.RESHEDULE_REQUEST_SENT_SUCCESSFULLY,
          reshedule: resheduleRequst,
        });
      }
    } catch (error) {
      console.error(Messages.ERROR_IN_RESHEDULE_REJECTION, error);
      next(error);
    }
  };

  public acceptBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;
      const { acceptedBy } = req.body;

      if (!bookingId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_ID_REQUIRED });
      }

      const updatedBooking = await this.bookingService.acceptResheduleRequst(
        bookingId,
        acceptedBy
      );

      return res.status(HttpStatus.OK).json({
        message: Messages.ACCEPT_RESHEDULE_REQUEST,
        reshedule: updatedBooking,
      });
    } catch (error) {
      console.error(Messages.ERROR_IN_ACCEPT_RESHEDULE_REQUEST, error);
      next(error);
    }
  };

  public additionalCharge = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId, amount, reason } = req.body;

      if (!bookingId || !amount || !reason) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.FIELDS_REQUEIRD });
      }

      const additionalCharge = await this.bookingService.additionalCharge(
        bookingId,
        amount,
        reason
      );

      if (additionalCharge) {
        return res.status(HttpStatus.OK).json({
          message: Messages.ADDITIONAL_CHARGE_UPDATED_SUCCESSFULLY,
          additnalChageAdd: additionalCharge,
        });
      }
    } catch (error) {
      console.error(Messages.ERROR_IN_ADDITIONAL_CHARGE, error);
      next(error);
    }
  };

  public acceptRequst = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_ID_NOT_FOUND });
      }

      const acceptRequstRespnse = await this.bookingService.acceptRequst(
        bookingId
      );

      if (acceptRequstRespnse) {
        return res.status(HttpStatus.OK).json({
          message: Messages.ADDITIONAL_CHARGE_ACCEPTED_SUCCESSFULLY,
          acceptRequst: acceptRequstRespnse,
        });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.BOOKING_ID_NOT_FOUND });
      }
    } catch (error) {
      console.error(Messages.ERROR_ID_ADDITIONAL_CHARGE_ACCEPT, error);
      next(error);
    }
  };

  public rejectRequst = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.BOOKING_ID_NOT_FOUND });
      }

      const rejectRequstRespnse = await this.bookingService.rejectRequst(
        bookingId
      );

      if (rejectRequstRespnse) {
        return res.status(HttpStatus.OK).json({
          message: Messages.ADDITIONAL_CHARGE_REJECTED_SUCESSFULLY,
          rejectRequst: rejectRequstRespnse,
        });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ERROR_IN_ADDITINAL_CHARGE_REJECTED });
      }
    } catch (error) {
      console.error(Messages.ERROR_IN_ADDITINAL_CHARGE_REJECTED, error);
      next(error);
    }
  };
  
  public fetchIsBookingExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userEmail = req.query.userEmail as string;
      const laborEmail = req.query.laborEmail as string;

      if (!userEmail || !laborEmail) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.MISSING_USER_ID_LABOR_ID });
      }
      const bookingData = {
        userEmail,
        laborEmail,
      };

      const fetchBookings = await this.bookingService.fetchExistBooking(
        bookingData
      );

      return res
        .status(HttpStatus.OK)
        .json({ messsage: Messages.BOOKINGS_FETCH_SUCCESS, fetchBookings });
    } catch (error) {
      console.error(Messages.BOOKING_FETCH_FAILD, error);
      next(error);
    }
  };

  public fetchAllBookingOfLabor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const laborEmail = req.query.email as string;

      if (!laborEmail) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.MISSING_LABOR_EMAIL });
      }

      const fetchBookings = await this.bookingService.fetchAllBookingsById(
        laborEmail
      );

      return res
        .status(HttpStatus.OK)
        .json({ messsage: Messages.BOOKINGS_FETCH_SUCCESS, fetchBookings });
    } catch (error) {
      console.error(Messages.BOOKING_FETCH_FAILD, error);
      next(error);
    }
  };

  public fetchAllLabors = async (
    req: Request & { labor: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fetchedLabors = await this.laborService.fetchAllLabor();

      return res
        .status(HttpStatus.OK)
        .json({ messsage: Messages.FETCH_LABOR_SUCCESSFULLY, fetchedLabors });
    } catch (error) {
      console.error(Messages.ERROR_IN_FETCH_LABORS, error);
      next(error);
    }
  };

  public witdrowWalletAmount = async (
    req: Request & { labor: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const laborId = req.labor.id;

      if (!laborId) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: Messages.LABOR_ID_NOTFOUND });
      }

      const { amount, bankDetails } = req.body;

      if (!amount || !bankDetails) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: Messages.AMOUNT_AND_BANKDETAILS_MISSING });
      }

      const withdrawalResponse = await this.laborService.walletWithrow(
        laborId,
        amount,
        bankDetails
      );

      res.status(HttpStatus.OK).json({
        message: Messages.WALLET_WITHDROW_REQUEST_SEND_SUCCESSFULLY,
        withdrawalResponse,
      });
    } catch (error) {
      console.error(Messages.ERROR_IN_WITHDROW_REQUEST, error);
      next(error);
    }
  };

  public withdrowalRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { laborId } = req.params;

    try {
      if (!laborId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.LABOR_ID_NOTFOUND });
      }

      const withdrowalRequests = await this.paymentService.withdrowalRequests(
        laborId
      );

      res.status(HttpStatus.OK).json({
        message: Messages.WITHDROW_REQUEST_FETCHED_SUCCESSFULY,
        withdrowalRequests,
      });
    } catch (error) {
      console.error(Messages.ERROR_IN_WITHDROW_REQUEST_FETCH, error);
      next(error);
    }
  };
}

export default LaborSideController;