import UserSideRepository from "../repositories/implementaions/UserSideRepository";
import UserServices from "../services/implementaions/UserServices";
import { IUserServices } from "../services/interface/IUserServices";
import { Request, Response, NextFunction } from "express"
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';
import { IBooking } from "./entities/bookingEntity";
import Booking from "../models/BookingModal";
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

import Stripe from 'stripe';
import Labor from "../models/LaborModel";
import { IBookingSerivese } from "../services/interface/IBookingServices";
import BookingRepository from "../repositories/implementaions/BookingRepository";
import BookingServices from "../services/implementaions/BookingServices";
import { IPaymentService } from "../services/interface/IPaymnetService";
import PaymnetRepository from "../repositories/implementaions/PaymentRepository";
import PaymentService from "../services/implementaions/PaymentService";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});


export class userController {
  private userService: IUserServices;
  private bookingService: IBookingSerivese
  private paymentService : IPaymentService

  constructor() {
    const userSideRepository = new UserSideRepository();
    const bookingRepository = new BookingRepository();
    const paymnetRepository = new PaymnetRepository()
    this.userService = new UserServices(userSideRepository);
    this.bookingService = new BookingServices(bookingRepository)
    this.paymentService = new PaymentService(paymnetRepository)
  }

  public fetchUsers = async (
    req: Request & Partial<{ user: DecodedToken }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Iama haer to seeeee...---------");

      const userId = req.user?.id; // Access userId from the decoded token
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }

      console.log("this sit he userId :", userId);

      const fetchUserResponse = await this.userService.fetchUserDetails(userId);

      console.log("This si the fetch user response", fetchUserResponse);

