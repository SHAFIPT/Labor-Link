import UserSideRepository from "../repositories/implementaions/UserSideRepository";
import UserServices from "../services/implementaions/UserServices";
import { IUserServices } from "../services/interface/IUserServices";
import { Request, Response, NextFunction } from "express"
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';
import { IBooking } from "../entities/bookingEntity";
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export class userController {
  private userService: IUserServices;

  constructor() {
    const userSideRepository = new UserSideRepository();
    this.userService = new UserServices(userSideRepository);
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
  console.log('Starting profile update...');

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
        const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "user_profiles",
        });
        imageUrl = uploadResult.secure_url;
      }

      console.log('Data to be passed:', {
        firstName : firstName[0],
        lastName : lastName[0],
        email : email[0],
        imageUrl
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
                updatedUser: response
            });
        }
    } catch (error) {
      console.error("Error updating profile:", error);
      next(error);
    }
  });
};
    public UpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
           
            const { email, password } = req.body
            
            if (!email || !password) {
                throw new Error('Email and Password is missing...!')
            }

            const response = await this.userService.updatePassword(email, password)
            
            if (response) {
            return res.status(200).json({
                message: "Password updated successfully!",
                updatedUser: response
            });
        }
        
       } catch (error) {
        console.error("Error updating profile:", error);
         next(error);
       }
   }
  public bookingLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
      const { userId, laborId, quote , addressDetails} = req.body;

      console.log("This is the Boooking data ", {
        userId,
        laborId,
        quote, 
        addressDetails
      })


      if (!quote?.description || !quote?.estimatedCost || !quote?.arrivalTime) {
            return res.status(400).json({ message: "Missing required quote fields" });
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
      
      console.log("This si erhe boooikingDetails...................",bookingDetails)

        if (!userId || !laborId || !quote) {
            return res.status(400).json({ message: "Missing required fields" });
      }
      
      const BookingResponse = await this.userService.bookingLabor(bookingDetails)
      
      if (BookingResponse) {
        res.status(201).json({ message: "Booking created successfully", booking: BookingResponse });
      }

     } catch (error) {
      console.error("Error in booking labor:", error);
         next(error);
     }
  }
  
  public fetchLaborId = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { email } = req.params
      
      if (!email) {
        throw new Error("Email is not found...........")
      }

      email as string

      const laborId = await this.userService.fetchLaborId(email)
      if (laborId) {
        res.status(200).json({laborId})
      } 
      
    } catch (error) {
       console.error("Error in booking labor:", error);
         next(error);
    }
  }

  public fetchBookings = async (req: Request & { user: { id: string } }, res: Response, next: NextFunction) => {
    try {

      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10



      if (!userId) {
        throw new Error("User is not found.")
      }

      const {bookings ,total}  = await this.userService.fetchBooking(userId , page ,limit)

      if (bookings ) {
        res.status(200).json({
          message: 'fetching booking succesfully ..',
          bookings,
          total,
          page,
          limit,
          totalPages : Math.ceil(total / limit)
        })
      }
      
    } catch (error) {
        console.error("Error in fetch booking....:", error);
        next(error);
    }
  }

  public cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId, reason, comments, isWithin30Minutes, canceledBy } = req.body;

      if (!bookingId) {
        throw new Error ('No booking id is found...')
      }


      const cancelledBooking = await this.userService.cancelBooking({
        bookingId,
        reason,
        comments,
        isWithin30Minutes,
        canceledBy
      })
      
      if (!cancelledBooking) {
      throw new Error('Failed to cancel booking.');
    }

    res.status(200).json({
      message: 'Booking canceled successfully',
      booking: cancelledBooking,
    });

      
    } catch (error) {
        console.error("Error in cancell booking", error);
        next(error);
    }
  }
}


export default userController;