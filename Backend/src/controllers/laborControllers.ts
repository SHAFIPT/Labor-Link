
import { LaborSideRepository } from "../repositories/implementaions/LaborSideRepository"
import { ILaborService } from "../services/interface/ILaborServices"
import { LaborServices } from "../services/implementaions/LaborServices"
import { Request , Response ,NextFunction } from "express"
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';


interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}


class laborSideController {
  private laborService: ILaborService;

  constructor() {
    const laborRepository = new LaborSideRepository();
    this.laborService = new LaborServices(laborRepository);
  }

  public fetchLabors = async (
    req: Request & Partial<{ labor: DecodedToken }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Iama haer to seeeee...---------");

      const laborId = req.labor?.id; // Access userId from the decoded token
      if (!laborId) {
        return res.status(401).json({ message: "Laobr ID not found" });
      }

      console.log("this sit he laborId :", laborId);

      const fetchUserResponse = await this.laborService.fetchLaborDetails(
        laborId
      );

      console.log("This si the fetch labor response", fetchUserResponse);

      if (fetchUserResponse) {
        res
          .status(200)
          .json({ message: "Labor fetch successfully .", fetchUserResponse });
      } else {
        throw new Error("error occurd during fetch labors....!");
      }
    } catch (error) {
      console.error("Error in labor login:", error);
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
        return res.status(500).json({ error: "Error parsing form data." });
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

        console.log("this si data Labor profiel ----+++00 :", {
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
          profilePictureUrl,
        });

        const response = await this.laborService.updateLaborProfile({
          firstName: firstName[0],
          lastName: lastName[0],
          email: email[0],
          phone: phone[0],
          // address: address[0],
          language: language[0],
          availability: JSON.parse(availability[0]),
          skill: skills,
          responsibility: responsibilities[0],
          startTime: startTime[0],
          endTime: endTime[0],
          profilePicture: profilePictureUrl,
        });
        console.log("Thsis ie the resoponse for labor updae ", response);

        return res.status(200).json({
          message: "Labor profile updated successfully!",
          updatedLabor: response,
        });
      } catch (error) {
        console.error("Error updating labor profile:", error);
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

      const response = await this.laborService.updatePassword(email, password);

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

  public fetchLaborsByLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { latitude, longitude, sortOrder } = req.query;

      console.log("This is the latitude and longitude:", {
        latitude,
        longitude,
      });

      // Check if latitude and longitude are provided
      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ message: "Latitude and Longitude are required." });
      }

      // Convert latitude and longitude to numbers
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      // Check if the conversion resulted in valid numbers
      if (isNaN(lat) || isNaN(lng)) {
        return res
          .status(400)
          .json({ message: "Invalid latitude or longitude." });
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

      // console.log("YYYYYYYYYYYYYYYYYYYYYYYY", {
      //   latitude: lat,
      //       longitude: lng,
      //       country,
      //       state,
      //       city,
      //       zipCode,
      //       category,
      //       rating
      // })

      // console.log("This is the laborers:", laborers);

      return res.status(200).json({ laborers });
    } catch (error) {
      console.error("Error fetching labors:", error);
      next(error);
    }
  };

  public abouteMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, name, experience, description } = req.body;

      console.log("Thie is body data :", {
        userId,
        name,
        experience,
        description,
      });

      const AboutData = {
        userId,
        name,
        experience,
        description,
      };

      console.log("Thsis ie the response of AboutDat", AboutData);

      const AboutMe = await this.laborService.aboutMe(AboutData);

      console.log("This sie the reponse :", AboutMe);

      return res
        .status(200)
        .json({ message: "Abbout udpated successfully....", AboutMe });
    } catch (error) {
      console.error("Error about me:", error);
      next(error);
    }
  };

  public fetchBooking = async (
    req: Request & { labor: { id: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("iumaaaaaaaaaaa heeeeeeeeeereeeeeeeeeeeee................");

      const laborId = req.labor.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.filter as string | undefined;

      const filter = status ? { status } : {};

      console.log('hllllllll',filter)

      if (!laborId) {
        res.status(404).json({ message: "Labor not Found." });
      }

      const {
        bookings,
        total,
        completedBookings,
        canceledBookings,
        pendingBookings ,
        totalAmount } = await this.laborService.fetchBookings(
        laborId,
        page,
        limit,
        filter
      );

      if (!bookings) {
        res.status(404).json({ message: "No bookings found by labor" });  
      }

      res.status(200).json({
        message: "fetching booking succesfully ..",
        bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        completedBookings,
        canceledBookings,
        totalAmount,
        pendingBookings
      });
    } catch (error) {
      console.error("Error labor:", error);
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
    
    const laborId: string = typeof req.query.laborId === "string"
      ? req.query.laborId
      : Array.isArray(req.query.laborId) && typeof req.query.laborId[0] === "string"
      ? req.query.laborId[0]
      : "";


    console.log("Received latitude, longitude, and category:", {
      latitude,
      longitude,
      categorie,
       laborId
    });

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required.",
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
      return res.status(400).json({
        message: "Category is required.",
      });
    }


    console.log("Thei si before passing it;;;;;;;;;;;;;", {
      lat,
      lng,
      category,
      laborId
    })

    // Fetch similar labors
    const labors = await this.laborService.fetchSimilorLabors(lat, lng, category ,laborId);

    console.log("Thsi sie th the labor to kkkkkkkkkkkkkkkkk",labors)

    res.status(200).json({
      message: "Similar labors fetched successfully.",
      labors,
    });
  } catch (error) {
    console.error("Error fetching similar labors:", error);
    next(error);
  }
};

  public fetchBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    
    if (!bookingId) {
      return res.status(404).json({ message: 'Booking id is not found...' });
    }

    const bookingDetails = await this.laborService.fetchBookingDetils(bookingId);

    if (bookingDetails) {
      return res.status(200).json({ message: 'Booking fetched successfully', bookings: bookingDetails });
    } else {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    next(error);
  }      
  };
  
  public submitRejection = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { newTime, newDate, rejectionReason, bookingId , rejectedBy  ,requestSentBy} = req.body
      
      console.log("this is the reonsponse data aa :", {
        newDate, 
        newTime,  
        rejectionReason,
        bookingId,
        requestSentBy
      })

       const resheduleRequst = await this.laborService.rejectResheduleRequst(
        bookingId,
        newDate,
        newTime,
        rejectionReason,
        rejectedBy,
        requestSentBy
      )

      if (resheduleRequst) {
        return res.status(200)
        .json({message : 'resheduleRequst has been sent....', reshedule : resheduleRequst})
      }
      

      
    } catch (error) {
      console.error("Error submit Rejection:", error);
    next(error);
    }
  }


  public acceptBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId } = req.params; 
      const { acceptedBy } = req.body; 
      
      if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

      const updatedBooking  = await this.laborService.acceptResheduleRequst(bookingId , acceptedBy);

      return res.status(200).json({ message: "Accept reshedule successfully",reshedule : updatedBooking });
      
      
    } catch (error) {
      console.error("Error accetpt rejection:", error);
    next(error);
    }
  }

  public additionalCharge = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId, amount, reason } = req.body;

      if (!bookingId || !amount || !reason) {
            return res.status(400).json({ message: "Missing required fields" });
      }
      
      const additionalCharge = await this.laborService.additionalCharge(bookingId, amount, reason)
      
       if (additionalCharge) {
        return res.status(200)
          .json({
            message: 'additional charge is has been updatedSucceffly ',
            additnalChageAdd: additionalCharge
          })
      }
      
    } catch (error) {
       console.error("Error in additionalCharge:", error);
      next(error);
    }
  }

  public acceptRequst = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId } = req.params; 

      console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiii accepttt',bookingId)

       if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
      }
      
      const acceptRequstRespnse = await this.laborService.acceptRequst(bookingId)


      if (acceptRequstRespnse) {
        return res.status(200).json({ message: 'additional charge accept ,,,,', acceptRequst: acceptRequstRespnse });
      } else {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      
    } catch (error) {
      console.error("Error in additional charge accept:", error);
      next(error);
    }
  }
  public rejectRequst = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { bookingId } = req.params; 

       if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
      }
      
      const rejectRequstRespnse = await this.laborService.rejectRequst(bookingId)


      if (rejectRequstRespnse) {
        return res.status(200).json({ message: 'additional charge reject ,,,,', rejectRequst : rejectRequstRespnse });
      } else {
        return res.status(404).json({ message: 'additional charge reject' });
      }
      

      
    } catch (error) {
      console.error("Error in additional charge reject:", error);
      next(error);
    }
  }
  public fetchIsBookingExist = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log('this is requsags :',req.query)

      // const { userEmail, laborEmail } = req.query
      
      
      const userEmail = req.query.userEmail as string;
      const laborEmail = req.query.laborEmail as string;
      
      if (!userEmail || !laborEmail) {
           return res.status(400).json({ message: "Missing userId or laborId" });
     }
      const bookingData = {
        userEmail,
        laborEmail
      }

      console.log('This is the Baaabuu0',bookingData)
      
      const fetchBookings = await this.laborService.fetchExistBooking(bookingData)

      return res.status(200)
      .json({messsage : 'bookingFetchsucceffluuly',fetchBookings})

        
    } catch (error) {
      console.error("Error in exitst bookings ", error);
      next(error);
    }
  }

}

export default laborSideController;