      if (fetchUserResponse) {
        res
          .status(200)
          .json({ message: "User fetch successfully .", fetchUserResponse });
      } else {
        throw new Error("error occurd during fetch userse....!");
      }
    } catch (error) {
      console.error("Error in labor login:", error);
      next(error);
    }
  };

  public profileUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Starting profile update...");

    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data." });
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

        console.log("Data to be passed:", {
          firstName: firstName[0],
          lastName: lastName[0],
          email: email[0],
          imageUrl,
        });

        const response = await this.userService.UpdateUser({
          firstName: firstName[0],
          lastName: lastName[0],
          email: email[0],
          ProfilePic: imageUrl,
        });

        if (response) {
          return res.status(200).json({
            message: "Profile updated successfully!",
            updatedUser: response,
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
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
        throw new Error("Email and Password is missing...!");
      }

      const response = await this.userService.updatePassword(email, password);

      if (response) {
        return res.status(200).json({
          message: "Password updated successfully!",
          updatedUser: response,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      next(error);
    }
  };

  //Done .....................................

  public bookingLabor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId, laborId, quote, addressDetails } = req.body;

      console.log("This is the Boooking data ", {
        userId,
        laborId,
        quote,
        addressDetails,
      });

      if (!quote?.description || !quote?.estimatedCost || !quote?.arrivalTime) {
        return res
          .status(400)
          .json({ message: "Missing required quote fields" });
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
          .status(400)
          .json({ message: "Missing required address fields" });
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

      // console.log("This si erhe boooikingDetails...................",bookingDetails)

      if (!userId || !laborId || !quote) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const BookingResponse = await this.bookingService.bookingLabor(
        bookingDetails
      );

      if (BookingResponse) {
        res
          .status(201)
          .json({
            message: "Booking created successfully",
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
        throw new Error("Email is not found...........");
      }

      email as string;

      const laborId = await this.userService.fetchLaborId(email);
      if (laborId) {
        res.status(200).json({ laborId });
      }
    } catch (error) {
      console.error("Error in booking labor:", error);
      next(error);
    }
  };

   //Done .....................................

  public fetchBookings = async (
    req: Request & { user: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("fetchboooking......");
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')

      if (!userId) {
        throw new Error("User is not found.");
      }

      const filter = status ? { status } : {};

      const { bookings, total } = await this.bookingService.fetchBooking(
        userId,
        page,
        limit,
        filter
      );

      if (bookings) {
        return res.status(200).json({
          message: "fetching booking succesfully ..",
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

  
  //Done .....................................

  public cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookingId, reason, comments, isWithin30Minutes, canceledBy } =
        req.body;

      if (!bookingId) {
        throw new Error("No booking id is found...");
      }

      const cancelledBooking = await this.bookingService.cancelBooking({
        bookingId,
        reason,
        comments,
        isWithin30Minutes,
        canceledBy,
      });

      if (!cancelledBooking) {
        throw new Error("Failed to cancel booking.");
      }

      res.status(200).json({
        message: "Booking canceled successfully",
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
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const updatedBooking = await this.bookingService.updateReadStatus(
        bookingId,
        isUserRead
      );

      return res
        .status(200)
        .json({
          message: "Read status updated successfully",
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

      console.log("this is the reonsponse data aa :", {
        newDate,
        newTime,
        reason,
        bookingId,
      });

      const resheduleRequst = await this.bookingService.resheduleRequst(
        bookingId,
        newDate,
        newTime,
        reason,
        requestSentBy
      );

      console.log("HHHHHHHHHHHHHHHIIIIIIIIIIIIIIIIIIIII", resheduleRequst);

      if (resheduleRequst) {
        return res
          .status(200)
          .json({
            message: "resheduleRequst has been sent....",
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
      console.log("This is the request Body lllll", req.body);

      const { bookingId } = req.params;
      const updateData = req.body;

      console.log("This is geting dataaa :;;", {
        bookingId,
        updateData,
      });
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiiii");

      if (!bookingId || !updateData) {
        return res.status(400).json({ message: "missing nesssory fields...." });
      }

      const response = await this.bookingService.workCompletion(
        bookingId,
        updateData
      );

      console.log("thsi sie th repsnses :::", response);

      if (response) {
        return res
          .status(200)
          .json({
            message: "resheduleRequst has been sent....",
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
      console.log("The is the bodyyyyyyyyyyy", req.body);

      const { bookingId, laborId, userId } = req.body;

      console.log("this is the bookingId detisl ll................", {
        bookingId,
        laborId,
        userId,
      });

      if (!bookingId || !laborId || !userId) {
        return res
          .status(404)
          .json({ message: "missing Requaerud Fields ....." });
      }

      const successResponse = await this.paymentService.pymentSuccess(
        bookingId,
        laborId,
        userId
      );

      if (successResponse) {
        return res
          .status(200)
          .json({
            message: "Payment is succcessfullll........",
            pymentRespnose: successResponse,
          });
      }
    } catch (error) {
      console.error("Error in pyment section.", error);
      next(error);
    }
  };


  public handleStripeWebhook = async (req: Request, res: Response) => {
    console.log("hooook calledddddddddddddddddddddddd ffffffffffffffffffff");

    console.log("Webhook called");
    console.log("signature", req.headers);
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      await this.paymentService.updateWebhook(event, sig);

      res.status(200).send({ received: true });
    } catch (error) {
      console.log(error);
    }
  };



  public fetchBookingWithId = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId } = req.params
      
      if (!bookingId) {
        return res.status(404)
        .json({message : 'Booking id is not found'})
      }

      const fetchedBooking = await this.bookingService.fetchBookinById(bookingId)


      console.log('myyyyyyyyyyyyyyyyyyyyyy',fetchedBooking)

      if (!fetchedBooking) {
          throw new Error("Failed to fetch booking");
        }

      if (fetchedBooking) {
        return res.status(200)
        .json({message : 'fetched succefuluy',fetchedBooking })
      }
      
    } catch (error) {
      console.log(error);
    }
  }



  public reviewSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId } = req.params
      
      if (!bookingId) {
        return res.status(404)
        .json({message : 'Booking id is not found'})
      }

      const form = formidable({ multiples: false });   
    
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500)
          .json({error : 'Error parsing form data'})
        }

        const rating = Array.isArray(fields.rating) ? fields.rating[0] : fields.rating;
        const feedback = Array.isArray(fields.feedback) ? fields.feedback[0] : fields.feedback;


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
        )

        if (!reiveSubmiting) {
          return res.status(500)
          .json({error : 'Error in reivew sumbinting.....'})
        }

        return res.status(200)
        .json({message : 'Review sumbitted succefullly',reiveSubmiting})


      })
      
    } catch (error) {
      console.log(error);
    }
  }
  public fetchAllBooings = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { userId } = req.params
      
      if (!userId) {
        return res.status(404)
        .json({error : 'User id is miising .....'})
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
        totalAmount
      } = await this.bookingService.fetchAllBookings(userId, page, limit, filter)

      if (!bookings) {
        return res.status(404)
        .json({error : 'error in fetchBooking .....'})
      }
      console.log('This is the bookings vinuuuuuuuuuuuu',bookings)

      return  res.status(200).json({
          message: "fetching booking succesfully ..",
          bookings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          completedBookings,
          canceledBookings,
          totalAmount
        });
      
    } catch (error) {
      console.log(error);
      next()
    }
  }
}

export default userController;



















