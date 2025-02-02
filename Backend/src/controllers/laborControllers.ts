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
    private laborService: ILaborService
    
    constructor() {
        const laborRepository = new LaborSideRepository()
        this.laborService = new LaborServices(laborRepository)
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
    
          const fetchUserResponse = await this.laborService.fetchLaborDetails(laborId);
    
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
        endTime
      } = fields;

      const imageFile = files.profilePicture ? files.profilePicture[0] : null;
      let profilePictureUrl;
      // Upload image to Cloudinary if provided
      if (imageFile) {
    const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: "labor_profiles",
    });
    profilePictureUrl = uploadResult.secure_url;
    }
        
        console.log('this si data Labor profiel ----+++00 :', {
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
        profilePictureUrl
    })

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
        profilePicture: profilePictureUrl
      });
    console.log('Thsis ie the resoponse for labor updae ',response)

      return res.status(200).json({
        message: "Labor profile updated successfully!",
        updatedLabor: response
      });

    } catch (error) {
      console.error("Error updating labor profile:", error);
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

            const response = await this.laborService.updatePassword(email, password)
            
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
  
public fetchLaborsByLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude ,  sortOrder} = req.query;

        console.log("This is the latitude and longitude:", { latitude, longitude });

        // Check if latitude and longitude are provided
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and Longitude are required.' });
        }

        // Convert latitude and longitude to numbers
        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);

        // Check if the conversion resulted in valid numbers
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ message: 'Invalid latitude or longitude.' });
      }
      
       const validatedSortOrder = sortOrder === 'asc' || sortOrder === 'desc' 
      ? sortOrder 
      : undefined;

        // Explicitly cast the other optional query parameters
        const country = req.query.country as string | undefined;
        const state = req.query.state as string | undefined;
        const city = req.query.city as string | undefined;
        const zipCode = req.query.zipCode as string | undefined;
        const category = req.query.category as string | undefined;
        const rating = req.query.rating ? parseFloat(req.query.rating as string) : undefined;

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
            sortOrder: validatedSortOrder
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
        description
      })


      const AboutData = {
        userId,
        name, 
        experience,
        description
      } 

      console.log("Thsis ie the response of AboutDat" , AboutData)

      const AboutMe = await this.laborService.aboutMe(AboutData)

      console.log("This sie the reponse :",AboutMe)

      return res.status(200).json({message : 'Abbout udpated successfully....', AboutMe})
      
    } catch (error) {
       console.error("Error about me:", error);
         next(error);
    }
  }    

  public fetchBooking = async (req: Request & { labor: { id: string } }, res: Response, next: NextFunction) => {     
    try {
      console.log("iumaaaaaaaaaaa heeeeeeeeeereeeeeeeeeeeee................")

      const laborId = req.labor.id
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      if (!laborId) {
        res.status(404).json({message : 'Labor not Found.'})
      }

     const {bookings ,total} = await this.laborService.fetchBookings(laborId, page, limit)

      if (!bookings) {
        res.status(404).json({message : 'No bookings found by labor'})
      }
      
      res.status(200).json({
          message: 'fetching booking succesfully ..',
          bookings,
          total,
          page,
          limit,
          totalPages : Math.ceil(total / limit)
      })

      
    } catch (error) {
       console.error("Error labor:", error);
         next(error);
    }
  }
}

export default laborSideController